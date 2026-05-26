"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSession, signOut } from "next-auth/react";
import { useCollegeDetail } from "@/hooks/queries/use-colleges";
import { useSaveCollege, useUnsaveCollege } from "@/hooks/queries/use-saved-colleges";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCollegeImageUrl } from "@/lib/college-image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default function CollegeDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { data: college, isLoading, error } = useCollegeDetail(slug);
  const { mutate: saveCollege } = useSaveCollege();
  const { mutate: unsaveCollege } = useUnsaveCollege();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "reviews" | "qa">("overview");

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Question Form States
  const [questionText, setQuestionText] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // Answer Form States (questionId -> answerText)
  const [activeQuestionIdForAnswer, setActiveQuestionIdForAnswer] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-md">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-body-md text-on-surface-variant animate-pulse font-bold">Loading college details...</p>
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center p-gutter">
        <span className="material-symbols-outlined text-[64px] text-error mb-sm">error</span>
        <h1 className="text-headline-md font-headline-md text-on-surface font-bold">College Not Found</h1>
        <p className="text-body-md text-on-surface-variant max-w-sm mt-xs mb-lg">
          We couldn't retrieve the details for this institution. It may have been removed or the link is broken.
        </p>
        <Link href="/colleges" className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md font-label-md font-bold hover:opacity-90 transition-all shadow-md">
          Return to Discovery
        </Link>
      </div>
    );
  }

  const handleApplyNow = () => {
    if (college.website) {
      toast.success(`Redirecting to official website for ${college.name}...`);
      window.open(college.website, "_blank");
    } else {
      toast.success("Application successfully initiated! Our advisors will contact you shortly.");
    }
  };

  const handleDownloadBrochure = () => {
    toast.success(`Brochure download started for ${college.name}!`);
  };

  const handleSaveToggle = () => {
    if (status !== "authenticated") {
      toast.error("Please sign in to save colleges.");
      router.push("/login?tab=login");
      return;
    }
    if (college.isSaved) {
      unsaveCollege(college.id);
    } else {
      saveCollege(college.id);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.error("Please sign in to write reviews.");
      router.push("/login?tab=login");
      return;
    }
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      toast.warning("Please fill out all fields.");
      return;
    }

    setIsSubmittingReview(true);
    const loadingToast = toast.loading("Submitting review...");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
          collegeId: college.id,
        }),
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error(data.error || "Failed to submit review.");
      } else {
        toast.success("Review posted successfully!");
        setReviewTitle("");
        setReviewComment("");
        queryClient.invalidateQueries({ queryKey: ["college", slug] });
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Failed to post review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.error("Please sign in to ask questions.");
      router.push("/login?tab=login");
      return;
    }
    if (!questionText.trim()) return;

    setIsSubmittingQuestion(true);
    const loadingToast = toast.loading("Posting question...");

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText,
          collegeId: college.id,
        }),
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error(data.error || "Failed to ask question.");
      } else {
        toast.success("Question posted to Q&A Board!");
        setQuestionText("");
        queryClient.invalidateQueries({ queryKey: ["college", slug] });
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Failed to post question.");
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.error("Please sign in to answer questions.");
      router.push("/login?tab=login");
      return;
    }
    if (!answerText.trim()) return;

    setIsSubmittingAnswer(true);
    const loadingToast = toast.loading("Submitting answer...");

    try {
      const res = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answerText }),
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error(data.error || "Failed to submit answer.");
      } else {
        toast.success("Answer posted successfully!");
        setAnswerText("");
        setActiveQuestionIdForAnswer(null);
        queryClient.invalidateQueries({ queryKey: ["college", slug] });
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Failed to post answer.");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Specific high quality fall-back logotype / emblem if logoUrl is broken
  const fallbackLogoText = college.name.split(" ").map((w: string) => w[0]).join("").substring(0, 3);

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

      {/* Hero Section */}
      <section className="relative w-full h-[360px] flex items-end pb-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${getCollegeImageUrl(college.slug, college.imageUrl, college.name, college.stream, college.city)}')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        <div className="relative w-full px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-10">
          <div className="flex items-end gap-6 flex-wrap md:flex-nowrap">
            <div className="w-24 h-24 bg-white rounded-xl p-2 shadow-lg border border-outline-variant flex-shrink-0 flex items-center justify-center">
              {college.logoUrl ? (
                <img
                  alt={`${college.name} Logo`}
                  className="w-full h-full object-contain rounded-lg"
                  src={college.logoUrl}
                  onError={(e) => {
                    // fall back to emblem
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="text-headline-sm font-extrabold text-primary select-none">{fallbackLogoText}</div>
              )}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Verified
                </span>
                <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-xs font-semibold capitalize">
                  {college.ownership.toLowerCase().replace("_", " ")} Institute
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-primary">{college.name}</h1>
              <p className="text-base text-on-surface-variant flex items-center gap-xs font-semibold">
                <span className="material-symbols-outlined text-[18px] text-secondary">location_on</span> {college.location}
              </p>
            </div>
          </div>
          <div className="pb-1 w-full md:w-auto flex gap-2">
            <button
              onClick={handleSaveToggle}
              className="bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low text-primary p-4 rounded-xl flex items-center justify-center shadow-md cursor-pointer transition-colors"
            >
              <span className={`material-symbols-outlined ${college.isSaved ? "text-secondary icon-fill" : ""}`}>
                {college.isSaved ? "bookmark" : "bookmark_border"}
              </span>
            </button>
            <button
              onClick={handleApplyNow}
              className="flex-grow md:flex-grow-0 bg-secondary text-on-secondary hover:opacity-90 transition-all shadow-md px-6 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              Apply Now
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="px-6 max-w-7xl mx-auto mt-4 relative z-20 mb-12">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.05)] border border-outline-variant p-2">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-outline-variant">
            <div className="p-4 flex flex-col items-center justify-center text-center group hover:bg-surface-container-low transition-colors rounded-l-lg">
              <div className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">NAAC Rating</div>
              <div className="text-2xl font-extrabold text-primary flex items-baseline gap-1">
                {college.naacGrade || "N/A"}
              </div>
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center group hover:bg-surface-container-low transition-colors">
              <div className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Highest Placement</div>
              <div className="text-2xl font-extrabold text-primary">
                {college.highestPackage ? `₹${college.highestPackage} L` : "N/A"}
              </div>
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center group hover:bg-surface-container-low transition-colors">
              <div className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Avg annual fee</div>
              <div className="text-2xl font-extrabold text-primary">
                ₹{(college.fees / 100000).toFixed(1)} L
              </div>
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center group hover:bg-surface-container-low transition-colors rounded-r-lg">
              <div className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">NIRF Ranking</div>
              <div className="text-2xl font-extrabold text-primary">#{college.nirfRank || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-outline-variant mb-lg bg-surface-container-lowest top-16 sticky z-30 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-6 flex gap-6 overflow-x-auto no-scrollbar">
          {(["overview", "courses", "reviews", "qa"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-label-md font-label-md font-bold border-b-2 transition-all cursor-pointer capitalize ${
                activeTab === tab 
                  ? "text-secondary border-secondary" 
                  : "text-on-surface-variant hover:text-primary border-transparent"
              }`}
            >
              {tab === "qa" ? "Q&A Forum" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 max-w-7xl mx-auto w-full pb-16 flex-grow">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-lg">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
                <h3 className="text-headline-sm font-headline-sm text-primary mb-md font-bold">About the Institution</h3>
                <p className="text-body-lg font-body-lg text-on-surface-variant leading-relaxed mb-md">
                  {college.overview}
                </p>
                <div className="grid grid-cols-2 gap-md border-t border-outline-variant/30 pt-md text-body-sm text-on-surface-variant">
                  <div>
                    <span className="font-bold text-on-surface block">Established</span>
                    {college.establishedYear}
                  </div>
                  <div>
                    <span className="font-bold text-on-surface block">Campus Area</span>
                    {college.campusArea || "N/A"}
                  </div>
                  <div>
                    <span className="font-bold text-on-surface block">Total Students</span>
                    {college.totalStudents ? college.totalStudents.toLocaleString() : "N/A"}
                  </div>
                  <div>
                    <span className="font-bold text-on-surface block">Total Faculty</span>
                    {college.totalFaculty ? college.totalFaculty.toLocaleString() : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Side Card: Admission Brochure */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm h-fit space-y-md">
              <h3 className="text-headline-sm font-headline-sm text-primary font-bold">Admissions 2026</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Admissions for the current academic session are now open. Download the official brochure to learn more about the schedule, eligibility criteria, and fee guidelines.
              </p>
              <button
                onClick={handleDownloadBrochure}
                className="w-full bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container text-label-md font-label-md font-bold py-3 rounded-lg flex items-center justify-center gap-xs cursor-pointer shadow-sm border border-secondary-fixed-dim/30"
              >
                <span className="material-symbols-outlined text-[20px]">download</span> Download Brochure
              </button>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-lg">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <h3 className="text-headline-sm font-headline-sm text-primary mb-md font-bold">Offered Courses</h3>
              <div className="space-y-md">
                {college.courses.length === 0 ? (
                  <p className="text-body-md text-on-surface-variant">No course details available at the moment.</p>
                ) : (
                  college.courses.map((course: any) => (
                    <div key={course.id} className="border border-outline-variant/60 rounded-lg p-md bg-surface-container-low flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
                      <div>
                        <h4 className="text-body-lg font-body-lg font-bold text-primary">{course.name}</h4>
                        <div className="flex gap-md mt-base flex-wrap text-label-sm font-label-sm text-on-surface-variant">
                          <span>Duration: <strong>{course.duration}</strong></span>
                          {course.eligibility && <span>Eligibility: <strong>{course.eligibility}</strong></span>}
                          {course.seats && <span>Seats: <strong>{course.seats}</strong></span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <span className="text-label-sm font-label-sm text-on-surface-variant">Total Fee</span>
                        <span className="text-body-lg font-body-lg font-bold text-secondary">
                          ₹{(course.fees / 100000).toFixed(1)} Lakh
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Placements info */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <h3 className="text-headline-sm font-headline-sm text-primary mb-md font-bold">Placement Records</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div className="bg-gradient-to-br from-[#091426] to-[#1e293b] text-white border border-outline-variant/30 rounded-xl p-md flex flex-col justify-between min-h-[120px]">
                  <span className="text-label-sm font-label-sm text-sky-200 uppercase tracking-wider font-semibold">Highest Package</span>
                  <span className="text-headline-lg font-headline-lg text-white font-extrabold mt-sm">
                    {college.highestPackage ? `₹${college.highestPackage} LPA` : "N/A"}
                  </span>
                </div>
                <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-md flex flex-col justify-between min-h-[120px]">
                  <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Average Package</span>
                  <span className="text-headline-lg font-headline-lg text-secondary font-extrabold mt-sm">
                    {college.averagePackage ? `₹${college.averagePackage} LPA` : "N/A"}
                  </span>
                </div>
                <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-md flex flex-col justify-between min-h-[120px]">
                  <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Placement Percentage</span>
                  <span className="text-headline-lg font-headline-lg text-tertiary-container font-bold mt-sm">
                    {college.placementPercentage ? `${college.placementPercentage}%` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="md:col-span-2 space-y-md">
              <h3 className="text-headline-sm font-headline-sm text-primary font-bold mb-sm">Student Reviews</h3>
              {college.reviews.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-center text-on-surface-variant">
                  No reviews yet. Be the first to share your experience!
                </div>
              ) : (
                college.reviews.map((review: any) => (
                  <div key={review.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md space-y-base shadow-sm">
                    <div className="flex justify-between items-center flex-wrap gap-xs">
                      <div>
                        <h4 className="text-body-lg font-body-lg font-bold text-primary">{review.title}</h4>
                        <div className="flex items-center gap-xs mt-base text-label-sm font-label-sm text-on-surface-variant">
                          <span className="bg-secondary/15 text-secondary px-2 py-0.5 rounded font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px] icon-fill">star</span> {review.rating}
                          </span>
                          <span>by <strong>{review.user.name || "Anonymous Student"}</strong></span>
                          <span>on {new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm h-fit space-y-md">
              <h3 className="text-headline-sm font-headline-sm text-primary font-bold">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-md">
                <div className="flex flex-col gap-base">
                  <label className="text-label-sm font-label-sm text-on-surface-variant">Rating</label>
                  <div className="flex items-center gap-xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-secondary hover:scale-110 transition-transform cursor-pointer"
                      >
                        <span className={`material-symbols-outlined text-[28px] ${reviewRating >= star ? "icon-fill text-secondary" : "text-outline"}`}>
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-base">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="review-title">Title</label>
                  <input
                    id="review-title"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="E.g. Great infrastructure, high fees"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-sm text-body-sm font-body-sm text-on-surface outline-none focus:border-secondary"
                  />
                </div>
                <div className="flex flex-col gap-base">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="review-comment">Comment</label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your detailed experience..."
                    required
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-sm text-body-sm font-body-sm text-on-surface outline-none focus:border-secondary resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-primary hover:opacity-90 text-on-primary text-label-md font-label-md font-bold py-3 rounded-lg flex items-center justify-center gap-xs cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmittingReview ? "Posting..." : "Post Review"}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "qa" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Questions Board */}
            <div className="md:col-span-2 space-y-md">
              <h3 className="text-headline-sm font-headline-sm text-primary font-bold mb-sm">Q&A Board</h3>
              {college.questions.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-center text-on-surface-variant">
                  No questions asked yet. Have a doubt? Ask below!
                </div>
              ) : (
                college.questions.map((q: any) => (
                  <div key={q.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md space-y-md shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-body-sm font-body-sm text-on-surface-variant font-semibold">Question</span>
                      <h4 className="text-body-lg font-body-lg font-bold text-primary mt-base">{q.question}</h4>
                      <span className="text-label-xs font-label-xs text-on-surface-variant mt-base">
                        Asked by {q.user.name || "Student"} on {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Answers list under this question */}
                    <div className="pl-md border-l-2 border-outline-variant/60 space-y-sm">
                      {q.answers.length === 0 ? (
                        <p className="text-body-sm font-body-sm text-on-surface-variant italic">No answers yet.</p>
                      ) : (
                        q.answers.map((ans: any) => (
                          <div key={ans.id} className="bg-surface-container-low/50 rounded-lg p-sm border border-outline-variant/20">
                            <p className="text-body-sm font-body-sm text-on-surface leading-relaxed">{ans.answer}</p>
                            <span className="text-label-xs font-label-xs text-on-surface-variant mt-base block">
                              Answered by {ans.user.name || "Faculty Advisor"} on {new Date(ans.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Toggle Reply box */}
                    {activeQuestionIdForAnswer === q.id ? (
                      <form onSubmit={(e) => handleAnswerSubmit(e, q.id)} className="space-y-base pt-base">
                        <textarea
                          rows={2}
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Write your answer..."
                          required
                          className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-sm text-body-sm font-body-sm text-on-surface outline-none focus:border-secondary resize-none"
                        />
                        <div className="flex gap-xs">
                          <button
                            type="submit"
                            disabled={isSubmittingAnswer}
                            className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-label-sm font-label-sm font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer"
                          >
                            Submit Answer
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveQuestionIdForAnswer(null);
                              setAnswerText("");
                            }}
                            className="text-on-surface-variant hover:text-primary px-3 py-2 text-label-sm font-label-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveQuestionIdForAnswer(q.id);
                          setAnswerText("");
                        }}
                        className="text-label-sm font-label-sm text-secondary hover:underline flex items-center gap-xs cursor-pointer font-bold"
                      >
                        <span className="material-symbols-outlined text-[16px]">reply</span> Reply to this question
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Ask a Question Form */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm h-fit space-y-md">
              <h3 className="text-headline-sm font-headline-sm text-primary font-bold">Ask a Question</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Got questions regarding cutoffs, faculty quality, hostel rules, or placement procedures? Ask the student community.
              </p>
              <form onSubmit={handleQuestionSubmit} className="space-y-md">
                <textarea
                  rows={4}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="E.g. What is the cutoff for CSE in general category?"
                  required
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-sm text-body-sm font-body-sm text-on-surface outline-none focus:border-secondary resize-none"
                />
                <button
                  type="submit"
                  disabled={isSubmittingQuestion}
                  className="w-full bg-primary hover:opacity-90 text-on-primary text-label-md font-label-md font-bold py-3 rounded-lg flex items-center justify-center gap-xs cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmittingQuestion ? "Posting..." : "Ask Question"}
                </button>
              </form>
            </div>
          </div>
        )}
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



