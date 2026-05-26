import { useQuery } from "@tanstack/react-query";

interface UseCollegesFilters {
  search?: string;
  state?: string;
  city?: string;
  stream?: string;
  ownership?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  naacGrade?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export function useColleges(filters: UseCollegesFilters = {}) {
  return useQuery({
    queryKey: ["colleges", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          params.append(key, String(val));
        }
      });

      const res = await fetch(`/api/colleges?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch colleges");
      return res.json();
    },
  });
}

export function useCollegeDetail(slug: string) {
  return useQuery({
    queryKey: ["college", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`/api/colleges/${slug}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch college detail");
      return res.json();
    },
    enabled: !!slug,
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ["search-suggestions", query],
    queryFn: async () => {
      if (!query || query.trim().length < 2) {
        return { suggestions: [], popular: [] };
      }
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch search suggestions");
      return res.json();
    },
    enabled: query.trim().length >= 2,
    staleTime: 60 * 1000, // 1 minute
  });
}
