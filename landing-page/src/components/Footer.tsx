'use client'


import { motion } from 'framer-motion'
import { Github, Mail, Linkedin, Youtube } from 'lucide-react'
import Image from 'next/image'
import logo from '../../../public/socialshare.png'

// Lucide doesn't ship brand logos for Discord, so a small inline SVG covers it.
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.211.375-.444.879-.608 1.279a18.27 18.27 0 0 0-5.487 0A12.64 12.64 0 0 0 9.182 3a19.736 19.736 0 0 0-4.435 1.369C1.578 9.045.769 13.579 1.174 18.053a19.9 19.9 0 0 0 5.993 3.03c.484-.66.914-1.36 1.285-2.096a12.3 12.3 0 0 1-2.023-.975c.17-.124.336-.253.497-.386 3.902 1.804 8.13 1.804 11.986 0 .163.133.329.262.497.386-.646.389-1.325.719-2.026.977.372.735.8 1.435 1.284 2.095a19.86 19.86 0 0 0 6.002-3.03c.475-5.177-.8-9.669-3.352-13.685ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.955 2.419-2.157 2.419Zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.947 2.419-2.157 2.419Z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white border-t border-neutral-900">
      {/* Hero CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight mb-4 font-bold text-white leading-[1.1]">
              Start <span className="text-[#FFCC00]">sharing.</span>
              <br />
              Right <span className="text-[#00C853]">now.</span>
            </h2>
            <p className="text-neutral-500 max-w-sm text-sm font-medium leading-relaxed mt-6">
              Two CDN tags, one function call. No account, no API key, no
              <br className="hidden sm:block" />
              build step. Your users will be sharing in under 30
              <br className="hidden sm:block" />
              seconds.
            </p>
          </div>

          <div className="space-y-4 max-w-md w-full lg:ml-auto">
            <a
              href="https://github.com/aossie-org/SocialShareButton"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-transparent border border-neutral-800 hover:border-neutral-600 rounded-xl p-4 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#FFCC00] flex items-center justify-center flex-shrink-0">
                  <Github className="w-5 h-5 text-black" />
                </div>
                <span className="text-sm font-bold text-white group-hover:text-[#FFCC00] transition-colors">
                  Star on GitHub
                </span>
              </div>
              <span className="text-neutral-600 group-hover:text-neutral-400">
                →
              </span>
            </a>

import Link from 'next/link'

...
            <Link
              href="/docs"
              className="flex items-center justify-between bg-transparent border border-neutral-800 hover:border-neutral-600 rounded-xl p-4 transition-colors group"
            >
...
            </Link>
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#00C853] flex items-center justify-center flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-black"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                  </svg>
                </div>
                <span className="text-sm font-bold text-white group-hover:text-[#00C853] transition-colors">
                  View Documentation
                </span>
              </div>
              <span className="text-neutral-600 group-hover:text-neutral-400">
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* AOSSIE brand / nav / connect */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-t border-neutral-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                  src={logo}
                  alt="SocialShareButton logo"
                  className="w-auto h-24 rounded-lg"
                />

              </div>
              <h3 className="font-mono text-xl font-bold text-white mb-4">
                Developed by AOSSIE
              </h3>
              <p className="text-sm text-neutral-400 font-mono max-w-md leading-relaxed">
                AOSSIE is a not-for-profit organization dedicated to
                project-based innovation-focused and research-intensive
                education.
              </p>
            </div>

            <div>
              <div className="pt-28">
              <h3 className="font-mono text-sm font-semibold text-white tracking-wider uppercase mb-4">
                Connect
              </h3>
              <div className="flex flex-wrap gap-6">
                <a
                  aria-label="Contact by Mail"
                  className="text-neutral-500 hover:text-[#FFCC00] transition"
                  href="mailto:contact@aossie.org"
                >
                  <Mail className="w-6 h-6" />
                </a>
                <a
                  aria-label="Join on Discord"
                  className="text-neutral-500 hover:text-[#FFCC00] transition"
                  href="https://discord.gg/hjUhu33uAn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DiscordIcon className="w-6 h-6" />
                </a>
                <a
                  aria-label="Follow on LinkedIn"
                  className="text-neutral-500 hover:text-[#FFCC00] transition"
                  href="https://www.linkedin.com/company/aossie/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  aria-label="Subscribe on YouTube"
                  className="text-neutral-500 hover:text-[#FFCC00] transition"
                  href="https://www.youtube.com/@AOSSIE-Org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-sm text-neutral-500 text-center">
            Open Source under MIT License &middot; &copy; 2016-
            {new Date().getFullYear()} AOSSIE. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}