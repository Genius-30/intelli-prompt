"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Sparkle, Zap } from "lucide-react";
import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCurrentUser } from "@/lib/queries/user";
import { useActivatePlan, useCreateOrder } from "@/lib/queries/subscription";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

export default function PricingSection() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { data: user } = useCurrentUser({
    enabled: isSignedIn && isLoaded,
  });

  const createOrder = useCreateOrder();
  const activatePlanMutation = useActivatePlan();

  const [yearly, setYearly] = useState(false);
  const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  // === PAYMENT HANDLER ===
  const handlePayment = (
    planKey: string,
    plan: "Premium" | "Enterprise",
    currency: "INR" | "USD",
  ) => {
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

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
        onError: () => setSelectedPlanKey(null),
      },
    );
  };

   // Pricing logic (auto convert USD↔INR and Monthly↔Yearly)
  const getPrice = (usdMonthly: number) => {
    let monthlyPrice = currency === "INR" ? usdMonthly * 88.74 : usdMonthly;
    let yearlyPrice = monthlyPrice * 12 * 0.85; // 15% off yearly

    const displayPrice = yearly ? yearlyPrice : monthlyPrice;
    const symbol = currency === "INR" ? "₹" : "$";

    return `${symbol}${displayPrice.toFixed(2)}`;
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden bg-[#090014] px-4 py-20">
  <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

  {/* ===== Glow Background ===== */}
  <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-500 via-fuchsia-500 to-indigo-500 opacity-50 blur-[160px] rotate-45" />

  {/* ===== Header ===== */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center max-sm:mb-6 mb-12 z-10"
  >
    <h1 className="text-3xl sm:text-5xl max-w-5xl mx-auto font-bold max-sm:mb-2 mb-4 leading-tight">
      <span className="max-sm:hidden bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
        Flexible Pricing Plans <br /> for Every Need
      </span>
      <span className="max-sm:inline-block bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
        Flexible Pricing Plans
      </span>
    </h1>

    <p className="max-sm:hidden text-lg text-purple-200 max-sm:mb-4 mb-8 leading-relaxed max-w-3xl mx-auto">
      Choose the plan that best fits your requirements and start optimizing your time today!
    </p>
    <p className="max-sm:inline-block text-lg text-purple-200 max-sm:mb-4 mb-8 leading-relaxed max-w-3xl mx-auto">
      Choose the plan that best fits your requirements
    </p>

    {/* ===== Billing Toggle ===== */}
    <div className="flex items-center justify-center gap-4 mb-4">
      <span className={`text-sm ${!yearly ? "text-white" : "text-gray-400"}`}>Monthly</span>
      <button
        onClick={() => setYearly(!yearly)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          yearly ? "bg-purple-700" : "bg-purple-500"
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            yearly ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
      <span className={`text-sm ${yearly ? "text-white" : "text-gray-400"}`}>Annually</span>
    </div>

    {/* ===== Currency Selector ===== */}
    <div className="flex justify-center max-sm:mb-2 mb-8">
      <button
        onClick={() => setCurrency("INR")}
        className={`px-4 py-0.5 rounded-l-full border border-gray-400 transition-colors ${
          currency === "INR" ? "bg-purple-700 text-white" : "bg-transparent text-white"
        }`}
      >
        INR
      </button>
      <button
        onClick={() => setCurrency("USD")}
        className={`px-4 py-0.5 rounded-r-full border border-gray-400 transition-colors ${
          currency === "USD" ? "bg-purple-700 text-white" : "bg-transparent text-white"
        }`}
      >
        USD
      </button>
    </div>
  </motion.div>

  {/* ===== Cards ===== */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl z-10">
    {[
      {
        key: "basic",
        title: "Basic",
        price: "Free",
        icon: <Sparkle className="text-purple-400 h-8 w-8" />,
        description: "Perfect for casual users & explorers",
        subNote: "Unlimited usage for 1st month — no limits, all features unlocked!",
        features: [
          "3 Enhances/day",
          "5 Prompt tests/day",
          "Access to 2 AI models",
          "Up to 10 saved prompts",
          "Limited prompt history",
          "Community support",
        ],
        button: "Get Started",
      },
      {
        key: "premium",
        title: "Pro",
        highlight: true,
        price: "$11.99",
        icon: <Zap className="h-8 w-8 text-yellow-500" />,
        description: "For prompt engineers & AI power users",
        features: [
          "Unlimited Enhances & Prompt Tests",
          "Access to all AI models (GPT, Claude, Gemini, etc.)",
          "Up to 1,000 saved prompts",
          "Priority email support",
          "Full prompt history access",
        ],
        button: "Get Started",
      },
      {
        key: "enterprise",
        title: "Enterprise",
        price: "Custom",
        icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
        description: "Best for teams & large-scale users",
        features: [
          "Everything in Pro",
          "Early access to new features",
          "Extended usage limits ~25M tokens/month",
          "Annual billing convenience",
          "Onboarding support (coming soon)",
        ],
        button: "Contact Sales",
      },
    ].map((plan) => {
      const isCurrentPlan = user?.plan?.toLowerCase() === plan.key;
      const isSelectedPlan = selectedPlanKey === plan.key;

      return (
        <PricingCard
          {...plan}
          key={plan.key}
          highlight={plan.highlight}
          isSignedIn={isSignedIn}
          isCurrentPlan={isCurrentPlan}
          isSelectedPlan={isSelectedPlan}
          handlePayment={handlePayment}
          currency={currency}
          createOrder={createOrder}
          router={router}
        />
      );
    })}
  </div>
</section>

  );
}
function PricingCard({
  title,
  price,
  icon,
  description,
  features,
  button,
  highlight,
  subNote,
  key: planKey,
  isSignedIn,
  isCurrentPlan,
  isSelectedPlan,
  handlePayment,
  currency,
  createOrder,
  router,
}: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`
        relative flex flex-col justify-between h-full p-6 sm:p-8 rounded-2xl border
        transition-all duration-300 overflow-hidden
        ${highlight
          ? "bg-gradient-to-bl from-purple-700/40 to-transparent border-purple-500/20 border-t-purple-500 border-r-purple-500 shadow-[0_0_100px_10px_rgba(168,85,247,0.2)]"
          : "bg-gradient-to-br from-[#1a002d]/50 to-[#120022]/50 border-white/10"
        }
      `}
    >
      {/* Dotted Background */}
      <div
        className={`absolute inset-0 z-0 opacity-80 [background-size:20px_20px] ${
          highlight
            ? "[background-image:radial-gradient(rgba(168,85,247,0.8)_1px,transparent_1px)]"
            : "[background-image:radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)]"
        }`}
      ></div>

      {/* Radial Glow Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,#0a0018_90%)]"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-0">
          <h3 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
            {title}
          </h3>
          <div className="shrink-0">{icon}</div>
        </div>

        {/* Price */}
        <p className="text-3xl sm:text-4xl font-bold mb-2">{price}</p>
        <p className="text-purple-100/80 text-sm mb-4">{description}</p>

        {/* Features List */}
        <ul className="space-y-2 text-sm sm:text-base text-purple-100 mb-6 flex-grow">
          {features.map((f: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-purple-300 mt-1">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Optional Sub Note */}
        {subNote && (
          <p className="text-xs text-purple-300 mb-4 italic">{subNote}</p>
        )}

        {/* CTA Button */}
        <div className="mt-auto">
          {!isSignedIn ? (
            <button
              className="w-full py-3 rounded-full font-semibold border border-purple-500/40 hover:bg-purple-500/10 transition-all"
              onClick={() => router.push("/sign-up")}
            >
              Get Started
            </button>
          ) : isCurrentPlan ? (
            <button
              disabled
              className="w-full py-3 rounded-full font-semibold border border-purple-500/40 bg-transparent text-purple-300 cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : (
            <button
              disabled={createOrder.isPending && !isSelectedPlan}
              onClick={() =>
                handlePayment(
                  planKey,
                  planKey === "premium"
                    ? "Premium"
                    : planKey === "enterprise"
                    ? "Enterprise"
                    : "Premium",
                  currency
                )
              }
              className={`w-full py-3 rounded-full font-semibold border transition-all duration-300 ${
                highlight
                  ? "bg-gradient-to-r from-purple-500 via-purple-700 to-fuchsia-500 hover:opacity-90"
                  : "border-purple-500/40 hover:bg-purple-500/10"
              }`}
            >
              {createOrder.isPending && isSelectedPlan ? (
                <>
                  <Loader /> Processing...
                </>
              ) : (
                button
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
