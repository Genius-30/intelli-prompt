import { ReactNode } from "react";
import { FolderSidebar } from "@/components/FolderSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function PromptsLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <FolderSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 bg-background">{children}</main>
      </div>
    </SidebarProvider>
  );
}
