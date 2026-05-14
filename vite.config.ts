import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const betterAuthProxyTarget = (
    env.VITE_BETTER_AUTH_PROXY_TARGET
  ).trim();
  const appBaseURL = (env.VITE_APP_BASE_URL ?? "").trim();

  return {
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api/auth-employer": {
          target: betterAuthProxyTarget,
          changeOrigin: true,
          cookieDomainRewrite: "localhost",
        },
        "/api/auth": {
          target: betterAuthProxyTarget,
          changeOrigin: true,
          cookieDomainRewrite: "localhost",
        },
        "/company": {
          target: appBaseURL,
          changeOrigin: true,
        },
        "^/job(?:/|$)": {
          target: appBaseURL,
          changeOrigin: true,
        },
        "/apply-monitor": {
          target: appBaseURL,
          changeOrigin: true,
        },
        "/utility": {
          target: appBaseURL,
          changeOrigin: true,
        },
        "/api": {
          target: appBaseURL,
          changeOrigin: true,
        },
      },
    },
  };
});
