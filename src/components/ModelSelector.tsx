import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { GROUPED_MODELS } from "@/utils/groupModels";
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
      <Menubar className="mt-2 gap-3">
        {Object.entries(GROUPED_MODELS).map(([provider, { logo, models }]) => (
          <MenubarMenu key={provider}>
            <MenubarTrigger className="flex items-center gap-2">
              <Image
                src={logo}
                alt={`${provider} logo`}
                width={20}
                height={20}
                className="rounded-sm"
              />
              <span>{provider}</span>
            </MenubarTrigger>
            <MenubarContent>
              {models.map((m) => (
                <MenubarItem
                  key={m.id}
                  onClick={() => onChange(m.id)}
                  className={model === m.id ? "bg-muted font-semibold" : ""}
                >
                  <span className="text-sm">{m.label}</span>
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
      <p className="text-sm text-muted-foreground mt-1">Selected: {model}</p>
    </div>
  );
}
