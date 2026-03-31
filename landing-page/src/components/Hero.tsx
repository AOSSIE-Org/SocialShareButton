export function Hero() {
  return (
    <div className="pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 mix-blend-screen" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] -z-10 mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs font-medium mb-6">
              <span className="text-primary px-1">★</span>
              v1.0.3 IS OUT NOW
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-balance leading-[1.1] mb-6">
              Lightweight social share button <span className="text-[#00C853]">library</span> for modern websites.
            </h1>
            
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl text-balance">
              <strong className="text-foreground font-semibold">Zero dependencies.</strong> Cross-platform. Fast. Secure. Clean.
              Import just one script and start showing share buttons! View the demo below or read the documentation.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#FFCC00] text-black px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all border-2 border-transparent dark:border-none">
                Read the Docs
              </button>
              <button className="bg-[#00C853] text-white px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all border-2 border-transparent dark:border-none">
                Try demo →
              </button>
              <button className="px-6 py-3 rounded-full font-bold border-2 border-black dark:border-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-2">
                View on GitHub
              </button>
            </div>
          </div>
          
          {/* Floating Mockup */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:ml-auto perspective-1000">
             <div className="rounded-xl border-2 border-[#FFCC00] bg-background p-6 shadow-[0_0_30px_rgba(255,204,0,0.15)] transform-gpu hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center justify-between mb-8 cursor-move">
                  <h3 className="font-serif text-2xl font-bold text-center w-full text-[#00C853]">Share this Page</h3>
                  <button className="absolute right-4 top-4 text-neutral-400 hover:text-foreground">✕</button>
                </div>
                
                <p className="text-center text-sm text-neutral-500 mb-6">Where do you want to share this link?</p>
                
                <div className="grid grid-cols-5 gap-4 mb-8">
                  {/* Mock Icons */}
                  {[
                    { bg: "bg-[#25D366]", name: "WhatsApp" },
                    { bg: "bg-[#1877F2]", name: "Facebook" },
                    { bg: "bg-black dark:bg-neutral-800", name: "X" },
                    { bg: "bg-[#0A66C2]", name: "LinkedIn" },
                    { bg: "bg-[#229ED9]", name: "Telegram" }
                  ].map((network, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${network.bg} flex items-center justify-center text-white shadow-lg transition-transform group-hover:-translate-y-1`}>
                        {network.name[0]}
                      </div>
                      <span className="text-[10px] md:text-xs text-neutral-500">{network.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 bg-background rounded-full p-1 pl-4 border-2 border-[#FFCC00]">
                  <span className="text-xs md:text-sm text-neutral-500 truncate flex-1">social-share-button.aossie.org</span>
                  <button className="bg-[#FFCC00] text-black px-4 py-2 rounded-full text-sm font-bold">
                    Copy Link
                  </button>
                </div>
                
                <div className="mt-4 flex justify-center">
                   <button className="bg-[#FFCC00] text-black px-8 py-2 rounded-full text-sm font-bold w-32 border-2 border-transparent hover:brightness-110">
                     Share
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
