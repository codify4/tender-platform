import { createClient } from "@/utils/supabase/server";

// Storage bucket names
export const BUCKETS = {
  TENDER_DOCUMENTS: "tender_documents",
  VENDOR_SUBMISSIONS: "vendor_submissions"
};

/**
 * Upload a file to Supabase storage
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @param file The file to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(bucket: string, path: string, file: File) {
  const supabase = await createClient();
  
  // Create the bucket if it doesn't exist
  const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucket);
  
  if (!bucketData && bucketError) {
    // Bucket doesn't exist, create it
    const { error } = await supabase.storage.createBucket(bucket, {
      public: false, // Set to true if you want files to be publicly accessible
      fileSizeLimit: 52428800, // 50MB in bytes
    });
    
    if (error) {
      throw new Error(`Error creating bucket: ${error.message}`);
    }
  }
  
  // Upload the file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    
  if (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
  
  // Get the public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
  
  return {
    path: data.path,
    fullPath: `${bucket}/${data.path}`,
    publicUrl: urlData.publicUrl,
  };
}

/**
 * Download a file from Supabase storage
 * @param bucket The storage bucket name
 * @param path The path of the file within the bucket
 * @returns The file data
 */
export async function downloadFile(bucket: string, path: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path);
    
  if (error) {
    throw new Error(`Error downloading file: ${error.message}`);
  }
  
  return data;
}

/**
 * Get a signed URL for a file in Supabase storage
 * @param bucket The storage bucket name
 * @param path The path of the file within the bucket
 * @param expiresIn Expiration time in seconds
 * @returns The signed URL
 */
export async function getSignedUrl(bucket: string, path: string, expiresIn = 60) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
    
  if (error) {
    throw new Error(`Error creating signed URL: ${error.message}`);
  }
  
  return data.signedUrl;
}

/**
 * Delete a file from Supabase storage
 * @param bucket The storage bucket name
 * @param path The path of the file within the bucket
 */
export async function deleteFile(bucket: string, path: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
    
  if (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
  
  return true;
}

/**
 * List files in a directory
 * @param bucket The storage bucket name
 * @param path The directory path
 * @returns List of files
 */
export async function listFiles(bucket: string, path?: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path);
    
  if (error) {
    throw new Error(`Error listing files: ${error.message}`);
  }
  
  return data;
}

/**
 * Generate a unique file path for upload
 * @param fileName Original file name
 * @param userId User ID
 * @param prefix Optional prefix for the path
 * @returns A unique file path
 */
export function generateFilePath(fileName: string, userId: string, prefix?: string) {
  const timestamp = Date.now();
  const extension = fileName.split('.').pop();
  const safeFileName = fileName
    .split('.')[0]
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  
  const path = prefix 
    ? `${prefix}/${userId}/${timestamp}_${safeFileName}.${extension}`
    : `${userId}/${timestamp}_${safeFileName}.${extension}`;
    
  return path;
} 