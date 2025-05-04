"use client"

import { useState } from 'react'
import { Trash2, Eye } from 'lucide-react'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet"
import { deleteTender } from '@/actions/tender'
import { useRouter } from 'next/navigation'

export interface Tender {
  id: string
  reference: string
  title: string
  type: string
  published_at: string
  deadline: string
  status: string
  description: string
  ceiling_fund: number
  submissionCount?: number
}

export function TenderTable({ tenders }: { tenders: Tender[] }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tenderToDelete, setTenderToDelete] = useState<string | null>(null)
  const [viewTenderOpen, setViewTenderOpen] = useState(false)
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const router = useRouter()
  
  const handleDeleteConfirm = (id: string) => {
    setTenderToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteAction = async (id: string) => {
    if (id) {
      await deleteTender(id)
      router.refresh()
      setDeleteDialogOpen(false)
    }
  }
  
  const handleViewTender = (tender: Tender) => {
    setSelectedTender(tender)
    setViewTenderOpen(true)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No tenders found
              </TableCell>
            </TableRow>
          ) : (
            tenders.map((tender) => (
              <TableRow key={tender.id}>
                <TableCell className="font-medium">{tender.title}</TableCell>
                <TableCell className="capitalize">{tender.type}</TableCell>
                <TableCell>{new Date(tender.deadline).toLocaleDateString()}</TableCell>
                <TableCell>
                  <StatusBadge status={tender.status} />
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewTender(tender)}
                    className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteConfirm(tender.id)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className='bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tender
              and all related documents and submissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='bg-white'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => tenderToDelete && handleDeleteAction(tenderToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Sheet open={viewTenderOpen} onOpenChange={setViewTenderOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-white px-5">
          <SheetHeader>
            <SheetTitle>{selectedTender?.title}</SheetTitle>
            <SheetDescription>
              Tender details
            </SheetDescription>
          </SheetHeader>
          
          {selectedTender && (
            <div className="py-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <StatusBadge status={selectedTender.status} />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                <p className="mt-1 text-sm capitalize">{selectedTender.type}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ceiling Fund</h3>
                <p className="mt-1 text-sm">${selectedTender.ceiling_fund.toLocaleString()}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Publication Date</h3>
                  <p className="mt-1 text-sm">{new Date(selectedTender.published_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
                  <p className="mt-1 text-sm">{new Date(selectedTender.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm whitespace-pre-wrap">{selectedTender.description}</p>
              </div>
            </div>
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
    draft: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    closed: "bg-gray-100 text-gray-800 hover:bg-gray-100"
  };
  
  const statusText = {
    active: "Active",
    completed: "Completed",
    draft: "Draft",
    closed: "Closed"
  };
  
  return (
    <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
      {statusText[status as keyof typeof statusText] || status}
    </Badge>
  )
} 