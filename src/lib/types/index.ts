export interface AppState {
  user: {
    accessToken: string;
    refreshToken: string;
    email: string;
    roles: string[];
    onboardingStage: number;
    id: string;
  } | null;
  email: string;
  password: string;
  success: boolean;
  error: boolean;
}

export interface User {
  id?: string;
}

export interface Tag {
  id: string;
  text: string;
  parent?: Tag;
}

export interface UserProfileData {
  slug?: string;
  id?: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  timezone?: string;
  user?: User;
  skills?: Tag[];
}

export interface PostData {
  id?: string;
  user?: User;
  title?: string;
  tags?: Tag[];
  data?: string;
}
