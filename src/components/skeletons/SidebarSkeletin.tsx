import { SidebarMenuItem } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

export function SidebarSkeletonItem() {
  return (
    <SidebarMenuItem>
      <Skeleton className="h-6 w-5/6 mx-1 my-1 rounded-sm" />
    </SidebarMenuItem>
  );
}
