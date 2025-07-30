import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Layers, ArrowRight, Code2, Brain, History, FolderOpen, Play } from "lucide-react"
import up from '../../public/hero/up.png'
import down from '../../public/hero/down.png'
import favicon from '../../public/favicon.ico'
import Stars from './stars'
import Image from "next/image"

const steps = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Write or Import Prompt",
      description: "Start with your raw prompt or import from your existing library",
      color: "from-cyan-400 to-blue-700",
      border: "border-blue-600/30",
      glow: "shadow-blue-500/10",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Enhance using AI",
      description: "Our AI engine optimizes your prompt for clarity and effectiveness",
      color: "from-purple-500 to-pink-500",
      border: "border-pink-600/30",
      glow: "shadow-pink-500/10",
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Test on Multiple Models",
      description: "Compare outputs across GPT-4, Claude, Gemini, and more",
      color: "from-green-600 to-cyan-600",
      border: "border-green-600/30",
      glow: "shadow-green-500/10",
    },
  ]
const features = [
    {
      icon: <Brain className="w-10 h-10" />,
      title: "Prompt Enhancer Engine",
      description: "Transform basic prompts into optimized, detailed instructions using advanced AI analysis.",
      gradient: "from-purple-500/10 to-blue-500/10",
      border: "border-purple-500/30",
      glow: "shadow-purple-500/10",
    },
    {
      icon: <Layers className="w-10 h-10" />,
      title: "Multi-Model Testing",
      description: "Compare responses across multiple AI models side-by-side to find the perfect match.",
      gradient: "from-cyan-500/10 to-green-500/10",
      border: "border-green-500/30",
      glow: "shadow-green-500/10",
    },
    {
      icon: <History className="w-10 h-10" />,
      title: "Version Control & Archiving",
      description: "Track prompt iterations, save successful variations, and build your prompt library.",
      gradient: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/30",
      glow: "shadow-blue-500/10",
    },
    {
      icon: <FolderOpen className="w-10 h-10" />,
      title: "Workspace Organization",
      description: "Organize prompts by projects, tags, and categories for efficient workflow management.",
      gradient: "from-red-300/10 to-pink-500/10",
      border: "border-red-500/30",
      glow: "shadow-red-500/10",
    },
  ]

