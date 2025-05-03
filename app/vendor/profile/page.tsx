import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { saveVendorProfile, getVendorProfile } from '@/actions/vendor-auth'
import { use } from 'react'

export default async function VendorProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signin?message=Please sign in to continue')
  }
  
  // Get existing profile if available
  const profile = await getVendorProfile()
  
  // Use await to access searchParams properties
  const { message } = await searchParams
  
  return (
    <div className="flex min-h-screen w-full items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Company Profile</CardTitle>
          <CardDescription>
            Please provide your company information to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveVendorProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name*</Label>
              <Input 
                id="companyName" 
                name="companyName" 
                placeholder="Enter company name" 
                required 
                defaultValue={profile?.company_name || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input 
                id="registrationNumber" 
                name="registrationNumber" 
                placeholder="Enter registration number" 
                defaultValue={profile?.registration_number || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                name="address" 
                placeholder="Enter company address" 
                defaultValue={profile?.address || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input 
                id="phoneNumber" 
                name="phoneNumber" 
                placeholder="Enter phone number" 
                defaultValue={profile?.phone_number || ''}
              />
            </div>
            
            <Button type="submit" className="w-full">
              Save Profile
            </Button>
          </form>
          
          {message && (
            <p className="mt-4 p-4 bg-red-50 text-red-500 text-center rounded">
              {message}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Fields marked with * are required
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 