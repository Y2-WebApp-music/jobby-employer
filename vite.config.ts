import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const betterAuthProxyTarget = (env.VITE_BETTER_AUTH_PROXY_TARGET ?? "").trim();
  const appBaseURL = (env.VITE_APP_BASE_URL ?? "").trim();
  const proxy: Record<string, { target: string; changeOrigin: boolean; cookieDomainRewrite?: string }> = {};

  if (betterAuthProxyTarget) {
    proxy["/api/auth-employer"] = {
      target: betterAuthProxyTarget,
      changeOrigin: true,
      cookieDomainRewrite: "localhost",
    };
    proxy["/api/auth"] = {
      target: betterAuthProxyTarget,
      changeOrigin: true,
      cookieDomainRewrite: "localhost",
    };
  }

  if (appBaseURL) {
    proxy["/company"] = {
      target: appBaseURL,
      changeOrigin: true,
    };
    proxy["/job"] = {
      target: appBaseURL,
      changeOrigin: true,
    };
    proxy["/utility"] = {
      target: appBaseURL,
      changeOrigin: true,
    };
    proxy["/api"] = {
      target: appBaseURL,
      changeOrigin: true,
    };
  }

  return {
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy,
    },
  };
});
