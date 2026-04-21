import { api } from "@/lib/api";
import { PaginatedResponse, ApiResponse } from "@/types/backend.types";

export interface Report {
  id: number;
  title: string;
  report_type: string;
  status: string;
  scan: number | null;
  file: string | null;
  created_at: string;
  format?: string;
  file_size_bytes?: number;
}

export const ReportsService = {
  async getReports(params?: Record<string, any>): Promise<PaginatedResponse<Report>> {
    const response = await api.get("/reports/", { params });
    return response.data;
  },

  async getComplianceStats(): Promise<ApiResponse<any>> {
    const response = await api.get("/reports/compliance/");
    return response.data;
  },

  async generateReport(data: { title: string; report_type: string; scan?: number }): Promise<Report> {
    const response = await api.post("/reports/", data);
    return response.data;
  },
  
  async downloadReport(id: number): Promise<Blob> {
    const response = await api.get(`/reports/${id}/download/`, { responseType: 'blob' });
    return response.data;
  }
};
