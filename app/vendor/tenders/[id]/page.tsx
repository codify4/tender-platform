import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import TenderDetails from "./TenderDetails";

// Define types
type TenderDocument = {
  id: number;
  name: string;
  size: string;
};

type Tender = {
  id: number;
  title: string;
  description: string;
  reference: string;
  deadline: string;
  published_at: string;
  status: string;
  type: string;
  ceiling_fund: number;
  documents: TenderDocument[];
};

// Mock tender data function
const getTenderById = (id: string): Tender => {
  return {
    id: parseInt(id),
    title: "IT Infrastructure Development Project",
    description: "Development of IT infrastructure for AADF offices including server setup, network configuration, and security implementation.",
    reference: `AADF-2023-${id}`,
    deadline: "2023-12-31",
    published_at: "2023-10-01",
    status: "active",
    type: "service",
    ceiling_fund: 50000,
    documents: [
      { id: 1, name: "Technical Specifications.pdf", size: "1.2 MB" },
      { id: 2, name: "Budget Template.xlsx", size: "542 KB" },
      { id: 3, name: "Contract Terms.docx", size: "825 KB" },
    ],
  };
};

export default async function TenderDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // We can now await params directly since this is a server component
  const tenderId = params.id;
  const tender = getTenderById(tenderId);
  
  return (
    <Suspense fallback={
      <div className="container py-8 px-10 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading tender details...</p>
        </div>
      </div>
    }>
      <TenderDetails tender={tender} />
    </Suspense>
  );
} 