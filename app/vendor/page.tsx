import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileBox, Info } from "lucide-react";
import Link from "next/link";

export default function VendorPage() {
  return (
    <div className="container py-8 px-10">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Open Tenders
            </CardTitle>
            <CardDescription>
              Active tender opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              My Applications
            </CardTitle>
            <CardDescription>
              Submitted applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Deadlines
            </CardTitle>
            <CardDescription>
              Applications due soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Recent Tenders</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium mb-2">IT Infrastructure Development Project</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Info className="h-4 w-4 mr-2" />
                    <span>Reference: AADF-2023-{i}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Deadline: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/vendor/tenders/${i}`}>
                      <FileBox className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline">
          <Link href="/vendor/tenders">
            View All Tenders
          </Link>
        </Button>
      </div>
    </div>
  );
}