import { AppSidebar } from "@/components/app-sidebar-committee";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 