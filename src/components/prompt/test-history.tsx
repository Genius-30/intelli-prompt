import { Separator } from "@/components/ui/separator";
import { TestHistoryCard } from "./test-history-card";

type TestRun = {
  model: string;
  modelLabel: string;
  modelLogo: string;
  output: string;
  values: Record<string, string>;
  timestamp: string;
};

export function TestHistory({ history }: { history: TestRun[] }) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg">🧾 Test History</h4>
      </div>
      <Separator />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {history.map((run, idx) => (
          <TestHistoryCard key={idx} run={run} />
        ))}
      </div>
    </div>
  );
}
