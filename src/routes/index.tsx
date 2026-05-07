import LandingPage from "@/pages/LandingPage";
import ProfilePage from "@/pages/profile/Profile";
import ApplymonitorPage from "@/pages/applymonitor/applymonitor";
import ApplyByTitlePage from "@/pages/applybytitle/ApplyByTitle";
import JobMonitorPage from "@/pages/jobmonitor/JobMonitor";
import MessagePage from "@/pages/message/message";
import AccountPage from "@/pages/Account";
import CreatejobPage from "@/pages/createjob/Createjob";
import ScoutPage from "@/pages/scout/Scout";
import ApproveWorkPage from "@/pages/approvework/approvework";
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
      path: "/jobmonitor",
      element: <JobMonitorPage />,
    },
    {
      path: "/message",
      element: <MessagePage />,
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
      path: "/approvework",
      element: <ApproveWorkPage />,
    },
    {
      path: "/createjob",
      element: <CreatejobPage />,
    },
    {
      path: "/scout",
      element: <ScoutPage />,
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
