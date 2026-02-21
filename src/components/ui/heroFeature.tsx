import {
  ArrowRight,
  History,
  Sparkles,
  PenLine,
  FlaskConical,
  ChartPie,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import creation from '../../../public/hero/creation.png'
import explore from '../../../public/hero/explore.png'
import model from '../../../public/hero/model.png'
import test from '../../../public/hero/test.png'
import version from '../../../public/hero/version.png'

function HeroFeature() {
  return (
    <section id="features" className="max-sm:mb-16">
      <div className="text-center mx-auto max-sm:mb-6 mb-20">
        <h1 className="text-3xl sm:text-5xl max-w-5xl mx-auto font-bold mb-2 md:mb-4 leading-tight">
          <span className="max-sm:hidden bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
            Powerful Features Transform <br /> Your Prompt Workflow
          </span>
          <span className="max-sm:inline-block bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
            Powerful Features
          </span>
        </h1>

        <p className="max-sm:hidden text-lg text-purple-200 mb-8 leading-relaxed max-w-3xl mx-auto">
          From raw ideas to refined, tested, and shared prompt. All the tools to engineer, collaborate, and discover with precision.
        </p>
        <p className="max-sm:inline-block text-lg text-purple-200 mb-8 leading-relaxed max-w-3xl mx-auto">
          From raw ideas to refined, tested, and shared prompt. 
        </p>
      </div>

      <div className="flex flex-col max-sm:gap-10 gap-20 max-w-6xl mx-auto px-4 sm:px-0">
        {/* Smart Creation Section */}
        <div className="flex flex-col sm:flex-row items-center sm:gap-10">
          <div className="text-center sm:text-left">
            <Badge className="bg-purple-300/10 text-purple-300 font-normal max-sm:text-xs text-sm rounded-3xl mb-2 py-1 sm:pb-1.5 px-4">
              <PenLine className="mr-1" />
              Smart Creation
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-bold max-sm:mb-2 mb-4 leading-tight">
              <span className="bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
                Create & <span className="bg-gradient-to-b from-purple-200 to-purple-700 bg-clip-text text-transparent">Enhance</span> Prompts <span className="max-sm:hidden">Easily</span>
              </span>
            </h1>
            <p className="max-sm:text-[16px] text-lg text-purple-200 mb-8 leading-relaxed max-w-3xl mx-auto sm:mx-0">
              Start with a raw idea and transform it into a polished, high-performing prompt with guided enhancements and intelligent suggestions.
            </p>
          </div>
          <Image 
            alt="Creation" 
            src={creation} 
            className="w-full max-w-[500px] h-auto border-purple-600 border-1 object-center object-cover rounded-lg shadow-[0_0_40px_2px_rgba(169,85,247,0.3)]" 
            width={500} 
            height={500} 
          />
        </div>

        {/* Cross-Model Testing Section */}
        <div className="flex flex-col sm:flex-row max-sm:flex-col-reverse items-center sm:gap-10">
          <Image 
            alt="Model" 
            src={model} 
            className="w-full max-w-[500px] h-auto border-purple-600 border-1 object-center object-cover rounded-lg shadow-[0_0_40px_2px_rgba(169,85,247,0.3)]" 
            width={500} 
            height={500} 
          />
          <div className="text-center sm:text-left">
            <Badge className="bg-purple-300/10 text-purple-300 font-normal max-sm:text-xs text-sm rounded-3xl mb-2 py-1 sm:pb-1.5 px-4">
              <FlaskConical className="mr-1" />
              Cross-Model Testing
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
                <span className="bg-gradient-to-b from-purple-200 to-purple-700 bg-clip-text text-transparent">Test</span> Across Multiple LLMs
              </span>
            </h1>
            <p className="max-sm:text-[16px] text-lg text-purple-200 mb-8 leading-relaxed max-w-3xl mx-auto sm:mx-0">
              Run prompts against leading providers and models in one place, ensuring consistent performance and reliable outputs everywhere.
            </p>
          </div>
        </div>

        {/* Side-by-Side Comparison Section */}
        <div className="flex flex-col sm:flex-row items-center sm:gap-10">
          <div className="text-center sm:text-left">
            <Badge className="bg-purple-300/10 text-purple-300 font-normal max-sm:text-xs text-sm rounded-3xl mb-2 py-1 sm:pb-1.5 px-4">
              <ChartPie className="mr-1" />
              Side-by-Side Comparison
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
                Compare <span className="bg-gradient-to-b from-purple-200 to-purple-700 bg-clip-text text-transparent">Outputs</span> with Precision
              </span>
            </h1>
            <p className="max-sm:text-[16px] text-lg text-purple-200 mb-8 leading-relaxed max-w-3xl mx-auto sm:mx-0">
              Instantly evaluate results across models and versions with side-by-side comparison, making it easy to spot improvements and gaps.
            </p>
          </div>
          <Image 
            alt="Test" 
            src={test} 
            className="w-full max-w-[500px] h-auto border-purple-600 border-1 object-center object-cover rounded-lg shadow-[0_0_40px_2px_rgba(169,85,247,0.3)]" 
            width={500} 
            height={500} 
          />
        </div>

        {/* Version Control Section */}
        <div className="flex flex-col sm:flex-row max-sm:flex-col-reverse items-center sm:gap-10">
          <Image 
            alt="Version" 
            src={version} 
            className="w-full max-w-[500px] h-auto border-purple-600 border-1 object-center object-cover rounded-lg shadow-[0_0_40px_2px_rgba(169,85,247,0.3)]" 
            width={500} 
            height={500} 
          />
          <div className="text-center sm:text-left">
            <Badge className="bg-purple-300/10 items-center text-purple-300 font-normal max-sm:text-xs text-sm rounded-3xl mb-2 py-1 sm:pb-1.5 px-4">
              <History className="mr-1" />
              Version Control
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
                Keep Every <span className="bg-gradient-to-b from-purple-200 to-purple-700 bg-clip-text text-transparent">Iteration</span> Organized
              </span>
            </h1>
            <p className="max-sm:text-[16px] text-lg text-purple-200 mb-8 leading-relaxed max-w-3xl mx-auto sm:mx-0">
              Track, save, and revert prompt versions seamlessly, so you never lose progress and can refine with confidence.
            </p>
          </div>
        </div>

        {/* Elite Community Section */}
        <div className="flex flex-col sm:flex-row items-center sm:gap-10">
          <div className="text-center sm:text-left">
            <Badge className="bg-purple-300/10 text-purple-300 font-normal max-sm:text-xs text-sm rounded-3xl mb-2 py-1 sm:pb-1.5 px-4">
              <Users className="mr-1" />
              Elite Community
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
                <span className="bg-gradient-to-b from-purple-200 to-purple-700 bg-clip-text text-transparent">Share & Discover</span> Prompts Together
              </span>
            </h1>
            <p className="max-sm:text-[16px] text-lg text-purple-200 mb-8 leading-relaxed max-w-3xl mx-auto sm:mx-0">
              Publish your best prompts to the community, explore what others are building, follow creators, and engage through likes, comments, and saves.
            </p>
          </div>
          <Image 
            alt="Explore" 
            src={explore} 
            className="w-full max-w-[500px] h-auto border-purple-600 border-1 object-center object-cover rounded-lg shadow-[0_0_40px_2px_rgba(169,85,247,0.3)]" 
            width={500} 
            height={500} 
          />
        </div>
      </div>
    </section>
  );
}

export default HeroFeature;
