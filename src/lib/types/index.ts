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
      card_status: string;
    };
  } | null;
  email: string;
  password: string;
  success: boolean;
  error: boolean;
}