export default function Hero() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white overflow-hidden relative">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-0 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      <Stars/>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000`}>
            <div className="mb-2 mt-12 sm:mt-0">
              <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-cyan-500/30 mb-4 p-1 px-2">
                ⭐ AI-Powered Prompt Engineering
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
                Enhance Prompts.
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                Compare Outputs.
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-500 to-red-600 bg-clip-text text-transparent">
                Unlock Precision.
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              A powerful prompt engineering workspace to enhance, version, and test prompts across leading AI models.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Enhance Prompt
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 px-8 py-4 text-lg font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <Play className="w-5 h-5 mr-2" />
                Test Across Models
              </Button>
            </div>
          </div>

          {/* Floating Dashboard UI */}
          <div className={`relative transition-all duration-1000 delay-300`}>
            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-500/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Prompt Workspace</h3>
                  <div className="hidden md:flex space-x-2 mr-12">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">Original Prompt</div>
                    <div className="text-red-300 font-mono text-sm">"Write a blog post about AI"</div>
                  </div>

                  <div className="bg-black/20 rounded-xl p-4 border border-green-500/30">
                    <div className="text-sm text-gray-400 mb-2">Enhanced Prompt</div>
                    <div className="text-green-300 font-mono text-sm">
                      "Create a comprehensive, engaging blog post about artificial intelligence..."
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Model Cards */}
              <div className="absolute -top-12 -right-2 sm:-right-6 md:-right-16 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4 ">
                <div className="text-sm font-semibold mb-2">Active Models</div>
                <div className="space-y-2">
                  {['GPT-4','Claude'].map((item) => (
                    <div key={item} className="flex items-center text-gray-200 space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-16 sm:-bottom-14 -right-2 sm:-right-6 md:-right-16 backdrop-blur-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-4">
                <div className="text-sm font-semibold mb-2">Performance</div>
                <div className="text-xs text-gray-200 space-y-2">
                  
                  <div className="flex"><Image src={up} alt="up" className="w-3 mx-[2px]" /> Quality: 94%</div>
                  <div className="flex"><Image src={down} alt="down" className="w-4" /> Response: 1.2s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 mt-12 sm:mt-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">Transform your prompts in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className={`relative transition-all duration-500`}>
                <Card className={`backdrop-blur-xl hover:scale-105 bg-gradient-to-br from-white/10 to-white/5 border-2 transition-all duration-500 ${step.border} hover:shadow-2xl ${step.glow}`}>
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}>
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-cyan-500 to-purple-500 transform -translate-y-1/2">
                    <div className="absolute right-0 top-1/2 w-2 h-2 bg-purple-500 rounded-full transform translate-x-1 -translate-y-1/2"></div>
                  </div>
                )}
                {index < steps.length - 1 && (
                  <div className="md:hidden block absolute -bottom-12 right-1/2  w-px h-8 bg-gradient-to-r from-cyan-500 to-purple-500 transform -translate-y-1/2">
                    <div className="absolute right-0 -bottom-1 w-2 h-2 bg-purple-500 rounded-full transform translate-x-1 -translate-y-1/2"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Playground Preview */}
      <section id="playground" className="sm:py-20 pt-0 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r leading-relaxed from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Live Playground
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See your prompts transform in real-time and compare outputs across models
            </p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-3xl p-4 sm:p-8 shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Panel - Prompt Comparison */}
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Code2 className="w-6 h-6 mr-2 text-cyan-400" />
                  Prompt Enhancement
                </h3>

                <div className="space-y-4">
                  <div className="bg-red-400/10 border border-red-500/20 rounded-xl p-2 sm:p-4">
                    <div className="text-sm text-red-400 mb-2 font-semibold">- Original</div>
                    <div className="font-mono text-sm text-gray-300">
                      Write a marketing email for our new product launch
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-2 sm:p-4">
                    <div className="text-sm text-green-400 mb-2 font-semibold">+ Enhanced</div>
                    <div className="font-mono text-sm text-gray-300">
                      Create a compelling marketing email for our new product launch that includes: a catchy subject
                      line, personalized greeting, clear value proposition highlighting 3 key benefits, social proof or
                      testimonials, strong call-to-action, and professional closing. Target audience: existing customers
                      aged 25-45. Tone: enthusiastic but professional. Length: 150-200 words.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Model Selection & Output */}
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Layers className="w-6 h-6 mr-2 text-purple-400" />
                  Model Comparison
                </h3>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-2 sm:p-4 min-h-[200px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-400">Output Preview</div>
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed">
                    🚀 **Subject: Introducing Our Game-Changing Innovation!**
                    <br />
                    <br />
                    Hi [Name],
                    <br />
                      We're thrilled to announce the launch of our revolutionary new product that will transform how you work and elevate your productivity to the next level. <br />
                      This innovation isn’t just a tool—it’s a complete shift in how you approach daily tasks. With its intuitive interface, powerful features, and seamless integration into your workflow, you’ll be empowered to achieve more in less time...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">Everything you need to master prompt engineering</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`backdrop-blur-xl bg-gradient-to-br ${feature.gradient} border-2 ${feature.border} hover:scale-105 transition-all duration-300 hover:shadow-2xl ${feature.glow} group`}>
                <CardContent className="p-8 text-center">
                  <div className="text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-xl bg-gradient-to-br from-gray-600/10 to-gray-100/5 border border-white/20 rounded-3xl p-8 px-4 sm:p-12 shadow-2xl shadow-purple-500/10 relative overflow-hidden">
            {/* Glowing backdrop */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>

            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-relaxed bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Your AI Workflow, Upgraded.
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of developers and AI enthusiasts who are transforming their prompt engineering workflow.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-900 via-purple-900 to-pink-900 hover:from-cyan-900 hover:via-purple-900 hover:to-pink-900 text-white px-12 py-4 text-xl font-semibold rounded-2xl shadow-2xl shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40"
              >
                Start Managing Prompts
                <ArrowRight className="hidden sm:block w-6 h-6 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image className="w-8 mr-2" src={favicon} alt="logo" />
              <span className="text-xl font-bold">IntelliPrompt</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 IntelliPrompt. Crafted for the future of AI engineering.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
