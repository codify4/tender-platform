"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Calendar,
  Clock,
  Download,
  FileText,
  Upload,
  User,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { submitTenderApplication } from "@/actions/tender-applications";
import { BUCKETS } from "@/lib/supabase-storage";

// Define types
type TenderDocument = {
  id: number;
  name: string;
  size: string;
};

type Tender = {
  id: number;
  title: string;
  description: string;
  reference: string;
  deadline: string;
  published_at: string;
  status: string;
  type: string;
  ceiling_fund: number;
  documents: TenderDocument[];
};

export default function TenderDetails({ 
  tender 
}: { 
  tender: Tender 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError("Please upload at least one file for your application");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get form data
      const formData = new FormData(e.target as HTMLFormElement);
      formData.append("tenderId", tender.id.toString());
      
      // Add all files to formData
      files.forEach((file, index) => {
        formData.append(`applicationFiles`, file);
      });
      
      // Submit the form via server action
      const result = await submitTenderApplication(formData);
      
      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        setShowSuccess(true);
        setFiles([]);
        
        // Reset form
        if (formRef.current) {
          formRef.current.reset();
        }
        
        // Close the dialog if it's open
        if (dialogCloseRef.current) {
          dialogCloseRef.current.click();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 px-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{tender.title}</h1>
          <p className="text-muted-foreground">Reference: {tender.reference}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/vendor/tenders">
              Back to Tenders
            </a>
          </Button>
        </div>
      </div>

      {showSuccess && (
        <Alert className="mb-6 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Application Submitted</AlertTitle>
          <AlertDescription className="text-green-600">
            Your application has been submitted successfully. You can track its status in the My Applications section.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-600">Error</AlertTitle>
          <AlertDescription className="text-red-600">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="details">Tender Details</TabsTrigger>
          <TabsTrigger value="application">Submit Application</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>Tender information and requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Description</h3>
                      <p className="text-sm text-muted-foreground">
                        {tender.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Type</h3>
                        <p className="text-sm text-muted-foreground capitalize">{tender.type}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Status</h3>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 capitalize">
                          {tender.status}
                        </span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <h3 className="text-sm font-medium">Published Date</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tender.published_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <h3 className="text-sm font-medium">Deadline</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tender.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tender Documents</CardTitle>
                  <CardDescription>Download the required documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tender.documents.map((doc: TenderDocument) => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Tender Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-md text-center">
                      <p className="text-sm text-muted-foreground mb-1">Budget Ceiling</p>
                      <p className="text-2xl font-bold">${tender.ceiling_fund.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className="font-medium capitalize">{tender.status}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize">{tender.type}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Deadline:</span>
                      <span className="font-medium">{new Date(tender.deadline).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Documents:</span>
                      <span className="font-medium">{tender.documents.length}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Apply for Tender
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Apply for Tender</DialogTitle>
                        <DialogDescription>
                          Submit your application for this tender by uploading the required documents.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} ref={formRef}>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="coverMessage">Cover Message</Label>
                            <Textarea 
                              id="coverMessage" 
                              name="coverMessage"
                              placeholder="Brief description of your application..." 
                              rows={4}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Upload Application Documents</Label>
                            <div className="border-2 border-dashed rounded-md p-6 text-center">
                              <Input
                                id="applicationFiles"
                                name="applicationFiles"
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                              />
                              <Label 
                                htmlFor="applicationFiles" 
                                className="flex flex-col items-center cursor-pointer"
                              >
                                <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                                <span className="text-sm font-medium mb-1">
                                  Click to upload files
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Technical proposal, financial proposal, company documents, etc.
                                </span>
                                <span className="text-xs text-muted-foreground mt-2">
                                  Upload all your files at once (max 50MB total)
                                </span>
                              </Label>
                            </div>
                            
                            {files.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Selected Files ({files.length})</h4>
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                  {files.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                                      <div className="flex items-center overflow-hidden">
                                        <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                                        <span className="truncate">{file.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                          {(file.size / 1024).toFixed(0)} KB
                                        </span>
                                        <Button 
                                          type="button" 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-6 w-6 rounded-full"
                                          onClick={() => handleRemoveFile(i)}
                                        >
                                          <X className="h-3 w-3" />
                                          <span className="sr-only">Remove</span>
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 w-full"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Add More Files
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isSubmitting || files.length === 0}>
                            {isSubmitting ? (
                              <>
                                <div className="spinner mr-2" /> Submitting...
                              </>
                            ) : (
                              "Submit Application"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <h3 className="text-sm font-medium">Contact AADF</h3>
                        <p className="text-sm text-muted-foreground">
                          Email: procurement@aadf.org
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Phone: +355 42 234 621
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="application">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Application</CardTitle>
              <CardDescription>
                Upload all the required documents for this tender
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" ref={formRef}>
                <div>
                  
                  <div className="border-2 border-dashed rounded-md p-8 text-center">
                    <Input
                      id="application-files"
                      name="applicationFiles"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                    
                    {files.length === 0 ? (
                      <Label 
                        htmlFor="application-files" 
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <Upload className="h-10 w-10 mb-4 text-muted-foreground" />
                        <span className="text-base font-medium mb-2">
                          Drag files here or click to upload
                        </span>
                        <span className="text-sm text-muted-foreground max-w-md">
                          Upload all documents required for this tender application including technical proposal, 
                          financial proposal, company documentation, and any other required materials
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className="mt-6"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Select Files
                        </Button>
                      </Label>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center">
                          <FileText className="h-10 w-10 mb-2 text-muted-foreground" />
                          <h4 className="text-lg font-medium">{files.length} {files.length === 1 ? 'file' : 'files'} selected</h4>
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto space-y-2 border border-border rounded-md">
                          {files.map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border-b last:border-b-0">
                              <div className="flex items-center overflow-hidden">
                                <FileText className="h-5 w-5 mr-3 flex-shrink-0 text-muted-foreground" />
                                <div className="overflow-hidden">
                                  <p className="text-sm font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {file.type || "Unknown type"} • {(file.size / 1024).toFixed(0)} KB
                                  </p>
                                </div>
                              </div>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive/90"
                                onClick={() => handleRemoveFile(i)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Add More Files
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-2">
                    <p>Maximum file size: 10MB per file, 50MB total</p>
                    <p>Accepted formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, ZIP</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" asChild>
                    <a href="/vendor/tenders">Cancel</a>
                  </Button>
                  <Button type="submit" disabled={isSubmitting || files.length === 0}>
                    {isSubmitting ? (
                      <>
                        <div className="spinner mr-2" /> Submitting Application...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 