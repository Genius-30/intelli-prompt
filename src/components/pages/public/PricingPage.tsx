"use client";

import { BadgeCheck, Check, Sparkle, Zap } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useCurrentUser } from "@/lib/queries/user";
import { useRouter } from "next/navigation";

const plans = [
  {
    key: "free",
    title: "Free",
    icon: <Sparkle className="text-primary h-6 w-6" />,
    description: "Perfect for casual users & explorers",
    price: "₹0 /mo",
    subNote: "Unlimited usage for 1st month — no limits, all features unlocked!",
    features: [
      "3 Enhances/day",
      "5 Prompt tests/day",
      "Access to 2 AI models",
      "Up to 10 saved prompts",
      "2 prompt folders",
      "Limited prompt history",
      "100K tokens/month included",
      "Community support",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    key: "premium",
    title: "Pro",
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    description: "For prompt engineers & AI power users",
    price: "₹999 /mo (~$12)",
    features: [
      "Everything in Free",
      "Unlimited Enhances & Prompt Tests",
      "Access to all AI models (GPT, Claude, Gemini, etc.)",
      "Up to 1,000 saved prompts",
      "Extended usage limits ~5M tokens/month",
      "Unlimited folders & versions",
      "Priority email support",
      "Full prompt history access",
    ],
    cta: "Upgrade Now",
    highlight: true,
  },
  {
    key: "enterprise",
    title: "Enterprise",
    icon: <BadgeCheck className="h-6 w-6 text-green-600" />,
    description: "Best for professionals, teams & yearly savers",
    price: "₹9,999 /yr (~$120)",
    features: [
      "Everything in Pro",
      "2 months free (₹2,000 off)",
      "Early access to new features",
      "Unlimited Saved Prompts",
      "Extended usage limits ~25M tokens/month",
      "Annual billing convenience",
      "Onboarding support (coming soon)",
    ],
    cta: "Go Yearly",
    highlight: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { data: user, isLoading: isUserLoading } = useCurrentUser({
    enabled: isSignedIn && isLoaded,
  });

  return (
    <div className="">
      <div className="flex-1">
        <h2 className="text-foreground mb-2 text-center text-4xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground mb-10 text-center">
          Start for free, go monthly, or save with a yearly plan.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => {
            const isCurrentPlan = user?.plan.toLowerCase() === plan.key;

            return (
              <Card
                key={index}
                className={cn(
                  `transition-all duration-300`,
                  plan.title === "Pro"
                    ? "border-primary scale-105 hover:scale-[103%]"
                    : "hover:scale-[98%]",
                  isCurrentPlan && "ring-1 ring-green-500",
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
                    <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                      {plan.cta}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
