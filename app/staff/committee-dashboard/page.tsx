import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getStaffRole } from '@/actions/staff-auth'
import { Button } from '@/components/ui/button'
import { logOut } from '@/actions/auth'

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
  
  return (
    <div className="flex min-h-screen w-full flex-col p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Committee Officer Dashboard</h1>
        <form action={logOut}>
          <Button variant="outline" type="submit">Log Out</Button>
        </form>
      </div>
      
      {message && (
        <p className="mt-4 p-4 bg-green-50 text-green-500 text-center rounded">
          {message}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Welcome, {user.user_metadata?.name || 'User'}</CardTitle>
            <CardDescription>This is your committee dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{user.email}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p>Committee Officer</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 