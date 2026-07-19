"use client";
// import documente page
import Link from "next/link";
import { useState } from "react";
import { SiteNavbar } from "@/components/SiteNavbar";

export default function Docs() {
  const [copied, setCopied] = useState(false);

  const sections = [
    { id: "overview", title: "Overview" },
    { id: "why", title: "Why SocialShareButton?" },
    { id: "getting-started", title: "Getting Started" },
    { id: "analytics", title: "Analytics" },
    { id: "use-cases", title: "Use Cases" },
    { id: "install", title: "Ready to Go?" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("npm install @aossie-org/social-share-button");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="min-h-screen selection:bg-[#FFCC00]/30">
      <SiteNavbar variant="docs" />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-4 lg:gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-24 space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:translate-x-2 text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </aside>

            {/* Mobile Navigation */}
            <div className="col-span-4 lg:hidden mb-6 sticky top-16 z-10 bg-background/95 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <select
                onChange={(e) => scrollToSection(e.target.value)}
                className="w-full bg-transparent font-medium text-foreground text-sm sm:text-base"
                aria-label="Navigate to section"
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Main Content */}
            <div className="col-span-4 lg:col-span-3 space-y-8 sm:space-y-12 lg:space-y-16">
              {/* Overview Section */}
              <div id="overview" className="space-y-6 sm:space-y-8 scroll-mt-24">
                <div className="bg-gradient-to-br from-[#FFCC00]/20 to-[#00C853]/20 rounded-3xl p-6 sm:p-8 md:p-12 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transition-all duration-300">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6">
                    Get Your Share Button Live in Minutes
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Add beautiful, privacy-first social sharing to any website — no backend, no complexity, no compromise.
                  </p>
                </div>

                <div className="bg-background rounded-3xl p-6 sm:p-8 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-[#FFCC00]/10 dark:bg-[#FFCC00]/5 rounded-2xl p-4 sm:p-6 border-l-4 border-[#FFCC00]">
                    <p className="text-base sm:text-lg font-medium">
                      Your audience is already sharing. Give them a button worth clicking.
                    </p>
                  </div>
                </div>
              </div>

              {/* Why Section */}
              <div id="why" className="space-y-6 sm:space-y-8 scroll-mt-24">
                <div className="bg-background rounded-3xl p-6 sm:p-8 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-6 sm:mb-8">
                    Why SocialShareButton?
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-black dark:border-white">
                          <th className="text-left py-3 sm:py-4 px-3 sm:px-4 text-lg sm:text-xl font-bold">What you get</th>
                          <th className="text-left py-3 sm:py-4 px-3 sm:px-4 text-lg sm:text-xl font-bold">What you skip</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["One-line install", "Backend servers"],
                          ["Works on any framework", "Tracking or data collection"],
                          ["Fully customizable", "Lock-in or licensing fees"],
                          ["Lightweight & fast", "Build step (CDN option)"],
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                            <td className="py-3 sm:py-4 px-3 sm:px-4 text-base sm:text-lg">{row[0]}</td>
                            <td className="py-3 sm:py-4 px-3 sm:px-4 text-base sm:text-lg text-muted-foreground">{row[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Getting Started Section */}
              <div id="getting-started" className="space-y-6 sm:space-y-8 scroll-mt-24">
                <div className="bg-background rounded-3xl p-6 sm:p-8 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-6 sm:mb-8">
                    How to Get Started
                  </h2>

                  <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
                    You have exactly <span className="font-bold text-[#00C853]">three steps</span> between you and a live share button.
                  </p>

                  <div className="bg-[#00C853]/10 dark:bg-[#00C853]/5 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-l-4 border-[#00C853]">
                    <pre className="text-sm sm:text-base md:text-lg font-mono whitespace-pre-wrap">
                      1.  Load the library   →   one line in your HTML or package install
                      2.  Drop a div         →   place it wherever you want the button
                      3.  Initialize         →   one line of JavaScript
                    </pre>
                  </div>

                  <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                    That's it. No accounts. No API keys. No configuration files.
                  </p>

                  <div className="bg-[#FFCC00]/10 dark:bg-[#FFCC00]/5 rounded-2xl p-4 sm:p-6 border-2 border-[#FFCC00]">
                    <p className="text-xs sm:text-sm font-bold text-[#FFCC00] mb-2">Using GitHub Copilot?</p>
                    <p className="text-sm sm:text-base mb-4">
                      Open the chat, type <code className="bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded text-sm">@workspace</code>, then copy the public prompt from:
                    </p>
                    <a
                      href="https://github.com/AOSSIE-Org/SocialShareButton/blob/main/.github/copilot/integrate-social-share-button.prompt.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00C853] hover:underline break-all text-sm sm:text-base"
                    >
                      https://github.com/AOSSIE-Org/SocialShareButton/blob/main/.github/copilot/integrate-social-share-button.prompt.md
                    </a>
                    <p className="text-sm sm:text-base mt-4">
                      Copilot will walk through each step for your exact framework automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytics Section */}
              <div id="analytics" className="space-y-6 sm:space-y-8 scroll-mt-24">
                <div className="bg-background rounded-3xl p-6 sm:p-8 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-6 sm:mb-8">
                    Want to Track Every Share?
                  </h2>

                  <p className="text-base sm:text-lg mb-6 sm:mb-8">
                    SocialShareButton emits rich events locally — you forward them to whatever analytics tool you already use (Google Analytics, Mixpanel, Plausible, or your own). <span className="font-bold">Zero extra vendors. Zero new data contracts.</span>
                  </p>

                  <div className="bg-[#00C853]/10 dark:bg-[#00C853]/5 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">You see:</h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {[
                        "Which platform users share to",
                        "When the popup opens and closes",
                        "Copy-link vs. direct share split",
                        "Any errors, so nothing goes silently wrong",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-[#00C853] mt-1 text-sm sm:text-base">✓</span>
                          <span className="text-sm sm:text-base lg:text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#FFCC00]/10 dark:bg-[#FFCC00]/5 rounded-2xl p-4 sm:p-6 border-2 border-[#FFCC00]">
                    <p className="text-xs sm:text-sm font-bold text-[#FFCC00] mb-2">Using GitHub Copilot?</p>
                    <p className="text-sm sm:text-base mb-4">
                      Open and copy the analytics prompt from:
                    </p>
                    <a
                      href="https://github.com/AOSSIE-Org/SocialShareButton/blob/main/.github/copilot/integrate-analytics.prompt.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00C853] hover:underline break-all text-sm sm:text-base"
                    >
                      https://github.com/AOSSIE-Org/SocialShareButton/blob/main/.github/copilot/integrate-analytics.prompt.md
                    </a>
                    <p className="text-sm sm:text-base mt-4">
                      Copilot will wire up the events to your analytics stack in minutes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Use Cases Section */}
              <div id="use-cases" className="space-y-6 sm:space-y-8 scroll-mt-24">
                <div className="bg-background rounded-3xl p-6 sm:p-8 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-6 sm:mb-8">
                    What Clients Are Building with It
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      {
                        title: "Blogs & editorial sites",
                        desc: "boost organic reach on every article",
                        color: "bg-[#FFCC00]",
                        textColor: "text-black",
                      },
                      {
                        title: "E-commerce product pages",
                        desc: "shareable links that drive referral traffic",
                        color: "bg-[#00C853]",
                        textColor: "text-black",
                      },
                      {
                        title: "SaaS dashboards",
                        desc: "let users share reports or invite teammates",
                        color: "bg-white dark:bg-neutral-900",
                        textColor: "text-black dark:text-white",
                      },
                      {
                        title: "Portfolio & landing pages",
                        desc: "make every page shareworthy",
                        color: "bg-[#00C853]",
                        textColor: "text-black",
                      },
                    ].map((useCase, i) => (
                      <div
                        key={i}
                        className={`${useCase.color} ${useCase.textColor} rounded-2xl p-4 sm:p-6 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all duration-300 cursor-pointer`}
                      >
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2">{useCase.title}</h3>
                        <p className="text-sm sm:text-base opacity-90">{useCase.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Install Section */}
              <div id="install" className="space-y-6 sm:space-y-8 scroll-mt-24">
                <div className="bg-gradient-to-br from-[#00C853]/20 to-[#FFCC00]/20 rounded-3xl p-6 sm:p-8 md:p-12 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transition-all duration-300">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-6 sm:mb-8">
                    Ready to Go?
                  </h2>

                  <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
                    Install takes under five minutes. Support is on{' '}
                    <a
                      href="https://discord.com/channels/1022871757289422898/1479012884209078365"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00C853] hover:underline font-bold"
                    >
                      Discord
                    </a>.
                  </p>

                  <div className="bg-black dark:bg-white rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 relative group">
                    <code className="text-white dark:text-black text-sm sm:text-base md:text-lg lg:text-xl font-mono pr-16 sm:pr-20 break-all">
                      npm install @aossie-org/social-share-button
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-[#FFCC00] text-black px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold hover:brightness-110 transition-all text-xs sm:text-sm"
                    >
                      {copied ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>

                  <p className="text-base sm:text-lg text-muted-foreground">
                    or drop one <code className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded text-sm sm:text-base">&lt;script&gt;</code> tag — your call.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    href="/"
                    className="bg-[#FFCC00] text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:brightness-110 transition-all border-2 border-transparent dark:border-none text-base sm:text-lg"
                  >
                    ← Back to Home
                  </Link>
                  <a
                    href="https://github.com/AOSSIE-Org/SocialShareButton"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#00C853] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:brightness-110 transition-all border-2 border-transparent dark:border-none text-base sm:text-lg"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}