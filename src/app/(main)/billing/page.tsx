import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing | IntelliPrompt",
  description: "Manage your subscription, billing details, and payment history.",
  openGraph: {
    title: "Billing | IntelliPrompt",
    description: "Manage your subscription, billing details, and payment history.",
  },
  twitter: {
    card: "summary",
    title: "Billing | IntelliPrompt",
    description: "View and manage your billing information securely.",
  },
};

export default function BillingPage() {
  return <div>Billing Page</div>;
}
