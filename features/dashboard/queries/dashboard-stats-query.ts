import { queryOptions } from "@tanstack/react-query";
import { fetchDashboardStats } from "features/dashboard/api/fetch-dashboard-stats";

export function dashboardStatsQuery() {
  return queryOptions({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    staleTime: 30 * 1000, // 30 seconds
    placeholderData: prev => prev
  });
}

export type DashboardStats = Awaited<ReturnType<typeof fetchDashboardStats>>;
