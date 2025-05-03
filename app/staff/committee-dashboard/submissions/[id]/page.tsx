import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStaffRole } from '@/actions/staff-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, CheckCircle, AlertCircle, ArrowLeft, Download, Star } from 'lucide-react'
import Link from 'next/link'

// Define types for the page props
type PageProps = {
  params: {
    id: string
  }
}

export default async function SubmissionDetailsPage({ params }: PageProps) {
  const submissionId = params.id
  const supabase = await createClient()
  
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

  // Mock data for submission details
  // In a real app, we would fetch the specific submission from the database
  const submission = {
    id: submissionId,
    vendor: "TechCorp Solutions",
    tenderTitle: "IT Equipment Supply",
    tenderReference: "TEN2023-101",
    submittedAt: "2023-11-15T10:30:00Z",
    status: "pending",
    score: null,
    documents: [
      { id: "doc1", name: "Technical Proposal", type: "pdf", size: "2.5 MB" },
      { id: "doc2", name: "Financial Proposal", type: "pdf", size: "1.3 MB" },
      { id: "doc3", name: "Company Profile", type: "pdf", size: "4.7 MB" },
      { id: "doc4", name: "Certifications", type: "zip", size: "8.1 MB" },
    ],
    criteria: [
      { id: "c1", title: "Technical Specifications", weight: 30, maxScore: 30 },
      { id: "c2", title: "Delivery Timeline", weight: 15, maxScore: 15 },
      { id: "c3", title: "Experience", weight: 20, maxScore: 20 },
      { id: "c4", title: "Price", weight: 25, maxScore: 25 },
      { id: "c5", title: "Warranty & Support", weight: 10, maxScore: 10 },
    ],
    evaluations: []
  }

  // Format date
  const formattedDate = new Date(submission.submittedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="flex w-full flex-col p-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/staff/committee-dashboard/submissions">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Submissions
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{submission.tenderTitle}</h1>
          <p className="text-muted-foreground">
            Reference: {submission.tenderReference} | Submitted by: {submission.vendor}
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link href={`/staff/committee-dashboard/evaluation/${submission.id}`}>
              <Star className="h-4 w-4 mr-1" />
              Evaluate Submission
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Submission Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{formattedDate}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={
              submission.status === 'pending' 
                ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-50' 
                : submission.status === 'evaluated'
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-50'
                : submission.status === 'recommended'
                ? 'bg-green-50 text-green-700 hover:bg-green-50'
                : 'bg-red-50 text-red-700 hover:bg-red-50'
            }>
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{submission.score !== null ? `${submission.score}/100` : 'Not evaluated yet'}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Submission Documents</CardTitle>
          <CardDescription>Review submitted documents for evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-3 p-4 font-medium border-b">
              <div>Document Name</div>
              <div>Type</div>
              <div>Actions</div>
            </div>
            {submission.documents.map((doc) => (
              <div key={doc.id} className="grid grid-cols-3 p-4 border-b last:border-0">
                <div className="font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  {doc.name}
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs">
                    {doc.type.toUpperCase()} ({doc.size})
                  </Badge>
                </div>
                <div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Criteria</CardTitle>
          <CardDescription>The criteria used to evaluate this submission</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-3 p-4 font-medium border-b">
              <div>Criteria</div>
              <div>Weight</div>
              <div>Maximum Score</div>
            </div>
            {submission.criteria.map((criteria) => (
              <div key={criteria.id} className="grid grid-cols-3 p-4 border-b last:border-0">
                <div className="font-medium">{criteria.title}</div>
                <div>{criteria.weight}%</div>
                <div>{criteria.maxScore} points</div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center">
              {submission.status === 'pending' ? (
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              )}
              <span className="text-sm text-muted-foreground">
                {submission.status === 'pending' 
                  ? 'This submission is pending evaluation'
                  : 'This submission has been evaluated'}
              </span>
            </div>
            <Button asChild>
              <Link href={`/staff/committee-dashboard/evaluation/${submission.id}`}>
                Proceed to Evaluation
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 