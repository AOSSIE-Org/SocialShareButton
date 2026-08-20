"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function Hero() {
  const router = useRouter();

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setTimeout(() => {
      router.push(href);
    }, 200);
  };

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
              v1.0.4 IS OUT NOW
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-balance leading-[1.1] mb-6">
              Lightweight social share button <span className="text-[#00C853]">library</span> for modern websites.
            </h1>

            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl text-balance">
              <strong className="text-foreground font-semibold">Zero dependencies.</strong> Cross-platform. Fast. Secure. Clean.
              Import just one script and start showing share buttons! View the demo below or read the documentation.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <motion.a
                whileTap={{ scale: 0.9 }}
                href="/docs#ai-agent"
                onClick={(e) => handleNavigate(e, '/docs#ai-agent')}
                className="bg-[#FFCC00] text-black px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all border-2 border-transparent dark:border-none flex items-center gap-2 cursor-pointer group"
              >
                Add with AI Agent <span className="group-hover:translate-x-1 transition-transform">→</span>
              </motion.a>
              <motion.a
                whileTap={{ scale: 0.9 }}
                href="/docs/manual"
                onClick={(e) => handleNavigate(e, '/docs/manual')}
                className="bg-[#00C853] text-white px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all border-2 border-transparent dark:border-none flex items-center gap-2 cursor-pointer group"
              >
                Add Manually <span className="group-hover:translate-x-1 transition-transform">→</span>
              </motion.a>
              <Link
                href="#playground"
                className="px-6 py-3 rounded-full font-bold border-2 border-black dark:border-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-2"
              >
                Try demo →
              </Link>
              <a
                href="https://github.com/AOSSIE-Org/SocialShareButton"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full font-bold border-2 border-black dark:border-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-2"
              >
                View on GitHub
              </a>
            </div>
          </div>

          {/* Floating Mockup */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:ml-auto perspective-1000">
            <div className="rounded-xl border-2 border-[#FFCC00] bg-card p-6 shadow-[0_0_30px_rgba(255,204,0,0.15)] transform-gpu hover:-translate-y-2 transition-transform duration-500">
              <div className="flex items-center justify-between mb-8 cursor-move">
                <h3 className="font-serif text-2xl font-bold text-center w-full text-[#00C853]">Share this Page</h3>
                <button className="absolute right-4 top-4 text-neutral-400 hover:text-foreground">✕</button>
              </div>

              <p className="text-center text-sm text-neutral-500 mb-6">Where do you want to share this link?</p>

              <div className="grid grid-cols-5 gap-4 mb-8">
                {/* Brand Icons */}
                {[
                  {
                    bg: "bg-[#25D366]",
                    name: "WhatsApp",
                    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
                  },
                  {
                    bg: "bg-[#1877F2]",
                    name: "Facebook",
                    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                  },
                  {
                    bg: "bg-black dark:bg-neutral-800",
                    name: "X",
                    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                  },
                  {
                    bg: "bg-[#0A66C2]",
                    name: "LinkedIn",
                    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                  },
                  {
                    bg: "bg-[#229ED9]",
                    name: "Telegram",
                    path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
                  },
                ].map((network, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${network.bg} flex items-center justify-center shadow-lg transition-transform group-hover:-translate-y-1`}>
                      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true">
                        <path d={network.path} />
                      </svg>
                    </div>
                    <span className="text-[10px] md:text-xs text-neutral-500">{network.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-background rounded-full p-1 pl-4 border-2 border-[#FFCC00]">
                <span className="text-xs md:text-sm text-neutral-500 truncate flex-1 hidden sm:block">social-share-button.aossie.org</span>
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
