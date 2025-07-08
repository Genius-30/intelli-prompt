import Link from "next/link";
import Logo from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* 🔙 Logo or Home Link */}
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Logo /> {/* or <Button variant="ghost">← Back to Home</Button> */}
        </Link>
      </div>

      {children}
    </div>
  );
}
