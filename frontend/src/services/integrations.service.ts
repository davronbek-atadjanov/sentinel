import { api } from "@/lib/api"
import { ApiResponse, ExternalApp, Webhook, WebhookDelivery } from "@/types/integrations.types"

export const IntegrationsService = {
  // Webhooks
  async getWebhooks(params?: Record<string, any>): Promise<ApiResponse<Webhook[]>> {
    const res = await api.get("/integrations/webhooks/", { params: { page_size: 50, ...params } });
    // DRF generic list returns pagination or raw array. Let's assume pagination style or raw array wrapping.
    // Standardizing the response to our ApiResponse
    return Array.isArray(res.data) ? { success: true, data: res.data } : res.data;
  },

  async createWebhook(data: { name: string; url: string; events: string[] }): Promise<ApiResponse<Webhook>> {
    const res = await api.post("/integrations/webhooks/", data);
    return { success: true, data: res.data };
  },

  async deleteWebhook(id: string): Promise<ApiResponse<void>> {
    await api.delete(`/integrations/webhooks/${id}/`);
    return { success: true, data: undefined };
  },

  async pingWebhook(id: string): Promise<ApiResponse<{ message: string }>> {
    const res = await api.post(`/integrations/webhooks/${id}/ping/`);
    return res.data;
  },

  async getWebhookDeliveries(webhookId: string, params?: Record<string, any>): Promise<ApiResponse<WebhookDelivery[]>> {
    const res = await api.get(`/integrations/webhooks/${webhookId}/deliveries/`, { params: { page_size: 50, ...params } });
    return res.data;
  },

  // External Apps
  async getExternalApps(params?: Record<string, any>): Promise<ApiResponse<ExternalApp[]>> {
    const res = await api.get("/integrations/apps/", { params: { page_size: 50, ...params } });
    return Array.isArray(res.data) ? { success: true, data: res.data } : res.data;
  },
};
