import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { getStaffRole } from '@/actions/staff-auth'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

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
  
  // Fetch evaluation statistics (mock data for now)
  const evalStats = {
    pendingEvaluation: 8,
    completed: 5,
    inProgress: 3, 
    myAssignments: 4
  }
  
  // Fetch recent evaluation tasks (mock data for now)
  const recentEvaluations = [
    { id: 1, title: "IT Equipment Supply", deadline: "2023-11-30", status: "pending", criteria: 5 },
    { id: 2, title: "Office Renovation", deadline: "2023-12-15", status: "in_progress", criteria: 7 },
    { id: 3, title: "Consulting Services", deadline: "2023-12-05", status: "pending", criteria: 4 },
    { id: 4, title: "Software Licenses", deadline: "2023-11-20", status: "completed", criteria: 6 },
  ]
  
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
                        evaluation.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-600'
                          : evaluation.status === 'in_progress'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-green-50 text-green-600'
                      }`}>
                        {evaluation.status === 'pending'
                          ? 'Pending'
                          : evaluation.status === 'in_progress'
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
                          {evaluation.status === 'completed' ? 'View' : 'Evaluate'}
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