import { CalendarClock, CreditCard, Receipt, ShieldCheck, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

import { Skeleton } from "../ui/skeleton";

export default function BillingPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Current Plan Skeleton */}
      <Card className="border-primary/15 from-background to-primary/[0.02] overflow-hidden border bg-gradient-to-br shadow-lg">
        <CardHeader className="border-primary/10 from-primary/5 border-b bg-gradient-to-r to-transparent py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/15 border-primary/20 rounded-xl border p-2.5">
                <CreditCard className="text-primary h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-semibold">Current Plan</CardTitle>
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <CardDescription className="mt-1">Your subscription and token usage</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-2 w-full rounded" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-9 w-36 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarClock className="text-muted-foreground h-4 w-4" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="text-muted-foreground h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-muted-foreground h-4 w-4" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Skeleton */}
      <Card className="border-primary/15 from-background to-primary/[0.01] overflow-hidden border bg-gradient-to-br shadow-lg">
        <CardHeader className="border-primary/10 from-primary/5 border-b bg-gradient-to-r to-transparent py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/15 border-primary/20 rounded-xl border p-2.5">
              <Receipt className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold">Billing History</CardTitle>
          </div>
          <CardDescription className="mt-1">
            Your previous invoices and subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border-primary/10 grid grid-cols-2 items-center gap-4 rounded-lg border p-4 md:grid-cols-5"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
