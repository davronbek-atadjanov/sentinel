import { api } from "@/lib/api"
import { ApiResponse, PaginatedResponse } from "@/types/backend.types"

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

  async generateReport(
    data: { title: string; report_type: string; scan?: number }
  ): Promise<{ blob: Blob; filename: string }> {
    const response = await api.post("/reports/", data, { responseType: "blob" });

    if (response.data.type === "application/json") {
      const text = await response.data.text();
      const errorData = JSON.parse(text);
      throw new Error(errorData.message || "Failed to generate report");
    }

    const contentDisposition = response.headers?.["content-disposition"] as string | undefined;
    let filename = "report.pdf";
    if (contentDisposition) {
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(contentDisposition);
      const rawName = match?.[1] || match?.[2];
      if (rawName) {
        filename = decodeURIComponent(rawName);
      }
    }

    return { blob: response.data, filename };
  },
  
  async downloadReport(id: number): Promise<Blob> {
    const response = await api.get(`/reports/${id}/download/`, { responseType: 'blob' });
    
    // Check if the response is actually JSON (an error) instead of a PDF Blob
    if (response.data.type === 'application/json') {
      const text = await response.data.text();
      const errorData = JSON.parse(text);
      throw new Error(errorData.message || "Failed to download report");
    }
    
    return response.data;
  }
};
