"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { getCollegeFallbackImageDataUri, getCollegeImageUrl } from "@/lib/college-image";

interface MatchResult {
  id: string;
  collegeId: string;
  exam: string;
  minRank: number;
  maxRank: number;
  courseName?: string;
  college: {
    name: string;
    slug: string;
    city: string;
    state: string;
    fees: number;
    rating: number;
    naacGrade?: string;
    imageUrl?: string;
    averagePackage?: number;
    courses: Array<{ name: string }>;
  };
}

export const dynamic = "force-dynamic";

export default function PredictorPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedExam, setSelectedExam] = useState("JEE_MAIN");
  const [rankInput, setRankInput] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [gender, setGender] = useState("ALL");
  const [stateQuota, setStateQuota] = useState("ALL_INDIA");
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    const rank = Number(rankInput.trim());

    if (!rank || isNaN(rank) || rank <= 0) {
      toast.warning("Please enter a valid positive rank number.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    const loadingToast = toast.loading("Analyzing cutoffs and matching colleges...");

    try {
      const params = new URLSearchParams({
        exam: selectedExam,
        rank: String(rank),
        category,
        gender,
        stateQuota,
      });
      const res = await fetch(`/api/predictor?${params.toString()}`);
      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error(data.error || "Failed to fetch predictions.");
      } else {
        const flatResults = data?.all || [];
        setResults(flatResults);
        if (flatResults.length > 0) {
          toast.success(`Found ${flatResults.length} potential matches for your rank!`);
        } else {
          toast.info("No cutoffs matched this specific rank. Try exploring other exam types.");
        }
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Failed to calculate predictions.");
    } finally {
      setIsLoading(false);
    }
  };

  const getChanceLevel = (rank: number, min: number, max: number) => {
    // The closer to min rank, the safer (more likely) the chance is!
    const mid = (min + max) / 2;
    if (rank <= mid) {
      return { label: "High Chance", color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" };
    } else if (rank <= max - (max - min) * 0.15) {
      return { label: "Moderate Chance", color: "bg-amber-500/15 text-amber-500 border-amber-500/20" };
    } else {
      return { label: "Borderline Chance", color: "bg-rose-500/15 text-rose-500 border-rose-500/20" };
    }
  };

  const exams = [
    { value: "JEE_MAIN", label: "JEE Main (Engineering)" },
    { value: "JEE_ADV", label: "JEE Advanced (IITs)" },
    { value: "NEET", label: "NEET (Medical)" },
    { value: "CAT", label: "CAT (Management/MBA)" },
    { value: "CLAT", label: "CLAT (Law)" },
    { value: "NIFT", label: "NIFT (Design)" },
  ];

  const categories = ["GENERAL", "OBC", "SC", "ST", "EWS"];
  const genders = ["ALL", "MALE", "FEMALE"];
  const quotas = ["ALL_INDIA", "HOME_STATE", "OTHER_STATE"];

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
              <Link className="text-label-md font-label-md text-secondary border-b-2 border-secondary pb-1 font-bold" href="/predictor">
                Rank Predictor
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <ThemeToggle />
            {status === "authenticated" ? (
              <div className="flex items-center gap-xs">
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

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-xl flex flex-col gap-xl">
        <section className="relative rounded-2xl border border-outline-variant bg-surface-container-lowest/70 p-6 md:p-10 shadow-sm">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-label-sm font-bold uppercase tracking-wider text-secondary">College Predictor</p>
            <h1 className="mt-2 text-4xl md:text-6xl font-extrabold text-primary">Admission Rank Predictor</h1>
            <p className="mt-4 text-body-lg text-on-surface-variant">
              Enter your exam details to discover colleges with strong admission chances based on historical cutoffs.
            </p>
          </div>

          <form onSubmit={handlePredict} className="mx-auto mt-8 max-w-5xl rounded-2xl border border-outline-variant bg-surface-container-low p-5 md:p-7 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-2 lg:col-span-2">
                <label className="text-label-sm font-semibold text-on-surface-variant">Exam</label>
                <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-3">
                  {exams.map((ex) => <option key={ex.value} value={ex.value}>{ex.label}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-sm font-semibold text-on-surface-variant">Rank</label>
                <input id="rank-number" type="number" value={rankInput} onChange={(e) => setRankInput(e.target.value)} placeholder="e.g. 12000" required className="h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-3" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-sm font-semibold text-on-surface-variant">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-3">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-sm font-semibold text-on-surface-variant">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-3">
                  {genders.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2 lg:col-span-2">
                <label className="text-label-sm font-semibold text-on-surface-variant">State Quota</label>
                <select value={stateQuota} onChange={(e) => setStateQuota(e.target.value)} className="h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-3">
                  {quotas.map((q) => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-1 lg:col-start-4 flex items-end">
                <button type="submit" disabled={isLoading} className="h-12 w-full rounded-lg bg-secondary text-on-secondary font-bold hover:opacity-90 disabled:opacity-50">
                  {isLoading ? "Predicting..." : "Predict Colleges"}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Results Showcase */}
        <section className="space-y-md">
          {hasSearched && (
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h2 className="text-headline-sm font-headline-sm text-primary font-bold">
                Matching Colleges ({results.length})
              </h2>
              <span className="text-label-sm font-label-sm text-on-surface-variant">
                Rank analyzed: <strong>{Number(rankInput).toLocaleString()}</strong> in <strong>{selectedExam}</strong>
              </span>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card flex flex-col overflow-hidden animate-pulse">
                  <div className="h-40 bg-surface-variant"></div>
                  <div className="p-4 flex-grow flex flex-col gap-3">
                    <div className="h-6 bg-surface-container-high rounded w-3/4"></div>
                    <div className="h-4 bg-surface-container-high rounded w-1/2 mb-2"></div>
                    <div className="grid grid-cols-3 gap-2 bg-surface-container-low rounded-lg p-3 mt-auto mb-2">
                      <div className="h-8 bg-surface-container-high rounded w-full"></div>
                      <div className="h-8 bg-surface-container-high rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-2xl text-center bg-surface-container-lowest rounded-xl border border-outline-variant border-dashed">
              <span className="material-symbols-outlined text-[64px] text-outline mb-sm">manage_search</span>
              <h3 className="text-headline-sm font-headline-sm text-on-surface font-bold">No Colleges Matched</h3>
              <p className="text-body-md font-body-md text-on-surface-variant max-w-md mt-xs">
                Your rank falls outside the historical cutoff ranges currently recorded for this exam. Try refining your rank input or check another exam stream.
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {results.map((match) => {
                const chance = getChanceLevel(Number(rankInput), match.minRank, match.maxRank);
                return (
                  <div
                    key={match.id}
                    onClick={() => router.push(`/colleges/${match.college.slug}`)}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
                  >
                    <div className="h-40 bg-surface-container-highest relative overflow-hidden">
                      <img
                        src={getCollegeImageUrl(
                          match.college.slug,
                          match.college.imageUrl,
                          match.college.name,
                          match.college.courses?.[0]?.name,
                          match.college.city
                        )}
                        alt={match.college.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = getCollegeFallbackImageDataUri(
                            match.college.name,
                            match.college.courses?.[0]?.name,
                            match.college.city
                          );
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`border text-label-xs font-label-xs px-2.5 py-1 rounded-md backdrop-blur-md font-bold ${chance.color}`}>
                          {chance.label}
                        </span>
                      </div>
                      {match.college.naacGrade && (
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-tertiary-container/30 text-on-tertiary-container text-label-xs font-label-xs px-2 py-0.5 rounded backdrop-blur-md border border-tertiary-container/20 font-bold">
                            NAAC {match.college.naacGrade}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-headline-sm font-headline-sm text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1 font-bold">
                        {match.college.name}
                      </h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mb-4 flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[16px] text-outline">location_on</span> {match.college.city}, {match.college.state}
                      </p>

                      {/* Course target details if available */}
                      {match.courseName && (
                        <div className="mb-4 bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-body-sm text-on-surface">
                          <span className="text-label-xs font-label-xs text-on-surface-variant block mb-base">Match Target Course</span>
                          <strong>{match.courseName}</strong>
                        </div>
                      )}

                      {/* Stats Row */}
                      <div className="grid grid-cols-2 gap-2 bg-surface-container-low rounded-lg p-3 mt-auto mb-4 border border-outline-variant/40">
                        <div className="flex flex-col">
                          <span className="text-label-sm font-label-sm text-on-surface-variant">Cutoff Range</span>
                          <span className="text-label-md font-label-md text-on-surface font-bold">
                            {match.minRank.toLocaleString()} - {match.maxRank.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col border-l border-outline-variant/30 pl-2">
                          <span className="text-label-sm font-label-sm text-on-surface-variant">Placement Avg</span>
                          <span className="text-label-md font-label-md text-tertiary-container font-bold">
                            {match.college.averagePackage ? `₹${match.college.averagePackage} LPA` : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/colleges/${match.college.slug}`}
                          className="flex-1 bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container text-label-sm font-label-sm py-2.5 rounded-lg transition-all font-bold text-center cursor-pointer flex items-center justify-center"
                        >
                          View Admission Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
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




