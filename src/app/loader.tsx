import { Loader } from "@/components/ui/loader";

export default function LoaderPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader className="h-12 w-12" />
    </div>
  );
}
