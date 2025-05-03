"use client"

import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent, 
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'

export interface Tender {
  id: number
  reference: string
  title: string
  category: string
  startDate: string
  endDate: string
  status: string
  submissionCount: number
  hasEvaluation: boolean
}

export function TenderTable({ tenders }: { tenders: Tender[] }) {
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  
  const handleViewDetails = (tender: Tender) => {
    setSelectedTender(tender)
    setSheetOpen(true)
  }
  
  const handleDelete = (id: number) => {
    // This would typically call an API to delete the tender
    console.log('Delete tender:', id)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submissions</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No tenders found
              </TableCell>
            </TableRow>
          ) : (
            tenders.map((tender) => (
              <TableRow key={tender.id}>
                <TableCell className="font-medium">{tender.reference}</TableCell>
                <TableCell>{tender.title}</TableCell>
                <TableCell>{tender.category}</TableCell>
                <TableCell>{tender.endDate}</TableCell>
                <TableCell>
                  <StatusBadge status={tender.status} />
                </TableCell>
                <TableCell>{tender.submissionCount}</TableCell>
                <TableCell className="text-right flex justify-end items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDetails(tender)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(tender.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md bg-white px-5">
          {selectedTender && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle>Tender Details</SheetTitle>
                <SheetDescription>
                  {selectedTender.reference}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                  <p className="text-base">{selectedTender.title}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                  <p className="text-base">{selectedTender.category}</p>
                </div>
                
                <div className="flex gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                    <p className="text-base">{selectedTender.startDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                    <p className="text-base">{selectedTender.endDate}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <StatusBadge status={selectedTender.status} />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Submissions</h3>
                  <p className="text-base">{selectedTender.submissionCount}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusColors = {
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    completed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    draft: "bg-amber-100 text-amber-800 hover:bg-amber-100"
  };
  
  const statusText = {
    active: "Active",
    completed: "Completed",
    draft: "Draft"
  };
  
  return (
    <Badge className={statusColors[status as keyof typeof statusColors]}>
      {statusText[status as keyof typeof statusText]}
    </Badge>
  )
} 