import { BadgeCheck, Check, Sparkle, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
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
      "Onboarding support (coming soon)"
    ],
    cta: "Go Yearly",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <div className="flex-1">
        <h2 className="mb-2 text-center text-4xl font-bold text-white">Choose Your Plan</h2>
        <p className="mb-10 text-center text-gray-400">
          Start for free, go monthly, or save with a yearly plan.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={cn(
                `${
                  plan.title == "Pro" ? "border-primary scale-105" : "border-neutral-800"
                } border shadow-md backdrop-blur-xl transition hover:shadow-xl`,
              )}
            >
              <CardHeader className="text-center">
                <div className="mb-2 flex scale-125 justify-center">{plan.icon}</div>
                <CardTitle className="text-2xl font-bold text-white">{plan.title}</CardTitle>
                <p className="mt-2 text-xl text-blue-400">{plan.price}</p>
              </CardHeader>

              <CardContent className="flex h-full flex-col justify-between space-y-4">
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-400">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="mt-4 w-full" variant={plan.highlight ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
