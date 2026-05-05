export interface CustomerLoginPayload {
  email: string;
  password: string;
}

// --- Shared ---
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
   user: {
    id: string;
    email: string;
  };
}

// --- Customer ---
export interface CustomerRegisterPayload {
  email: string;
  password: string;
  name?: string;
   phone?: string;
}

export interface CustomerLoginPayload {
  email: string;
  password: string;
}

export type CustomerLoginResponse = AuthTokens;
export type CustomerRegisterResponse = AuthTokens;

// --- Admin ---
export interface AdminRegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export type AdminLoginResponse = AuthTokens;
export type AdminRegisterResponse = AuthTokens;