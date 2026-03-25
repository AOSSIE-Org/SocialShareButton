export function CodeShowcase() {
  return (
    <div className="py-24 bg-background border-b-2 border-black dark:border-white overflow-hidden relative">

      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FFCC00]/5 blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="max-w-xl">
            <span className="text-[#00C853] font-mono text-sm mb-4 block font-bold">
              ~ npm install social-share-button-aossie
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-balance mb-6">
              30-second<br />setup.<br />Any framework.
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg font-medium">
              Fully typed, tree-shakable, and designed to match your application's design system out of the box.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded border-2 border-black dark:border-white bg-[#00C853] text-black flex justify-center items-center text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">✓</div>
                <span className="text-sm font-bold">Tree-shakable exports</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded border-2 border-black dark:border-white bg-[#FFCC00] text-black flex justify-center items-center text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">✓</div>
                <span className="text-sm font-bold">Written in TypeScript</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white flex justify-center items-center text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">✓</div>
                <span className="text-sm font-bold">Framework wrappers included</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="rounded-xl border-2 border-black dark:border-neutral-700 bg-[#111] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b-2 border-neutral-800 bg-[#222]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-[#FFCC00]" />
                  <div className="w-3 h-3 rounded-full bg-[#00C853]" />
                </div>
                <div className="flex-1 text-center text-xs text-neutral-400 font-mono font-bold tracking-wider">
                  page.tsx
                </div>
              </div>
              <div className="p-6 overflow-x-auto text-sm font-mono leading-relaxed">
                <pre>
                  <code className="text-[#00C853]">import</code>{" "}
                  <code className="text-white">{"{ "}SocialShare{" }"}</code>{" "}
                  <code className="text-[#00C853]">from</code>{" "}
                  <code className="text-[#FFCC00]">"social-share-button-aossie"</code>
                  <code className="text-white">;</code>
                  {"\n\n"}
                  <code className="text-[#00C853]">export default function</code>{" "}
                  <code className="text-[#FFCC00]">Page</code>
                  <code className="text-white">() {"{"}</code>
                  {"\n  "}
                  <code className="text-[#00C853]">return</code> <code className="text-white">(</code>
                  {"\n    "}
                  <code className="text-neutral-500 font-medium">{"// Just drop it wherever you need it"}</code>
                  {"\n    "}
                  <code className="text-white">{"<"}</code>
                  <code className="text-[#FFCC00]">SocialShare</code>
                  {"\n      "}
                  <code className="text-blue-300">url</code>
                  <code className="text-white">={"{ "}</code>
                  <code className="text-[#00C853]">window</code>
                  <code className="text-white">.location.href{" }"}</code>
                  {"\n      "}
                  <code className="text-blue-300">networks</code>
                  <code className="text-white">={"{["}</code>
                  <code className="text-[#FFCC00]">"twitter"</code>
                  <code className="text-white">, </code>
                  <code className="text-[#FFCC00]">"linkedin"</code>
                  <code className="text-white">, </code>
                  <code className="text-[#FFCC00]">"facebook"</code>
                  <code className="text-white">{"]}"}</code>
                  {"\n      "}
                  <code className="text-blue-300">theme</code>
                  <code className="text-white">=</code>
                  <code className="text-[#FFCC00]">"modern"</code>
                  {"\n    "}
                  <code className="text-white">{"/>"}</code>
                  {"\n  "}
                  <code className="text-white">);</code>
                  {"\n"}
                  <code className="text-white">{"}"}</code>
                </pre>
              </div>
            </div>
            
            {/* Decorative element behind code window if needed */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#00C853] to-[#FFCC00] blur-2xl opacity-10 -z-10 rounded-xl" />
          </div>
          
        </div>
      </div>
    </div>
  );
}
