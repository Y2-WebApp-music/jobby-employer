import { createAuthClient } from "better-auth/client";
import { useAuthStore } from "@/store/auth";
import { apiGetCompanyIdByUserId } from "@/services/profileService";

const COMPANY_ID_STORAGE_KEY = "company_id";

const raw = import.meta.env.VITE_BETTER_AUTH_URL ?? "";
const proxyTarget = (
  import.meta.env.VITE_BETTER_AUTH_PROXY_TARGET ?? ""
).trim();
const normalizedProxyTarget = proxyTarget.replace(/\/+$/, "");
const baseURL = raw.startsWith("/")
  ? normalizedProxyTarget
    ? `${normalizedProxyTarget}${raw}`
    : `${window.location.origin}${raw}`
  : raw;

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
});

export const clearAuthStore = () => {
  useAuthStore.getState().logout();
  window.localStorage.removeItem(COMPANY_ID_STORAGE_KEY);
};

export const hydrateCompanyIdFromUserId = async (userId: string) => {
  if (!userId) {
    window.localStorage.removeItem(COMPANY_ID_STORAGE_KEY);
    return;
  }

  try {
    const result = await apiGetCompanyIdByUserId(userId);
    const companyId = result.data?.company_id;
    if (companyId) {
      window.localStorage.setItem(COMPANY_ID_STORAGE_KEY, companyId);
      return;
    }
  } catch {
    // Ignore fetch errors and clear stale company id.
  }

  window.localStorage.removeItem(COMPANY_ID_STORAGE_KEY);
};

type AuthHydrationPayload = {
  data?: AuthHydrationPayload;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    permissions?: string[] | null;
  };
  token?: string | null;
  session?: {
    token?: string | null;
  };
};

export const hydrateAuthStoreFromPayload = (payload: unknown) => {
  const payloadData = payload as AuthHydrationPayload;
  const data = payloadData.data ?? payloadData;
  const user = data?.user;
  const token = data?.token ?? data?.session?.token ?? null;

  if (!user) {
    return false;
  }

  useAuthStore.getState().setUser({
    id: user.id,
    name: user.name ?? user.email ?? "User",
    email: user.email ?? "",
    role: user.role ?? "user",
    permissions: Array.isArray(user.permissions) ? user.permissions : [],
  });
  useAuthStore.getState().setToken(token);
  return true;
};

export const hydrateAuthStoreFromSession = async () => {
  try {
    const sessionResult = (await authClient.getSession()) as unknown;
    const hydrated = hydrateAuthStoreFromPayload(sessionResult);
    if (!hydrated) {
      const { user, token } = useAuthStore.getState();
      if (!user && !token) {
        clearAuthStore();
      }
    }
  } catch {
    const { user, token } = useAuthStore.getState();
    if (!user && !token) {
      clearAuthStore();
    }
  }
};
