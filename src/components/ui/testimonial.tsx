"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Emma Johnson",
    role: "Project Manager at Tech Innovators",
    text: "The AI Scheduling Assistant has revolutionized the way I manage my time. Meetings are now seamlessly organized without any effort.",
    img: "/bg.png",
  },
  {
    name: "Michael Smith",
    role: "Sales Executive at Global Enterprises",
    text: "I love how the AI Scheduling Assistant integrates with my calendar. It saves me so much time and prevents double bookings.",
    img: "/bg.png",
  },
  {
    name: "David Miller",
    role: "Operations Manager at Efficiency Co.",
    text: "The AI Scheduling Assistant is an efficient tool that has streamlined our workflows and reduced errors.",
    img: "/bg.png",
  },
  {
    name: "William Smith",
    role: "CEO at Business Solutions Group",
    text: "As a CEO, time is my most valuable resource. This tool helps me optimize my schedule and focus on what matters most.",
    img: "/bg.png",
  },
  {
    name: "Jane Doe",
    role: "Marketing Director at Creative Solutions",
    text: "The AI Scheduling Assistant revolutionized my workflow. It's like having a personal assistant who works around the clock!",
    img: "/bg.png",
  },
  {
    name: "Sophia Lee",
    role: "HR Director at People First",
    text: "This app has made scheduling interviews a breeze. A total game changer for our HR department.",
    img: "/bg.png",
  },
];

export default function TestimonialMarquee() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Duplicate cards for seamless loop
    [row1Ref, row2Ref].forEach((ref) => {
      if (ref.current) {
        ref.current.innerHTML += ref.current.innerHTML;
      }
    });
  }, []);

  return (
<section className="relative bg-[#0b0016] py-10 pb-20 overflow-hidden">
  {/* Gradient Overlays */}
  <div className="absolute inset-y-0 left-0 w-32 sm:w-48 md:w-64 bg-gradient-to-r from-[#0b0016] to-transparent z-10" />
  <div className="absolute inset-y-0 right-0 w-32 sm:w-48 md:w-64 bg-gradient-to-l from-[#0b0016] to-transparent z-10" />

  {/* Top Row */}
  <div className="overflow-hidden mb-10">
    <div
      ref={row1Ref}
      className="flex animate-marquee-left gap-4 sm:gap-6 px-4 sm:px-8"
    >
      {testimonials.slice(0, 3).map((t, i) => (
        <Card key={i} {...t} />
      ))}
    </div>
  </div>

  {/* Bottom Row */}
  <div className="overflow-hidden">
    <div
      ref={row2Ref}
      className="flex animate-marquee-right gap-4 sm:gap-6 px-4 sm:px-8"
    >
      {testimonials.slice(3).map((t, i) => (
        <Card key={i} {...t} />
      ))}
    </div>
  </div>
</section>

  );
}

function Card({ name, role, text, img }: any) {
  return (
    <div className="min-w-[250px] sm:min-w-[300px] md:min-w-[360px] lg:min-w-[400px] max-w-[90vw] bg-gradient-to-t to-purple-950/50 via-transparent from-transparent border border-[#2a0b44] border-t-purple-800 rounded-2xl p-4 sm:p-6 text-white/90 shadow-lg shadow-[#00000040]">
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={img}
          alt={name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-white text-sm sm:text-base">{name}</h4>
          <p className="text-xs sm:text-sm text-white/70">{role}</p>
        </div>
      </div>
      <p className="text-sm sm:text-[15px] leading-relaxed">“{text}”</p>
    </div>
  );
}
