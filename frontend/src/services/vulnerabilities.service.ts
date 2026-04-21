import { api } from "@/lib/api";
import { PaginatedResponse, ApiResponse } from "@/types/backend.types";

export interface Vulnerability {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  category: string;
  affected_url: string;
  evidence: string;
  remediation: string;
  cvss_score: number | null;
  cve_id: string;
  scan: number;
  scan_target: string;
  assigned_to: number | null;
  assigned_to_email: string;
  created_at: string;
  updated_at: string;
  days_open: number;
}

export const VulnerabilitiesService = {
  async getVulnerabilities(params?: Record<string, any>): Promise<PaginatedResponse<Vulnerability>> {
    const response = await api.get("/vulnerabilities/", { params });
    return response.data;
  },

  async getVulnerability(id: number): Promise<ApiResponse<Vulnerability>> {
    const response = await api.get(`/vulnerabilities/${id}/`);
    return response.data;
  },

  async updateStatus(id: number, status: string): Promise<ApiResponse<Vulnerability>> {
    const response = await api.patch(`/vulnerabilities/${id}/`, { status });
    return response.data;
  },

  async getStats(): Promise<ApiResponse<any>> {
    const response = await api.get("/vulnerabilities/stats/");
    return response.data;
  },

  async getByCategory(): Promise<ApiResponse<any>> {
    const response = await api.get("/vulnerabilities/by-category/");
    return response.data;
  },
};
