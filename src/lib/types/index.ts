export interface AppState {
  user: {
    accessToken: string;
    roles: string[];
    refreshToken: string;
    email: string;
  } | null;
  email: string;
  password: string;
  success: boolean;
  error: boolean;
}
