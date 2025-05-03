import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStaffRole } from '@/actions/staff-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function EvaluationPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signin?message=Please sign in to continue')
  }
  
  // Verify role
  const role = await getStaffRole()
  
  if (role !== 'procurement_officer' && role !== 'committee_officer') {
    redirect('/staff/role?message=You do not have access to this page')
  }

  return (
    <div className="flex w-full flex-col p-8">
      <h1 className="text-3xl font-bold mb-6">Tender Evaluation</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Dashboard</CardTitle>
            <CardDescription>Manage and evaluate tender submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This page allows you to evaluate submissions against tender criteria and make recommendations.
            </p>
            
            {/* Evaluation list would go here */}
            <div className="p-8 text-center border rounded-lg border-dashed">
              <p className="text-muted-foreground">No active evaluations found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 