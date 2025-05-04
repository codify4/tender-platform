import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { getStaffRole } from "@/actions/staff-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Eye } from "lucide-react"
import Link from "next/link"
import { SubmissionCard } from "@/components/evaluation/submission-card"
import { mockSubmissions } from "@/lib/submissions"
import { mockEvaluations } from "@/lib/evaluations"

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

  // Transform mock data to match the expected format for the UI
  const submissions = mockSubmissions.map((submission) => {
    // Check if this submission has been evaluated
    const existingEvaluation = mockEvaluations.find(
      (existingEvaluation) => existingEvaluation.application_id === submission.id,
    )

    return {
      id: submission.id,
      vendor: submission.vendor_name,
      tenderTitle: submission.tender_title,
      submittedAt: new Date(submission.created_at).toLocaleDateString(),
      status: submission.status, // Use the original status from mock data
      score: existingEvaluation ? existingEvaluation.score : null,
      rank: Math.floor(Math.random() * 5) + 1, // Random rank for demo
      isLocked: false,
    }
  })

  // Group submissions by status for card display
  const pendingSubmissions = submissions.filter((s) => s.status === "pending")
  const evaluatedSubmissions = submissions.filter((s) => s.status === "evaluated" || s.status === "recommended")
  const rejectedSubmissions = submissions.filter((s) => s.status === "rejected")

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

      <Card>
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
                <div className="grid grid-cols-6 p-4 font-medium border-b">
                  <div>Vendor</div>
                  <div>Tender</div>
                  <div>Submission Date</div>
                  <div>Status</div>
                  <div>Score</div>
                  <div>Actions</div>
                </div>
                {submissions.map((submission) => (
                  <div key={submission.id} className="grid grid-cols-6 p-4 border-b last:border-0">
                    <div className="font-medium">{submission.vendor}</div>
                    <div>{submission.tenderTitle}</div>
                    <div>{submission.submittedAt}</div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          submission.status === "pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : submission.status === "evaluated"
                              ? "bg-blue-50 text-blue-700"
                              : submission.status === "recommended"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                        }`}
                      >
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </div>
                    <div>{submission.score !== null ? submission.score + "/100" : "-"}</div>
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
                  pendingSubmissions.map((submission: any) => <SubmissionCard key={submission.id} submission={submission} />)
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
                  evaluatedSubmissions.map((submission: any) => (
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
                  rejectedSubmissions.map((submission: any) => (
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
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">Showing {submissions.length} submissions</div>
          <Button asChild>
            <Link href="/staff/committee-dashboard/evaluation">Go to Evaluation Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}