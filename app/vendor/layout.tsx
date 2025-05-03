import { VendorSidebar } from "@/components/vendor-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function VendorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <VendorSidebar />
      <SidebarInset>
        <div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 