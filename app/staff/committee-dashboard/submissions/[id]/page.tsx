import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStaffRole } from '@/actions/staff-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, FileText, Download, Calendar, User, Building } from 'lucide-react'
import Link from 'next/link'
import { AIEvaluationButton } from '@/components/evaluation/ai-evaluation-button'

interface PageProps {
  params: {
    id: string
  }
}

export default async function SubmissionDetailsPage({ params }: PageProps) {
  const supabase = await createClient()
  const submissionId = parseInt(params.id)
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signin?message=Please sign in to continue')
  }
  
  // Verify role
  const role = await getStaffRole()
  
  if (role !== 'committee_officer') {
    redirect('/staff/role?message=You do not have access to this page')
  }

  // Mock submission details - in a real app, fetch this from the database
  const submission = {
    id: submissionId,
    tenderId: 101,
    tenderTitle: "IT Equipment Supply",
    tenderReference: "TEN2023-101",
    description: "Supply and delivery of IT equipment including laptops, desktops, and peripherals for the main office and regional branches.",
    vendor: "TechCorp Ltd",
    vendorId: "VEN-2023-456",
    status: "pending_review",
    submissionDate: "2023-11-10",
    documents: [
      { id: 1, name: "Technical Proposal.pdf", size: "3.4 MB", type: "application/pdf", category: "Technical" },
      { id: 2, name: "Financial Proposal.pdf", size: "1.2 MB", type: "application/pdf", category: "Financial" },
      { id: 3, name: "Company Profile.pdf", size: "5.7 MB", type: "application/pdf", category: "Administrative" },
      { id: 4, name: "Product Specifications.xlsx", size: "780 KB", type: "application/xlsx", category: "Technical" },
      { id: 5, name: "Certification Documents.zip", size: "8.2 MB", type: "application/zip", category: "Compliance" },
    ],
    isLocked: false
  }
  
  const isEvaluated = submission.status === "evaluated"
  const canEvaluate = !submission.isLocked

  return (
    <div className="flex w-full flex-col p-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/staff/committee-dashboard/submissions">
            <ChevronLeft className="h-6 w-6 mr-1" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Submission Details</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{submission.tenderTitle}</CardTitle>
                <CardDescription>Reference: {submission.tenderReference}</CardDescription>
              </div>
              <Badge 
                variant={
                  submission.status === "pending_review" 
                    ? "secondary" 
                    : submission.status === "under_evaluation" 
                    ? "outline" 
                    : "default"
                }
              >
                {submission.status === "pending_review" 
                  ? "Pending Review" 
                  : submission.status === "under_evaluation" 
                  ? "Under Evaluation" 
                  : "Evaluated"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{submission.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Submission Date</h3>
                </div>
                <p className="text-sm pl-6">{submission.submissionDate}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Vendor</h3>
                </div>
                <p className="text-sm pl-6">{submission.vendor}</p>
                <p className="text-xs text-muted-foreground pl-6">ID: {submission.vendorId}</p>
              </div>
            </div>
            
            {submission.isLocked && (
              <div className="bg-amber-50 p-4 rounded-md">
                <p className="text-sm text-amber-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  This submission is locked until the tender closing date.
                </p>
              </div>
            )}
            
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Documents</h3>
                <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
                  <Download className="h-4 w-4" />
                  Download All
                </Button>
              </div>
              
              <div className="space-y-2">
                {submission.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-md border">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.size} • {doc.category}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Evaluation Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evaluation</CardTitle>
            <CardDescription>Review and evaluate this submission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEvaluated ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Current Status</p>
                  <Badge variant="default">Evaluated</Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Evaluation Score</p>
                  <div className="h-10 rounded-md flex items-center justify-center px-3 bg-green-500 text-white font-medium">
                    87/100
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Evaluation Date</p>
                  <p className="text-sm">November 15, 2023</p>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" asChild>
                    <Link href={`/staff/committee-dashboard/evaluation/${submission.id}`}>
                      View Complete Evaluation
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm">
                  This submission has not been evaluated yet. Use the AI evaluation button to automatically
                  analyze all documents and generate a comprehensive evaluation report.
                </p>
                
                <div className="pt-2 flex flex-col gap-2">
                  <AIEvaluationButton 
                    submissionId={submission.id}
                    tenderTitle={submission.tenderTitle}
                    disabled={submission.isLocked}
                  />
                  
                  <Button variant="outline" className="w-full" asChild>
                    Evaluate Manually
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 