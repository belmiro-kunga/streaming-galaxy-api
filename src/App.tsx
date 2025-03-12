import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from 'react';
import { signOut } from '@/lib/supabase/auth';
import { UserProvider } from '@/contexts/UserContext';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Kids from "./pages/Kids";
import MoviesPage from "./pages/movies";
import SeriesPage from "./pages/series";
import ProfileManagement from "./pages/ProfileManagement";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import UserSettingsPage from "./pages/UserSettingsPage";
import PaymentUpload from "./pages/PaymentUpload";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { BackgroundAudio } from '@/components/ui/BackgroundAudio';
import { Downloads } from "./pages/Downloads";
import { FreeContent } from "./pages/FreeContent";
import { Anime } from "./pages/Anime";
import { Animation } from "./pages/Animation";
import { Dorama } from "./pages/Dorama";
import Netflix from './pages/Netflix';
import DisneyPlusPage from './pages/DisneyPlus';
import MaxPage from './pages/Max';
import PrimeVideoPage from './pages/PrimeVideo';
import AppleTVPage from './pages/AppleTV';
import ParamountPlusPage from './pages/ParamountPlus';
import HuluPage from './pages/Hulu';
import GloboPlayPage from './pages/GloboPlay';
import CrunchyrollPage from './pages/Crunchyroll';
import AcaoPage from './pages/Acao';
import AventuraPage from './pages/Aventura';
import ComediaPage from './pages/Comedia';
import DramaPage from './pages/Drama';
import FaroestePage from './pages/Faroeste';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const logoutOnAppStart = async () => {
      await signOut();
      console.log('User logged out on app start');
    };
    
    logoutOnAppStart();
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UserProvider>
            <BackgroundAudio />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/welcome" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/movies" element={<MoviesPage />} />
                  <Route path="/series" element={<SeriesPage />} />
                  <Route path="/kids" element={<Kids />} />
                  <Route path="/watch/:id" element={<Watch />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/free" element={<FreeContent />} />
                  <Route path="/free-content" element={<Navigate to="/free" replace />} />
                  <Route path="/anime" element={<Anime />} />
                  <Route path="/subscription-plans" element={<SubscriptionPlans />} />
                  
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/profiles" element={<ProfileManagement />} />
                    <Route path="/user-settings" element={<UserSettingsPage />} />
                    <Route path="/payment-upload" element={<PaymentUpload />} />
                  </Route>
                  
                  <Route element={<ProtectedRoute requiresAdmin={true} />}>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  </Route>
                  
                  <Route path="/animation" element={<Animation />} />
                  <Route path="/dorama" element={<Dorama />} />
                  
                  <Route path="/netflix" element={<Netflix />} />
                  <Route path="/disney-plus" element={<DisneyPlusPage />} />
                  <Route path="/max" element={<MaxPage />} />
                  <Route path="/prime-video" element={<PrimeVideoPage />} />
                  <Route path="/apple-tv" element={<AppleTVPage />} />
                  <Route path="/paramount-plus" element={<ParamountPlusPage />} />
                  <Route path="/hulu" element={<HuluPage />} />
                  <Route path="/globoplay" element={<GloboPlayPage />} />
                  <Route path="/crunchyroll" element={<CrunchyrollPage />} />
                  <Route path="/acao" element={<AcaoPage />} />
                  <Route path="/aventura" element={<AventuraPage />} />
                  <Route path="/comedia" element={<ComediaPage />} />
                  <Route path="/drama" element={<DramaPage />} />
                  <Route path="/faroeste" element={<FaroestePage />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </BrowserRouter>
          </UserProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
