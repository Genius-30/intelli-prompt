import { Metadata } from "next";
import PricingPage from "../../components/pages/public/PricingPage";

export const metadata: Metadata = {
  title: "Pricing | IntelliPrompt",
  description:
    "Choose the right IntelliPrompt plan for your workflow. Compare features and get started for free.",
  openGraph: {
    title: "Pricing | IntelliPrompt",
    description:
      "Flexible pricing plans tailored for prompt engineers, creators, and teams.",
    url: "https://intelliprompt.app/pricing",
    siteName: "IntelliPrompt",
    images: [
      {
        url: "https://intelliprompt.app/og-pricing.png", // optional, but good if visually clean
        width: 1200,
        height: 630,
        alt: "Compare IntelliPrompt Plans",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | IntelliPrompt",
    description:
      "Flexible plans that grow with you. Try IntelliPrompt for free.",
    images: ["https://intelliprompt.app/og-pricing.png"],
  },
};

export default function Pricing() {
  return <PricingPage />;
}
