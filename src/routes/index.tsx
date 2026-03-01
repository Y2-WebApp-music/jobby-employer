import LandingPage from "@/pages/LandingPage";
import ProfilePage from "@/pages/Profile";
import ApplymonitorPage from "@/pages/applymonitor/applymonitor";
import ApplyByTitlePage from "@/pages/applybytitle/ApplyByTitle";
import AccountPage from "@/pages/Account";
import CreatejobPage from "@/pages/Createjob";
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
      path: "/applymonitor",
      element: <ApplymonitorPage />,
    },
    {
      path: "/apply/:title",
      element: <ApplyByTitlePage />,
    },
    {
      path: "/account",
      element: <AccountPage />,
    },
    {
      path: "/createjob",
      element: <CreatejobPage />,
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
