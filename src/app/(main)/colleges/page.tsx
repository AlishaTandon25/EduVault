"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DiscoverPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
              <Link className="text-label-md font-label-md text-secondary border-b-2 border-secondary pb-1 opacity-80 transition-opacity duration-150" href="/colleges">
                Explore
              </Link>
              <Link className="text-label-md font-label-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors px-xs py-1 rounded" href="/compare">
                Compare
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-md">
            {/* Search Bar placeholder */}
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
            <button onClick={() => router.push("/login?tab=login")} className="text-label-md font-label-md text-secondary hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors cursor-pointer">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="flex-1 flex w-full max-w-container-max mx-auto px-gutter py-md gap-lg">
        {/* SideNavBar (Filters) */}
        <aside className="hidden md:flex flex-col p-4 gap-4 bg-white text-secondary h-[calc(100vh-6rem)] w-64 rounded-r-xl border-r border-outline-variant shadow-sm sticky top-24 overflow-y-auto">
          <div className="mb-sm">
            <h2 className="text-headline-sm font-headline-sm font-extrabold text-primary">Filters</h2>
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-1">Refine your search</p>
          </div>
          {/* Tab 1: Location */}
          <div className="filter-group border-b border-outline-variant pb-4 mb-2">
            <button className="w-full flex justify-between items-center text-label-md font-label-md text-on-surface hover:bg-surface-container-low p-2 rounded transition-colors group">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">location_on</span>
                <span className="">Location</span>
              </div>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <div className="pl-8 pr-2 mt-2 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
                <input className="rounded border-outline-variant text-secondary focus:ring-secondary h-4 w-4" type="checkbox"/>
                Delhi NCR
              </label>
              <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
                <input className="rounded border-outline-variant text-secondary focus:ring-secondary h-4 w-4" type="checkbox"/>
                Mumbai
              </label>
              <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
                <input className="rounded border-outline-variant text-secondary focus:ring-secondary h-4 w-4" type="checkbox"/>
                Bangalore
              </label>
            </div>
          </div>
          {/* Tab 2: Fees */}
          <div className="filter-group border-b border-outline-variant pb-4 mb-2">
            <button className="w-full flex justify-between items-center text-label-md font-label-md text-on-surface hover:bg-surface-container-low p-2 rounded transition-colors group">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">payments</span>
                <span className="">Fees (INR)</span>
              </div>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <div className="pl-8 pr-2 mt-2 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
                <input className="rounded border-outline-variant text-secondary focus:ring-secondary h-4 w-4" type="checkbox"/>
                &lt; 1 Lakh
              </label>
              <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
                <input className="rounded border-outline-variant text-secondary focus:ring-secondary h-4 w-4" type="checkbox"/>
                1L - 5L
              </label>
              <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
                <input className="rounded border-outline-variant text-secondary focus:ring-secondary h-4 w-4" type="checkbox"/>
                5L - 10L+
              </label>
            </div>
          </div>
          {/* Tab 3: Streams */}
          <div className="filter-group border-b border-outline-variant pb-4 mb-2">
            <button className="w-full flex justify-between items-center text-label-md font-label-md text-on-surface hover:bg-surface-container-low p-2 rounded transition-colors group">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">school</span>
                <span className="">Streams</span>
              </div>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <div className="pl-8 pr-2 mt-2 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
                <input defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary h-4 w-4" type="checkbox"/>
                Engineering
              </label>
              <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
                <input className="rounded border-outline-variant text-secondary focus:ring-secondary h-4 w-4" type="checkbox"/>
                Management
              </label>
              <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
                <input className="rounded border-outline-variant text-secondary focus:ring-secondary h-4 w-4" type="checkbox"/>
                Arts &amp; Science
              </label>
            </div>
          </div>
          {/* Tab 4: Ratings */}
          <div className="filter-group mb-4">
            <button className="w-full flex justify-between items-center text-label-md font-label-md text-on-surface bg-secondary-container text-on-secondary-container font-semibold rounded-lg p-2 transition-transform scale-95 group">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-secondary-container">star</span>
                <span className="">Ratings</span>
              </div>
              <span className="material-symbols-outlined text-sm">expand_less</span>
            </button>
            <div className="pl-8 pr-2 mt-2 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
                <input defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary h-4 w-4" type="checkbox"/>
                4.0 &amp; Above
              </label>
              <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
                <input className="rounded border-outline-variant text-secondary focus:ring-secondary h-4 w-4" type="checkbox"/>
                3.0 &amp; Above
              </label>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-outline-variant">
            <button className="w-full bg-primary text-on-primary text-label-md font-label-md py-3 rounded-lg hover:bg-inverse-surface transition-colors cursor-pointer">Apply Filters</button>
          </div>
        </aside>

        {/* Canvas (Listings) */}
        <div className="flex-1 flex flex-col">
          {/* Sorting & View Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-md gap-4">
            <div>
              <h1 className="text-headline-lg font-headline-lg text-primary">Top Engineering Colleges</h1>
              <p className="text-body-md font-body-md text-on-surface-variant mt-1">Showing 1-9 of 245 results</p>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant">
                <button className="p-1.5 bg-surface-container-lowest shadow-sm rounded text-primary flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">grid_view</span>
                </button>
                <button className="p-1.5 text-on-surface-variant hover:text-primary rounded flex items-center justify-center transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">view_list</span>
                </button>
              </div>
              <div className="relative">
                <select className="appearance-none bg-surface-container-lowest border border-outline-variant text-body-sm font-body-sm text-on-surface pl-4 pr-10 py-2 rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none shadow-sm cursor-pointer">
                  <option>Sort: Highest Rated</option>
                  <option>Sort: Lowest Fees</option>
                  <option>Sort: Placements</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-sm">expand_more</span>
              </div>
            </div>
          </div>

          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {/* Card 1 */}
            <div onClick={() => router.push("/colleges/iit-delhi")} className="glass-card flex flex-col overflow-hidden hover:focus-shadow transition-shadow duration-300 group cursor-pointer">
              <div className="h-40 bg-surface-container-highest relative overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN2JNF7bVw2nBekfVI3ibiKjOGV7_I114JHt9PxDBvrfrYoTCiUnIPNoa7mlSm84EkQgVp-WyUMZ7vkrOrzPlZ6ZK0I1sctziaiG1Y8GNyKFaQQCdAwRS3Lfw0oiswMi0x8YJSmAjgcDrAk6Ie8TXGYpYvo8-a5-4-QKGURBR5z_uCHE7ZbffvIaelkQKUbiJrX97kXHU4zHrSw8Bzhgxo4i5AA-jvPjA8o9JxWKuHhluycWC1aShGmjjL0Qyohnd06So1aGNNd2c" alt="IIT Delhi Campus" className="w-full h-full object-cover"/>
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="bg-surface-container-lowest/90 p-1.5 rounded-full text-on-surface-variant hover:text-secondary hover:bg-white transition-colors backdrop-blur-sm flex items-center justify-center cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="bg-tertiary-container/10 text-on-tertiary-container text-label-sm font-label-sm px-2 py-1 rounded-md backdrop-blur-md border border-tertiary-container/20 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span> NAAC A++
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-headline-sm font-headline-sm text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1">Indian Institute of Technology (IIT) Delhi</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant mb-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span> New Delhi, Delhi NCR
                </p>
                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-2 bg-surface-container-low rounded-lg p-3 mt-auto mb-4 border border-outline-variant/50">
                  <div className="flex flex-col">
                    <span className="text-label-sm font-label-sm text-on-surface-variant">Fees/Yr</span>
                    <span className="text-label-md font-label-md text-on-surface">₹2.5L</span>
                  </div>
                  <div className="flex flex-col border-l border-outline-variant/30 pl-2">
                    <span className="text-label-sm font-label-sm text-on-surface-variant">Placement</span>
                    <span className="text-label-md font-label-md text-tertiary-container font-bold">98%</span>
                  </div>
                  <div className="flex flex-col border-l border-outline-variant/30 pl-2">
                    <span className="text-label-sm font-label-sm text-on-surface-variant">Rating</span>
                    <span className="text-label-md font-label-md text-on-surface flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px] text-secondary">star</span> 4.9</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); router.push("/compare"); }} className="flex-1 bg-surface-container-lowest border border-outline-variant text-primary text-label-sm font-label-sm py-2 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-1 cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">compare_arrows</span> Compare
                  </button>
                  <button className="flex-1 bg-secondary text-on-secondary text-label-sm font-label-sm py-2 rounded-lg hover:bg-on-secondary-container transition-colors cursor-pointer">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div onClick={() => router.push("/colleges/bits-pilani")} className="glass-card flex flex-col overflow-hidden hover:focus-shadow transition-shadow duration-300 group cursor-pointer">
              <div className="h-40 bg-surface-container-highest relative overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSguY97b6IYypoYD9dgTpt9G3aSIqhFLrjPEbk-MtKwbRWfJQliBBMy-s0twuvE_0ok5WtErcXOdwHNNH77S16Cv-Lfq8Q3JHm8HnvfAIwq5-30Yb8k2ruGhHJKBntz7aw_0uh_Y7mtQ9FKQiFfwE4xeLNSeFZUbkTPdpTrqiUDTQi05Thp-NsQUOuhpCxq-c2cGh_3rKvIdWQ3yXt0uKKwWKFxfDI7qZgc3WyJoW-H9QtAZ1bujWHKmF0j64otmdOn3HDQ-_PgO4" alt="BITS Pilani Campus" className="w-full h-full object-cover"/>
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="bg-surface-container-lowest/90 p-1.5 rounded-full text-on-surface-variant hover:text-secondary hover:bg-white transition-colors backdrop-blur-sm flex items-center justify-center cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-headline-sm font-headline-sm text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1">Birla Institute of Technology and Science</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant mb-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span> Pilani, Rajasthan
                </p>
                <div className="grid grid-cols-3 gap-2 bg-surface-container-low rounded-lg p-3 mt-auto mb-4 border border-outline-variant/50">
                  <div className="flex flex-col">
                    <span className="text-label-sm font-label-sm text-on-surface-variant">Fees/Yr</span>
                    <span className="text-label-md font-label-md text-on-surface">₹5.8L</span>
                  </div>
                  <div className="flex flex-col border-l border-outline-variant/30 pl-2">
                    <span className="text-label-sm font-label-sm text-on-surface-variant">Placement</span>
                    <span className="text-label-md font-label-md text-tertiary-container font-bold">95%</span>
                  </div>
                  <div className="flex flex-col border-l border-outline-variant/30 pl-2">
                    <span className="text-label-sm font-label-sm text-on-surface-variant">Rating</span>
                    <span className="text-label-md font-label-md text-on-surface flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px] text-secondary">star</span> 4.7</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); router.push("/compare"); }} className="flex-1 bg-surface-container-lowest border border-outline-variant text-primary text-label-sm font-label-sm py-2 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-1 cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">compare_arrows</span> Compare
                  </button>
                  <button className="flex-1 bg-secondary text-on-secondary text-label-sm font-label-sm py-2 rounded-lg hover:bg-on-secondary-container transition-colors cursor-pointer">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Skeleton Placeholder */}
            <div className="glass-card flex flex-col overflow-hidden animate-pulse">
              <div className="h-40 bg-surface-variant"></div>
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div className="h-6 bg-surface-container-high rounded w-3/4"></div>
                <div className="h-4 bg-surface-container-high rounded w-1/2 mb-2"></div>
                <div className="grid grid-cols-3 gap-2 bg-surface-container-low rounded-lg p-3 mt-auto mb-2">
                  <div className="h-8 bg-surface-container-high rounded w-full"></div>
                  <div className="h-8 bg-surface-container-high rounded w-full border-l border-white pl-2"></div>
                  <div className="h-8 bg-surface-container-high rounded w-full border-l border-white pl-2"></div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="h-9 bg-surface-container-high rounded flex-1"></div>
                  <div className="h-9 bg-surface-container-high rounded flex-1"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-xl flex justify-center items-center gap-2">
            <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors flex items-center justify-center border border-transparent disabled:opacity-50 cursor-pointer" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 rounded-lg bg-secondary text-on-secondary text-label-md font-label-md flex items-center justify-center shadow-sm cursor-pointer">1</button>
            <button className="w-10 h-10 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container-low text-label-md font-label-md flex items-center justify-center transition-colors cursor-pointer">2</button>
            <button className="w-10 h-10 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container-low text-label-md font-label-md flex items-center justify-center transition-colors cursor-pointer">3</button>
            <span className="text-on-surface-variant px-2">...</span>
            <button className="w-10 h-10 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container-low text-label-md font-label-md flex items-center justify-center transition-colors cursor-pointer">28</button>
            <button className="p-2 text-on-surface hover:text-primary hover:bg-surface-container-low border border-outline-variant rounded-lg transition-colors flex items-center justify-center bg-surface-container-lowest cursor-pointer">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
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
