import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { getStaffRole } from '@/actions/staff-auth'
import { Button } from '@/components/ui/button'
import { logOut } from '@/actions/auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function ProcurementDashboardPage({
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
  
  if (role !== 'procurement_officer') {
    redirect('/staff/role?message=You do not have access to this dashboard')
  }
  
  // Fetch tender statistics (mock data for now)
  const tenderStats = {
    total: 12,
    active: 5,
    completed: 4,
    draft: 3,
  }
  
  // Fetch recent tenders (mock data for now)
  const recentTenders = [
    { id: 1, title: "IT Equipment Supply", deadline: "2023-11-30", status: "active", submissions: 8 },
    { id: 2, title: "Office Renovation", deadline: "2023-12-15", status: "active", submissions: 3 },
    { id: 3, title: "Consulting Services", deadline: "2023-12-05", status: "active", submissions: 5 },
    { id: 4, title: "Software Licenses", deadline: "2023-11-20", status: "completed", submissions: 6 },
  ]
  
  return (
    <div className="flex w-full flex-col p-8">
      <h1 className="text-3xl font-bold mb-6">Procurement Officer Dashboard</h1>

      
      {message && (
        <p className="mt-4 p-4 bg-green-50 text-green-500 text-center rounded">
          {message}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tenderStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tenderStats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tenderStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft Tenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tenderStats.draft}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Welcome, {user.user_metadata?.name || 'User'}</CardTitle>
          <CardDescription>Manage your procurement activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 p-4 font-medium border-b">
              <div>Title</div>
              <div>Deadline</div>
              <div>Status</div>
              <div>Submissions</div>
            </div>
            {recentTenders.map((tender) => (
              <div key={tender.id} className="grid grid-cols-4 p-4 border-b last:border-0">
                <div className="font-medium">{tender.title}</div>
                <div>{tender.deadline}</div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    tender.status === 'active' 
                      ? 'bg-green-50 text-green-700' 
                      : tender.status === 'completed'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-orange-50 text-orange-700'
                  }`}>
                    {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                  </span>
                </div>
                <div>{tender.submissions}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 