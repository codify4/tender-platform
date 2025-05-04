'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
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

export default function NewTenderPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function loadError() {
      const params = await searchParams
      if (params?.error) {
        setError(params.error)
      }
    }
    loadError()
  }, [searchParams])

  async function handleCreateTender(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await createTender(formData)
      if (result?.redirect) {
        router.push(result.redirect)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsSubmitting(false)
    }
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
          Error: {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tender Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreateTender} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="mb-2 block">Title</Label>
                <Input id="title" name="title" placeholder="Enter tender title" required />
              </div>
              
              <div>
                <Label htmlFor="description" className="mb-1 block">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Provide details about the tender"
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="type" className="mb-1 block">Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="communications">Communications</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="heritage">Heritage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="ceiling_fund" className="mb-2 block">Ceiling Fund</Label>
                <Input 
                  id="ceiling_fund" 
                  name="ceiling_fund" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="Maximum budget amount" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="published_at" className="mb-2 block">Publication Date</Label>
                  <Input 
                    id="published_at" 
                    name="published_at" 
                    type="date" 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="deadline" className="mb-2 block">Submission Deadline</Label>
                  <Input 
                    id="deadline" 
                    name="deadline" 
                    type="date" 
                    required 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-6">
              <Button variant="outline" asChild>
                <Link href="/staff/procurement-dashboard/tenders" className='bg-white border'>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Tender"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 