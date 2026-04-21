import { api } from "@/lib/api";
import { ApiResponse } from "@/types/backend.types";

export interface DashboardOverviewData {
  security_score: number;
  compliance_score: number;
  total_scans: number;
  active_scans: number;
  completed_scans: number;
  total_vulnerabilities: number;
  open_vulnerabilities: number;
  resolved_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  total_assets: number;
  severity_distribution: Record<string, number>;
  recent_activity: any[];
  threat_trajectory: any[];
}

export const DashboardService = {
  async getOverview(): Promise<ApiResponse<DashboardOverviewData>> {
    const response = await api.get("/dashboard/overview/");
    return response.data;
  },
};
