import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DotBackgroundDemo } from "@/components/ui/dotBackground";
import Marquee from "@/components/ui/Maquee";
import TestimonialMarquee from "@/components/ui/testimonial";
import HeroFeature from "@/components/ui/heroFeature";
import Image from "next/image";
import PricingSection from "./Pricing";

export default function Hero() {
  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="hero md:mb-72">
        <DotBackgroundDemo className="extra absolute -top-10">
          <div className="sm:mt-96 mx-auto z-10 px-4 sm:px-8">
            <div className="transition-all pb-10 max-w-6xl mx-auto text-center duration-1000">
              <div className="mb-2">
                <Badge className="bg-gradient-to-br from-purple-400/40 to-purple-300/10 text-purple-200 font-normal text-xs sm:text-sm rounded-3xl border-purple-400/50 mb-2 py-1 pb-1.5 px-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Your AI Prompt Studio
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-6xl w-screen mx-auto font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
                  Create Smarter <span className="bg-gradient-to-b from-purple-200 to-purple-700 bg-clip-text text-transparent">Prompts</span> with <br className="hidden md:block"/>AI-Powered Assistance
                </span>
              </h1>

              <p className="text-md sm:text-xl text-purple-200 mb-4 md:mb-8 leading-relaxed max-w-3xl mx-auto">
                A powerful prompt engineering workspace to enhance, version, and test prompts across leading AI models.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-12">
                <Button
                  size="lg"
                  className="mx-auto bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] px-4 py-2 md:px-8 md:py-4 text-md md:text-lg font-semibold rounded-md tracking-wider text-shadow-2xs"
                >
                  Get Started
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="https://cdn.prod.website-files.com/66d5553aa640d66c668df6f1/66d788cd794c9055616809fa_Glow%20Effect.avif"
                alt="glow"
                width={500}
                height={500}
                className="absolute -top-19 md:-top-60 left-0 w-full h-auto animate-pulse -z-99"
              />
              <Image
                src="/image.png"
                alt="Hero Image"
                width={1200}
                height={600}
                className="h-auto w-[90vw] md:w-[80vw] max-w-full border-2 border-red-500 rounded-lg mx-auto"
                priority
              />
            </div>
          </div>
        </DotBackgroundDemo>
      </section>

      <Marquee />

      <HeroFeature />

      <section id="testimonials" className="py-10 mt-5 sm:mt-18">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl max-w-5xl mx-auto font-bold max-sm:mb-2 mb-4 leading-tight">
            <span className="bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
              What Our <br /> Users Are Saying
            </span>
          </h1>

          <p className="max-sm:hidden text-lg text-purple-200 mb-8 leading-relaxed max-w-3xl mx-auto">
            Hear from prompt engineers, creators, and teams using IntelliPrompt to build smarter prompts and achieve better results.
          </p>
          <p className="max-sm:inline-block text-lg text-purple-200 max-sm:mb-4 mb-8 leading-relaxed px-2 max-w-3xl mx-auto">
            Hear from prompt engineers, creators, and teams using IntelliPrompt 
          </p>
        </div>

        <TestimonialMarquee />
      </section>

      <PricingSection />

      <section className="pt-10 max-h-[90vh] mt-10 max-w-7xl mx-auto rounded-3xl bg-gradient-to-b from-purple-950 via-transparent to-transparent relative overflow-hidden">
        <DotBackgroundDemo className="extra absolute -top-32">
          <div className="mx-auto text-center p-8 px-4">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-6xl max-w-5xl mx-auto font-bold mb-4 leading-tight bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
                Ready to Supercharge <span className="max-sm:hidden">Your</span> <br /> Prompt Workflow?
              </h2>
              <p className="text-lg text-purple-200 mb-8 leading-relaxed max-w-3xl mx-auto">
                Join developers and creators using IntelliPrompt to organize, enhance, and test their AI prompts — all in one smart workspace.
              </p>
              <Button
                  size="lg"
                  className="mx-auto bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] px-4 py-2 md:px-8 md:py-4 text-md md:text-lg font-semibold rounded-md tracking-wider text-shadow-2xs"
                >
                  Get Started
                </Button>
            </div>
          </div>
        </DotBackgroundDemo>
      </section>
    </div>
  );
}
