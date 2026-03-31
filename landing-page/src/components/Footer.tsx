import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight mb-4 font-bold text-white leading-[1.1]">
              Start <span className="text-[#FFCC00]">sharing.</span><br />
              Right <span className="text-[#00C853]">now.</span>
            </h2>
            <p className="text-neutral-500 max-w-sm text-sm font-medium leading-relaxed mt-6">
              Two CDN tags, one function call. No account, no API key, no<br className="hidden sm:block" />
              build step. Your users will be sharing in under 30<br className="hidden sm:block" />
              seconds.
            </p>
          </div>
          
          <div className="space-y-4 max-w-md w-full lg:ml-auto">
             <a href="https://github.com/aossie-org/SocialShareButton" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-transparent border border-neutral-800 hover:border-neutral-600 rounded-xl p-4 transition-colors group">
               <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-lg bg-[#FFCC00] flex items-center justify-center flex-shrink-0">
                   <Github className="w-5 h-5 text-black" />
                 </div>
                 <span className="text-sm font-bold text-white group-hover:text-[#FFCC00] transition-colors">Star on GitHub</span>
               </div>
               <span className="text-neutral-600 group-hover:text-neutral-400">→</span>
             </a>
             
             <a href="#" className="flex items-center justify-between bg-transparent border border-neutral-800 hover:border-neutral-600 rounded-xl p-4 transition-colors group">
               <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-lg bg-[#00C853] flex items-center justify-center flex-shrink-0">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-black"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                 </div>
                 <span className="text-sm font-bold text-white group-hover:text-[#00C853] transition-colors">View Documentation</span>
               </div>
               <span className="text-neutral-600 group-hover:text-neutral-400">→</span>
             </a>
             
             <a href="#" className="flex items-center justify-between bg-transparent border border-neutral-800 hover:border-neutral-600 rounded-xl p-4 transition-colors group">
               <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" x2="20" y1="19" y2="19"></line></svg>
                 </div>
                 <span className="text-sm font-bold text-white group-hover:text-neutral-300 transition-colors">Try Interactive Demo</span>
               </div>
               <span className="text-neutral-600 group-hover:text-neutral-400">→</span>
             </a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-neutral-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">SB</span>
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              SocialShareButton
            </span>
          </div>
          
          <div className="text-sm text-neutral-500">
            Open Source under MIT License.
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
