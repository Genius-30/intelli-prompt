import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return <Loader2 className={cn("text-muted-foreground h-5 w-5 animate-spin", className)} />;
}
