import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import Image from "next/image";
import { Label } from "./ui/label";

export function ModelSelector({
  model,
  onChange,
}: Readonly<{
  model: string;
  onChange: (id: string) => void;
}>) {
  return (
    <div className="mt-2">
      <Label>Model</Label>
      <Menubar className="mt-2 gap-3"></Menubar>
      <p className="text-sm text-muted-foreground mt-1">Selected: {model}</p>
    </div>
  );
}
