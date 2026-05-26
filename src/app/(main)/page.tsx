"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/login?tab=login");
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased w-full">
      {/* TopNavBar */}
      <nav className="bg-surface/95 dark:bg-surface-dim/95 docked full-width top-0 sticky border-b border-outline-variant dark:border-outline backdrop-blur-md shadow-sm dark:shadow-none z-50 w-full">
        <div className="max-w-container-max mx-auto px-gutter h-16 flex justify-between items-center w-full">
          <div className="flex items-center gap-lg">
            <Link className="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed" href="/login?tab=login">
              EduVault
            </Link>
            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-md">
              <li>
                <Link className="text-label-md font-label-md text-secondary dark:text-secondary-fixed-dim border-b-2 border-secondary dark:border-secondary-fixed-dim pb-1 opacity-80 transition-opacity duration-150" href="/login?tab=login">
                  Explore
                </Link>
              </li>
              <li>
                <Link className="text-label-md font-label-md text-on-surface-variant dark:text-on-surface hover:text-primary dark:hover:text-primary-fixed hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors rounded px-2 py-1" href="/compare">
                  Compare
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-sm">
            <ThemeToggle />
            <button onClick={() => router.push("/login?tab=login")} className="hidden md:block text-label-md font-label-md text-on-surface-variant hover:text-primary px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
              Sign In
            </button>
            {/* Mobile Menu Toggle */}
            <button onClick={() => router.push("/login?tab=login")} className="md:hidden text-on-surface p-2 rounded-lg hover:bg-surface-container-low">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="w-full bg-surface-container-lowest pt-xl pb-xl px-gutter relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-secondary-fixed-dim rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-tertiary-fixed-dim rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          </div>
          <div className="max-w-container-max mx-auto relative z-10 flex flex-col items-center text-center">
            <button onClick={() => router.push("/login?tab=login")} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-label-sm font-label-sm text-secondary mb-lg border border-surface-variant cursor-pointer">
              <span className="material-symbols-outlined text-[16px] icon-fill">school</span>
              Trusted by 1M+ Students
            </button>
            <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary max-w-4xl mb-md">
              Find Your Future. <br className="hidden md:block"/>Discover Top Colleges in India.
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mb-xl">
              Navigate the complex world of higher education with confidence. Compare fees, placement records, and campus life to make data-driven decisions.
            </p>
            {/* Giant Search Bar */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl bg-white rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.1)] border border-outline-variant p-2 flex flex-col md:flex-row gap-2 transition-shadow focus-within:shadow-[0px_15px_40px_rgba(0,0,0,0.15)] focus-within:border-secondary">
              <div className="flex-grow flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-outline-variant">
                <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-body-md font-body-md text-on-surface placeholder-on-surface-variant/70 p-0 outline-none"
                  placeholder="Search by college, course, or location..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-2 px-2 md:px-0">
                <button type="submit" className="w-full md:w-auto bg-secondary text-on-secondary px-6 py-3 rounded-lg text-label-md font-label-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer font-bold">
                  Search
                </button>
              </div>
            </form>
            <div className="mt-sm flex flex-wrap justify-center gap-3 text-label-sm font-label-sm text-on-surface-variant">
              <span>Popular:</span>
              <Link className="hover:text-secondary underline decoration-secondary/30 underline-offset-2 transition-colors" href="/colleges/iit-delhi">IIT Delhi</Link>
              <Link className="hover:text-secondary underline decoration-secondary/30 underline-offset-2 transition-colors" href="/colleges/bits-pilani">BITS Pilani</Link>
              <Link className="hover:text-secondary underline decoration-secondary/30 underline-offset-2 transition-colors" href="/login?tab=login">B.Tech Computer Science</Link>
            </div>
          </div>
        </section>

        {/* Featured Colleges (Bento-ish Grid / Horizontal Scroll) */}
        <section className="w-full py-xl px-gutter bg-surface">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-lg">
              <div>
                <h2 className="text-headline-lg font-headline-lg text-primary">Featured Institutions</h2>
                <p className="text-body-md font-body-md text-on-surface-variant mt-xs">Highly ranked universities based on placements and infrastructure.</p>
              </div>
            </div>
            {/* Horizontal Scroll Container for Mobile, Grid for Desktop */}
            <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4 -mx-gutter px-gutter md:mx-0 md:px-0 md:grid md:grid-cols-2 gap-md">
              {/* College Card 1 */}
              <div onClick={() => router.push("/colleges/iit-delhi")} className="min-w-[85vw] md:min-w-0 flex-shrink-0 snap-center bg-white rounded-xl border border-outline-variant shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col hover:shadow-[0px_10px_30px_rgba(0,0,0,0.1)] transition-shadow group cursor-pointer">
                <div className="h-48 relative overflow-hidden bg-surface-container-high">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAN2JNF7bVw2nBekfVI3ibiKjOGV7_I114JHt9PxDBvrfrYoTCiUnIPNoa7mlSm84EkQgVp-WyUMZ7vkrOrzPlZ6ZK0I1sctziaiG1Y8GNyKFaQQCdAwRS3Lfw0oiswMi0x8YJSmAjgcDrAk6Ie8TXGYpYvo8-a5-4-QKGURBR5z_uCHE7ZbffvIaelkQKUbiJrX97kXHU4zHrSw8Bzhgxo4i5AA-jvPjA8o9JxWKuHhluycWC1aShGmjjL0Qyohnd06So1aGNNd2c')" }}>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-tertiary-fixed-dim/90 backdrop-blur text-tertiary px-2 py-1 rounded text-label-sm font-label-sm flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">military_tech</span> #2 NIRF
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-headline-sm font-headline-sm text-white drop-shadow-md">IIT Delhi</h3>
                    <p className="text-body-sm font-body-sm text-white/90 drop-shadow flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span> New Delhi, Delhi
                    </p>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center divide-x divide-outline-variant/50 border-b border-outline-variant/50 pb-4">
                    <div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">Avg Fee</p>
                      <p className="text-body-md font-body-md font-semibold text-primary mt-1">₹2.1L<span className="text-label-sm font-label-sm text-on-surface-variant font-normal">/yr</span></p>
                    </div>
                    <div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">Placement</p>
                      <p className="text-body-md font-body-md font-semibold text-tertiary-container mt-1">₹21.4L</p>
                    </div>
                    <div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">Acceptance</p>
                      <p className="text-body-md font-body-md font-semibold text-primary mt-1">1.2%</p>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-2 py-1 rounded">Engineering</span>
                    <button onClick={(e) => { e.stopPropagation(); router.push("/compare"); }} className="text-label-sm font-label-sm text-secondary font-semibold hover:text-secondary-container transition-colors cursor-pointer">Compare</button>
                  </div>
                </div>
              </div>
              {/* College Card 2 */}
              <div onClick={() => router.push("/colleges/bits-pilani")} className="min-w-[85vw] md:min-w-0 flex-shrink-0 snap-center bg-white rounded-xl border border-outline-variant shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col hover:shadow-[0px_10px_30px_rgba(0,0,0,0.1)] transition-shadow group cursor-pointer">
                <div className="h-48 relative overflow-hidden bg-surface-container-high">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSguY97b6IYypoYD9dgTpt9G3aSIqhFLrjPEbk-MtKwbRWfJQliBBMy-s0twuvE_0ok5WtErcXOdwHNNH77S16Cv-Lfq8Q3JHm8HnvfAIwq5-30Yb8k2ruGhHJKBntz7aw_0uh_Y7mtQ9FKQiFfwE4xeLNSeFZUbkTPdpTrqiUDTQi05Thp-NsQUOuhpCxq-c2cGh_3rKvIdWQ3yXt0uKKwWKFxfDI7qZgc3WyJoW-H9QtAZ1bujWHKmF0j64otmdOn3HDQ-_PgO4')" }}>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-tertiary-fixed-dim/90 backdrop-blur text-tertiary px-2 py-1 rounded text-label-sm font-label-sm flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">military_tech</span> #1 Private
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-headline-sm font-headline-sm text-white drop-shadow-md">BITS Pilani</h3>
                    <p className="text-body-sm font-body-sm text-white/90 drop-shadow flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span> Pilani, Rajasthan
                    </p>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center divide-x divide-outline-variant/50 border-b border-outline-variant/50 pb-4">
                    <div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">Avg Fee</p>
                      <p className="text-body-md font-body-md font-semibold text-primary mt-1">₹4.5L<span className="text-label-sm font-label-sm text-on-surface-variant font-normal">/yr</span></p>
                    </div>
                    <div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">Placement</p>
                      <p className="text-body-md font-body-md font-semibold text-tertiary-container mt-1">₹30.3L</p>
                    </div>
                    <div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">Acceptance</p>
                      <p className="text-body-md font-body-md font-semibold text-primary mt-1">1.5%</p>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-2 py-1 rounded">Engg &amp; Science</span>
                    <button onClick={(e) => { e.stopPropagation(); router.push("/compare"); }} className="text-label-sm font-label-sm text-secondary font-semibold hover:text-secondary-container transition-colors cursor-pointer">Compare</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-xl px-gutter bg-primary text-on-primary">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-headline-lg font-headline-lg mb-sm">Ready to make a decision?</h2>
            <p className="text-body-lg font-body-lg text-primary-fixed-dim mb-lg max-w-2xl mx-auto">
              Join 1M+ students who have successfully navigated their college discovery journey with EduVault.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in-50 duration-300">
              <Link href="/compare" className="bg-secondary text-on-secondary px-8 py-4 rounded-lg text-label-md font-label-md font-bold hover:bg-secondary-container transition-colors shadow-lg text-center cursor-pointer">
                Start Your Comparison
              </Link>
              <button onClick={() => router.push("/login?tab=login")} className="bg-transparent border-2 border-primary-fixed-dim text-on-primary px-8 py-4 rounded-lg text-label-md font-label-md font-bold hover:bg-primary-container transition-colors text-center cursor-pointer">
                Create Free Account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-surface-container-high text-primary dark:text-on-primary-fixed w-full py-xl px-gutter border-t border-outline-variant dark:border-outline">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-lg">
          <div className="flex flex-col gap-4">
            <Link className="text-headline-sm font-headline-sm font-bold text-primary dark:text-on-primary-fixed" href="/login?tab=login">EduVault</Link>
            <p className="text-body-sm font-body-sm text-on-surface-variant">Empowering students to make data-driven educational choices.</p>
            <div className="mt-auto pt-4 border-t border-outline-variant/30">
              <p className="text-label-sm font-label-sm text-on-surface-variant">© 2026 EduVault Discovery. All rights reserved.</p>
            </div>
          </div>
          <div>
            <h4 className="text-label-md font-label-md font-bold mb-4">Platform</h4>
            <ul className="flex flex-col gap-3">
              <li><Link className="text-body-sm font-body-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/login?tab=login">About Us</Link></li>
              <li><Link className="text-body-sm font-body-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/login?tab=login">Trust Badges</Link></li>
              <li><Link className="text-body-sm font-body-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/login?tab=login">Contact Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-label-md font-label-md font-bold mb-4">Legal</h4>
            <ul className="flex flex-col gap-3">
              <li><Link className="text-body-sm font-body-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/login?tab=login">Terms of Service</Link></li>
              <li><Link className="text-body-sm font-body-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/login?tab=login">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-label-md font-label-md font-bold mb-4">Stay Updated</h4>
            <p className="text-body-sm font-body-sm text-on-surface-variant mb-3">Get the latest college rankings and admission insights.</p>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-sm font-body-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none text-on-surface" placeholder="Email address" type="email" required />
              <button type="submit" className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-sm font-label-sm hover:bg-primary-container transition-colors cursor-pointer">Subscribe</button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}
