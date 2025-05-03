import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { getStaffRole } from '@/actions/staff-auth'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

// Define types for the data structure
type TenderData = {
  id: string;
  title: string;
  deadline: string;
}

type ApplicationData = {
  id: string;
  status: string;
  tenders: TenderData;
}

type EvaluationData = {
  id: string;
  score: number | null;
  application_id: string;
  applications: {
    tender_id: string;
    vendor_id: string;
  };
  evaluated_by: string;
}

export default async function CommitteeDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signin?message=Please sign in to continue')
  }
  
  // Verify role
  const role = await getStaffRole()
  
  if (role !== 'committee_officer') {
    redirect('/staff/role?message=You do not have access to this dashboard')
  }
  
  // Fetch applications waiting for evaluation
  const { data: applications, error: applicationsError } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      tenders!inner(id, title, deadline)
    `)
    .in('status', ['submitted', 'under_review'])
  
  if (applicationsError) {
    console.error('Error fetching applications:', applicationsError)
  }
  
  // Fetch evaluations in progress
  const { data: evaluations, error: evaluationsError } = await supabase
    .from('evaluated_applications')
    .select(`
      id,
      score,
      application_id,
      applications!inner(tender_id, vendor_id),
      evaluated_by
    `)
    .eq('evaluated_by', user.id)
  
  if (evaluationsError) {
    console.error('Error fetching evaluations:', evaluationsError)
  }
  
  // Prepare stats
  const evalStats = {
    pendingEvaluation: applications?.filter(app => app.status === 'submitted')?.length || 0,
    inProgress: applications?.filter(app => app.status === 'under_review')?.length || 0,
    completed: evaluations?.filter(evaluation => evaluation.score !== null)?.length || 0,
    myAssignments: evaluations?.length || 0
  }
  
  // Transform applications data for display
  const recentEvaluations = applications ? 
    (applications as unknown as ApplicationData[]).map(app => ({
      id: app.id,
      title: app.tenders.title || 'Unknown Tender',
      deadline: app.tenders.deadline ? new Date(app.tenders.deadline).toLocaleDateString() : 'N/A',
      status: app.status,
      criteria: 0 // This would need to be fetched from a criteria table if available
    })) : []
  
  return (
    <div className="flex w-full flex-col p-8">
      <h1 className="text-3xl font-bold mb-5">Committee Officer Dashboard</h1>

      {message && (
        <p className="mt-4 p-4 bg-green-50 text-green-500 text-center rounded">
          {message}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Evaluations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{evalStats.pendingEvaluation}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{evalStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{evalStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{evalStats.myAssignments}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.user_metadata?.name || 'User'}</CardTitle>
          <CardDescription>Manage your evaluation activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="evaluations">
            <TabsList className="mb-4">
              <TabsTrigger value="evaluations">Pending Evaluations</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="evaluations">
              <div className="rounded-md border">
                <div className="grid grid-cols-5 p-4 font-medium border-b">
                  <div>Tender Title</div>
                  <div>Deadline</div>
                  <div>Status</div>
                  <div>Criteria Count</div>
                  <div>Actions</div>
                </div>
                
                {recentEvaluations.map((evaluation) => (
                  <div key={evaluation.id} className="grid grid-cols-5 p-4 border-b last:border-0">
                    <div className="font-medium">{evaluation.title}</div>
                    <div>{evaluation.deadline}</div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        evaluation.status === 'pending' || evaluation.status === 'submitted'
                          ? 'bg-yellow-50 text-yellow-600'
                          : evaluation.status === 'under_review'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-green-50 text-green-600'
                      }`}>
                        {evaluation.status === 'pending' || evaluation.status === 'submitted'
                          ? 'Pending'
                          : evaluation.status === 'under_review'
                          ? 'In Progress'
                          : 'Completed'}
                      </span>
                    </div>
                    <div>{evaluation.criteria}</div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/staff/committee-dashboard/evaluation/${evaluation.id}`}>
                          {evaluation.status === 'approved' ? 'View' : 'Evaluate'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground text-center">No recent activity available.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Link href="/staff/committee-dashboard/submissions">
            <Button variant="outline" className="mr-2">View All Submissions</Button>
          </Link>
          <Link href="/staff/committee-dashboard/evaluation">
            <Button>Go to Evaluation</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 