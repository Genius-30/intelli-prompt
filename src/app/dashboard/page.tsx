import DashboardPage from "../../components/pages/dashboard/DashboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | IntelliStack",
  description:
    "Access your personalized dashboard, manage prompts, and track performance on IntelliStack.",
  openGraph: {
    title: "Dashboard | IntelliStack",
    description:
      "Access your personalized dashboard, manage prompts, and track performance on IntelliStack.",
    url: "https://yourdomain.com/dashboard", // Replace with your actual domain
    siteName: "IntelliStack",
    images: [
      {
        url: "https://yourdomain.com/og-image.png", // Optional
        width: 1200,
        height: 630,
        alt: "IntelliStack Dashboard",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard | IntelliStack",
    description: "Your control center for managing AI prompts on IntelliStack.",
    images: ["https://yourdomain.com/og-image.png"],
  },
};

export default function page() {
  return <DashboardPage />;
}
