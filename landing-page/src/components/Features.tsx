"use client";

import Link from "next/link";

import { useState, useRef, useEffect } from "react";

interface FeatureCardProps {
  card: { num: string; title: string; desc: string; color: string; textColor: string };
  index: number;
  rotatedCard: number | null;
  handleCardClick: (index: number) => void;
}

function FeatureCard({ card, index, rotatedCard, handleCardClick }: FeatureCardProps) {
  return (
    <div
      onClick={() => handleCardClick(index)}
      className={`snap-center shrink-0 w-[280px] sm:w-[300px] md:w-[350px] lg:w-[400px] rounded-[32px] p-6 sm:p-8 md:p-10 relative flex flex-col transition-all duration-700 ease-in-out border-[3px] border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] ${card.color} ${card.textColor} aspect-square cursor-pointer
        hover:-translate-y-4 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]
        hover:rotate-3
        ${rotatedCard === index ? 'rotate-[360deg] scale-110 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]' : ''}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <span className={`text-5xl sm:text-6xl md:text-7xl font-serif opacity-30 absolute top-4 sm:top-6 right-6 sm:right-8 font-bold ${card.textColor}`}>
        {card.num}
      </span>

      <div className="mt-auto pt-8 sm:pt-12">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 pr-4">{card.title}</h3>
        <p className={`text-[12px] sm:text-[14px] md:text-[15px] opacity-90 leading-relaxed font-semibold mb-6 sm:mb-8`}>
          {card.desc}
        </p>

        <div>
          <Link href="/docs" className="inline-block text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 sm:py-3 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-sm hover:opacity-80 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white">
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Features() {
  const [rotatedCard, setRotatedCard] = useState<number | null>(null);

  const cards = [{
    num: "01",
    title: "Lightweight & Fast",
    desc: "Under 10KB gzipped. Zero external dependencies. Won't slow down your website's load time or affect Core Web Vitals.",
    color: "bg-[#FFCC00]",
    textColor: "text-black",
  },
  {
    num: "02",
    title: "Fully Customizable",
    desc: "Every button comes with a clean default design, but can be easily themed using CSS variables to match your brand.",
    color: "bg-[#00C853]",
    textColor: "text-black",
  },
  {
    num: "03",
    title: "Framework Agnostic",
    desc: "Use it with Vanilla JS, React, Vue, Angular, or any modern framework. It just works.",
    color: "bg-white dark:bg-neutral-900",
    textColor: "text-black dark:text-white",
  },
  {
    num: "04",
    title: "Privacy Respected",
    desc: "No tracking scripts. No analytics bloat. We don't collect any data about you or your users. Ever.",
    color: "bg-[#00C853]",
    textColor: "text-black",
  },
  ];

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCardClick = (index: number) => {
    setRotatedCard(index);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setRotatedCard(null);
      timeoutRef.current = null;
    }, 1500);
  };

  return (
    <div className="py-24 bg-background border-t-2 border-black dark:border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-16">
          <span className="text-xs font-bold tracking-widest text-[#FFCC00] uppercase mb-4 block">
            Core Features
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-balance">
            Everything you need.<br />Nothing you don&apos;t.
          </h2>
        </div>

        <div className="overflow-hidden pb-12 pt-4 relative group flex">
          <div className="flex gap-4 sm:gap-6 md:gap-8 w-max animate-scroll-left group-hover:[animation-play-state:paused] pr-4 sm:pr-6 md:pr-8">
            {cards.map((card, i) => (
              <FeatureCard key={i} card={card} index={i} rotatedCard={rotatedCard} handleCardClick={handleCardClick} />
            ))}
          </div>
          <div className="flex gap-4 sm:gap-6 md:gap-8 w-max animate-scroll-left group-hover:[animation-play-state:paused] pr-4 sm:pr-6 md:pr-8" aria-hidden="true">
            {cards.map((card, i) => (
              <FeatureCard key={`dup-${i}`} card={card} index={i} rotatedCard={rotatedCard} handleCardClick={handleCardClick} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
