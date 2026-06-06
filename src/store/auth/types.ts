// types.ts


export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  recaptchaToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  emailToken: string;
}


export interface UpdateProfilePayload {
  profilePic: File; // the new image file to upload
}


export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface AuthUser {
  id: string;
  username: string;
  createdAt?: string;
  email: string;
  phone?: string;
  role: string;
  authProvider?: string;
  isGoogleUser?: boolean;
  profilePic: string;
  verified?: boolean;
}



// 🔹 1. Slice for just state
export interface AuthSlice {
  authUser: AuthUser | null;
  accessToken: string | null; // ✅ move this here
  isHydrated: boolean;
  isCheckingAuth: boolean;
  isLoading: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isVerifyingEmail: boolean;
  isUpdatingProfile: boolean;
  isRequestingReset: boolean;
  isResettingPassword: boolean;


   // 🔹 Logged out state
  isLoggedOut: boolean;
  logoutReason?: "manual" | "auto" | undefined; // optional reason
}

interface SignupWithGoogleResult {
  success: boolean;
  message?: string; // optional if sometimes missing
}




// 🔹 2. Slice for just actions
export interface AuthActions {
  setAuthUser: (user: AuthUser | null) => void;
  checkAuth: () => Promise<void>;
  signup: (data: SignupPayload) => Promise<{ success: boolean; message: string }>;
  login: (data: LoginPayload) => Promise<boolean>;
  // 🔹 Updated logout signature
  logout: (reason?: "manual" | "auto") => Promise<void>;
  fetchUser: () => Promise<void>;
  verifyEmail: (data: VerifyEmailPayload) => Promise<boolean>;
  updateProfile: (data: UpdateProfilePayload) => Promise<void>;
   requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (data: ResetPasswordPayload) => Promise<boolean>;
  getAuthMethod: () => string;
  getRole: () => string;
  setAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;
  refreshAccessToken: () => Promise<string>; // ✅ add this
  signupWithGoogle: (data: { googleToken: string }) => Promise<SignupWithGoogleResult>;
}

export type AuthStoreWithPersist = AuthState & {
  persist?: {
    clearStorage: () => Promise<void> | void;
  };
};


// 🔹 3. Combine into the store type
export type AuthState = AuthSlice & AuthActions;
