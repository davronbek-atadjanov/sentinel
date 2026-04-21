export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  tokens: AuthTokens;
  user: User;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    username: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}
