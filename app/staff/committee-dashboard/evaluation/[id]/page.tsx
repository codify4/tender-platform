import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { getStaffRole } from "@/actions/staff-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, CheckCircle2, AlertCircle, BarChartHorizontal, FileBarChart } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { mockEvaluations } from "@/lib/evaluations"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function EvaluationResultsPage({ params, searchParams }: PageProps) {
  // Await params and searchParams as they are promises in Next.js 15
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  const supabase = await createClient()
  const submissionId = resolvedParams.id

  // Authentication checks
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/signin?message=Please sign in to continue")

  // Role verification
  const role = await getStaffRole()
  if (role !== "committee_officer") redirect("/staff/role?message=No access")

  // Fetch evaluation data from mock data
  const evaluation = mockEvaluations.find((evaluationItem) => evaluationItem.application_id === submissionId)

  if (!evaluation) redirect(`/staff/committee-dashboard/submissions/${submissionId}`)

  // Calculate scores
  const technicalTotal = evaluation.technical_evaluation.total_score
  const financialScore = evaluation.financial_evaluation.score
  const overallScore = evaluation.score

  return (
    <div className="flex w-full flex-col p-8">
      {resolvedSearchParams.error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">Error: {resolvedSearchParams.error}</div>
      )}

      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/staff/committee-dashboard/submissions">
            <ChevronLeft className="size-6 mr-1" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Evaluation Results</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{evaluation.tender_title}</CardTitle>
                <CardDescription>Vendor: {evaluation.vendor_name}</CardDescription>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant="outline">Evaluated on {new Date(evaluation.created_at).toLocaleDateString()}</Badge>
                <p className="text-xs text-muted-foreground mt-1">by AI Assistant</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-md">
                <p className="text-xs text-muted-foreground">Overall Score</p>
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-green-700">{overallScore}</span>
                </div>
                <p className="text-xs text-muted-foreground">out of 100</p>
              </div>

              <div className="space-y-1 flex flex-col p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Technical (70%)</p>
                  <p className="text-xs font-medium">{technicalTotal}</p>
                </div>
                <Progress value={technicalTotal} className="h-2" />

                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-muted-foreground">Financial (30%)</p>
                  <p className="text-xs font-medium">{financialScore}</p>
                </div>
                <Progress value={financialScore} className="h-2" />
              </div>

              <div className="space-y-1 flex flex-col p-4 bg-gray-50 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Recommendation</p>
                <Badge
                  className={
                    evaluation.recommendation === "award"
                      ? "bg-green-100 text-green-700"
                      : evaluation.recommendation === "reject"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {evaluation.recommendation.charAt(0).toUpperCase() + evaluation.recommendation.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
            <CardDescription>Review evaluation results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" asChild>
              <Link href={`/staff/committee-dashboard/submissions/${submissionId}`}>View Submission Details</Link>
            </Button>
            <Button variant="outline" className="w-full text-white">
              Download Evaluation Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Evaluation Tabs */}
      <Tabs defaultValue="technical">
        <TabsList className="mb-6">
          <TabsTrigger value="technical">
            <FileBarChart className="h-4 w-4 mr-2" />
            Technical Evaluation
          </TabsTrigger>
          <TabsTrigger value="financial">
            <BarChartHorizontal className="h-4 w-4 mr-2" />
            Financial Evaluation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Evaluation</CardTitle>
              <CardDescription>
                Score: {technicalTotal}/100 (
                {evaluation.technical_evaluation.experience.score + evaluation.technical_evaluation.team.score} raw
                points)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Experience Section */}
              <div className="space-y-4">
                <h3 className="font-medium">Experience Evaluation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {evaluation.technical_evaluation.experience.correct.map((item: any, index: any) => (
                        <li key={index} className="text-sm flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Improvements</h4>
                    <ul className="space-y-1">
                      {evaluation.technical_evaluation.experience.mistakes.map((item: any, index: any) => (
                        <li key={index} className="text-sm flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Team Section */}
              <div className="space-y-4">
                <h3 className="font-medium">Team Evaluation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {evaluation.technical_evaluation.team.correct.map((item: any, index: any) => (
                        <li key={index} className="text-sm flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Improvements</h4>
                    <ul className="space-y-1">
                      {evaluation.technical_evaluation.team.mistakes.map((item: any, index: any) => (
                        <li key={index} className="text-sm flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Evaluation</CardTitle>
              <CardDescription>Score: {financialScore}/100</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {evaluation.financial_evaluation.correct.map((item: any, index: any) => (
                      <li key={index} className="text-sm flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Improvements</h4>
                  <ul className="space-y-1">
                    {evaluation.financial_evaluation.mistakes.map((item: any, index: any) => (
                      <li key={index} className="text-sm flex items-start">
                        <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Compliance Issues Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Compliance Issues</CardTitle>
          <CardDescription>Critical items requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {evaluation.compliance_issues.map((issue: any, index: any) => (
              <Badge key={index} variant="destructive" className="px-3 py-1">
                {issue}
              </Badge>
            ))}
            {evaluation.compliance_issues.length === 0 && (
              <div className="text-sm text-muted-foreground">No critical compliance issues found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
