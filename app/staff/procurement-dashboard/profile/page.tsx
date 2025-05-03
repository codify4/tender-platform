import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStaffRole } from '@/actions/staff-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signin?message=Please sign in to continue')
  }
  
  // Verify role
  const role = await getStaffRole()
  
  if (!role) {
    redirect('/staff/role?message=You do not have a valid role')
  }

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  const userEmail = user.email || ''
  const userAvatar = user.user_metadata?.avatar_url || ''

  return (
    <div className="flex w-full flex-col p-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{userName}</h3>
              <p className="text-muted-foreground">{userEmail}</p>
              <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {role === 'procurement_officer' ? 'Procurement Officer' : 'Committee Officer'}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Role-specific Content Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Role Settings</CardTitle>
            <CardDescription>Role-specific information and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="information" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="information">
                {role === 'procurement_officer' ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Procurement Officer Information</h3>
                    <p>As a Procurement Officer, you have the following responsibilities:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Create and manage tender notices</li>
                      <li>Review submissions from vendors</li>
                      <li>Coordinate with the evaluation committee</li>
                      <li>Award tenders to successful vendors</li>
                      <li>Manage procurement documentation</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Committee Officer Information</h3>
                    <p>As a Committee Officer, you have the following responsibilities:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Evaluate tender submissions based on criteria</li>
                      <li>Provide scores and comments on submissions</li>
                      <li>Participate in committee decisions</li>
                      <li>Review technical specifications</li>
                      <li>Ensure fair and transparent evaluation process</li>
                    </ul>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Settings</h3>
                  
                  {role === 'procurement_officer' ? (
                    <div className="space-y-2">
                      <p>Configure your procurement officer settings:</p>
                      <div className="grid gap-2">
                        <Button variant="outline" size="sm">
                          Notification Preferences
                        </Button>
                        <Button variant="outline" size="sm">
                          Document Templates
                        </Button>
                        <Button variant="outline" size="sm">
                          Delegation Settings
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>Configure your committee officer settings:</p>
                      <div className="grid gap-2">
                        <Button variant="outline" size="sm">
                          Evaluation Criteria Templates
                        </Button>
                        <Button variant="outline" size="sm">
                          Scoring Guidelines
                        </Button>
                        <Button variant="outline" size="sm">
                          Committee Notifications
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 