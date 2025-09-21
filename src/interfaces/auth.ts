export interface AuthResponse {
    message: string;
    user: AuthUser;
    token: string;
  }
  
  export interface AuthUser {
    name: string;
    email: string;
    phone?: string;
    role: string;
  }