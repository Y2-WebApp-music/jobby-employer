import LandingPage from "@/pages/LandingPage";
import ProfilePage from "@/pages/profile/Profile";
import ApplymonitorPage from "@/pages/applymonitor/applymonitor";
import ApplymonitorJobPage from "@/pages/applymonitor/ApplymonitorJobPage";
import ApplyByTitlePage from "@/pages/applybytitle/ApplyByTitle";
import JobMonitorPage from "@/pages/jobmonitor/JobMonitor";
import MessagePage from "@/pages/message/message";
import AccountPage from "@/pages/Account";
import CreatejobPage from "@/pages/createjob/Createjob";
import ScoutPage from "@/pages/scout/Scout";
import ApproveWorkPage from "@/pages/approvework/approvework";
import SignUpPage from "@/pages/auth/SignUp";
import CompanySetupPage from "@/pages/auth/CompanySetup";
import SignInPage from "@/pages/auth/SignIn";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/signup",
      element: <SignUpPage />,
    },
    {
      path: "/sign-up",
      element: <SignUpPage />,
    },
    {
      path: "/signin",
      element: <SignInPage />,
    },
    {
      path: "/sign-in",
      element: <SignInPage />,
    },
    {
      path: "/company-setup",
      element: <CompanySetupPage />,
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
      path: "/applymonitor/job/:jobId",
      element: <ApplymonitorJobPage />,
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
