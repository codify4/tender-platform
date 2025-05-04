import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStaffRole } from '@/actions/staff-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EvaluationRanking } from '@/components/evaluation/evaluation-ranking'
import { TableProperties, Calendar, LockIcon } from 'lucide-react'
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
  
  if (role !== 'procurement_officer') {
    redirect('/staff/role?message=You do not have access to this page')
  }

  // Mock evaluation data for tenders - in a real app, fetch from Supabase
  const tenders = [
    {
      id: 101,
      title: "IT Equipment Supply",
      evaluationStatus: "completed",
      submissionCount: 4,
      endDate: "2023-11-01",
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
      evaluationStatus: "completed",
      submissionCount: 2,
      endDate: "2023-11-10",
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
          status: "recommended" as const,
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
      title: "Software Licenses",
      evaluationStatus: "in_progress",
      submissionCount: 5,
      endDate: "2023-11-20",
      isLocked: false,
      submissions: [
        { 
          id: 7, 
          rank: 1, 
          vendor: "Digital Software Solutions", 
          score: 88, 
          technicalScore: 90, 
          financialScore: 85, 
          complianceScore: 92, 
          status: "evaluated" as const,
          evaluationDate: "2023-11-22" 
        },
        { 
          id: 8, 
          rank: 2, 
          vendor: "License Express", 
          score: 76, 
          technicalScore: 80, 
          financialScore: 70, 
          complianceScore: 78, 
          status: "evaluated" as const,
          evaluationDate: "2023-11-22" 
        },
        { 
          id: 9, 
          rank: 3, 
          vendor: "CloudTech Services", 
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
        <h1 className="text-3xl font-bold">Tender Evaluation Results</h1>
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
        </TabsList>
        
        <TabsContent value="completed" className="space-y-6">
          {completedTenders.length > 0 ? (
            completedTenders.map(tender => (
              <Card key={tender.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">{tender.title}</CardTitle>
                      <CardDescription>
                        {tender.submissionCount} submission{tender.submissionCount !== 1 ? 's' : ''} evaluated
                      </CardDescription>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      End Date: {tender.endDate}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-white border-t">
                    <div className="p-4 border-b bg-muted/20">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Ranking Results</div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {tender.submissions.sort((a, b) => a.rank - b.rank).map((submission) => (
                        <div key={submission.id} className="grid grid-cols-8 py-3 px-4 items-center hover:bg-gray-50">
                          <div className="col-span-1 flex justify-center">
                            <div className={`flex justify-center items-center w-8 h-8 rounded-full ${
                              submission.rank === 1 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {submission.rank}
                            </div>
                          </div>
                          <div className="col-span-3 font-medium">
                            {submission.vendor}
                            {submission.status === 'recommended' && (
                              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                                Recommended
                              </Badge>
                            )}
                            {submission.status === 'rejected' && (
                              <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800">
                                Rejected
                              </Badge>
                            )}
                          </div>
                          <div className="col-span-1 text-center text-sm">
                            <div className="font-medium">{submission.score}</div>
                            <div className="text-xs text-muted-foreground">Overall</div>
                          </div>
                          <div className="col-span-1 text-center text-sm">
                            <div className="font-medium">{submission.technicalScore}</div>
                            <div className="text-xs text-muted-foreground">Technical</div>
                          </div>
                          <div className="col-span-1 text-center text-sm">
                            <div className="font-medium">{submission.financialScore}</div>
                            <div className="text-xs text-muted-foreground">Financial</div>
                          </div>
                          <div className="col-span-1 text-right">
                            <Button variant="outline" size="sm" asChild className="bg-white">
                              <Link href={`/staff/procurement-dashboard/evaluation/${submission.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              <Card key={tender.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">{tender.title}</CardTitle>
                      <CardDescription>
                        {tender.submissionCount} submission{tender.submissionCount !== 1 ? 's' : ''}, partially evaluated
                      </CardDescription>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      End Date: {tender.endDate}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-white border-t">
                    <div className="p-4 border-b bg-muted/20">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Evaluation in Progress</div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {tender.submissions.sort((a, b) => {
                        // Sort evaluated submissions first by rank, then pending ones
                        if (a.status === 'pending' && b.status !== 'pending') return 1;
                        if (a.status !== 'pending' && b.status === 'pending') return -1;
                        return a.rank - b.rank;
                      }).map((submission) => (
                        <div key={submission.id} className="grid grid-cols-8 py-3 px-4 items-center hover:bg-gray-50">
                          <div className="col-span-1 flex justify-center">
                            {submission.status !== 'pending' ? (
                              <div className={`flex justify-center items-center w-8 h-8 rounded-full ${
                                submission.rank === 1 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {submission.rank}
                              </div>
                            ) : (
                              <div className="flex justify-center items-center w-8 h-8 rounded-full bg-amber-100 text-amber-800">
                                <LockIcon className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="col-span-3 font-medium">
                            {submission.vendor}
                            {submission.status === 'pending' && (
                              <Badge variant="outline" className="ml-2 flex items-center gap-1">
                                Pending
                              </Badge>
                            )}
                          </div>
                          <div className="col-span-1 text-center text-sm">
                            <div className="font-medium">{submission.status !== 'pending' ? submission.score : '-'}</div>
                            <div className="text-xs text-muted-foreground">Overall</div>
                          </div>
                          <div className="col-span-1 text-center text-sm">
                            <div className="font-medium">{submission.status !== 'pending' ? submission.technicalScore : '-'}</div>
                            <div className="text-xs text-muted-foreground">Technical</div>
                          </div>
                          <div className="col-span-1 text-center text-sm">
                            <div className="font-medium">{submission.status !== 'pending' ? submission.financialScore : '-'}</div>
                            <div className="text-xs text-muted-foreground">Financial</div>
                          </div>
                          <div className="col-span-1 text-right">
                            {submission.status !== 'pending' ? (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/staff/procurement-dashboard/evaluation/${submission.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                Not Evaluated
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No evaluations in progress.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 