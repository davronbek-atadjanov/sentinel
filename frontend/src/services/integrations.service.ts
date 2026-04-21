import { api } from "@/lib/api";
import { Webhook, ExternalApp, WebhookDelivery, ApiResponse } from "@/types/integrations.types";

export const IntegrationsService = {
  // Webhooks
  async getWebhooks(): Promise<ApiResponse<Webhook[]>> {
    const res = await api.get("/integrations/webhooks/");
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

  async getWebhookDeliveries(webhookId: string): Promise<ApiResponse<WebhookDelivery[]>> {
    const res = await api.get(`/integrations/webhooks/${webhookId}/deliveries/`);
    return res.data;
  },

  // External Apps
  async getExternalApps(): Promise<ApiResponse<ExternalApp[]>> {
    const res = await api.get("/integrations/apps/");
    return Array.isArray(res.data) ? { success: true, data: res.data } : res.data;
  },
};
