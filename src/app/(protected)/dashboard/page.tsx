"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSession, signOut } from "next-auth/react";
import { useDashboard } from "@/hooks/queries/use-dashboard";
import { useUnsaveCollege } from "@/hooks/queries/use-saved-colleges";
import { useCompareStore } from "@/store/use-compare-store";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCollegeFallbackImageDataUri, getCollegeImageUrl } from "@/lib/college-image";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const { data: dashboard, isLoading, error } = useDashboard();
  const { mutate: unsaveCollege } = useUnsaveCollege();

  const [activeTab, setActiveTab] = useState<"saved" | "comparisons" | "activity">("saved");

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-md">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-body-md text-on-surface-variant animate-pulse font-bold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center p-gutter">
        <span className="material-symbols-outlined text-[64px] text-error mb-sm">lock</span>
        <h1 className="text-headline-md font-headline-md text-on-surface font-bold">Access Denied</h1>
        <p className="text-body-md text-on-surface-variant max-w-sm mt-xs mb-lg">
          Please sign in to view your personalized student dashboard, saved colleges, and comparisons.
        </p>
        <Link href="/login?tab=login" className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md font-label-md font-bold hover:opacity-90 transition-all shadow-md">
          Sign In Now
        </Link>
      </div>
    );
  }

  const handleUnsave = (collegeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    unsaveCollege(collegeId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
      }
    });
  };

  const handleDeleteComparison = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const loadingToast = toast.loading("Deleting comparison set...");
    try {
      const res = await fetch(`/api/user/comparisons/${id}`, {
        method: "DELETE",
      });
      toast.dismiss(loadingToast);
      if (res.ok) {
        toast.success("Comparison set deleted!");
        queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
      } else {
        toast.error("Failed to delete comparison.");
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Failed to delete comparison.");
    }
  };

  const handleLoadComparison = async (comparison: any) => {
    const loadingToast = toast.loading("Loading comparison set...");
    try {
      const promises = comparison.collegeSlugs.map(async (slug: string) => {
        const res = await fetch(`/api/colleges/${slug}`);
        if (!res.ok) return null;
        const college = await res.json();
        return {
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
      });

      const items = (await Promise.all(promises)).filter(Boolean);
      toast.dismiss(loadingToast);

      if (items.length > 0) {
        useCompareStore.setState({ comparedColleges: items });
        localStorage.setItem("eduvault_compare_z", JSON.stringify(items));
        toast.success(`Loaded "${comparison.name}" comparison set!`);
        router.push("/compare");
      } else {
        toast.error("Could not load any colleges in this comparison set.");
      }
    } catch (e) {
      toast.dismiss(loadingToast);
      toast.error("Failed to load comparison.");
    }
  };

  const studentName = dashboard?.user?.name || "Student";
  const studentEmail = dashboard?.user?.email || "";

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
              <Link className="text-label-md font-label-md text-on-surface hover:text-primary transition-colors px-xs py-1 rounded" href="/compare">
                Compare
              </Link>
              <Link className="text-label-md font-label-md text-on-surface hover:text-primary transition-colors px-xs py-1 rounded" href="/predictor">
                Rank Predictor
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <ThemeToggle />
            <button 
              onClick={() => {
                signOut({ redirect: true, callbackUrl: "/" });
                toast.success("Logged out successfully");
              }} 
              className="text-label-md font-label-md text-on-surface-variant hover:text-error px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-xl flex flex-col gap-xl">
        {/* Banner Section */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-md shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[20%] h-full bg-secondary-fixed-dim/5 rounded-full filter blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-md">
            <div className="w-16 h-16 rounded-full bg-secondary text-on-secondary text-headline-md font-extrabold flex items-center justify-center select-none shadow-sm">
              {studentName[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-headline-lg font-headline-lg text-primary font-bold">
                Welcome, {studentName}!
              </h1>
              <p className="text-body-md font-body-md text-on-surface-variant">
                {studentEmail}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-sm">
            <Link href="/colleges" className="bg-primary text-on-primary hover:opacity-90 font-bold px-5 py-2.5 rounded-lg text-label-md font-label-md shadow-sm flex items-center gap-xs cursor-pointer transition-all">
              <span className="material-symbols-outlined text-[20px]">explore</span>
              Find More Colleges
            </Link>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex items-center gap-md shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">bookmark</span>
            </div>
            <div>
              <span className="text-label-xs font-label-xs text-on-surface-variant uppercase tracking-wider block">Saved Colleges</span>
              <span className="text-headline-md font-headline-md text-on-surface font-extrabold">{dashboard?.savedColleges?.length || 0}</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex items-center gap-md shadow-sm">
            <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">compare_arrows</span>
            </div>
            <div>
              <span className="text-label-xs font-label-xs text-on-surface-variant uppercase tracking-wider block">Saved Comparisons</span>
              <span className="text-headline-md font-headline-md text-on-surface font-extrabold">{dashboard?.comparisons?.length || 0}</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex items-center gap-md shadow-sm">
            <div className="w-12 h-12 rounded-full bg-tertiary-container/10 text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">history</span>
            </div>
            <div>
              <span className="text-label-xs font-label-xs text-on-surface-variant uppercase tracking-wider block">Recent Activities</span>
              <span className="text-headline-md font-headline-md text-on-surface font-extrabold">{dashboard?.activities?.length || 0}</span>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="border-b border-outline-variant bg-surface-container-lowest shadow-sm rounded-xl p-2 flex gap-sm">
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-xs px-4 py-2.5 rounded-lg text-label-md font-label-md font-bold cursor-pointer transition-all ${
              activeTab === "saved"
                ? "bg-secondary text-on-secondary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span> Saved Colleges
          </button>
          <button
            onClick={() => setActiveTab("comparisons")}
            className={`flex items-center gap-xs px-4 py-2.5 rounded-lg text-label-md font-label-md font-bold cursor-pointer transition-all ${
              activeTab === "comparisons"
                ? "bg-secondary text-on-secondary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">compare_arrows</span> Saved Comparisons
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-xs px-4 py-2.5 rounded-lg text-label-md font-label-md font-bold cursor-pointer transition-all ${
              activeTab === "activity"
                ? "bg-secondary text-on-secondary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">history</span> Activity Log
          </button>
        </div>

        {/* Tab Canvas */}
        <div className="flex-grow">
          {activeTab === "saved" && (
            <div className="space-y-md">
              {dashboard?.savedColleges?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-2xl text-center bg-surface-container-lowest rounded-xl border border-outline-variant border-dashed">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-sm">bookmark_border</span>
                  <h3 className="text-headline-sm font-headline-sm text-on-surface font-bold">No Saved Colleges</h3>
                  <p className="text-body-md font-body-md text-on-surface-variant max-w-xs mt-xs">
                    You haven't bookmarked any universities yet. Start exploring now!
                  </p>
                  <Link href="/colleges" className="mt-md bg-primary text-on-primary px-5 py-2.5 rounded-lg text-label-md font-label-md font-bold hover:opacity-90 cursor-pointer">
                    Explore Directories
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                  {dashboard.savedColleges.map((saved: any) => {
                    const col = saved.college;
                    return (
                      <div
                        key={saved.id}
                        onClick={() => router.push(`/colleges/${col.slug}`)}
                        className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
                      >
                        <div className="h-36 bg-surface-container-highest relative">
                          <img
                            src={getCollegeImageUrl(col.slug, col.imageUrl, col.name, col.stream, col.city)}
                            alt={col.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = getCollegeFallbackImageDataUri(col.name, col.stream, col.city);
                            }}
                          />
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={(e) => handleUnsave(col.id, e)}
                              className="bg-white/95 p-1.5 rounded-full text-red-500 hover:bg-white hover:scale-105 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[20px] icon-fill">bookmark</span>
                            </button>
                          </div>
                          {col.naacGrade && (
                            <div className="absolute bottom-3 left-3">
                              <span className="bg-tertiary-container/30 text-on-tertiary-container text-label-xs font-label-xs px-2 py-0.5 rounded backdrop-blur-md border border-tertiary-container/20 font-bold">
                                NAAC {col.naacGrade}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                          <h3 className="text-body-lg font-body-lg text-primary mb-base group-hover:text-secondary transition-colors line-clamp-1 font-bold">
                            {col.name}
                          </h3>
                          <p className="text-label-sm font-label-sm text-on-surface-variant mb-md flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[16px] text-outline">location_on</span> {col.city}, {col.state}
                          </p>

                          <div className="grid grid-cols-2 gap-xs bg-surface-container-low rounded-lg p-2 mt-auto mb-md border border-outline-variant/30 text-center">
                            <div className="flex flex-col">
                              <span className="text-label-xs font-label-xs text-on-surface-variant">Fees / Yr</span>
                              <span className="text-body-sm font-body-sm text-on-surface font-bold">₹{(col.fees / 100000).toFixed(1)}L</span>
                            </div>
                            <div className="flex flex-col border-l border-outline-variant/30">
                              <span className="text-label-xs font-label-xs text-on-surface-variant">Placement Avg</span>
                              <span className="text-body-sm font-body-sm text-tertiary-container font-bold">
                                {col.averagePackage ? `₹${col.averagePackage} LPA` : "N/A"}
                              </span>
                            </div>
                          </div>

                          <Link
                            href={`/colleges/${col.slug}`}
                            className="bg-secondary text-on-secondary text-label-sm font-label-sm py-2 rounded-lg text-center font-bold hover:opacity-90 transition-all block cursor-pointer"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "comparisons" && (
            <div className="space-y-md">
              {dashboard?.comparisons?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-2xl text-center bg-surface-container-lowest rounded-xl border border-outline-variant border-dashed">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-sm">compare_arrows</span>
                  <h3 className="text-headline-sm font-headline-sm text-on-surface font-bold">No Saved Comparisons</h3>
                  <p className="text-body-md font-body-md text-on-surface-variant max-w-xs mt-xs">
                    You haven't saved any comparison matrices. Use the Compare tool to build side-by-side matrices!
                  </p>
                  <Link href="/compare" className="mt-md bg-primary text-on-primary px-5 py-2.5 rounded-lg text-label-md font-label-md font-bold hover:opacity-90 cursor-pointer">
                    Go to Compare Tool
                  </Link>
                </div>
              ) : (
                <div className="space-y-sm">
                  {dashboard.comparisons.map((comp: any) => (
                    <div
                      key={comp.id}
                      onClick={() => handleLoadComparison(comp)}
                      className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md hover:border-secondary transition-colors cursor-pointer group shadow-sm"
                    >
                      <div>
                        <h4 className="text-body-lg font-body-lg font-bold text-primary group-hover:text-secondary transition-colors">
                          {comp.name}
                        </h4>
                        <div className="flex gap-md mt-base flex-wrap text-label-xs font-label-xs text-on-surface-variant">
                          <span>Colleges: <strong>{comp.collegeSlugs.length}</strong></span>
                          <span>Saved on: <strong>{new Date(comp.createdAt).toLocaleDateString()}</strong></span>
                        </div>
                      </div>
                      <div className="flex gap-xs w-full sm:w-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadComparison(comp);
                          }}
                          className="flex-1 sm:flex-initial bg-secondary text-on-secondary px-4 py-2 rounded-lg text-label-sm font-label-sm font-bold hover:opacity-90 cursor-pointer flex items-center justify-center gap-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">compare_arrows</span> Load
                        </button>
                        <button
                          onClick={(e) => handleDeleteComparison(comp.id, e)}
                          className="bg-surface-container-lowest hover:bg-red-500/10 border border-outline-variant hover:border-red-500/20 text-red-500 px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-md">
              {dashboard?.activities?.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-center text-on-surface-variant">
                  No activities logged yet. Browse colleges to start tracking!
                </div>
              ) : (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-md">
                  <div className="border-l-2 border-outline-variant pl-4 ml-2 space-y-lg py-base">
                    {dashboard.activities.map((act: any) => {
                      let icon = "explore";
                      let color = "bg-primary/10 text-primary";
                      if (act.action === "SAVE_COLLEGE") {
                        icon = "bookmark";
                        color = "bg-secondary/10 text-secondary";
                      } else if (act.action === "VIEW_COLLEGE") {
                        icon = "visibility";
                        color = "bg-emerald-500/10 text-emerald-500";
                      }

                      return (
                        <div key={act.id} className="relative flex gap-md items-start">
                          <div className={`absolute -left-[27px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-background ${color}`}>
                            <span className="material-symbols-outlined text-[12px] icon-fill">{icon}</span>
                          </div>
                          <div>
                            <span className="text-label-xs font-label-xs text-on-surface-variant block">
                              {new Date(act.createdAt).toLocaleString()}
                            </span>
                            <p className="text-body-sm font-body-sm text-on-surface mt-base">
                              {act.action.replace("_", " ")}: <strong>{act.details || act.targetSlug}</strong>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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



