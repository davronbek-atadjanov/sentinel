import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, LoginResponse } from "@/types/auth.types";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: Record<string, any>) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [stateUser, setStateUser] = useState<User | null>(null);
  
  // Use React Query to fetch the user profile if authenticated
  const { data: profileResponse, isLoading: isProfileLoading, error } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: AuthService.getProfile,
    enabled: AuthService.isAuthenticated(),
    retry: false,
  });

  // In React Query, when fetching completes, isLoading becomes false immediately.
  // We derive user state directly from query data to avoid useEffect race conditions
  const user = profileResponse?.success ? profileResponse.data : stateUser;

  useEffect(() => {
    if (error) {
      console.error("Auth profile check failed:", error);
      if ((error as any).response?.status === 401 || (error as any).response?.status === 403) {
        setStateUser(null);
        // Force clear on persistent auth error
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
  }, [error]);

  const login = async (credentials: Record<string, any>) => {
    try {
      const res = await AuthService.login(credentials);
      if (res.success && res.user) {
        setStateUser(res.user);
        toast.success("Successfully logged in");
      }
      return res;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(msg);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Server logout failed", error);
    } finally {
      setStateUser(null);
      toast.info("Logged out successfully");
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isProfileLoading,
        login,
        logout,
        isAuthenticated: !!user || (AuthService.isAuthenticated() && isProfileLoading),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
