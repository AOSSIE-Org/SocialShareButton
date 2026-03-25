"use client";
export function Playground() {
  return (
    <div className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest text-[#FFCC00] uppercase mb-4 block flex items-center gap-2">
            <div className="w-4 h-[2px] bg-[#FFCC00]"></div> INTERACTIVE DEMO
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-balance mb-6">
            Configure it live.<br />See it <span className="underline decoration-[#FFCC00] decoration-4 underline-offset-8">instantly.</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium max-w-md text-sm leading-relaxed">
            Tweak theme, style, platforms and color — the preview updates in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-24 items-start mt-16">
          
          {/* Left Column: Preview / Code */}
          <div className="flex flex-col items-center">
            
            <div className="flex items-center justify-center gap-6 mb-12">
              <button className="text-[#FFCC00] font-bold text-xl font-serif">Preview</button>
              <span className="text-white font-bold text-xl">|</span>
              <button className="text-white font-bold text-xl font-serif hover:text-neutral-300 transition-colors">Code</button>
            </div>
            
            {/* The Output Mockup */}
            <div className="relative rounded-2xl border-2 border-[#FFCC00] bg-neutral-900 dark:bg-[#111] p-8 shadow-[0_0_40px_rgba(255,204,0,0.15)] w-full max-w-[450px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-3xl font-bold text-center w-full text-[#00C853] dark:text-[#a3e635]">Share this Page</h3>
                <button className="absolute right-6 top-6 text-[#FFCC00] border border-[#FFCC00] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">✕</button>
              </div>

              <p className="text-center text-sm text-neutral-400 mb-8 font-medium">Share this page to your social networks:</p>

              <div className="grid grid-cols-5 gap-4 mb-10">
                {[
                  { bg: "bg-[#25D366]", name: "WhatsApp", icon: "W" },
                  { bg: "bg-[#1877F2]", name: "Facebook", icon: "f" },
                  { bg: "bg-[#111] dark:bg-[#222]", name: "X", icon: "X" },
                  { bg: "bg-[#0A66C2]", name: "LinkedIn", icon: "in" },
                  { bg: "bg-[#229ED9]", name: "Telegram", icon: "T" }
                ].map((network, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${network.bg} flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                      {network.icon === "in" ? "in" : network.icon}
                    </div>
                    <span className="text-[11px] text-neutral-400 font-medium">{network.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-transparent rounded-full p-1 pl-4 border border-neutral-600 mb-8">
                <span className="text-sm text-neutral-400 truncate flex-1">https://socialsharebutton.com</span>
                <button className="bg-[#FFCC00] text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-[#e6b800] transition-colors">
                  Copy Link
                </button>
              </div>

              <div className="flex justify-center">
                <button className="bg-[#FFCC00] text-black px-12 py-3 rounded-full text-lg font-bold w-48 hover:bg-[#e6b800] transition-colors shadow-lg">
                  Share
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column: Configuration Panel */}
          <div className="w-full">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111] overflow-hidden">
              
              {/* Panel Header */}
              <div className="bg-[#FFCC00] px-4 py-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-black/20 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-background rounded-full"></div>
                </div>
                <span className="text-black text-xs font-mono font-bold tracking-wide">Configuration panel</span>
              </div>
              
              <div className="p-6 space-y-8">
                
                {/* Theme Config */}
                <div>
                   <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 mb-3 uppercase">Theme</h4>
                   <div className="flex rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0a0a0a] p-1">
                     <button className="flex-1 py-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">Light</button>
                     <button className="flex-1 py-2 text-sm font-bold text-black bg-[#FFCC00] rounded shadow-sm">Dark</button>
                   </div>
                </div>
                
                {/* Button Style Config */}
                <div>
                   <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 mb-3 uppercase">Button Style</h4>
                   <div className="grid grid-cols-2 gap-2">
                     <button className="py-2 text-sm font-bold text-black bg-[#FFCC00] rounded-md shadow-sm">default</button>
                     <button className="py-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded-md">primary</button>
                     <button className="py-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded-md">compact</button>
                     <button className="py-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded-md">icon-only</button>
                   </div>
                </div>
                
                {/* Platforms Config */}
                <div>
                  <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 mb-3 uppercase">Platforms</h4>
                  <div className="space-y-2">
                    {[
                      { name: "WhatsApp", icon: "W", active: true, color: "bg-[#25D366]" },
                      { name: "Facebook", icon: "f", active: true, color: "bg-[#1877F2]" },
                      { name: "Twitter/X", icon: "X", active: true, color: "bg-black dark:bg-[#222]" },
                      { name: "LinkedIn", icon: "in", active: true, color: "bg-[#0A66C2]" },
                      { name: "Telegram", icon: "T", active: false, color: "bg-[#229ED9]" },
                      { name: "Reddit", icon: "R", active: false, color: "bg-[#FF4500]" },
                      { name: "Email", icon: "@", active: false, color: "bg-neutral-500" }
                    ].map((platform, i) => (
                      <div key={i} className={`flex items-center justify-between p-2 rounded-md border ${platform.active ? 'border-[#00C853]/50 bg-[#00C853]/5' : 'border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] text-white font-bold ${platform.active ? platform.color : 'bg-neutral-400 dark:bg-neutral-700'}`}>
                            {platform.icon}
                          </div>
                          <span className={`text-xs font-medium ${platform.active ? 'text-foreground' : 'text-neutral-500'}`}>{platform.name}</span>
                        </div>
                        
                        {/* Toggle */}
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${platform.active ? 'bg-[#00C853]' : 'bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700'}`}>
                           <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${platform.active ? 'bg-white right-0.5' : 'bg-neutral-400 dark:bg-neutral-500 left-0.5'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Button Color Config */}
                <div>
                   <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 mb-3 uppercase">Button Color</h4>
                   <div className="flex gap-2">
                     <button className="w-6 h-6 rounded bg-[#FFCC00] ring-1 ring-offset-2 ring-offset-background ring-foreground"></button>
                     <button className="w-6 h-6 rounded bg-[#00C853]"></button>
                     <button className="w-6 h-6 rounded bg-[#229ED9]"></button>
                     <button className="w-6 h-6 rounded bg-[#FF4500]"></button>
                     <button className="w-6 h-6 rounded bg-purple-500"></button>
                     <button className="w-6 h-6 rounded bg-white border border-neutral-200 dark:border-neutral-800"></button>
                   </div>
                </div>
                
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
