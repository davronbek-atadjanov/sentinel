import { api } from "@/lib/api"
import { ApiResponse, PaginatedResponse } from "@/types/backend.types"

export interface Notification {
  id: number;
  level: "CRITICAL" | "WARNING" | "INFO" | "SYSTEM" | "SUCCESS";
  title: string;
  description: string;
  is_read: boolean;
  meta_data: Record<string, any>;
  created_at: string;
}

export const NotificationsService = {
  async getNotifications(params?: Record<string, any>): Promise<PaginatedResponse<Notification>> {
    const response = await api.get("/notifications/", { params: { page_size: 50, ...params } });
    return response.data;
  },

  async markAllAsRead(): Promise<ApiResponse<any>> {
    const response = await api.post("/notifications/mark-read/");
    return response.data;
  },

  async getStats(): Promise<ApiResponse<any>> {
    const response = await api.get("/notifications/stats/");
    return response.data;
  },
};
