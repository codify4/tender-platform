import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { getStaffRole } from "@/actions/staff-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, AlertCircle, ArrowLeft, Download, Star } from "lucide-react"
import Link from "next/link"
import { mockSubmissions } from "@/lib/submissions"
import { evaluateSubmission } from "@/actions/gemini"
import { Submission } from "@/lib/db-schema"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string, check?: string }>
}

export default async function SubmissionDetailsPage({ params, searchParams }: PageProps) {
  // Await params and searchParams as they are promises in Next.js 15
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  const submissionId = resolvedParams.id
  const error = resolvedSearchParams.error

  const supabase = await createClient()

  // Authentication checks
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/signin?message=Please sign in to continue")

  // Role verification
  const role = await getStaffRole()
  if (role !== "committee_officer") redirect("/staff/role?message=No access")

  // Fetch submission data from mock data
  const submission = mockSubmissions.find((sub) => sub.id === submissionId)
  if (!submission) redirect("/staff/committee-dashboard/submissions")

  // Check if evaluation exists in Supabase or try to generate if requested
  // In a real app, you'd check if the evaluation exists in a database
  // For now, we'll assume no stored evaluations
  let evaluation = null
  const checkEvaluation = resolvedSearchParams.check === "true"
  
  if (checkEvaluation) {
    try {
          // Cast status to one of the expected values
    const typedSubmission: Submission = {
      ...submission,
      status: submission.status as 'pending' | 'evaluated' | 'recommended' | 'rejected'
    }
    evaluation = await evaluateSubmission(typedSubmission)
    } catch (error) {
      console.error("Error generating evaluation:", error)
      // We'll continue without an evaluation
    }
  }

  // Format date
  const formattedDate = new Date(submission.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex w-full flex-col p-8">
      {resolvedSearchParams.error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          Error: {resolvedSearchParams.error === "evaluation_failed" ? "Evaluation failed" : "Unknown error"}
        </div>
      )}

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
          <h1 className="text-3xl font-bold">{submission.tender_title}</h1>
          <p className="text-muted-foreground">
            Reference: {submission.tender_reference} | Submitted by: {submission.vendor_name}
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {!evaluation ? (
            <Button variant="default" asChild>
              <Link href={`/staff/committee-dashboard/evaluation/${submissionId}`}>
                <Star className="h-4 w-4 mr-1" />
                Evaluate Submission
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href={`/staff/committee-dashboard/evaluation/${submissionId}`}>View Evaluation</Link>
            </Button>
          )}
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
            <Badge
              className={
                !evaluation
                  ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-50"
              }
            >
              {!evaluation ? "Pending Evaluation" : "Evaluated"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{evaluation ? `${evaluation.score}/100` : "Not evaluated yet"}</div>
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
            {submission.documents.map((doc: any) => (
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
            {submission.criteria.map((criteria: any) => (
              <div key={criteria.id} className="grid grid-cols-3 p-4 border-b last:border-0">
                <div className="font-medium">{criteria.title}</div>
                <div>{criteria.weight}%</div>
                <div>{criteria.maxScore} points</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
