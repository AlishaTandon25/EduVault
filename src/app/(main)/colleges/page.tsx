"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSession, signOut } from "next-auth/react";
import { useFilterStore } from "@/store/use-filter-store";
import { useColleges } from "@/hooks/queries/use-colleges";
import { useSaveCollege, useUnsaveCollege, useSavedColleges } from "@/hooks/queries/use-saved-colleges";
import { useCompareStore } from "@/store/use-compare-store";
import { toast } from "sonner";
import { getCollegeFallbackImageDataUri, getCollegeImageUrl } from "@/lib/college-image";

export const dynamic = "force-dynamic";

export default function DiscoverPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Zustand Store
  const {
    searchQuery,
    selectedState,
    selectedCity,
    selectedStream,
    selectedOwnership,
    minFees,
    maxFees,
    minRating,
    sortBy,
    page,
    limit,
    setSearchQuery,
    setSelectedState,
    setSelectedCity,
    setSelectedStream,
    setSelectedOwnership,
    setFeesRange,
    setMinRating,
    setSortBy,
    setPage,
    resetFilters,
  } = useFilterStore();

  // Sync search query from URL parameter if present
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams, setSearchQuery]);

  // Local state for search input text
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Sync searchInput when searchQuery store changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Fetch data
  const { data, isLoading, error } = useColleges({
    search: searchQuery,
    state: selectedState,
    city: selectedCity,
    stream: selectedStream,
    ownership: selectedOwnership,
    minFees,
    maxFees,
    minRating,
    sort: sortBy,
    page,
    limit,
  });

  const { data: savedList } = useSavedColleges();
  const { mutate: saveCollege } = useSaveCollege();
  const { mutate: unsaveCollege } = useUnsaveCollege();

  // Zustand Compare Store
  const { addToCompare, removeFromCompare, isCompared } = useCompareStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const isSaved = (collegeId: string) => {
    return savedList?.some((s: any) => s.collegeId === collegeId) || false;
  };

  const toggleSave = (collegeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (status !== "authenticated") {
      toast.error("Please sign in to save colleges.");
      router.push("/login?tab=login");
      return;
    }
    if (isSaved(collegeId)) {
      const savedItem = savedList?.find((s: any) => s.collegeId === collegeId);
      if (savedItem) {
        unsaveCollege(collegeId);
      }
    } else {
      saveCollege(collegeId);
    }
  };

  const handleCompareToggle = (college: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const compareItem = {
      slug: college.slug,
      name: college.name,
      location: college.location,
      avgFee: `₹${(college.fees / 100000).toFixed(1)}L/yr`,
      placement: college.averagePackage ? `₹${college.averagePackage} LPA` : "N/A",
      rating: college.rating,
      stream: college.stream,
      image: college.imageUrl || undefined,
      naac: college.naacGrade || undefined,
      nirf: college.nirfRank || undefined,
      averagePackage: college.averagePackage || undefined,
      highestPackage: college.highestPackage || undefined,
      establishedYear: college.establishedYear || undefined,
      ownership: college.ownership || undefined,
    };

    if (isCompared(college.slug)) {
      removeFromCompare(college.slug);
    } else {
      addToCompare(compareItem);
    }
  };

  const states = [
    "Delhi", "Karnataka", "Tamil Nadu", "Maharashtra", "Rajasthan",
    "West Bengal", "Gujarat", "Uttar Pradesh", "Telangana", "Punjab",
    "Chandigarh", "Puducherry", "Jharkhand", "Madhya Pradesh"
  ];

  const streams = ["ENGINEERING", "MEDICAL", "MBA", "LAW", "DESIGN"];
  const ownerships = ["GOVERNMENT", "PRIVATE", "PUBLIC_PRIVATE"];

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
              <Link className="text-label-md font-label-md text-secondary border-b-2 border-secondary pb-1 font-bold" href="/colleges">
                Explore
              </Link>
              <Link className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors px-xs py-1 rounded" href="/compare">
                Compare
              </Link>
              <Link className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors px-xs py-1 rounded" href="/predictor">
                Rank Predictor
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-body-sm font-body-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none w-64 transition-all text-on-surface"
                placeholder="Search colleges..."
                type="text"
              />
            </form>
            <ThemeToggle />
            {status === "authenticated" ? (
              <div className="flex items-center gap-xs">
                <Link href="/dashboard" className="text-label-md font-label-md bg-secondary text-on-secondary px-4 py-2 rounded-lg hover:opacity-90 transition-all font-bold">
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    signOut({ redirect: false });
                    toast.success("Logged out successfully");
                  }} 
                  className="text-label-md font-label-md text-on-surface-variant hover:text-error px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login?tab=login" className="text-label-md font-label-md bg-primary text-on-primary hover:opacity-90 px-4 py-2 rounded-lg transition-all font-bold">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="flex-grow flex w-full max-w-container-max mx-auto px-gutter py-md gap-lg">
        {/* SideNavBar Filters */}
        <aside className="hidden md:flex flex-col p-5 gap-5 bg-surface-container-lowest text-secondary h-[calc(100vh-6rem)] w-72 rounded-xl border border-outline-variant shadow-sm sticky top-24 overflow-y-auto">
          <div className="flex justify-between items-center border-b border-outline-variant pb-3">
            <div>
              <h2 className="text-headline-sm font-headline-sm font-bold text-primary">Filters</h2>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Refine your search</p>
            </div>
            <button onClick={resetFilters} className="text-label-sm font-label-sm text-secondary hover:underline font-bold cursor-pointer">
              Reset All
            </button>
          </div>

          {/* Search Mobile/Fallback */}
          <div className="flex flex-col gap-base lg:hidden">
            <label className="text-label-sm font-label-sm text-on-surface font-semibold">Search Query</label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm font-body-sm focus:border-secondary outline-none text-on-surface"
                placeholder="Search..."
                type="text"
              />
            </form>
          </div>

          {/* Stream Filter */}
          <div className="flex flex-col gap-base">
            <label className="text-label-sm font-label-sm text-on-surface font-semibold flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px] text-primary">school</span> Stream
            </label>
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="bg-surface-container-low border border-outline-variant text-body-sm font-body-sm text-on-surface p-2 rounded-lg focus:border-secondary outline-none cursor-pointer"
            >
              <option value="all">All Streams</option>
              {streams.map((s) => (
                <option key={s} value={s.toLowerCase()}>{s}</option>
              ))}
            </select>
          </div>

          {/* Location State Filter */}
          <div className="flex flex-col gap-base">
            <label className="text-label-sm font-label-sm text-on-surface font-semibold flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px] text-primary">location_on</span> State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-surface-container-low border border-outline-variant text-body-sm font-body-sm text-on-surface p-2 rounded-lg focus:border-secondary outline-none cursor-pointer"
            >
              <option value="all">All States</option>
              {states.map((st) => (
                <option key={st} value={st.toLowerCase()}>{st}</option>
              ))}
            </select>
          </div>

          {/* Ownership Filter */}
          <div className="flex flex-col gap-base">
            <label className="text-label-sm font-label-sm text-on-surface font-semibold flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px] text-primary">business</span> Ownership
            </label>
            <select
              value={selectedOwnership}
              onChange={(e) => setSelectedOwnership(e.target.value)}
              className="bg-surface-container-low border border-outline-variant text-body-sm font-body-sm text-on-surface p-2 rounded-lg focus:border-secondary outline-none cursor-pointer"
            >
              <option value="all">All Ownerships</option>
              {ownerships.map((o) => (
                <option key={o} value={o.toLowerCase()}>{o.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          {/* Fees Filter */}
          <div className="flex flex-col gap-base">
            <div className="flex justify-between items-center">
              <label className="text-label-sm font-label-sm text-on-surface font-semibold flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px] text-primary">payments</span> Max Fees / Yr
              </label>
              <span className="text-label-sm font-label-sm text-secondary font-bold">
                {maxFees >= 3000000 ? "Any" : `₹${(maxFees / 100000).toFixed(1)}L`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3000000"
              step="50000"
              value={maxFees}
              onChange={(e) => setFeesRange(0, Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex flex-col gap-base">
            <div className="flex justify-between items-center">
              <label className="text-label-sm font-label-sm text-on-surface font-semibold flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px] text-primary">star</span> Min Rating
              </label>
              <span className="text-label-sm font-label-sm text-secondary font-bold">
                {minRating === 0 ? "Any" : `${minRating}★+`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer"
            />
          </div>
        </aside>

        {/* Listings Canvas */}
        <div className="flex-grow flex flex-col">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-md gap-4">
            <div>
              <h1 className="text-headline-lg font-headline-lg text-primary capitalize">
                {selectedStream === "all" ? "All Discovery Colleges" : `${selectedStream} Colleges`}
              </h1>
              <p className="text-body-md font-body-md text-on-surface-variant mt-1">
                {isLoading ? "Searching colleges..." : `Found ${data?.total || 0} colleges`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-surface-container-lowest border border-outline-variant text-body-sm font-body-sm text-on-surface pl-4 pr-10 py-2 rounded-lg focus:border-secondary outline-none shadow-sm cursor-pointer"
                >
                  <option value="nirfRank:asc">Sort: NIRF Ranking</option>
                  <option value="fees:asc">Sort: Fees (Low to High)</option>
                  <option value="fees:desc">Sort: Fees (High to Low)</option>
                  <option value="rating:desc">Sort: Rating</option>
                  <option value="establishedYear:desc">Sort: Established Year</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-sm">expand_more</span>
              </div>
            </div>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-md">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card flex flex-col overflow-hidden animate-pulse">
                  <div className="h-40 bg-surface-variant"></div>
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="h-6 bg-surface-container-high rounded w-3/4"></div>
                    <div className="h-4 bg-surface-container-high rounded w-1/2 mb-2"></div>
                    <div className="grid grid-cols-3 gap-2 bg-surface-container-low rounded-lg p-3 mt-auto mb-2">
                      <div className="h-8 bg-surface-container-high rounded w-full"></div>
                      <div className="h-8 bg-surface-container-high rounded w-full pl-2"></div>
                      <div className="h-8 bg-surface-container-high rounded w-full pl-2"></div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div className="h-9 bg-surface-container-high rounded flex-1"></div>
                      <div className="h-9 bg-surface-container-high rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && data?.data?.length === 0 && (
            <div className="flex-grow flex flex-col items-center justify-center py-2xl text-center bg-surface-container-lowest rounded-xl border border-outline-variant border-dashed">
              <span className="material-symbols-outlined text-[64px] text-outline mb-sm">school</span>
              <h3 className="text-headline-sm font-headline-sm text-on-surface font-bold">No Colleges Found</h3>
              <p className="text-body-md font-body-md text-on-surface-variant max-w-sm mt-xs">
                We couldn't find any institutions matching your search criteria. Try adjusting your filters.
              </p>
              <button onClick={resetFilters} className="mt-md bg-primary text-on-primary px-5 py-2.5 rounded-lg text-label-md font-label-md font-bold hover:opacity-90 transition-all cursor-pointer">
                Clear Filters
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {!isLoading && data?.data && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-md">
              {data.data.map((college: any) => (
                <div
                  key={college.id}
                  onClick={() => router.push(`/colleges/${college.slug}`)}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all group cursor-pointer"
                >
                  <div className="h-40 bg-surface-container-highest relative overflow-hidden">
                    <img
                      src={getCollegeImageUrl(college.slug, college.imageUrl, college.name, college.stream, college.city)}
                      alt={college.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = getCollegeFallbackImageDataUri(college.name, college.stream, college.city);
                      }}
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={(e) => toggleSave(college.id, e)}
                        className="bg-surface-container-lowest/90 p-1.5 rounded-full text-on-surface-variant hover:text-secondary hover:bg-white transition-all backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-sm"
                      >
                        <span className={`material-symbols-outlined text-[20px] ${isSaved(college.id) ? "text-secondary icon-fill" : ""}`}>
                          {isSaved(college.id) ? "bookmark" : "bookmark_border"}
                        </span>
                      </button>
                    </div>
                    {college.naacGrade && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-tertiary-container/30 text-on-tertiary-container text-label-sm font-label-sm px-2 py-0.5 rounded-md backdrop-blur-md border border-tertiary-container/20 font-bold">
                          NAAC {college.naacGrade}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-headline-sm font-headline-sm text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1">
                      {college.name}
                    </h3>
                    <p className="text-body-sm font-body-sm text-on-surface-variant mb-4 flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px] text-outline">location_on</span> {college.city}, {college.state}
                    </p>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2 bg-surface-container-low rounded-lg p-3 mt-auto mb-4 border border-outline-variant/40">
                      <div className="flex flex-col">
                        <span className="text-label-sm font-label-sm text-on-surface-variant">Fees / Yr</span>
                        <span className="text-label-md font-label-md text-on-surface font-bold">₹{(college.fees / 100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex flex-col border-l border-outline-variant/30 pl-2">
                        <span className="text-label-sm font-label-sm text-on-surface-variant">Placement</span>
                        <span className="text-label-md font-label-md text-tertiary-container font-bold">
                          {college.placementPercentage ? `${college.placementPercentage}%` : "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col border-l border-outline-variant/30 pl-2">
                        <span className="text-label-sm font-label-sm text-on-surface-variant">Rating</span>
                        <span className="text-label-md font-label-md text-on-surface flex items-center gap-0.5 font-bold">
                          <span className="material-symbols-outlined text-[14px] text-secondary icon-fill">star</span> {college.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleCompareToggle(college, e)}
                        className={`flex-1 border text-label-sm font-label-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-xs cursor-pointer ${
                          isCompared(college.slug)
                            ? "bg-secondary text-on-secondary border-secondary"
                            : "bg-surface-container-lowest border-outline-variant text-primary hover:bg-surface-container-low"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">{isCompared(college.slug) ? "done" : "compare_arrows"}</span>
                        {isCompared(college.slug) ? "Compared" : "Compare"}
                      </button>
                      <button className="flex-1 bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container text-label-sm font-label-sm py-2 rounded-lg transition-all cursor-pointer font-bold flex items-center justify-center">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && data?.totalPages > 1 && (
            <div className="mt-xl flex justify-center items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors border border-outline-variant disabled:opacity-50 cursor-pointer bg-surface-container-lowest"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {[...Array(data.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-label-md font-label-md flex items-center justify-center transition-colors cursor-pointer ${
                    page === i + 1
                      ? "bg-secondary text-on-secondary font-bold shadow-sm"
                      : "bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container-low"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                disabled={page === data.totalPages}
                className="p-2 text-on-surface hover:text-primary hover:bg-surface-container-low border border-outline-variant rounded-lg transition-colors flex items-center justify-center bg-surface-container-lowest cursor-pointer"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
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
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-all" href="/colleges">About Us</Link>
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Terms of Service</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Privacy Policy</Link>
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Contact Support</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Trust Badges</Link>
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Newsletter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}



