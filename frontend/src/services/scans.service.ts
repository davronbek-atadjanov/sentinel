import { api } from "@/lib/api";
import { PaginatedResponse, ApiResponse } from "@/types/backend.types";

export interface Scan {
  id: number;
  target_url: string;
  scan_type: string;
  status: string;
  progress: number;
  config: Record<string, any>;
  results_summary: Record<string, any>;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export const ScansService = {
  async getScans(params?: Record<string, any>): Promise<PaginatedResponse<Scan>> {
    const response = await api.get("/scans/", { params });
    return response.data;
  },

  async getScan(id: number): Promise<ApiResponse<Scan>> {
    const response = await api.get(`/scans/${id}/`);
    return response.data;
  },

  async createScan(data: { target_url: string; scan_type: string; config?: any }): Promise<Scan> {
    const response = await api.post("/scans/", data);
    return response.data;
  },

  async deleteScan(id: number): Promise<void> {
    await api.delete(`/scans/${id}/`);
  },

  async cancelScan(id: number): Promise<ApiResponse<any>> {
    const response = await api.patch(`/scans/${id}/cancel/`);
    return response.data;
  },

  async getStats(): Promise<ApiResponse<any>> {
    const response = await api.get("/scans/stats/");
    return response.data;
  },
};
