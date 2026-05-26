"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useCompare } from "@/app/providers";

export default function ComparePage() {
  const router = useRouter();
  const { comparedColleges, removeFromCompare, clearCompare } = useCompare();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // We will default show IIT Delhi and BITS Pilani as comparison items if comparedColleges is empty,
  // to ensure the page is always visually gorgeous and populated as in the prototype!
  const defaultColleges = [
    {
      slug: "bits-pilani",
      name: "Birla Institute of Technology and Science",
      location: "Pilani, Rajasthan",
      stream: "B.Tech",
      nirf: "#25",
      avgFee: "₹5.8L",
      placement: "95%",
      rating: "4.7",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSguY97b6IYypoYD9dgTpt9G3aSIqhFLrjPEbk-MtKwbRWfJQliBBMy-s0twuvE_0ok5WtErcXOdwHNNH77S16Cv-Lfq8Q3JHm8HnvfAIwq5-30Yb8k2ruGhHJKBntz7aw_0uh_Y7mtQ9FKQiFfwE4xeLNSeFZUbkTPdpTrqiUDTQi05Thp-NsQUOuhpCxq-c2cGh_3rKvIdWQ3yXt0uKKwWKFxfDI7qZgc3WyJoW-H9QtAZ1bujWHKmF0j64otmdOn3HDQ-_PgO4"
    },
    {
      slug: "iit-delhi",
      name: "Indian Institute of Technology Delhi",
      location: "New Delhi, Delhi",
      stream: "B.Tech",
      nirf: "#2",
      avgFee: "₹2.5L",
      placement: "98%",
      rating: "4.9",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAN2JNF7bVw2nBekfVI3ibiKjOGV7_I114JHt9PxDBvrfrYoTCiUnIPNoa7mlSm84EkQgVp-WyUMZ7vkrOrzPlZ6ZK0I1sctziaiG1Y8GNyKFaQQCdAwRS3Lfw0oiswMi0x8YJSmAjgcDrAk6Ie8TXGYpYvo8-a5-4-QKGURBR5z_uCHE7ZbffvIaelkQKUbiJrX97kXHU4zHrSw8Bzhgxo4i5AA-jvPjA8o9JxWKuHhluycWC1aShGmjjL0Qyohnd06So1aGNNd2c"
    }
  ];

  const collegesToRender = comparedColleges.length > 0 
    ? comparedColleges.map(c => ({
        slug: c.slug,
        name: c.name,
        location: c.location,
        stream: c.stream,
        nirf: c.naac || "Verified Info",
        avgFee: c.avgFee,
        placement: c.placement,
        rating: String(c.rating),
        image: c.slug === "bits-pilani" 
          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBSguY97b6IYypoYD9dgTpt9G3aSIqhFLrjPEbk-MtKwbRWfJQliBBMy-s0twuvE_0ok5WtErcXOdwHNNH77S16Cv-Lfq8Q3JHm8HnvfAIwq5-30Yb8k2ruGhHJKBntz7aw_0uh_Y7mtQ9FKQiFfwE4xeLNSeFZUbkTPdpTrqiUDTQi05Thp-NsQUOuhpCxq-c2cGh_3rKvIdWQ3yXt0uKKwWKFxfDI7qZgc3WyJoW-H9QtAZ1bujWHKmF0j64otmdOn3HDQ-_PgO4" 
          : "https://lh3.googleusercontent.com/aida-public/AB6AXuAN2JNF7bVw2nBekfVI3ibiKjOGV7_I114JHt9PxDBvrfrYoTCiUnIPNoa7mlSm84EkQgVp-WyUMZ7vkrOrzPlZ6ZK0I1sctziaiG1Y8GNyKFaQQCdAwRS3Lfw0oiswMi0x8YJSmAjgcDrAk6Ie8TXGYpYvo8-a5-4-QKGURBR5z_uCHE7ZbffvIaelkQKUbiJrX97kXHU4zHrSw8Bzhgxo4i5AA-jvPjA8o9JxWKuHhluycWC1aShGmjjL0Qyohnd06So1aGNNd2c"
      }))
    : defaultColleges;

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
              <Link className="text-label-md font-label-md text-secondary border-b-2 border-secondary pb-1 opacity-80 transition-opacity duration-150" href="/compare">
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

      {/* Main Canvas */}
      <main className="flex-grow flex flex-col px-gutter py-md max-w-container-max mx-auto w-full">
        {/* Back Button */}
        <div className="mb-sm">
          <Link className="inline-flex items-center gap-1 text-label-sm font-label-sm text-secondary hover:underline" href="/colleges">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Explore
          </Link>
        </div>

        {/* Title */}
        <div className="flex justify-between items-end mb-lg">
          <div>
            <h1 className="text-headline-lg font-headline-lg text-primary">Compare Institutions</h1>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1">Side-by-side comparison of selected universities.</p>
          </div>
          {comparedColleges.length > 0 && (
            <button onClick={clearCompare} className="text-label-sm font-label-sm text-red-500 hover:text-red-700 font-semibold cursor-pointer">
              Clear Comparison
            </button>
          )}
        </div>

        {/* Comparison Grid / Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="p-4 text-left text-label-md font-label-md text-on-surface-variant min-w-[200px]">Comparison Factors</th>
                  {collegesToRender.map((college, idx) => (
                    <th key={college.slug + idx} className="p-4 text-left min-w-[240px] border-l border-outline-variant relative group">
                      {comparedColleges.length > 0 && (
                        <button 
                          onClick={() => removeFromCompare(college.slug)}
                          className="absolute top-2 right-2 text-on-surface-variant hover:text-red-500 cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-surface-container z-20"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      )}
                      <div className="h-28 w-full bg-surface-container-high rounded-lg overflow-hidden mb-3 border border-outline-variant/30 relative">
                        <img src={college.image} alt={college.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold">{college.stream}</span>
                      <h3 className="text-headline-sm font-headline-sm text-primary mt-2 group-hover:text-secondary transition-colors line-clamp-1">{college.name}</h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {college.location}
                      </p>
                    </th>
                  ))}
                  {/* Fill empty slots up to 4 columns */}
                  {collegesToRender.length < 4 && [...Array(4 - collegesToRender.length)].map((_, i) => (
                    <th key={i} className="p-4 text-center border-l border-outline-variant min-w-[240px] bg-surface-container-low/20">
                      <div className="flex flex-col items-center justify-center py-6 text-on-surface-variant/40">
                        <span className="material-symbols-outlined text-[32px] mb-2">add_circle_outline</span>
                        <Link className="text-label-sm font-label-sm text-secondary hover:underline" href="/colleges">
                          + Add College
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* NIRF Rank Row */}
                <tr className="border-b border-outline-variant hover:bg-surface-container-low/30 transition-colors">
                  <td className="p-4 text-label-md font-label-md text-on-surface">NIRF Ranking</td>
                  {collegesToRender.map((college, idx) => (
                    <td key={college.slug + "-nirf-" + idx} className="p-4 text-body-md font-body-md text-on-surface border-l border-outline-variant">{college.nirf}</td>
                  ))}
                  {collegesToRender.length < 4 && [...Array(4 - collegesToRender.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-outline-variant bg-surface-container-low/10"></td>
                  ))}
                </tr>
                {/* Average Fees Row */}
                <tr className="border-b border-outline-variant hover:bg-surface-container-low/30 transition-colors">
                  <td className="p-4 text-label-md font-label-md text-on-surface">Average Fees</td>
                  {collegesToRender.map((college, idx) => (
                    <td key={college.slug + "-fees-" + idx} className="p-4 text-body-md font-body-md text-on-surface border-l border-outline-variant">{college.avgFee}</td>
                  ))}
                  {collegesToRender.length < 4 && [...Array(4 - collegesToRender.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-outline-variant bg-surface-container-low/10"></td>
                  ))}
                </tr>
                {/* Placements Row */}
                <tr className="border-b border-outline-variant hover:bg-surface-container-low/30 transition-colors">
                  <td className="p-4 text-label-md font-label-md text-on-surface">Placements</td>
                  {collegesToRender.map((college, idx) => (
                    <td key={college.slug + "-placement-" + idx} className="p-4 text-body-md font-body-md text-tertiary-container font-bold border-l border-outline-variant">{college.placement}</td>
                  ))}
                  {collegesToRender.length < 4 && [...Array(4 - collegesToRender.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-outline-variant bg-surface-container-low/10"></td>
                  ))}
                </tr>
                {/* Rating Row */}
                <tr className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="p-4 text-label-md font-label-md text-on-surface">Global Rating</td>
                  {collegesToRender.map((college, idx) => (
                    <td key={college.slug + "-rating-" + idx} className="p-4 text-body-md font-body-md text-on-surface border-l border-outline-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">star</span>
                      {college.rating}
                    </td>
                  ))}
                  {collegesToRender.length < 4 && [...Array(4 - collegesToRender.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-outline-variant bg-surface-container-low/10"></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

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
