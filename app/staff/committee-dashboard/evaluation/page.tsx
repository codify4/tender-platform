import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStaffRole } from '@/actions/staff-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EvaluationRanking } from '@/components/evaluation/evaluation-ranking'
import { Sparkles, FileBarChart, TableProperties, Calendar, LockIcon, UnlockIcon } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default async function EvaluationPage() {
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

  // Get current date for locking logic
  const currentDate = new Date();

  // Mock evaluation data for tenders
  const tenders = [
    {
      id: 101,
      title: "IT Equipment Supply",
      evaluationStatus: "completed",
      submissionCount: 4,
      endDate: "2023-11-01", // Past date - evaluation allowed
      isLocked: false,
      submissions: [
        { 
          id: 1, 
          rank: 1, 
          vendor: "TechCorp Ltd", 
          score: 87, 
          technicalScore: 85, 
          financialScore: 92, 
          complianceScore: 90, 
          status: "recommended" as const,
          evaluationDate: "2023-11-15" 
        },
        { 
          id: 2, 
          rank: 2, 
          vendor: "IT Providers Inc", 
          score: 79, 
          technicalScore: 82, 
          financialScore: 75, 
          complianceScore: 85, 
          status: "evaluated" as const,
          evaluationDate: "2023-11-14" 
        },
        { 
          id: 3, 
          rank: 3, 
          vendor: "Compumax Solutions", 
          score: 72, 
          technicalScore: 68, 
          financialScore: 85, 
          complianceScore: 75, 
          status: "evaluated" as const,
          evaluationDate: "2023-11-16" 
        },
        { 
          id: 4, 
          rank: 4, 
          vendor: "DigiTech Systems", 
          score: 65, 
          technicalScore: 60, 
          financialScore: 72, 
          complianceScore: 70, 
          status: "rejected" as const,
          evaluationDate: "2023-11-15" 
        }
      ]
    },
    {
      id: 102,
      title: "Office Renovation",
      evaluationStatus: "in_progress",
      submissionCount: 2,
      endDate: "2023-11-10", // Past date - evaluation allowed
      isLocked: false,
      submissions: [
        { 
          id: 5, 
          rank: 1, 
          vendor: "BuildRight Construction", 
          score: 82, 
          technicalScore: 80, 
          financialScore: 84, 
          complianceScore: 85, 
          status: "evaluated" as const,
          evaluationDate: "2023-11-18" 
        },
        { 
          id: 6, 
          rank: 2, 
          vendor: "Premier Interiors", 
          score: 75, 
          technicalScore: 78, 
          financialScore: 72, 
          complianceScore: 80, 
          status: "evaluated" as const,
          evaluationDate: "2023-11-18" 
        }
      ]
    },
    {
      id: 103,
      title: "Consulting Services",
      evaluationStatus: "pending",
      submissionCount: 1,
      endDate: "2023-12-30", // Future date - locked for evaluation
      isLocked: true,
      submissions: [
        { 
          id: 7, 
          rank: 1, 
          vendor: "Strategic Advisors", 
          score: 0, 
          technicalScore: 0, 
          financialScore: 0, 
          complianceScore: 0, 
          status: "pending" as const
        }
      ]
    }
  ]

  const completedTenders = tenders.filter(tender => tender.evaluationStatus === "completed")
  const inProgressTenders = tenders.filter(tender => tender.evaluationStatus === "in_progress")
  const pendingTenders = tenders.filter(tender => tender.evaluationStatus === "pending")

  return (
    <div className="flex w-full flex-col p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tender Evaluation & Ranking</h1>
      </div>
      
      <Tabs defaultValue="completed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="completed" className="flex items-center gap-1">
            <TableProperties className="h-4 w-4" />
            Completed ({completedTenders.length})
          </TabsTrigger>
          <TabsTrigger value="inprogress" className="flex items-center gap-1">
            <TableProperties className="h-4 w-4" />
            In Progress ({inProgressTenders.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <TableProperties className="h-4 w-4" />
            Pending ({pendingTenders.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="completed" className="space-y-6">
          {completedTenders.length > 0 ? (
            completedTenders.map(tender => (
              <EvaluationRanking
                key={tender.id}
                tenderId={tender.id}
                tenderTitle={tender.title}
                submissionCount={tender.submissionCount}
                submissions={tender.submissions}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No completed evaluations found.
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="inprogress" className="space-y-6">
          {inProgressTenders.length > 0 ? (
            inProgressTenders.map(tender => (
              <EvaluationRanking
                key={tender.id}
                tenderId={tender.id}
                tenderTitle={tender.title}
                submissionCount={tender.submissionCount}
                submissions={tender.submissions}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No evaluations in progress.
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-6">
          {pendingTenders.length > 0 ? (
            pendingTenders.map(tender => (
              <Card key={tender.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {tender.title}
                        {tender.isLocked && (
                          <Badge variant="outline" className="ml-2 flex items-center gap-1 text-[#1a3c70]">
                            <LockIcon className="h-3 w-3" />
                            Locked
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {tender.submissionCount} submission{tender.submissionCount !== 1 ? 's' : ''} pending evaluation
                      </CardDescription>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      End Date: {tender.endDate}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tender.isLocked ? (
                      <div className="p-4 bg-[#e6edf7] rounded-lg text-center">
                        <p className="text-[#1a3c70] font-medium mb-1">Evaluation Locked</p>
                        <p className="text-sm text-muted-foreground">
                          This tender cannot be evaluated until after the submission end date ({tender.endDate}).
                        </p>
                      </div>
                    ) : (
                      tender.submissions.map(submission => (
                        <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{submission.vendor}</p>
                            <p className="text-sm text-muted-foreground">Pending evaluation</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/staff/committee-dashboard/submissions/${submission.id}`}>
                                View Submission
                              </Link>
                            </Button>
                            <Button size="sm" className="flex items-center gap-1">
                              <Sparkles className="h-4 w-4" />
                              Evaluate with AI
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No pending evaluations.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 