export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  is_active: boolean;
  latest_delivery_status: { status_code: number; created_at: string } | null;
  created_at: string;
  updated_at: string;
}

export interface ExternalApp {
  id: string;
  provider: 'slack' | 'jira' | 'github' | 'teams';
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WebhookDelivery {
  id: string;
  event_type: string;
  request_payload: any;
  response_status_code: number | null;
  response_body: string | null;
  duration_ms: number | null;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
