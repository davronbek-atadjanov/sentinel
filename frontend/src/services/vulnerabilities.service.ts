import { api } from "@/lib/api"
import { ApiResponse, PaginatedResponse } from "@/types/backend.types"

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

const getItems = (payload: PaginatedResponse<Vulnerability>) =>
  payload.data ?? payload.results ?? [];

export const VulnerabilitiesService = {
  async getVulnerabilities(params?: Record<string, any>): Promise<PaginatedResponse<Vulnerability>> {
    const response = await api.get("/vulnerabilities/", { params: { page_size: 50, ...params } });
    return response.data;
  },

  async getAllVulnerabilities(params?: Record<string, any>): Promise<PaginatedResponse<Vulnerability>> {
    const response = await api.get("/vulnerabilities/", { params: { page_size: 50, ...params } });
    const firstPayload = response.data as PaginatedResponse<Vulnerability>;
    const items: Vulnerability[] = [...getItems(firstPayload)];
    let next = firstPayload.links?.next ?? firstPayload.next;

    while (next) {
      const nextResponse = await api.get(next);
      const nextPayload = nextResponse.data as PaginatedResponse<Vulnerability>;
      items.push(...getItems(nextPayload));
      next = nextPayload.links?.next ?? nextPayload.next;
    }

    const total = firstPayload.total_items ?? firstPayload.count ?? items.length;

    return {
      ...firstPayload,
      data: items,
      results: items,
      total_items: total,
      count: total,
      links: { next: null, previous: null },
      next: null,
      previous: null,
      total_pages: 1,
      current_page: 1,
      page_size: items.length,
    };
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
