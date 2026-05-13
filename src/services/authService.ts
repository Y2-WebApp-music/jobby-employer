import type { UserLogin, UserLoginResponse } from "@/types/userTypes";
import axios from "axios";
import apiService from "./apiService";
import { useAuthStore } from "@/store/auth";

export const apiUserLogin = (data: UserLogin) => {
  return apiService.fetchData<UserLoginResponse>({
    url: `/api/v1/authentication/login`,
    method: "post",
    data,
  });
};

export type SignInWithEmailRequest = {
  email: string;
  password: string;
};

export type SignInWithEmailResponse = {
  redirect: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    [key: string]: unknown;
  };
};

const authHttpClient = axios.create({
  timeout: 60000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// POST {{auth-service}}/api/auth-employer/sign-in/email
export const apiSignInWithEmail = async (
  data: SignInWithEmailRequest,
): Promise<{ data: SignInWithEmailResponse | null; error: unknown }> => {
  try {
    const res = await authHttpClient.post<SignInWithEmailResponse>(
      "/api/auth-employer/sign-in/email",
      data,
    );
    return { data: res.data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

// POST {{auth-service}}/api/auth-employer/sign-out
export const apiSignOut = async (): Promise<void> => {
  const token = useAuthStore.getState().getToken();
  try {
    await authHttpClient.post(
      "/api/auth-employer/sign-out",
      {},
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    );
  } catch {
    // ignore sign-out errors, clear local state anyway
  }
};
