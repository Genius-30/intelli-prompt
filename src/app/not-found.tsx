import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="mt-4 inline-block text-primary underline">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
