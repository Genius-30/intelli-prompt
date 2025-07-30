

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-8">
      {children}
    </main>
  );
}
