import { api } from "@/lib/api";
import { PaginatedResponse, ApiResponse } from "@/types/backend.types";

export interface Asset {
  id: number;
  name: string;
  url: string;
  asset_type: string;
  is_active: boolean;
  last_scan: string | null;
  risk_score: number;
  technologies: string[];
  metadata: Record<string, any>;
  scan_count: number;
  created_at: string;
}

export const AssetsService = {
  async getAssets(params?: Record<string, any>): Promise<PaginatedResponse<Asset>> {
    const response = await api.get("/assets/", { params });
    return response.data;
  },

  async getAsset(id: number): Promise<ApiResponse<Asset>> {
    const response = await api.get(`/assets/${id}/`);
    return response.data;
  },

  async createAsset(data: { name: string; url: string; asset_type?: string }): Promise<Asset> {
    const response = await api.post("/assets/", data);
    return response.data;
  },

  async updateAsset(id: number, data: Partial<Asset>): Promise<Asset> {
    const response = await api.patch(`/assets/${id}/`, data);
    return response.data;
  },

  async getAttackSurface(): Promise<ApiResponse<any>> {
    const response = await api.get("/assets/attack-surface/");
    return response.data;
  },
};
