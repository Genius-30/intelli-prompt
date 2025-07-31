import Logo from "../Logo";

export default function PublicFooter() {
  return (
    <footer className="mx-auto w-full max-w-7xl border-t border-white/5 px-4 py-12 sm:px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center space-x-2 md:mb-0">
            <Logo />
          </div>
          <div className="text-center text-gray-400 md:text-right">
            <p>
              &copy; {new Date().getFullYear()} IntelliStack. Crafted for the future of AI
              engineering.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
