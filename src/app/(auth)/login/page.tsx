"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Sync tab with query parameters
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "signup") {
      setActiveTab("signup");
    } else {
      setActiveTab("login");
    }
  }, [searchParams]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Signing in...");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      toast.dismiss(loadingToast);

      if (res?.error) {
        toast.error(res.error || "Failed to sign in. Please try again.");
      } else {
        toast.success("Successfully signed in!");
        router.push("/colleges");
        router.refresh();
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error(data.error || "Failed to create account.");
      } else {
        toast.success("Account created successfully! Auto-logging you in...");
        
        // Auto sign-in
        const loginRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (loginRes?.error) {
          toast.info("Registration complete. Please sign in manually.");
          setActiveTab("login");
        } else {
          router.push("/colleges");
          router.refresh();
        }
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const loadingToast = toast.loading("Logging into Demo account...");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: "alisha@example.com",
        password: "password123",
      });

      toast.dismiss(loadingToast);

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Welcome back to Demo account!");
        router.push("/colleges");
        router.refresh();
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Demo login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen w-full flex items-center justify-center p-gutter relative overflow-hidden text-on-surface font-body-md">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] rounded-full bg-secondary-container opacity-20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] rounded-full bg-primary-fixed opacity-30 blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row shadow-[0px_10px_30px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden bg-surface-container-lowest z-10 border border-outline-variant">
        {/* Left Panel: Branding & Imagery */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-xl bg-surface-container-high relative overflow-hidden group">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Modern university campus building with large glass windows" 
              className="w-full h-full object-cover opacity-80 mix-blend-multiply transition-transform duration-[10s] group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI58AlkAvIsaBuy7AfYMgsgroonAOTij7de835OKxQ1clVIh8qPL0dlZ6sstEZ54CH2BMEg5WxRI-8Y_2ocTXKy8tGg1ukOkQh-805fxqIcVw3WVE6kpbvW5Pm4-_YjpWBKLKsBdmEcrMbzIux3Dr5tvmVL360IqBvROTCrkp8Qu3EpuJvrdwy1qXReCP8CHtAEf6W_E_n9OFssgMsjIXeDNaSr97gzuE5e7QCPyFOPLhr9bxfi9TxsRHB-E1A5DUoD4N1ja48hko"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent"></div>
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <Link href="/">
                <h1 className="text-headline-md font-headline-md font-extrabold text-on-primary">EduVault</h1>
              </Link>
              <p className="text-body-md font-body-md text-on-primary/80 mt-xs">Data-driven college discovery.</p>
            </div>
            <div className="glass-panel p-md rounded-lg mt-xl border-none bg-surface/10 backdrop-blur-md">
              <p className="text-body-lg font-body-lg text-on-primary italic font-light">"The clearest path to making an informed decision about my future. The data transparency is unmatched."</p>
              <div className="flex items-center mt-sm gap-xs">
                <span className="material-symbols-outlined text-tertiary-fixed-dim icon-fill">star</span>
                <span className="material-symbols-outlined text-tertiary-fixed-dim icon-fill">star</span>
                <span className="material-symbols-outlined text-tertiary-fixed-dim icon-fill">star</span>
                <span className="material-symbols-outlined text-tertiary-fixed-dim icon-fill">star</span>
                <span className="material-symbols-outlined text-tertiary-fixed-dim icon-fill">star</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Auth Form */}
        <div className="w-full md:w-1/2 p-md md:p-xl bg-surface-container-lowest flex flex-col justify-center">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="md:hidden mb-lg text-center">
            <Link href="/">
              <h1 className="text-headline-md font-headline-md font-extrabold text-primary">EduVault</h1>
            </Link>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-outline-variant mb-lg relative">
            <button 
              disabled={isLoading}
              onClick={() => setActiveTab("login")} 
              className={`w-1/2 pb-sm text-label-md font-label-md relative z-10 focus:outline-none transition-colors border-b-2 font-bold cursor-pointer ${
                activeTab === "login" 
                  ? "text-secondary border-secondary" 
                  : "text-on-surface-variant hover:text-primary border-transparent"
              }`}
            >
              Sign In
            </button>
            <button 
              disabled={isLoading}
              onClick={() => setActiveTab("signup")} 
              className={`w-1/2 pb-sm text-label-md font-label-md relative z-10 focus:outline-none transition-colors border-b-2 font-bold cursor-pointer ${
                activeTab === "signup" 
                  ? "text-secondary border-secondary" 
                  : "text-on-surface-variant hover:text-primary border-transparent"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" ? (
            <div className="flex flex-col gap-md transition-opacity duration-300">
              <div className="flex flex-col gap-xs">
                <h2 className="text-headline-sm font-headline-sm text-on-surface">Welcome back</h2>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Enter your credentials to access your dashboard.</p>
              </div>
              <form className="flex flex-col gap-md" onSubmit={handleLogin}>
                {/* Email Field */}
                <div className="flex flex-col gap-base">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">mail</span>
                    <input 
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-xl pr-sm py-sm rounded-md border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-shadow bg-surface-bright text-body-sm font-body-sm text-on-surface placeholder-on-surface-variant/50" 
                      id="email" 
                      placeholder="student@example.com" 
                      required 
                      type="email"
                    />
                  </div>
                </div>
                {/* Password Field */}
                <div className="flex flex-col gap-base">
                  <div className="flex justify-between items-center">
                    <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="password">Password</label>
                    <a className="text-label-sm font-label-sm text-secondary hover:underline" href="#">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">lock</span>
                    <input 
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-xl pr-xl py-sm rounded-md border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-shadow bg-surface-bright text-body-sm font-body-sm text-on-surface placeholder-on-surface-variant/50" 
                      id="password" 
                      placeholder="••••••••" 
                      required 
                      type={showPassword ? "text" : "password"}
                    />
                    <button 
                      disabled={isLoading}
                      className="absolute right-sm top-1/2 -translate-y-1/2 text-outline hover:text-on-surface focus:outline-none flex items-center justify-center cursor-pointer" 
                      onClick={togglePassword} 
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                </div>
                <button 
                  disabled={isLoading}
                  className="w-full bg-primary hover:opacity-90 text-on-primary text-label-md font-label-md py-sm rounded-md transition-all mt-xs flex justify-center items-center gap-xs cursor-pointer font-bold disabled:opacity-50" 
                  type="submit"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                  {!isLoading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                </button>
              </form>
              <div className="relative flex py-sm items-center">
                <div className="flex-grow border-t border-outline-variant"></div>
                <span className="flex-shrink-0 mx-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Or</span>
                <div className="flex-grow border-t border-outline-variant"></div>
              </div>
              <button 
                disabled={isLoading}
                onClick={handleDemoLogin}
                className="w-full bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container text-label-md font-label-md py-sm rounded-md transition-colors flex justify-center items-center gap-xs shadow-sm border border-secondary-fixed-dim/30 cursor-pointer font-bold disabled:opacity-50" 
                type="button"
              >
                Demo Login
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
              </button>
            </div>
          ) : (
            /* Signup Form */
            <div className="flex flex-col gap-md transition-opacity duration-300">
              <div className="flex flex-col gap-xs">
                <h2 className="text-headline-sm font-headline-sm text-on-surface">Start discovering</h2>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Create an account to save your favorite institutions.</p>
              </div>
              <form className="flex flex-col gap-md" onSubmit={handleSignup}>
                {/* Full Name Field */}
                <div className="flex flex-col gap-base">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="signup-name">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">person</span>
                    <input 
                      disabled={isLoading}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-xl pr-sm py-sm rounded-md border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-shadow bg-surface-bright text-body-sm font-body-sm text-on-surface placeholder-on-surface-variant/50" 
                      id="signup-name" 
                      placeholder="Alisha Tandon" 
                      required 
                      type="text"
                    />
                  </div>
                </div>
                {/* Email Field */}
                <div className="flex flex-col gap-base">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="signup-email">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">mail</span>
                    <input 
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-xl pr-sm py-sm rounded-md border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-shadow bg-surface-bright text-body-sm font-body-sm text-on-surface placeholder-on-surface-variant/50" 
                      id="signup-email" 
                      placeholder="student@example.com" 
                      required 
                      type="email"
                    />
                  </div>
                </div>
                {/* Password Field */}
                <div className="flex flex-col gap-base">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="signup-password">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">lock</span>
                    <input 
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-xl pr-xl py-sm rounded-md border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-shadow bg-surface-bright text-body-sm font-body-sm text-on-surface placeholder-on-surface-variant/50" 
                      id="signup-password" 
                      placeholder="••••••••" 
                      required 
                      type={showPassword ? "text" : "password"}
                    />
                  </div>
                </div>
                <button 
                  disabled={isLoading}
                  className="w-full bg-primary hover:opacity-90 text-on-primary text-label-md font-label-md py-sm rounded-md transition-all mt-xs flex justify-center items-center gap-xs cursor-pointer font-bold disabled:opacity-50" 
                  type="submit"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                  {!isLoading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
