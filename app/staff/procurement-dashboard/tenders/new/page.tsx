import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStaffRole } from '@/actions/staff-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createTender } from '@/actions/tender'

// Create a wrapper function that handles the return type from createTender
async function handleCreateTender(formData: FormData) {
  'use server';
  
  const result = await createTender(formData);
  
  if (result.error) {
    // Handle error case if needed
    console.error(result.error);
    return;
  }
  
  // Successful submission
  redirect('/staff/procurement-dashboard/tenders');
}

export default async function NewTenderPage() {
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

  return (
    <div className="flex w-full flex-col p-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/staff/procurement-dashboard/tenders">
            <ChevronLeft className="size-4 mr-1" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Tender</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tender Details</CardTitle>
          <CardDescription>
            Enter the details for the new tender. All fields are required unless specified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleCreateTender} className="space-y-6" id="create-tender-form">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="mb-2 block">Tender Title</Label>
                <Input id="title" name="title" placeholder="e.g., IT Equipment Supply" required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="mb-2 block">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" required />
                </div>
                <div>
                  <Label htmlFor="endDate" className="mb-2 block">Submission Deadline</Label>
                  <Input id="endDate" name="endDate" type="date" required />
                </div>
              </div>
              
              <div>
                <Label htmlFor="category" className="mb-1 block">Category</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goods">Goods</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="works">Works</SelectItem>
                    <SelectItem value="consultancy">Consultancy</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description" className="mb-1 block">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Provide a detailed description of the tender..."
                  rows={5}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="ceilingFund" className="mb-1 block">Ceiling Fund</Label>
                <Input
                  id="ceilingFund"
                  name="ceilingFund"
                  type="number"
                  placeholder="Maximum budget allocated for this tender"
                  required
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-dashed">
                <Label htmlFor="documents" className="block mb-2">Tender Documents</Label>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload all documents related to this tender. These will be made available to applicants.
                  </p>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-gray-500 mb-2" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF, DOCX, XLSX (MAX. 10MB per file)</p>
                      </div>
                      <Input id="dropzone-file" name="documents" type="file" className="hidden" multiple />
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Files will be uploaded to the Tender Documents bucket in Supabase.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="mb-1 block">Initial Status</Label>
              <Select name="status" defaultValue="draft">
                <SelectTrigger>
                  <SelectValue placeholder="Select initial status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft (not visible to vendors)</SelectItem>
                  <SelectItem value="active">Active (immediately visible)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Draft tenders can be edited and published later.
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 border-t pt-6">
          <Button variant="outline" asChild>
            <Link href="/staff/procurement-dashboard/tenders">Cancel</Link>
          </Button>
          <Button type="submit" form="create-tender-form">Create Tender</Button>
        </CardFooter>
      </Card>
    </div>
  )
} 