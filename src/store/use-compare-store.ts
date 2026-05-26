import { create } from "zustand";
import { toast } from "sonner";

export interface CollegeCompareItem {
  slug: string;
  name: string;
  location: string;
  avgFee: string;
  placement: string;
  rating: string | number;
  stream: string;
  image?: string;
  naac?: string;
  nirf?: string | number;
  averagePackage?: string | number;
  highestPackage?: string | number;
  establishedYear?: string | number;
  ownership?: string;
}

interface CompareState {
  comparedColleges: CollegeCompareItem[];
  addToCompare: (college: CollegeCompareItem) => void;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  isCompared: (slug: string) => boolean;
}

const getStoredCompare = (): CollegeCompareItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("eduvault_compare_z");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

export const useCompareStore = create<CompareState>((set, get) => ({
  comparedColleges: getStoredCompare(),

  addToCompare: (college) => {
    const list = get().comparedColleges;
    if (list.some((c) => c.slug === college.slug)) {
      toast.info(`${college.name} is already in the comparison list.`);
      return;
    }
    if (list.length >= 4) {
      toast.warning("You can compare up to 4 colleges at a time.");
      return;
    }
    const newList = [...list, college];
    set({ comparedColleges: newList });
    localStorage.setItem("eduvault_compare_z", JSON.stringify(newList));
    toast.success(`${college.name} added to comparison.`);
  },

  removeFromCompare: (slug) => {
    const list = get().comparedColleges;
    const collegeToRemove = list.find((c) => c.slug === slug);
    const newList = list.filter((c) => c.slug !== slug);
    set({ comparedColleges: newList });
    localStorage.setItem("eduvault_compare_z", JSON.stringify(newList));
    if (collegeToRemove) {
      toast.info(`${collegeToRemove.name} removed from comparison.`);
    }
  },

  clearCompare: () => {
    set({ comparedColleges: [] });
    localStorage.removeItem("eduvault_compare_z");
    toast.info("Comparison list cleared.");
  },

  isCompared: (slug) => {
    return get().comparedColleges.some((c) => c.slug === slug);
  },
}));
