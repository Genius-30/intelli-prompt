'use client';

import React, { useEffect, useRef } from 'react';
import anthropic from '../../../public/models/anthropic.png';
import deepseek from '../../../public/models/deepseek.png';
import google from '../../../public/models/google.png';
import meta from '../../../public/models/meta.png';
import mistral from '../../../public/models/mistral.png';
import openai from '../../../public/models/openai.png';
import Image from 'next/image';

const models = [
  { src: anthropic, alt: 'Anthropic', size: 'h-6 sm:h-10' },
  { src: deepseek, alt: 'DeepSeek', size: 'h-10 sm:h-12' },
  { src: google, alt: 'Google', size: 'h-8 sm:h-12' },
  { src: meta, alt: 'Meta', size: 'h-14 sm:h-20' },
  { src: mistral, alt: 'Mistral', size: 'h-10 sm:h-12' },
  { src: openai, alt: 'OpenAI', size: 'h-14 sm:h-20' },
];

function Marquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (el) {
      const clone = el.innerHTML;
      el.innerHTML += clone;
    }
  }, []);

  return (
    <section className="relative max-sm:-mt-30 overflow-hidden bg-transparent md:py-10 max-sm:mb-20 mb-10">
      {/* Overlay gradient for fade effect */}
      <div className="absolute inset-y-0 left-0 w-24 sm:w-40 md:w-64 bg-gradient-to-r from-[#0a0014] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-40 md:w-64 bg-gradient-to-l from-[#0a0014] to-transparent z-10" />

      {/* Marquee */}
      <div className="flex overflow-hidden">
        <div
          ref={marqueeRef}
          className="flex animate-marquee gap-12 sm:gap-24 items-center px-6 sm:px-8"
        >
          {models.map((item, idx) => (
            <Image
              key={idx}
              width={150}
              height={150}
              src={item.src}
              alt={item.alt}
              className={` w-auto ${item.size}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Marquee;
