"use client";

import { Check, Zap, Sparkle, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Stars from "@/components/stars";

const plans = [
  {
    title: "Free",
    icon: <Sparkle className="w-6 h-6 text-primary" />,
    price: "₹0 /mo",
    features: [
      "3 Enhances/day",
      "5 Prompt tests/day",
      "Access to 2 AI models",
      "Up to 10 saved prompts",
      "2 prompt folders",
      "limited prompt history",
      "Community support",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    title: "Pro",
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    price: "₹999 /mo",
    features: [
      "Unlimited prompt tests",
      "Unlimited enhances",
      "Access to all AI models (GPT, Claude, Gemini, etc.)",
      "Up to 1,000 saved prompts",
      "Unlimited folders",
      "Prompt enhancer with tone/style control",
      "Prompt history access",
      "Priority support",
    ],
    cta: "Upgrade Now",
    highlight: true,
  },
  {
    title: "Enterprise",
    icon: <BadgeCheck className="w-6 h-6 text-green-600" />,
    price: "₹9,999 /yr",
    features: [
      "Everything in Pro",
      "2 months free (₹2,000 off)",
      "Early access to new features",
      "Extended usage limits",
      "Annual billing convenience",
    ],
    cta: "Go Yearly",
    highlight: false,
  },
];

export default function PlansPage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Stars/>
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-14 h-dvh ">
        <h2 className="text-4xl font-bold text-center text-white mb-2">Choose Your Plan</h2>
        <p className="text-gray-400 text-center mb-10">
          Start for free, go monthly, or save with a yearly plan.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={cn(
                `${plan.title=='Pro'?'bg-gradient-to-r from-blue-600/10 via-black/60 to-blue-500/10 border-primary scale-105':'bg-gradient-to-r from-white/5 via-black/90 to-white/5'} border shadow-md backdrop-blur-xl  transition hover:shadow-xl`
              )}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2 scale-125">{plan.icon}</div>
                <CardTitle className="text-2xl text-white font-bold">{plan.title}</CardTitle>
                <p className="text-xl text-blue-400 mt-2">{plan.price}</p>
              </CardHeader>

              <CardContent className="space-y-4 flex flex-col justify-between h-full">
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-gray-400"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-4"
                  variant={plan.highlight ? "default" : "outline"}
                >
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
