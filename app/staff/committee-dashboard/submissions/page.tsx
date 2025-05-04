import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { getStaffRole } from "@/actions/staff-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Eye } from "lucide-react"
import Link from "next/link"
import { SubmissionCard } from "@/components/evaluation/submission-card"
import { mockSubmissions } from "@/lib/submissions"
import { EvaluatedApplication } from "@/lib/db-schema"

export default async function CommitteeSubmissionsPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin?message=Please sign in to continue")
  }

  // Verify role
  const role = await getStaffRole()

  if (role !== "committee_officer") {
    redirect("/staff/role?message=You do not have access to this page")
  }

  // Fetch evaluations from the database
  const { data: evaluations, error } = await supabase
    .from('evaluated_applications')
    .select('*')
    .order('score', { ascending: false }) as { data: EvaluatedApplication[] | null, error: any }
  
  if (error) {
    console.error("Error fetching evaluations:", error)
    // Continue with mock data if there's an error
  }

  // Create a map of application IDs to evaluations for easy lookup
  const evaluationMap = new Map<string, EvaluatedApplication>()
  if (evaluations) {
    evaluations.forEach((evaluation) => {
      evaluationMap.set(evaluation.application_id, evaluation)
    })
  }

  // Transform mock data to match the expected format for the UI
  const submissions = mockSubmissions.map((submission, index) => {
    // Check if this submission has been evaluated
    const evaluation = evaluationMap.get(submission.id)
    
    // Convert status to the format expected by SubmissionCard
    const mappedStatus = evaluation 
      ? (evaluation.recommendation === 'reject' ? 'evaluated' : 'evaluated')
      : (submission.status === "pending" ? "pending_review" : (submission.status === "rejected" ? "evaluated" : "evaluated"));

    // Calculate rank (if evaluated)
    const rank = evaluation ? 
      (evaluations ? evaluations.findIndex((e: any) => e.application_id === submission.id) + 1 : undefined) : 
      undefined;

    return {
      id: parseInt(submission.id),
      tenderId: parseInt(submission.tender_id),
      vendor: submission.vendor_name,
      tenderTitle: submission.tender_title,
      submissionDate: new Date(submission.created_at).toLocaleDateString(),
      documents: submission.documents.length,
      status: mappedStatus as "pending_review" | "under_evaluation" | "evaluated",
      score: evaluation?.score ?? (submission.score !== null ? submission.score : undefined)
    }
  })

  // Group submissions by status for card display
  const pendingSubmissions = submissions.filter((s) => s.status === "pending_review")
  const evaluatedSubmissions = submissions.filter((s) => s.status === "evaluated" && (!s.score || s.score >= 60))
  const rejectedSubmissions = submissions.filter((s) => s.status === "evaluated" && s.score && s.score < 60)

  return (
    <div className="flex w-full flex-col p-8">
      <h1 className="text-3xl font-bold mb-6">Tender Submissions</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Evaluation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Evaluated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{evaluatedSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{rejectedSubmissions.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Submissions Management</CardTitle>
              <CardDescription>Review and evaluate tender submissions</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search submissions..." className="pl-8 w-[300px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Submissions</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="evaluated">Evaluated</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="rounded-md border">
                <div className="grid grid-cols-5 p-4 font-medium border-b">
                  <div>Vendor</div>
                  <div>Tender</div>
                  <div>Submission Date</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                {submissions.map((submission) => (
                  <div key={submission.id} className="grid grid-cols-5 p-4 border-b last:border-0">
                    <div className="font-medium">{submission.vendor}</div>
                    <div>{submission.tenderTitle}</div>
                    <div>{submission.submissionDate}</div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          submission.status === "pending_review"
                            ? "bg-yellow-50 text-yellow-700"
                            : submission.status === "under_evaluation"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-green-50 text-green-700"
                        }`}
                      >
                        {submission.status === "pending_review" 
                          ? "Pending" 
                          : submission.status === "under_evaluation" 
                            ? "In Progress" 
                            : "Evaluated"}
                      </span>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/staff/committee-dashboard/submissions/${submission.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingSubmissions.length > 0 ? (
                  pendingSubmissions.map((submission) => <SubmissionCard key={submission.id} submission={submission} />)
                ) : (
                  <div className="col-span-full p-8 text-center text-muted-foreground">
                    No pending submissions found
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="evaluated">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {evaluatedSubmissions.length > 0 ? (
                  evaluatedSubmissions.map((submission) => (
                    <SubmissionCard key={submission.id} submission={submission} />
                  ))
                ) : (
                  <div className="col-span-full p-8 text-center text-muted-foreground">
                    No evaluated submissions found
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="rejected">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rejectedSubmissions.length > 0 ? (
                  rejectedSubmissions.map((submission) => (
                    <SubmissionCard key={submission.id} submission={submission} />
                  ))
                ) : (
                  <div className="col-span-full p-8 text-center text-muted-foreground">
                    No rejected submissions found
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}