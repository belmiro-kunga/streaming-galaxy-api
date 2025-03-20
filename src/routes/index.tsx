
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import { Animation } from "@/pages/Animation";
import { Dorama } from "@/pages/Dorama";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Kids from "@/pages/Kids";
import MoviesPage from "@/pages/movies";
import SeriesPage from "@/pages/series";
import ProfileManagement from "@/pages/ProfileManagement";
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import UserSettingsPage from "@/pages/UserSettingsPage";
import PaymentUpload from "@/pages/PaymentUpload";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import { Downloads } from "@/pages/Downloads";
import { FreeContent } from "@/pages/FreeContent";
import { Anime } from "@/pages/Anime";
import Watch from "@/pages/Watch";
import Netflix from '@/pages/Netflix';
import DisneyPlusPage from '@/pages/DisneyPlus';
import MaxPage from '@/pages/Max';
import PrimeVideoPage from '@/pages/PrimeVideo';
import AppleTVPage from '@/pages/AppleTV';
import ParamountPlusPage from '@/pages/ParamountPlus';
import HuluPage from '@/pages/Hulu';
import GloboPlayPage from '@/pages/GloboPlay';
import CrunchyrollPage from '@/pages/Crunchyroll';
import AcaoPage from '@/pages/Acao';
import AventuraPage from '@/pages/Aventura';
import ComediaPage from '@/pages/Comedia';
import DramaPage from '@/pages/Drama';
import FaroestePage from '@/pages/Faroeste';
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/welcome",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/movies",
    element: <MoviesPage />,
  },
  {
    path: "/series",
    element: <SeriesPage />,
  },
  {
    path: "/kids",
    element: <Kids />,
  },
  {
    path: "/watch/:id",
    element: <Watch />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin-login",
    element: <AdminLogin />,
  },
  {
    path: "/downloads",
    element: <Downloads />,
  },
  {
    path: "/free",
    element: <FreeContent />,
  },
  {
    path: "/free-content",
    element: <FreeContent />,
  },
  {
    path: "/anime",
    element: <Anime />,
  },
  {
    path: "/subscription-plans",
    element: <SubscriptionPlans />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "/dashboard/profiles",
    element: <ProtectedRoute><ProfileManagement /></ProtectedRoute>,
  },
  {
    path: "/user-settings",
    element: <ProtectedRoute><UserSettingsPage /></ProtectedRoute>,
  },
  {
    path: "/payment-upload",
    element: <ProtectedRoute><PaymentUpload /></ProtectedRoute>,
  },
  {
    path: "/admin-dashboard",
    element: <ProtectedRoute requiresAdmin={true}><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: "/animation",
    element: <Animation />,
  },
  {
    path: "/dorama",
    element: <Dorama />,
  },
  {
    path: "/netflix",
    element: <Netflix />,
  },
  {
    path: "/disney-plus",
    element: <DisneyPlusPage />,
  },
  {
    path: "/max",
    element: <MaxPage />,
  },
  {
    path: "/prime-video",
    element: <PrimeVideoPage />,
  },
  {
    path: "/apple-tv",
    element: <AppleTVPage />,
  },
  {
    path: "/paramount-plus",
    element: <ParamountPlusPage />,
  },
  {
    path: "/hulu",
    element: <HuluPage />,
  },
  {
    path: "/globoplay",
    element: <GloboPlayPage />,
  },
  {
    path: "/crunchyroll",
    element: <CrunchyrollPage />,
  },
  {
    path: "/acao",
    element: <AcaoPage />,
  },
  {
    path: "/aventura",
    element: <AventuraPage />,
  },
  {
    path: "/comedia",
    element: <ComediaPage />,
  },
  {
    path: "/drama",
    element: <DramaPage />,
  },
  {
    path: "/faroeste",
    element: <FaroestePage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
