import LandingPage from "@/pages/LandingPage";
import ProfilePage from "@/pages/Profile";
import ApplyPage from "@/pages/Apply";
import AccountPage from "@/pages/Account";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/profile",
      element: <ProfilePage />,
    },
    {
      path: "/apply",
      element: <ApplyPage />,
    },
    {
      path: "/account",
      element: <AccountPage />,
    },
    {
      path: "/test",
      element: <div>Test</div>,
    },
    { path: "*", element: <div>Not Found</div> },
  ],
  {
    basename: import.meta.env.VITE_BASE_URL,
  },
);
