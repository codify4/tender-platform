import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  FileBox,
  Filter,
  Info,
  Search,
} from "lucide-react";
import Link from "next/link";

const tenders = [
  {
    id: 1,
    title: "IT Infrastructure Development Project",
    description: "Development of IT infrastructure for AADF offices",
    reference: "AADF-2023-1",
    deadline: "2023-12-31",
    status: "active",
    type: "service",
    ceiling_fund: 50000,
  },
  {
    id: 2,
    title: "Marketing Services for Annual Report",
    description: "Design and production of annual report",
    reference: "AADF-2023-2",
    deadline: "2023-11-15",
    status: "active",
    type: "service",
    ceiling_fund: 15000,
  },
  {
    id: 3,
    title: "Office Equipment Supply",
    description: "Supply of computers and office equipment",
    reference: "AADF-2023-3",
    deadline: "2023-12-10",
    status: "active",
    type: "supply",
    ceiling_fund: 30000,
  },
  {
    id: 4,
    title: "Website Development Project",
    description: "Development of new organizational website",
    reference: "AADF-2023-4",
    deadline: "2023-11-30",
    status: "active",
    type: "service",
    ceiling_fund: 25000,
  },
  {
    id: 5,
    title: "Educational Materials Procurement",
    description: "Supply of educational materials for schools",
    reference: "AADF-2023-5",
    deadline: "2023-12-20",
    status: "active",
    type: "supply",
    ceiling_fund: 40000,
  },
];

export default function TendersPage() {
  return (
    <div className="container py-8 px-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Available Tenders</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tenders..."
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tender Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="supply">Supply</SelectItem>
              <SelectItem value="works">Works</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="active">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {tenders.map((tender) => (
          <Card key={tender.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-2">{tender.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {tender.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-sm">
                      <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Reference: {tender.reference}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Deadline: {new Date(tender.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 capitalize">
                        {tender.status}
                      </span>
                      <span className="ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600 capitalize">
                        {tender.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:min-w-36">
                  <div className="text-center p-2 bg-muted/50 rounded-md">
                    <div className="text-xs text-muted-foreground">Budget Ceiling</div>
                    <div className="font-semibold">${tender.ceiling_fund.toLocaleString()}</div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/vendor/tenders/${tender.id}`}>
                      <FileBox className="h-4 w-4 mr-2" />
                      View Tender
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 