"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { ThemeProvider } from "next-themes";

export interface College {
  slug: string;
  name: string;
  location: string;
  avgFee: string;
  placement: string;
  rating: number | string;
  stream: string;
  logo?: string;
  image?: string;
  naac?: string;
  acceptance?: string;
  nirf?: string;
}

interface CompareContextType {
  comparedColleges: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  isCompared: (slug: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [comparedColleges, setComparedColleges] = useState<College[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on client side mount
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("eduvault_compare");
    if (stored) {
      try {
        setComparedColleges(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored compared colleges", e);
      }
    }
  }, []);

  // Save to localStorage whenever comparison list changes
  const saveToStorage = (list: College[]) => {
    localStorage.setItem("eduvault_compare", JSON.stringify(list));
  };

  const addToCompare = (college: College) => {
    if (comparedColleges.some((c) => c.slug === college.slug)) {
      toast.info(`${college.name} is already in the comparison list.`);
      return;
    }
    if (comparedColleges.length >= 4) {
      toast.warning("You can compare up to 4 colleges at a time.");
      return;
    }
    const newList = [...comparedColleges, college];
    setComparedColleges(newList);
    saveToStorage(newList);
    toast.success(`${college.name} added to comparison.`);
  };

  const removeFromCompare = (slug: string) => {
    const collegeToRemove = comparedColleges.find((c) => c.slug === slug);
    const newList = comparedColleges.filter((c) => c.slug !== slug);
    setComparedColleges(newList);
    saveToStorage(newList);
    if (collegeToRemove) {
      toast.info(`${collegeToRemove.name} removed from comparison.`);
    }
  };

  const clearCompare = () => {
    setComparedColleges([]);
    localStorage.removeItem("eduvault_compare");
    toast.info("Comparison list cleared.");
  };

  const isCompared = (slug: string) => {
    return comparedColleges.some((c) => c.slug === slug);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <CompareContext.Provider
        value={{
          comparedColleges,
          addToCompare,
          removeFromCompare,
          clearCompare,
          isCompared,
        }}
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </CompareContext.Provider>
    </ThemeProvider>
  );
}
