"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Search,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Application = {
  id: number;
  tenderId: number;
  tenderTitle: string;
  reference: string;
  submittedDate: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  documents: {
    id: number;
    name: string;
    size: string;
  }[];
  feedback?: string;
};

// Mock data for applications
const applications: Application[] = [
  {
    id: 1,
    tenderId: 1,
    tenderTitle: "IT Infrastructure Development Project",
    reference: "AADF-2023-1",
    submittedDate: "2023-10-15",
    status: "under_review",
    documents: [
      { id: 1, name: "Technical Proposal.pdf", size: "2.4 MB" },
      { id: 2, name: "Financial Proposal.xlsx", size: "1.1 MB" },
      { id: 3, name: "Company Documents.zip", size: "5.8 MB" },
    ],
  },
  {
    id: 2,
    tenderId: 2,
    tenderTitle: "Marketing Services for Annual Report",
    reference: "AADF-2023-2",
    submittedDate: "2023-10-10",
    status: "approved",
    documents: [
      { id: 4, name: "Marketing Proposal.pdf", size: "3.2 MB" },
      { id: 5, name: "Budget Breakdown.xlsx", size: "980 KB" },
      { id: 6, name: "Company Portfolio.pdf", size: "8.5 MB" },
    ],
    feedback: "Your application has been approved. Please check your email for further instructions on contract signing.",
  },
  {
    id: 3,
    tenderId: 3,
    tenderTitle: "Office Equipment Supply",
    reference: "AADF-2023-3",
    submittedDate: "2023-10-05",
    status: "rejected",
    documents: [
      { id: 7, name: "Supply Proposal.pdf", size: "1.8 MB" },
      { id: 8, name: "Pricing Sheet.xlsx", size: "750 KB" },
    ],
    feedback: "We regret to inform you that your application does not meet the technical requirements specified in the tender documentation.",
  },
  {
    id: 4,
    tenderId: 4,
    tenderTitle: "Website Development Project",
    reference: "AADF-2023-4",
    submittedDate: "2023-10-20",
    status: "pending",
    documents: [
      { id: 9, name: "Technical Proposal.pdf", size: "4.2 MB" },
      { id: 10, name: "Financial Proposal.xlsx", size: "920 KB" },
      { id: 11, name: "Previous Projects.pdf", size: "12.5 MB" },
    ],
  },
];

export default function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter applications based on status and search query
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch = 
      app.tenderTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "under_review":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            <FileText className="h-3 w-3 mr-1" />
            Under Review
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  return (
    <div className="container py-8 px-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Applications</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tender</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.tenderTitle}
                    </TableCell>
                    <TableCell>{application.reference}</TableCell>
                    <TableCell>
                      {new Date(application.submittedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(application.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(application)}
                          className="bg-white"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-white"
                        >
                          <Link href={`/vendor/tenders/${application.tenderId}`}>
                            <FileText className="h-4 w-4 mr-1" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No applications found</h3>
              <p className="text-muted-foreground mb-4">
                {statusFilter !== "all"
                  ? `You don't have any ${statusFilter.replace("_", " ")} applications.`
                  : "No applications match your search criteria."}
              </p>
              <Button asChild>
                <Link href="/vendor/tenders">Browse Tenders</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {selectedApplication?.reference} - Submitted on{" "}
              {selectedApplication?.submittedDate
                ? new Date(selectedApplication.submittedDate).toLocaleDateString()
                : ""}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Tender</h3>
                <p>{selectedApplication.tenderTitle}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <div>{getStatusBadge(selectedApplication.status)}</div>
              </div>
              
              {selectedApplication.feedback && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Feedback</h3>
                  <div className={`p-3 rounded-md ${
                    selectedApplication.status === 'approved' 
                      ? 'bg-green-50 text-green-700' 
                      : selectedApplication.status === 'rejected'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-muted'
                  }`}>
                    {selectedApplication.status === 'approved' && (
                      <CheckCircle2 className="h-4 w-4 inline-block mr-2" />
                    )}
                    {selectedApplication.status === 'rejected' && (
                      <AlertCircle className="h-4 w-4 inline-block mr-2" />
                    )}
                    {selectedApplication.feedback}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium mb-2">Submitted Documents</h3>
                <div className="space-y-2">
                  {selectedApplication.documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 