import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStaffRole } from '@/actions/staff-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { TenderTable, type Tender } from './components/tender-table'

export default async function TendersPage({
  searchParams
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
    redirect('/staff/role?message=You do not have access to this page')
  }

  // Fetch tenders from the database
  const { data: tenders, error } = await supabase
    .from('tenders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tenders:', error)
  }

  return (
    <div className="flex w-full flex-col p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Tenders</h1>
        <Button asChild className="flex items-center gap-1">
          <Link href="/staff/procurement-dashboard/tenders/new">
            <Plus className="size-4 mr-1" />
            Create New Tender
          </Link>
        </Button>
      </div>
      
      {searchParams.message && (
        <div className="bg-green-50 p-4 rounded-md text-green-700 mb-6">
          {searchParams.message}
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>All Tenders</CardTitle>
          <CardDescription>
            View and manage your tenders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TenderTable tenders={tenders || []} />
        </CardContent>
      </Card>
    </div>
  )
} 