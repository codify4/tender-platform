import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { getStaffRole } from '@/actions/staff-auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ProcurementDashboardPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
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
  
  // Fetch tender count
  const { data: tenders, error: tendersError } = await supabase
    .from('tenders')
    .select('id, status')
  
  if (tendersError) {
    console.error('Error fetching tender statistics:', tendersError)
  }
  
  const tenderCount = tenders?.length || 0
  
  return (
    <div className="flex w-full flex-col p-8">
      <h1 className="text-3xl font-bold mb-6">Procurement Officer Dashboard</h1>

      {searchParams.message && (
        <p className="mt-4 p-4 bg-green-50 text-green-500 text-center rounded mb-6">
          {searchParams.message}
        </p>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome, {user.user_metadata?.name || 'User'}</CardTitle>
          <CardDescription>Manage your procurement activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{tenderCount}</div>
          <p className="text-sm text-muted-foreground">
            {tenderCount === 0 ? 'No tenders created yet' : 
             tenderCount === 1 ? '1 tender created' : 
             `${tenderCount} tenders created`}
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button asChild>
            <Link href="/staff/procurement-dashboard/tenders">Manage Tenders</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 