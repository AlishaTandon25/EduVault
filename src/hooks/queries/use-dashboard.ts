import { useQuery } from "@tanstack/react-query";

export function useDashboard() {
  return useQuery({
    queryKey: ["user-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/user/dashboard", { cache: "no-store" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return res.json();
    },
  });
}
