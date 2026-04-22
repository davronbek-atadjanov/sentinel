export interface PaginatedResponse<T> {
  success?: boolean;
  message?: string;
  links?: {
    next: string | null;
    previous: string | null;
  };
  total_items?: number;
  total_pages?: number;
  page_size?: number;
  current_page?: number;
  data?: T[];
  // Legacy DRF pagination fields (fallback only)
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
