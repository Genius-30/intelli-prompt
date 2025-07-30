import Logo from "../Logo";

export default function PublicFooter() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Logo />
          </div>
          <div className="text-gray-400 text-center md:text-right">
            <p>
              &copy; {new Date().getFullYear()} IntelliStack. Crafted for the
              future of AI engineering.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
