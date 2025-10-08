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
      <main className="mx-auto mt-18 min-h-[calc(100vh-104px)] w-full overflow-hidden md:min-h-[100vh-136px] py-4 md:py-8">
        {children}
      </main>
      <PublicFooter />
    </>
  );
}
