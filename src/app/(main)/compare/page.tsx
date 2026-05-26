"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSession, signOut } from "next-auth/react";
import { useCompareStore } from "@/store/use-compare-store";
import { toast } from "sonner";
import { getCollegeFallbackImageDataUri, getCollegeImageUrl } from "@/lib/college-image";

export const dynamic = "force-dynamic";

export default function ComparePage() {
  const router = useRouter();
  const { data: statusSession, status } = useSession();
  const { comparedColleges, removeFromCompare, clearCompare } = useCompareStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [comparisonName, setComparisonName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSaveComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.error("Please sign in to save comparisons.");
      router.push("/login?tab=login");
      return;
    }
    if (comparedColleges.length === 0) {
      toast.warning("Please add some colleges to compare first.");
      return;
    }
    if (!comparisonName.trim()) {
      toast.warning("Please provide a name for this comparison set.");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Saving comparison set...");

    try {
      const res = await fetch("/api/user/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: comparisonName,
          collegeSlugs: comparedColleges.map((c) => c.slug),
        }),
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error(data.error || "Failed to save comparison.");
      } else {
        toast.success("Comparison set saved to your dashboard!");
        setShowSaveModal(false);
        setComparisonName("");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Failed to save comparison.");
    } finally {
      setIsSaving(false);
    }
  };
  const collegesToRender = comparedColleges;

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
              <Link className="text-label-md font-label-md text-on-surface hover:text-primary transition-colors px-xs py-1 rounded" href="/colleges">
                Explore
              </Link>
              <Link className="text-label-md font-label-md text-secondary border-b-2 border-secondary pb-1 font-bold" href="/compare">
                Compare
              </Link>
              <Link className="text-label-md font-label-md text-on-surface hover:text-primary transition-colors px-xs py-1 rounded" href="/predictor">
                Rank Predictor
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-body-sm font-body-sm focus:border-secondary outline-none w-64 transition-all text-on-surface"
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
          <div className="flex gap-sm">
            {comparedColleges.length > 0 && (
              <>
                <button
                  onClick={() => {
                    if (status !== "authenticated") {
                      toast.error("Please sign in to save comparisons.");
                      router.push("/login?tab=login");
                      return;
                    }
                    setShowSaveModal(true);
                  }}
                  className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-sm font-label-sm font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm"
                >
                  Save Comparison Set
                </button>
                <button onClick={clearCompare} className="text-label-sm font-label-sm text-error hover:underline font-bold cursor-pointer">
                  Clear Comparison
                </button>
              </>
            )}
          </div>
        </div>

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-2xl max-w-md w-full space-y-md">
              <h3 className="text-headline-sm font-headline-sm text-primary font-bold">Save Comparison Set</h3>
              <form onSubmit={handleSaveComparison} className="space-y-md">
                <div className="flex flex-col gap-base">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="comparison-name">Set Name</label>
                  <input
                    id="comparison-name"
                    type="text"
                    value={comparisonName}
                    onChange={(e) => setComparisonName(e.target.value)}
                    placeholder="E.g. Top IITs Comparison, Private B.Tech"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-sm text-body-sm font-body-sm text-on-surface outline-none focus:border-secondary"
                  />
                </div>
                <div className="flex gap-xs justify-end">
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(false)}
                    className="text-on-surface-variant hover:text-primary px-3 py-2 text-label-sm font-label-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-label-sm font-label-sm font-bold hover:opacity-90 disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Set"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Comparison Grid / Table */}
        <div className="glass-card overflow-hidden border border-outline-variant rounded-xl shadow-sm bg-surface-container-lowest">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="p-4 text-left text-label-md font-label-md text-on-surface-variant min-w-[200px] bg-surface-container-low">Comparison Factors</th>
                  {collegesToRender.map((college, idx) => (
                    <th key={college.slug + idx} className="p-4 text-left min-w-[240px] border-l border-outline-variant relative group bg-surface-container-lowest">
                      {comparedColleges.length > 0 && (
                        <button 
                          onClick={() => removeFromCompare(college.slug)}
                          className="absolute top-2 right-2 text-on-surface-variant hover:text-error cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-surface-container z-20"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      )}
                      <div className="h-28 w-full bg-surface-container-high rounded-lg overflow-hidden mb-3 border border-outline-variant/30 relative">
                        <img
                          src={getCollegeImageUrl(college.slug, college.image, college.name, college.stream, college.location)}
                          alt={college.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = getCollegeFallbackImageDataUri(college.name, college.stream, college.location);
                          }}
                        />
                      </div>
                      <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase">{college.stream}</span>
                      <h3 className="text-headline-sm font-headline-sm text-primary mt-2 group-hover:text-secondary transition-colors line-clamp-1 font-bold">{college.name}</h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-xs mt-1">
                        <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                        {college.location}
                      </p>
                    </th>
                  ))}
                  {/* Fill empty slots up to 4 columns */}
                  {collegesToRender.length < 4 && [...Array(4 - collegesToRender.length)].map((_, i) => (
                    <th key={i} className="p-4 text-center border-l border-outline-variant min-w-[240px] bg-surface-container-low/20">
                      <div className="flex flex-col items-center justify-center py-6 text-on-surface-variant/40">
                        <span className="material-symbols-outlined text-[32px] mb-2 text-outline">add_circle_outline</span>
                        <Link className="text-label-sm font-label-sm text-secondary hover:underline font-bold" href="/colleges">
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
                  <td className="p-4 text-label-md font-label-md text-on-surface font-semibold bg-surface-container-low">NIRF Ranking</td>
                  {collegesToRender.map((college, idx) => (
                    <td key={college.slug + "-nirf-" + idx} className="p-4 text-body-md font-body-md text-on-surface border-l border-outline-variant">
                      {college.nirf ? `#${college.nirf}` : "N/A"}
                    </td>
                  ))}
                  {collegesToRender.length < 4 && [...Array(4 - collegesToRender.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-outline-variant bg-surface-container-low/10"></td>
                  ))}
                </tr>
                {/* Average Fees Row */}
                <tr className="border-b border-outline-variant hover:bg-surface-container-low/30 transition-colors">
                  <td className="p-4 text-label-md font-label-md text-on-surface font-semibold bg-surface-container-low">Average Fees</td>
                  {collegesToRender.map((college, idx) => (
                    <td key={college.slug + "-fees-" + idx} className="p-4 text-body-md font-body-md text-on-surface border-l border-outline-variant">
                      {college.avgFee}
                    </td>
                  ))}
                  {collegesToRender.length < 4 && [...Array(4 - collegesToRender.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-outline-variant bg-surface-container-low/10"></td>
                  ))}
                </tr>
                {/* Placements Row */}
                <tr className="border-b border-outline-variant hover:bg-surface-container-low/30 transition-colors">
                  <td className="p-4 text-label-md font-label-md text-on-surface font-semibold bg-surface-container-low">Placements (Avg Package)</td>
                  {collegesToRender.map((college, idx) => (
                    <td key={college.slug + "-placement-" + idx} className="p-4 text-body-md font-body-md text-tertiary-container font-bold border-l border-outline-variant">
                      {college.placement}
                    </td>
                  ))}
                  {collegesToRender.length < 4 && [...Array(4 - collegesToRender.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-outline-variant bg-surface-container-low/10"></td>
                  ))}
                </tr>
                {/* Highest Package */}
                <tr className="border-b border-outline-variant hover:bg-surface-container-low/30 transition-colors">
                  <td className="p-4 text-label-md font-label-md text-on-surface font-semibold bg-surface-container-low">Highest Package</td>
                  {collegesToRender.map((college, idx) => (
                    <td key={college.slug + "-highest-" + idx} className="p-4 text-body-md font-body-md text-primary font-bold border-l border-outline-variant">
                      {college.highestPackage ? `₹${college.highestPackage} LPA` : "N/A"}
                    </td>
                  ))}
                  {collegesToRender.length < 4 && [...Array(4 - collegesToRender.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-outline-variant bg-surface-container-low/10"></td>
                  ))}
                </tr>
                {/* Ownership */}
                <tr className="border-b border-outline-variant hover:bg-surface-container-low/30 transition-colors">
                  <td className="p-4 text-label-md font-label-md text-on-surface font-semibold bg-surface-container-low">Ownership</td>
                  {collegesToRender.map((college, idx) => (
                    <td key={college.slug + "-ownership-" + idx} className="p-4 text-body-md font-body-md text-on-surface border-l border-outline-variant capitalize">
                      {college.ownership?.toLowerCase().replace("_", " ") || "N/A"}
                    </td>
                  ))}
                  {collegesToRender.length < 4 && [...Array(4 - collegesToRender.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-outline-variant bg-surface-container-low/10"></td>
                  ))}
                </tr>
                {/* Global Rating Row */}
                <tr className="hover:bg-surface-container-low/30 transition-colors border-b border-outline-variant">
                  <td className="p-4 text-label-md font-label-md text-on-surface font-semibold bg-surface-container-low">Global Rating</td>
                  {collegesToRender.map((college, idx) => (
                    <td key={college.slug + "-rating-" + idx} className="p-4 text-body-md font-body-md text-on-surface border-l border-outline-variant">
                      <span className="flex items-center gap-xs font-bold">
                        <span className="material-symbols-outlined text-[16px] text-secondary icon-fill">star</span>
                        {college.rating} / 5
                      </span>
                    </td>
                  ))}
                  {collegesToRender.length < 4 && [...Array(4 - collegesToRender.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-outline-variant bg-surface-container-low/10"></td>
                  ))}
                </tr>
                {/* Action CTA Row */}
                <tr>
                  <td className="p-4 text-label-md font-label-md text-on-surface font-semibold bg-surface-container-low">Actions</td>
                  {collegesToRender.map((college, idx) => (
                    <td key={college.slug + "-cta-" + idx} className="p-4 border-l border-outline-variant">
                      <Link 
                        href={`/colleges/${college.slug}`}
                        className="bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container px-4 py-2.5 rounded-lg text-label-xs font-label-xs font-bold block text-center transition-all cursor-pointer shadow-sm"
                      >
                        Apply / View Details
                      </Link>
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



