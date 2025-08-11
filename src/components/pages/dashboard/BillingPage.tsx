"use client";

import { CalendarClock, CreditCard, Receipt, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBillingHistory, useBillingUsage } from "@/lib/queries/subscription";

import { Badge } from "@/components/ui/badge";
import BillingPageSkeleton from "@/components/skeletons/BillingPageSkeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

function formatCurrency(currency?: string, amount?: number | string) {
  if (currency == null || amount == null) return "-";
  try {
    // Normalize amount as number
    const value = typeof amount === "string" ? Number(amount) : amount;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${amount}`;
  }
}

function formatDate(date?: string | number | Date) {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return "-";
  }
}

function daysUntil(date?: string | number | Date) {
  if (!date) return null;
  const end = new Date(date).getTime();
  const now = Date.now();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return isNaN(diff) ? null : diff;
}

export default function BillingPage() {
  const { data: usage, isLoading: usageLoading } = useBillingUsage();
  const { data: history, isLoading: historyLoading } = useBillingHistory();

  const loading = usageLoading || historyLoading;
  if (loading) return <BillingPageSkeleton />;

  const plan = usage?.plan;
  const price = formatCurrency(usage?.currency, usage?.price);
  const tokenUsed = Number(usage?.tokenUsed ?? 0);
  const tokenLimit = Number(usage?.tokenLimit ?? 0);
  const tokenPct = tokenLimit > 0 ? Math.min(100, Math.round((tokenUsed / tokenLimit) * 100)) : 0;
  const expiresFormatted = formatDate(usage?.expiresOn);
  const daysLeft = daysUntil(usage?.expiresOn);

  const hasCurrentPlan = Boolean(plan);
  const hasHistory = Array.isArray(history) && history.length > 0;

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <Card className="border-primary/15 from-background via-primary/[0.02] to-background overflow-hidden border bg-gradient-to-br shadow-lg">
        <CardHeader className="border-primary/10 from-primary/5 to-primary/10 border-b bg-gradient-to-r py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/15 border-primary/20 rounded-xl border p-2.5">
                <CreditCard className="text-primary h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-semibold">Current Plan</CardTitle>
            </div>
            {hasCurrentPlan ? (
              <Badge className="bg-primary/10 text-primary border-primary/20 border">{plan}</Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                No active plan
              </Badge>
            )}
          </div>
          <CardDescription className="mt-1">Your subscription and token usage</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Left: Plan and Usage */}
          <div className="space-y-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Wallet className="text-primary h-4 w-4" />
              <span>
                Price:{" "}
                <span className="text-foreground font-medium">{hasCurrentPlan ? price : "-"}</span>
                {hasCurrentPlan && (
                  <span className="text-muted-foreground ml-2 text-xs">(per month)</span>
                )}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tokens Used</span>
                <span className="font-medium">
                  {tokenUsed.toLocaleString()} / {tokenLimit.toLocaleString()}
                </span>
              </div>
              <Progress value={tokenPct} className="h-2" />
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp className="text-primary h-3.5 w-3.5" />
                  <span className="text-muted-foreground">{tokenPct}% of monthly limit</span>
                </div>
                {hasCurrentPlan && (
                  <span className="text-muted-foreground">
                    Remaining: {Math.max(0, tokenLimit - tokenUsed).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/pricing">
                <Button size="sm" className="gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Dates and Meta */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CalendarClock className="text-primary h-4 w-4" />
              <span className="text-muted-foreground">
                {hasCurrentPlan ? "Expires On: " : "No active plan"}
                {hasCurrentPlan && (
                  <span className="text-foreground ml-1 font-medium">{expiresFormatted}</span>
                )}
              </span>
              {hasCurrentPlan && typeof daysLeft === "number" && (
                <Badge
                  variant="outline"
                  className={
                    daysLeft <= 3 ? "border-red-300 text-red-600" : "text-primary border-primary/30"
                  }
                >
                  {daysLeft <= 0 ? "Expired" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Receipt className="text-primary h-4 w-4" />
              <span className="text-muted-foreground">
                Billing Cycle: <span className="text-foreground font-medium">Monthly</span>
              </span>
            </div>
          </div>
        </CardContent>

        {!hasCurrentPlan && (
          <CardContent className="py-0">
            <div className="border-primary/15 bg-primary/5 text-muted-foreground mt-2 rounded-lg border p-4 text-sm">
              You don&apos;t have an active subscription. Choose a plan to unlock higher limits and
              features.
            </div>
          </CardContent>
        )}
      </Card>

      {/* Billing History */}
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
          {hasHistory ? (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history?.map((item: any, idx: number) => (
                    <TableRow key={idx} className="hover:bg-primary/5">
                      <TableCell className="font-medium">{item.plan}</TableCell>
                      <TableCell>{formatCurrency(item.currency, item.amount)}</TableCell>
                      <TableCell className="font-mono text-xs">{item.paymentId}</TableCell>
                      <TableCell>{formatDate(item.subscriptionStart)}</TableCell>
                      <TableCell>{formatDate(item.subscriptionEnds)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <Receipt className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
              <h3 className="text-lg font-semibold">No billing history yet</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                When you subscribe or renew a plan, your receipts and invoices will appear here.
              </p>
              <Link href="/pricing">
                <Button className="mt-4">View Plans</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
