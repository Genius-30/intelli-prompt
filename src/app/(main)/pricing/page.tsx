import { Metadata } from "next";
import PricingPage from "@/components/pages/public/PricingPage";
import { SITE_URL } from "@/lib/constants/SITE_URL";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the right IntelliPrompt plan for your workflow. Compare features and get started for free.",
  openGraph: {
    title: "Pricing",
    description: "Flexible pricing plans tailored for prompt engineers, creators, and teams.",
    url: `${SITE_URL}/pricing`,
    siteName: "IntelliPrompt",
    images: [
      {
        url: `${SITE_URL}/og-pricing.png`, // optional, but good if visually clean
        width: 1200,
        height: 630,
        alt: "Compare IntelliPrompt Plans",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing",
    description: "Flexible plans that grow with you. Try IntelliPrompt for free.",
    images: [`${SITE_URL}/og-pricing.png`],
  },
};

export default function Pricing() {
  return <PricingPage />;
}
