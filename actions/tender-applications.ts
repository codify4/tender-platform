"use server";

import { BUCKETS, generateFilePath, uploadFile } from "@/lib/supabase-storage";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

/**
 * Submit a new tender application
 */
export async function submitTenderApplication(
  formData: FormData
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        error: "You must be logged in to submit an application",
      };
    }
    
    // Get form data
    const tenderId = formData.get("tenderId") as string;
    const coverMessage = formData.get("coverMessage") as string;
    
    // Get all files from the applicationFiles field
    const applicationFiles = formData.getAll("applicationFiles") as File[];
    
    if (!tenderId || applicationFiles.length === 0) {
      return {
        error: "Tender ID and at least one file are required",
      };
    }
    
    // Get tender details
    const { data: tender, error: tenderError } = await supabase
      .from("tenders")
      .select("id, title, reference")
      .eq("id", tenderId)
      .single();
      
    if (tenderError || !tender) {
      return {
        error: "Tender not found",
      };
    }
    
    // Check total file size
    const totalFileSize = applicationFiles.reduce((total, file) => total + file.size, 0);
    const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB
    
    if (totalFileSize > MAX_TOTAL_SIZE) {
      return {
        error: `Total file size exceeds maximum allowed (50MB). Your files total ${(totalFileSize / (1024 * 1024)).toFixed(2)}MB`,
      };
    }
    
    // Upload files to Supabase storage
    const uploadedFiles = [];
    
    // Create a folder structure: vendor_submissions/[tenderId]/[vendorId]/[timestamp]_[filename]
    const submissionTimestamp = Date.now();
    const submissionFolder = `tender_${tenderId}/${submissionTimestamp}`;
    
    for (const file of applicationFiles) {
      // Check individual file size
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        return {
          error: `File "${file.name}" exceeds maximum allowed size (10MB)`,
        };
      }
      
      // Generate a unique path for the file
      const filePath = generateFilePath(
        file.name, 
        user.id,
        submissionFolder
      );
      
      // Upload the file to the vendor_submissions bucket
      const uploadedFile = await uploadFile(
        BUCKETS.VENDOR_SUBMISSIONS,
        filePath,
        file
      );
      
      uploadedFiles.push({
        name: file.name,
        path: uploadedFile.path,
        size: file.size,
        type: file.type || getFileTypeFromName(file.name),
        uploaded_at: new Date().toISOString(),
      });
    }
    
    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from("submissions")
      .insert({
        id: crypto.randomUUID(),
        cover_message: coverMessage,
      })
      .select()
      .single();
      
    if (submissionError) {
      return {
        error: "Failed to create submission",
        details: submissionError.message,
      };
    }
    
    // Create application
    const { data: application, error: applicationError } = await supabase
      .from("applications")
      .insert({
        vendor_id: user.id,
        tender_id: tenderId,
        submission_id: submission.id,
        status: "pending",
        documents: uploadedFiles,
      })
      .select()
      .single();
      
    if (applicationError) {
      return {
        error: "Failed to create application",
        details: applicationError.message,
      };
    }
    
    revalidatePath("/vendor/applications");
    revalidatePath(`/vendor/tenders/${tenderId}`);
    
    return {
      success: true,
      message: "Application submitted successfully",
      application,
    };
    
  } catch (error) {
    console.error("Application submission error:", error);
    return {
      error: "Failed to submit application",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get file type from filename if MIME type is not available
 */
function getFileTypeFromName(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'zip': 'application/zip',
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
}

/**
 * Download a tender document
 */
export async function getTenderDocument(documentId: string) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        error: "You must be logged in to download tender documents",
        details: authError?.message,
      };
    }
    
    // Get document details
    const { data: document, error: documentError } = await supabase
      .from("tender_documents")
      .select("id, name, path, tender_id")
      .eq("id", documentId)
      .single();
      
    if (documentError || !document) {
      return {
        error: "Document not found",
      };
    }
    
    // Create signed URL for the document
    const { data: signedURL, error: signedError } = await supabase
      .storage
      .from(BUCKETS.TENDER_DOCUMENTS)
      .createSignedUrl(document.path, 60); // 60 seconds expiry
      
    if (signedError) {
      return {
        error: "Failed to generate download link",
      };
    }
    
    return {
      success: true,
      document: {
        id: document.id,
        name: document.name,
        url: signedURL.signedUrl,
      },
    };
    
  } catch (error) {
    console.error("Document download error:", error);
    return {
      error: "Failed to download document",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
} 