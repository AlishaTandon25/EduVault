"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CollegeDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const isBITS = slug === "bits-pilani";
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleApplyNow = () => {
    alert("Application successfully initiated!");
  };

  const handleDownloadBrochure = () => {
    alert("College Brochure download initiated!");
  };

  if (isBITS) {
    return (
      <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col w-full">
        {/* TopNavBar */}
        <nav className="bg-surface/95 docked full-width top-0 sticky border-b border-outline-variant backdrop-blur-md shadow-sm z-50 w-full">
          <div className="max-w-container-max mx-auto px-gutter h-16 flex justify-between items-center w-full">
            <div className="flex items-center gap-lg">
              <Link className="text-headline-md font-headline-md font-bold text-primary" href="/">
                EduVault
              </Link>
              <div className="hidden md:flex gap-sm">
                <Link className="text-label-md font-label-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors px-xs py-1 rounded" href="/colleges">
                  Explore
                </Link>
                <Link className="text-label-md font-label-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors px-xs py-1 rounded" href="/compare">
                  Compare
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <form onSubmit={handleSearchSubmit} className="hidden lg:flex relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-body-sm font-body-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none w-64 transition-all text-on-surface"
                  placeholder="Search colleges..."
                  type="text"
                />
              </form>
              <ThemeToggle />
              <button onClick={() => router.push("/login?tab=login")} className="text-label-md font-label-md text-secondary hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors cursor-pointer">
                Sign In
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative w-full h-[360px] flex items-end pb-12 mb-16 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSguY97b6IYypoYD9dgTpt9G3aSIqhFLrjPEbk-MtKwbRWfJQliBBMy-s0twuvE_0ok5WtErcXOdwHNNH77S16Cv-Lfq8Q3JHm8HnvfAIwq5-30Yb8k2ruGhHJKBntz7aw_0uh_Y7mtQ9FKQiFfwE4xeLNSeFZUbkTPdpTrqiUDTQi05Thp-NsQUOuhpCxq-c2cGh_3rKvIdWQ3yXt0uKKwWKFxfDI7qZgc3WyJoW-H9QtAZ1bujWHKmF0j64otmdOn3HDQ-_PgO4')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent"></div>
          <div className="relative w-full px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-10">
            <div className="flex items-end gap-6 flex-wrap md:flex-nowrap">
              <div className="w-28 h-28 bg-surface-container-lowest rounded-xl p-2 shadow-lg border border-outline-variant flex-shrink-0 flex items-center justify-center bg-white">
                <img
                  alt="BITS Pilani Logo"
                  className="w-full h-full object-contain rounded-lg"
                  src="https://lh3.googleusercontent.com/aida/ADBb0ujPVemK4t2TpXecclL2Gw70nvCLxN3zP1CcaFNuv8QySLXAkKPjoBj_QKUvYizhrMriTaEwFU-ebPEcRLyI98US_xPevEvuGLPu6frs5OFl0YZwowGOo3dBNJw3d47i_9-BL69fza7kQKs_4ToSOtZt9aHj9tCJ6ksODkN8S9w1oA6Gj0Mm--3At4-lPOb1X8SCnQMNgwEJiFLCu7_0_ed45UAnzwqt_uDj-xvxbgf6DTM9C9YukijPDRk"
                />
              </div>
              <div className="text-on-primary pb-1">
                <div className="flex items-center gap-3 mb-2.5 flex-wrap">
                  <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span> Verified
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-on-primary px-3 py-1 rounded-full text-xs font-semibold">
                    Private Institute
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-2.5">BITS Pilani</h1>
                <p className="text-base text-primary-fixed-dim flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span> Pilani, Rajasthan
                </p>
              </div>
            </div>
            <div className="pb-1 w-full md:w-auto">
              <button
                onClick={handleApplyNow}
                className="w-full md:w-auto bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors shadow-lg px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                Apply Now
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <div className="px-6 max-w-7xl mx-auto -mt-20 relative z-20 mb-12">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.05)] border border-outline-variant p-2 bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-outline-variant">
              <div className="p-6 flex flex-col items-center justify-center text-center group hover:bg-surface-container-low transition-colors rounded-l-lg">
                <div className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">NAAC Rating</div>
                <div className="text-3xl font-extrabold text-primary flex items-baseline gap-1">
                  A <span className="text-lg font-bold text-tertiary-fixed-dim">+</span>
                </div>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center group hover:bg-surface-container-low transition-colors">
                <div className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">Highest Package</div>
                <div className="text-3xl font-extrabold text-primary">
                  60.75 <span className="text-lg font-bold text-on-surface-variant">L</span>
                </div>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center group hover:bg-surface-container-low transition-colors">
                <div className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">B.Tech Fees</div>
                <div className="text-3xl font-extrabold text-primary">
                  22.5 <span className="text-lg font-bold text-on-surface-variant">L</span>
                </div>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center group hover:bg-surface-container-low transition-colors rounded-r-lg">
                <div className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">NIRF Engg. Rank</div>
                <div className="text-3xl font-extrabold text-primary">#25</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-16">
          {/* Content Canvas */}
          <div className="md:col-span-8 space-y-12">
            {/* Secondary Sticky Nav */}
            <div className="bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant sticky top-16 z-40 py-3 flex gap-6 overflow-x-auto no-scrollbar bg-white">
              <a href="#overview" className="text-secondary border-b-2 border-secondary pb-2 text-sm font-semibold whitespace-nowrap">
                Overview
              </a>
              <a href="#placements" className="text-on-surface-variant hover:text-primary transition-colors pb-2 text-sm font-semibold whitespace-nowrap">
                Placements
              </a>
            </div>

            {/* Overview Section */}
            <section className="scroll-mt-32" id="overview">
              <h2 className="text-2xl font-bold text-primary mb-6">Institution Overview</h2>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm bg-white">
                <p className="text-base md:text-lg text-on-surface-variant mb-6 leading-relaxed">
                  Birla Institute of Technology and Science (BITS) Pilani is one of India's premier engineering and science institutes. Renowned for its rigorous academic curriculum and vibrant campus life, it operates as a deemed university and is consistently ranked among the top technical institutes in the country.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="bg-surface-container-low p-6 rounded-lg border border-surface-variant flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary">
                      <span className="material-symbols-outlined">school</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-primary mb-2">Zero Attendance Policy</h3>
                      <p className="text-sm text-on-surface-variant">
                        A hallmark of the BITS educational model, allowing students the flexibility to manage their own learning schedules and pursue extracurricular passions.
                      </p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-lg border border-surface-variant flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-tertiary-container/10 text-on-tertiary-container flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">corporate_fare</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-primary mb-2">Startup Culture</h3>
                      <p className="text-sm text-on-surface-variant">
                        Home to a thriving ecosystem of innovation, supported by dedicated incubators that have birthed numerous successful unicorns and tech startups.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Placements Section */}
            <section className="scroll-mt-32" id="placements">
              <h2 className="text-2xl font-bold text-primary mb-6">Placement Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Bento Item 1 */}
                <div className="md:col-span-2 bg-gradient-to-br from-primary to-inverse-surface rounded-xl p-6 md:p-8 text-on-primary shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-10 -bottom-10 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-[150px]">trending_up</span>
                  </div>
                  <div className="relative z-10">
                    <div className="text-xs font-semibold text-primary-fixed-dim uppercase tracking-wider mb-2">Highest Domestic Package</div>
                    <div className="text-4xl font-extrabold mb-2">₹60.75 LPA</div>
                    <p className="text-sm text-surface-dim">Secured during the recent placement drive for top engineering roles.</p>
                  </div>
                </div>
                {/* Bento Item 2 */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-center bg-white">
                  <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Average Package</div>
                  <div className="text-2xl font-bold text-secondary mb-1">₹21.8 LPA</div>
                  <div className="flex items-center gap-1 text-tertiary-fixed-dim text-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <span className="text-emerald-500">12% YoY Growth</span>
                  </div>
                </div>
              </div>

              {/* Top Recruiters */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm bg-white">
                <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">work</span>
                  Top Recruiters
                </h3>
                <div className="flex flex-wrap gap-4">
                  {["Apple", "Amazon", "Uber", "Microsoft", "Google"].map((company) => (
                    <div
                      key={company}
                      className="px-6 py-3 bg-surface border border-outline-variant rounded-lg flex items-center gap-3 hover:border-secondary transition-colors cursor-default"
                    >
                      <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold">
                        {company.slice(0, 1)}
                      </div>
                      <span className="text-sm font-semibold text-on-surface">{company}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar / Contextual Actions */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] sticky top-32 bg-white">
              <h3 className="text-lg font-bold text-primary mb-2">Interested in BITS?</h3>
              <p className="text-xs text-on-surface-variant mb-6">
                Applications for the BITSAT entrance exam are currently open. Check eligibility before applying.
              </p>
              <button
                onClick={handleApplyNow}
                className="w-full bg-primary hover:bg-primary-container text-on-primary py-3 rounded-lg text-sm font-bold transition-all mb-3 cursor-pointer"
              >
                Apply via BITSAT
              </button>
              <button
                onClick={handleDownloadBrochure}
                className="w-full bg-surface border border-outline-variant text-primary py-3 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download Brochure
              </button>
              <div className="mt-6 pt-6 border-t border-outline-variant">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium">Application Deadline</span>
                  <span className="font-bold text-red-500">15 May, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-surface-container-lowest border-t border-outline-variant w-full py-xl px-gutter mt-auto">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-lg">
            <div>
              <Link className="text-headline-sm font-headline-sm font-bold text-primary" href="/">
                EduVault
              </Link>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-2">© 2026 EduVault Discovery. All rights reserved.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/colleges">About Us</Link>
              <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/colleges">Terms of Service</Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/colleges">Privacy Policy</Link>
              <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/colleges">Contact Support</Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/colleges">Trust Badges</Link>
              <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/colleges">Newsletter</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // IIT Delhi details view
  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col w-full">
      {/* TopNavBar */}
      <nav className="bg-surface/95 docked full-width top-0 sticky border-b border-outline-variant backdrop-blur-md shadow-sm z-50 w-full">
        <div className="max-w-container-max mx-auto px-gutter h-16 flex justify-between items-center w-full">
          <div className="flex items-center gap-lg">
            <Link className="text-headline-md font-headline-md font-bold text-primary" href="/">
              EduVault
            </Link>
            <div className="hidden md:flex gap-sm">
              <Link className="text-label-md font-label-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors px-xs py-1 rounded" href="/colleges">
                Explore
              </Link>
              <Link className="text-label-md font-label-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors px-xs py-1 rounded" href="/compare">
                Compare
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-body-sm font-body-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none w-64 transition-all text-on-surface"
                placeholder="Search colleges..."
                type="text"
              />
            </form>
            <ThemeToggle />
            <button onClick={() => router.push("/login?tab=login")} className="text-label-md font-label-md text-secondary hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors cursor-pointer">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full bg-surface-container-lowest">
        <div className="h-64 md:h-80 w-full relative overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN2JNF7bVw2nBekfVI3ibiKjOGV7_I114JHt9PxDBvrfrYoTCiUnIPNoa7mlSm84EkQgVp-WyUMZ7vkrOrzPlZ6ZK0I1sctziaiG1Y8GNyKFaQQCdAwRS3Lfw0oiswMi0x8YJSmAjgcDrAk6Ie8TXGYpYvo8-a5-4-QKGURBR5z_uCHE7ZbffvIaelkQKUbiJrX97kXHU4zHrSw8Bzhgxo4i5AA-jvPjA8o9JxWKuHhluycWC1aShGmjjL0Qyohnd06So1aGNNd2c"
            alt="IIT Delhi Campus entrance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative -mt-16 md:-mt-24 z-10">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.1)] border border-outline-variant p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-surface flex-shrink-0 border border-outline-variant shadow-sm flex items-center justify-center p-2 bg-white">
                <span className="text-xl md:text-2xl font-extrabold text-primary">IITD</span>
              </div>
              <div className="flex flex-col gap-1 pb-1">
                <h1 className="text-2xl md:text-4xl font-extrabold text-primary">
                  Indian Institute of Technology Delhi
                </h1>
                <div className="flex items-center gap-1 flex-wrap text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>New Delhi, Delhi NCR</span>
                  <span className="mx-2 font-light">•</span>
                  <span className="bg-tertiary-container/10 text-on-tertiary-container px-2 py-0.5 rounded text-xs font-semibold border border-tertiary-container/20 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">military_tech</span>
                    Institute of Eminence
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 pb-1 w-full md:w-auto">
              <button
                onClick={handleApplyNow}
                className="w-full md:w-auto bg-secondary text-on-secondary px-8 py-3 rounded-lg font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                Apply Now
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto w-full px-6 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col gap-1 relative overflow-hidden group bg-white">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">NAAC Rating</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">A++</span>
              <span className="material-symbols-outlined text-[18px] text-emerald-500">military_tech</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col gap-1 relative overflow-hidden group bg-white">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Highest Package</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">2.05 Cr</span>
              <span className="text-on-surface-variant text-xs">/ yr</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col gap-1 relative overflow-hidden group bg-white">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">B.Tech Fees</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">8.5 L</span>
              <span className="text-on-surface-variant text-xs">Total</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col gap-1 relative overflow-hidden group bg-white">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">NIRF Rank</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">#2</span>
              <span className="text-on-surface-variant text-xs">Engineering</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-6 mt-12 flex flex-col md:flex-row gap-8 items-start pb-16">
        <div className="hidden md:flex flex-col w-64 flex-shrink-0 sticky top-[80px]">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-2 bg-white">
            <a href="#overview" className="bg-secondary-container text-on-secondary-container rounded-lg px-4 py-3 text-sm font-semibold flex items-center gap-3 transition-colors">
              <span className="material-symbols-outlined">info</span>
              Overview
            </a>
            <a href="#placements" className="text-on-surface-variant hover:bg-surface-container-low rounded-lg px-4 py-3 text-sm font-semibold flex items-center gap-3 transition-colors">
              <span className="material-symbols-outlined">work</span>
              Placements
            </a>
          </div>
        </div>

        <div className="flex-grow flex flex-col gap-12 w-full">
          {/* Overview Section */}
          <section className="scroll-mt-32" id="overview">
            <h2 className="text-xl font-bold text-primary border-b border-outline-variant pb-2 mb-6">About the Institution</h2>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] bg-white">
              <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-6">
                Indian Institute of Technology Delhi is one of the Twenty Three IITs created to be Centres of Excellence for training, research and development in science, engineering and technology in India. Established as College of Engineering in 1961, the Institute was later declared an Institution of National Importance under the "Institutes of Technology (Amendment) Act, 1963" and was renamed as "Indian Institute of Technology Delhi".
              </p>
              <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
                Recognized as an <strong>Institute of Eminence</strong> by the Government of India, IIT Delhi continues to set global benchmarks in academic excellence, cutting-edge research, and innovation. The campus spans 320 acres in the heart of the national capital, providing a vibrant ecosystem for students and researchers.
              </p>
            </div>
          </section>

          {/* Placement Highlights */}
          <section className="scroll-mt-32" id="placements">
            <h2 className="text-xl font-bold text-primary border-b border-outline-variant pb-2 mb-6">Placement Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-gradient-to-br from-primary to-inverse-surface border border-outline-variant rounded-xl p-6 md:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] relative overflow-hidden text-on-primary">
                <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-fixed-dim">Highest Package Offered</span>
                    <h3 className="text-4xl font-extrabold mt-2">₹ 2.05 Cr</h3>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim">trending_up</span>
                    <span className="text-sm text-primary-fixed">International &amp; Domestic offers included</span>
                  </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col justify-between bg-white">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Average Package</span>
                  <h3 className="text-xl font-bold text-secondary mt-2">₹ 18.5 LPA</h3>
                </div>
                <div className="mt-6 pt-6 border-t border-outline-variant">
                  <span className="text-xs text-on-surface-variant block mb-1">Placement Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-grow bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[95%]"></div>
                    </div>
                    <span className="text-xs font-bold text-primary">95%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-base font-bold text-primary mb-3">Top Recruiters</h3>
              <div className="flex flex-wrap gap-2.5">
                {["Microsoft", "Google", "Goldman Sachs", "Bain & Company", "BCG", "Jane Street", "McKinsey"].map((recruiter) => (
                  <div key={recruiter} className="bg-surface border border-outline-variant px-4 py-2 rounded-full flex items-center gap-2 shadow-sm bg-white">
                    <span className="text-sm font-semibold text-on-surface">{recruiter}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant w-full py-xl px-gutter mt-auto">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-lg">
          <div>
            <Link className="text-headline-sm font-headline-sm font-bold text-primary" href="/">
              EduVault
            </Link>
            <p className="text-body-sm font-body-sm text-on-surface-variant mt-2">© 2026 EduVault Discovery. All rights reserved.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/colleges">About Us</Link>
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/colleges">Terms of Service</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/colleges">Privacy Policy</Link>
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/colleges">Contact Support</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/colleges">Trust Badges</Link>
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" href="/colleges">Newsletter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
