"use client";

import { useEffect, useState } from "react";

const stats = [
  { value: 10, label: "KB GZIPPED", prefix: "<", suffix: " KB" },
  { value: 7, label: "NETWORKS", prefix: "", suffix: "" },
  { value: 0, label: "DEPENDENCIES", prefix: "", suffix: "" },
  { value: 4, label: "FRAMEWORKS", prefix: "", suffix: "" },
];

export function Stats() {
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setAnimatedValues(stats.map(s => s.value));
      return;
    }

    const duration = 2000; // 2 seconds animation
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedValues(
        stats.map(stat => Math.floor(stat.value * easeOutQuart))
      );

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="border-y-2 border-black bg-[#FFCC00] text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-black md:divide-x-2 divide-black">
          {stats.map((stat, i) => (
            <div key={i} className="py-6 sm:py-8 text-center flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-1 transition-all duration-300">
                {stat.prefix}{animatedValues[i]}{stat.suffix}
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-80">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
