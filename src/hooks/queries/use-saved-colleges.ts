import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSavedColleges() {
  return useQuery({
    queryKey: ["saved-colleges"],
    queryFn: async () => {
      const res = await fetch("/api/user/saved-colleges", { cache: "no-store" });
      if (res.status === 401) return []; // Return empty array if not authenticated
      if (!res.ok) throw new Error("Failed to fetch saved colleges");
      return res.json();
    },
  });
}

export function useSaveCollege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collegeId: string) => {
      const res = await fetch("/api/user/saved-colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save college");
      }
      return res.json();
    },
    onSuccess: (data, collegeId) => {
      toast.success("College saved to your list!");
      queryClient.invalidateQueries({ queryKey: ["saved-colleges"] });
      queryClient.invalidateQueries({ queryKey: ["college"] }); // Invalidate single college query too
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save college. Make sure you are signed in.");
    },
  });
}

export function useUnsaveCollege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collegeId: string) => {
      const res = await fetch(`/api/user/saved-colleges?collegeId=${collegeId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to unsave college");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("College removed from saved list!");
      queryClient.invalidateQueries({ queryKey: ["saved-colleges"] });
      queryClient.invalidateQueries({ queryKey: ["college"] }); // Invalidate single college query too
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove college.");
    },
  });
}
