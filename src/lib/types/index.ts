export interface AppState {
  user: {
    accessToken: string;
    refreshToken: string;
    email: string;
    roles: string[];
    license: {
      active: boolean;
      expires: number;
      type: string;
      source: string;
    };
  } | null;
  email: string;
  password: string;
  success: boolean;
  error: boolean;
}
