import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { setStaffRole, checkStaffRoleExists } from '@/actions/staff-auth'

export default async function StaffRolePage({
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
  
  // Check if role already exists
  const hasRole = await checkStaffRoleExists()
  
  if (hasRole) {
    // Role exists, get current role and redirect to appropriate dashboard
    const { data } = await supabase
      .from('staff')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (data?.role === 'procurement_officer') {
      redirect('/staff/procurement-dashboard')
    } else if (data?.role === 'committee_officer') {
      redirect('/staff/committee-dashboard')
    }
  }
  
  return (
    <div className="flex min-h-screen w-full items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Select Your Role</CardTitle>
          <CardDescription>
            Please select your role to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <form action={setStaffRole.bind(null, 'procurement_officer')}>
              <Button type="submit" className="w-full h-24 text-lg">
                Procurement Officer
              </Button>
            </form>
            
            <form action={setStaffRole.bind(null, 'committee_officer')}>
              <Button type="submit" variant="outline" className="w-full h-24 text-lg">
                Committee Officer
              </Button>
            </form>
          </div>
          
          {message && (
            <p className="mt-4 p-4 bg-red-50 text-red-500 text-center rounded">
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 