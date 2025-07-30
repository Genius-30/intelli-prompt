import PublicFooter from "../public/PublicFooter";
import PublicNavbar from "@/components/public/PublicNavbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicNavbar />
      <main className="p-4 md:p-8 mt-18 overflow-hidden">{children}</main>
      <PublicFooter />
    </>
  );
}
