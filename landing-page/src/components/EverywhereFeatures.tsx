"use client";

import { useState } from "react";
import Link from "next/link";

export function EverywhereFeatures() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      num: "01",
      title: "Content creators",
      desc: "Amplify your blog posts, articles, and newsletters by letting your audience share them easily.",
      color: "bg-[#00C853]",
      textColor: "text-black",
    },
    {
      num: "02",
      title: "E-commerce sites",
      desc: "Drive more traffic and sales by making your products shareable to social media platforms.",
      color: "bg-[#FFCC00]",
      textColor: "text-black",
    },
    {
      num: "03",
      title: "Portfolio platforms",
      desc: "Let clients and recruiters easily share your work and projects with their networks.",
      color: "bg-white dark:bg-neutral-900",
      textColor: "text-black dark:text-white",
    },
    {
      num: "04",
      title: "News portals",
      desc: "Enable rapid distribution of breaking news and important stories across any network.",
      color: "bg-[#FFCC00]",
      textColor: "text-black",
    },
    {
      num: "05",
      title: "Web apps",
      desc: "Add shareable achievements, results, or dashboards to your SaaS or web application.",
      color: "bg-[#00C853]",
      textColor: "text-black",
    },
  ];

  // const [paused, setPaused] = useState(false);
  // Duplicate the deck so the track can loop seamlessly.
  const track = [...cards, ...cards];

  return (
    <div className="py-24 bg-background border-t-2 border-black dark:border-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <span className="text-xs font-bold tracking-widest text-[#FFCC00] uppercase mb-4 block">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-balance">
            Wherever content<br />gets <span className="underline decoration-[#FFCC00] decoration-4 underline-offset-8">shared.</span>
          </h2>
        </div>
      </div>

        <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-12 pt-4 snap-x hide-scrollbar">
          {track.map((card, i) => (
            <div 
              key={i} 
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`snap-center shrink-0 w-[280px] sm:w-[300px] md:w-[350px] lg:w-[400px] rounded-[32px] p-6 sm:p-8 md:p-10 relative flex flex-col transition-all duration-700 ease-in-out border-[3px] border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] ${card.color} ${card.textColor} aspect-square
                hover:-translate-y-4 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]
                hover:rotate-[360deg] hover:scale-110
                ${hoveredCard === i ? 'z-10' : 'z-0'}
                animate-float`}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                animation: hoveredCard === i ? 'none' : 'float 3s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-[32px] opacity-0 transition-opacity duration-500 ${hoveredCard === i ? 'opacity-100' : ''}`}
                style={{
                  background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
              
              {/* Shine effect */}
              <div className={`absolute inset-0 rounded-[32px] overflow-hidden opacity-0 transition-opacity duration-500 ${hoveredCard === i ? 'opacity-100' : ''}`}>
                <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent ${hoveredCard === i ? 'animate-shine' : ''}`} />
              </div>
              
              <span className={`text-5xl sm:text-6xl md:text-7xl font-serif opacity-30 absolute top-4 sm:top-6 right-6 sm:right-8 font-bold ${card.textColor} transition-transform duration-300 ${hoveredCard === i ? 'scale-110 rotate-12' : ''}`}>
                {card.num}
              </span>
              
              <div className="mt-auto pt-8 sm:pt-12">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 pr-4 transition-transform duration-300">{card.title}</h3>
                <p className={`text-[12px] sm:text-[14px] md:text-[15px] opacity-90 leading-relaxed font-semibold mb-6 sm:mb-8 transition-transform duration-300`}>
                  {card.desc}
                </p>

                <div>
                  <Link href="/docs" className="inline-block text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 sm:py-3 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-sm hover:opacity-80 transition cursor-pointer hover:scale-105 hover:shadow-lg transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white">
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}