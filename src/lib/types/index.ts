export interface AppState {
  user: {
    accessToken: string;
    refreshToken: string;
    email: string;
    roles: string[];
    onboardingComplete: boolean;
  } | null;
  email: string;
  password: string;
  success: boolean;
  error: boolean;
}
