import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStaffRole } from '@/actions/staff-auth'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SubmissionCard } from '@/components/evaluation/submission-card'

export default async function SubmissionsPage() {
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

  // Mock submission data
  const submissions = [
    { 
      id: 1, 
      tenderId: 101,
      tenderTitle: "IT Equipment Supply", 
      vendor: "TechCorp Ltd", 
      status: "evaluated" as const, 
      submissionDate: "2023-11-10", 
      documents: 5,
      score: 87,
      isLocked: false
    },
    { 
      id: 2, 
      tenderId: 101,
      tenderTitle: "IT Equipment Supply", 
      vendor: "Compumax Solutions", 
      status: "evaluated" as const, 
      submissionDate: "2023-11-09", 
      documents: 4,
      score: 72,
      isLocked: false
    },
    { 
      id: 3, 
      tenderId: 102,
      tenderTitle: "Office Renovation", 
      vendor: "BuildRight Construction", 
      status: "under_evaluation" as const, 
      submissionDate: "2023-11-05", 
      documents: 7,
      isLocked: false
    },
    { 
      id: 4, 
      tenderId: 102,
      tenderTitle: "Office Renovation", 
      vendor: "Premier Interiors", 
      status: "under_evaluation" as const, 
      submissionDate: "2023-11-07", 
      documents: 6,
      isLocked: false
    },
    { 
      id: 5, 
      tenderId: 103,
      tenderTitle: "Consulting Services", 
      vendor: "Strategic Advisors", 
      status: "pending_review" as const, 
      submissionDate: "2023-11-12", 
      documents: 3,
      isLocked: false
    },
    { 
      id: 6, 
      tenderId: 104,
      tenderTitle: "Software Licenses", 
      vendor: "DigiTech Systems", 
      status: "pending_review" as const, 
      submissionDate: "2023-10-25", 
      documents: 4,
      isLocked: true,
      endDate: "2023-12-10"
    },
  ]

  // Group submissions by tender
  const tenderGroups = submissions.reduce((acc, submission) => {
    const key = submission.tenderId.toString()
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(submission)
    return acc
  }, {} as Record<string, typeof submissions>)

  // Filter submissions by status
  const pendingSubmissions = submissions.filter(s => s.status === "pending_review" && !s.isLocked)
  const inProgressSubmissions = submissions.filter(s => s.status === "under_evaluation")
  const evaluatedSubmissions = submissions.filter(s => s.status === "evaluated")
  const lockedSubmissions = submissions.filter(s => s.isLocked)

  return (
    <div className="flex w-full flex-col p-8">
      <h1 className="text-3xl font-bold mb-6">Tender Submissions</h1>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending ({pendingSubmissions.length})</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress ({inProgressSubmissions.length})</TabsTrigger>
          <TabsTrigger value="evaluated">Evaluated ({evaluatedSubmissions.length})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({lockedSubmissions.length})</TabsTrigger>
          <TabsTrigger value="bytender">By Tender</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {pendingSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingSubmissions.map(submission => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No pending submissions available for evaluation.
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="inprogress">
          {inProgressSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressSubmissions.map(submission => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No submissions currently in evaluation.
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="evaluated">
          {evaluatedSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evaluatedSubmissions.map(submission => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No evaluated submissions yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="locked">
          {lockedSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedSubmissions.map(submission => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No locked submissions.
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="bytender">
          <div className="space-y-8">
            {Object.entries(tenderGroups).map(([tenderId, submissions]) => {
              const tenderTitle = submissions[0].tenderTitle
              
              return (
                <Card key={tenderId}>
                  <CardHeader>
                    <CardTitle>{tenderTitle}</CardTitle>
                    <CardDescription>
                      {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {submissions.map(submission => (
                        <SubmissionCard key={submission.id} submission={submission} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 