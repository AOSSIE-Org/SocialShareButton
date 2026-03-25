"use client";
export function ComparisonTable() {
  const comparisonData = [
    { feature: "Bundle size", yours: "< 10KB", addthis: "300KB+", sharethis: "250KB+" },
    { feature: "External requests", yours: "0", addthis: "15+", sharethis: "10+" },
    { feature: "User tracking", yours: "None", addthis: "Heavy", sharethis: "Heavy" },
    { feature: "Cookie banners req", yours: "No", addthis: "Yes", sharethis: "Yes" },
    { feature: "Customizable CSS", yours: "100%", addthis: "Limited", sharethis: "Limited" },
    { feature: "Open Source", yours: "Yes", addthis: "No", sharethis: "No" },
  ];

  return (
    <div className="py-24 bg-[#FFCC00] text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-bold tracking-widest text-sm uppercase mb-4 block opacity-80">
              Why Switch?
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-8">
              No bloat.<br />No paywalls.<br />Just code.
            </h2>
            <p className="max-w-md text-lg font-medium opacity-90">
              Legacy sharing libraries inject megabytes of tracking code into your site, ruining your Core Web Vitals. We don't.
            </p>
          </div>
          
          <div className="bg-[#111] rounded-xl p-2 sm:p-6 text-white border-2 border-transparent shadow-2xl overflow-hidden relative">
            <div className="grid grid-cols-4 gap-4 px-4 py-4 border-b border-neutral-800 text-sm font-bold text-neutral-400 relative z-10">
              <div className="col-span-1">Feature</div>
              <div className="text-center text-black bg-[#FFCC00] rounded px-2 relative font-extrabold shadow-sm">
                AOSSIE Share
              </div>
              <div className="text-center">Legacy 1</div>
              <div className="text-center">Legacy 2</div>
            </div>
            
            <div className="divide-y divide-neutral-800/50 relative z-10">
              {comparisonData.map((row, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 px-4 py-4 items-center text-sm transition-colors rounded-lg group">
                  <div className="col-span-1 font-bold text-neutral-300">{row.feature}</div>
                  <div className="text-center font-bold text-black bg-[#FFCC00] rounded flex justify-center py-1">
                    {row.yours === "None" || row.yours === "No" || row.yours === "Yes" ? (
                      <span className="inline-flex w-16 justify-center">{row.yours}</span>
                    ) : (
                      row.yours
                    )}
                  </div>
                  <div className="text-center text-red-400 font-semibold group-hover:text-red-300">{row.addthis}</div>
                  <div className="text-center text-red-400 font-semibold group-hover:text-red-300">{row.sharethis}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
