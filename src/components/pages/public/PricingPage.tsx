"use client";

import React, { useState } from "react";
import { BadgeCheck, Check, Sparkle, Zap } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useCurrentUser } from "@/lib/queries/user";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useActivatePlan, useCreateOrder } from "@/lib/queries/subscription";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { plans } from "@/config/plan";

export default function PricingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { data: user, isLoading: isUserLoading } = useCurrentUser({
    enabled: isSignedIn && isLoaded,
  });

  const createOrder = useCreateOrder();
  const activatePlanMutation = useActivatePlan();

  const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  const handlePayment = (
    planKey: string,
    plan: "Premium" | "Enterprise",
    currency: "INR" | "USD",
  ) => {
    setSelectedPlanKey(planKey);
    createOrder.mutate(
      { plan, currency },
      {
        onSuccess: (data) => {
          if (!data?.order?.id) {
            toast.error("Could not create Razorpay order");
            setSelectedPlanKey(null);
            return;
          }

          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            amount: data.order.amount,
            currency: data.order.currency,
            name: "IntelliPrompt",
            description: `${plan} Subscription`,
            order_id: data.order.id,
            handler: function (response: any) {
              activatePlanMutation.mutate({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
                currency: data.order.currency,
              });
            },
            prefill: {
              name: user?.fullname || "",
              email: user?.email || "",
            },
            theme: { color: "#5959e5" },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        },
        onError: () => {
          setSelectedPlanKey(null);
        },
      },
    );
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => console.log("Razorpay script loaded")}
      />

      <div>
        <h2 className="text-foreground mb-1 text-center text-4xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Start for free, go monthly, or save with a yearly plan.
        </p>

        {/* Currency selector */}
        <div className="mb-8 flex justify-center">
          <div className="relative inline-flex cursor-pointer items-center select-none">
            <span
              className={`rounded-l-full border border-gray-300 px-4 py-1 ${
                currency === "INR"
                  ? "bg-primary text-white"
                  : "text-muted-foreground bg-white hover:bg-gray-100"
              } transition-colors duration-300`}
              onClick={() => setCurrency("INR")}
            >
              INR
            </span>
            <span
              className={`-ml-px rounded-r-full border border-gray-300 px-4 py-1 ${
                currency === "USD"
                  ? "bg-primary text-white"
                  : "text-muted-foreground bg-white hover:bg-gray-100"
              } transition-colors duration-300`}
              onClick={() => setCurrency("USD")}
            >
              USD
            </span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = user?.plan?.toLowerCase() === plan.key;
            const isSelectedPlan = selectedPlanKey === plan.key;

            return (
              <Card
                key={plan.key}
                className={cn(
                  "transition-all duration-300",
                  plan.title === "Pro"
                    ? "border-primary scale-105 hover:scale-[107%]"
                    : "hover:scale-[102%]",
                )}
              >
                <CardHeader className="text-center">
                  <div className="mb-2 flex scale-125 justify-center">{plan.icon}</div>
                  <CardTitle className="text-foreground text-2xl font-bold">{plan.title}</CardTitle>
                  <p className="text-primary mt-2 text-xl font-semibold">{plan.price}</p>
                </CardHeader>

                <CardContent>
                  <ul className="flex flex-col gap-y-2 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-muted-foreground flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-auto">
                  {!isSignedIn ? (
                    <Button className="w-full" onClick={() => router.push("/sign-up")}>
                      Get Started
                    </Button>
                  ) : isCurrentPlan ? (
                    <Button className="w-full" disabled variant="outline">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={plan.highlight ? "default" : "outline"}
                      disabled={createOrder.isPending && !isSelectedPlan}
                      onClick={() =>
                        handlePayment(
                          plan.key,
                          plan.key === "premium"
                            ? "Premium"
                            : plan.key === "enterprise"
                              ? "Enterprise"
                              : "Premium",
                          currency,
                        )
                      }
                    >
                      {createOrder.isPending && isSelectedPlan ? (
                        <>
                          <Loader /> Processing...
                        </>
                      ) : (
                        plan.cta
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
