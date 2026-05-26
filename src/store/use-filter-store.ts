import { create } from "zustand";

interface FilterState {
  searchQuery: string;
  selectedState: string;
  selectedCity: string;
  selectedStream: string;
  selectedOwnership: string;
  minFees: number;
  maxFees: number;
  minRating: number;
  selectedNaac: string;
  sortBy: string;
  page: number;
  limit: number;

  setSearchQuery: (query: string) => void;
  setSelectedState: (state: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedStream: (stream: string) => void;
  setSelectedOwnership: (ownership: string) => void;
  setFeesRange: (min: number, max: number) => void;
  setMinRating: (rating: number) => void;
  setSelectedNaac: (naac: string) => void;
  setSortBy: (sort: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const initialFilters = {
  searchQuery: "",
  selectedState: "all",
  selectedCity: "all",
  selectedStream: "all",
  selectedOwnership: "all",
  minFees: 0,
  maxFees: 3000000,
  minRating: 0,
  selectedNaac: "all",
  sortBy: "nirfRank:asc",
  page: 1,
  limit: 10,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialFilters,

  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  setSelectedState: (state) => set({ selectedState: state, selectedCity: "all", page: 1 }),
  setSelectedCity: (city) => set({ selectedCity: city, page: 1 }),
  setSelectedStream: (stream) => set({ selectedStream: stream, page: 1 }),
  setSelectedOwnership: (ownership) => set({ selectedOwnership: ownership, page: 1 }),
  setFeesRange: (min, max) => set({ minFees: min, maxFees: max, page: 1 }),
  setMinRating: (rating) => set({ minRating: rating, page: 1 }),
  setSelectedNaac: (naac) => set({ selectedNaac: naac, page: 1 }),
  setSortBy: (sort) => set({ sortBy: sort, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ ...initialFilters }),
}));
