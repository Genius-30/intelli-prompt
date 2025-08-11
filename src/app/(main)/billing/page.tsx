import BillingPage from "@/components/pages/dashboard/BillingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
  description: "Manage your subscription, billing details, and payment history.",
  openGraph: {
    title: "Billing",
    description: "Manage your subscription, billing details, and payment history.",
  },
  twitter: {
    card: "summary",
    title: "Billing",
    description: "View and manage your billing information securely.",
  },
};

export default function page() {
  return <BillingPage />;
}
