import Image from "next/image";
import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#0b0016] px-6 pt-16 pb-2 text-white/80 md:px-20">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between gap-y-8 md:items-center">
        
        {/* Brand and description */}
        <div className="flex flex-col max-w-lg">
          <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-purple-200">
            <Image
              width={40}
              height={40}
              src="/logo.png"
              alt="IntelliPrompt logo"
              className="h-8 w-8 mr-2 max-sm:hidden rounded-md"
            />
            IntelliPrompt
          </h3>
          <p className="text-base leading-relaxed text-purple-200">
            A smart and modern platform built to help developers and teams organize, refine, and test AI prompts — all in one intelligent workspace.
          </p>
        </div>

        {/* Links section */}
        <div className="flex flex-col sm:flex-row justify-start md:justify-center items-start gap-10 md:gap-20">
          <div>
            <h4 className="mb-2 text-base text-purple-400">PAGES</h4>
            <ul className="space-y-1 text-base">
              <li>
                <Link href="#features" className="text-purple-100 hover:text-purple-300">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-purple-100 hover:text-purple-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-purple-100 hover:text-purple-300">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-purple-100 hover:text-purple-300">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 text-base text-purple-400">SOCIALS</h4>
            <ul className="space-y-1 text-base">
              <li>
                <Link href="https://x.com/Intelliprompt_" target="_blank" className="text-purple-100 hover:text-purple-300">
                  X
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/intelliprompt.ai/" target="_blank" className="text-purple-100 hover:text-purple-300">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://discord.gg" target="_blank" className="text-purple-100 hover:text-purple-300">
                  Discord
                </Link>
              </li>
              <li>
                <Link href="https://youtube.com" target="_blank" className="text-purple-100 hover:text-purple-300">
                  YouTube
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mx-auto mt-12 flex flex-col md:flex-row items-center justify-between gap-2 border-t border-white/10 pt-2 text-xs text-white/50 max-w-7xl">
        <p>© {new Date().getFullYear()} IntelliPrompt</p>
        <p>
          Powered by <span className="text-purple-400">Next.js</span> &{" "}
          <span className="text-purple-400">OpenRouter</span>
        </p>
      </div>
    </footer>
  );
}
