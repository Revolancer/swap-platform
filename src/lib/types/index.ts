export interface AppState {
  user: {
    accessToken: string;
    refreshToken: string;
    email: string;
    roles: string[];
    onboardingStage: number;
  } | null;
  email: string;
  password: string;
  success: boolean;
  error: boolean;
}
