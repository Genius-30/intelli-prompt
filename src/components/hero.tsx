import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PreviewTerminal } from "./preview-terminal";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24 md:pt-48 md:pb-32 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      {/* 🔮 Floating Blobs Background */}
      <div
        className={cn(
          "absolute -top-10 -left-10 h-96 w-96 bg-primary/20 rounded-full blur-[120px] opacity-50",
          "dark:bg-primary/30"
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 right-0 h-96 w-96 bg-purple-500/20 rounded-full blur-[100px] opacity-30",
          "dark:bg-purple-600/30"
        )}
      />

      {/* 💬 Hero Content */}
      <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight animate-fade-up">
          Build Smarter AI Systems with{" "}
          <span className="text-primary">IntelliStack</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          The intelligence stack for testing prompts, managing agents, and
          logging AI execution flows — all in one place.
        </p>

        <div className="mt-8">
          <Button size="lg" className="px-6 text-base">
            Get Started
          </Button>
        </div>
      </div>

      {/* 🧠 Realtime Agent Preview */}
      <div className="mt-16 flex justify-center px-4 relative z-10">
        <PreviewTerminal />
      </div>
    </section>
  );
}
