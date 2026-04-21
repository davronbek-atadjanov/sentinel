import { api } from "@/lib/api";
import { 
  AuthTokens, 
  LoginResponse, 
  ProfileResponse, 
  RegistrationResponse 
} from "@/types/auth.types";

export const AuthService = {
  /**
   * Register a new user
   */
  async register(data: Record<string, any>): Promise<RegistrationResponse> {
    const response = await api.post("/auth/register/", data);
    const payload = response.data?.data;
    
    if (payload?.access) {
      localStorage.setItem("accessToken", payload.access);
      localStorage.setItem("refreshToken", payload.refresh);
    }

    return {
      success: response.data?.success,
      message: response.data?.message,
      data: payload?.user || payload,
      tokens: payload?.access ? { access: payload.access, refresh: payload.refresh } : undefined
    } as any;
  },

  /**
   * Login with email and password
   */
  async login(data: Record<string, any>): Promise<LoginResponse> {
    const response = await api.post("/auth/login/", data);
    const payload = response.data?.data;
    
    // Save tokens if successful (backend sends them inside data: { access, refresh })
    if (payload?.access) {
      localStorage.setItem("accessToken", payload.access);
      localStorage.setItem("refreshToken", payload.refresh);
    }
    
    // Repackage to match LoginResponse interface
    return {
      success: response.data?.success,
      message: response.data?.message,
      user: payload?.user || payload,
      tokens: payload?.access ? { access: payload.access, refresh: payload.refresh } : undefined
    } as any;
  },

  /**
   * Logout user globally and locally
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/auth/logout/", { refresh: refreshToken });
      }
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await api.get("/auth/me/");
    return response.data;
  },

  /**
   * Update profile
   */
  async updateProfile(data: Record<string, any>): Promise<ProfileResponse> {
    const response = await api.patch("/auth/me/", data);
    return response.data;
  },
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  }
};
