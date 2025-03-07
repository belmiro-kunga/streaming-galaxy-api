
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React from 'react';
import { UserProvider } from '@/contexts/UserContext';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Kids from "./pages/Kids";
import ProfileManagement from "./pages/ProfileManagement";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import UserSettingsPage from "./pages/UserSettingsPage";
import PaymentUpload from "./pages/PaymentUpload";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Create query client outside of the component
const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UserProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/welcome" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/watch/:id" element={<Watch />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/subscription-plans" element={<SubscriptionPlans />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  
                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/downloads" element={<Dashboard />} />
                    <Route path="/dashboard/profiles" element={<ProfileManagement />} />
                    <Route path="/kids" element={<Kids />} />
                    <Route path="/user-settings" element={<UserSettingsPage />} />
                    <Route path="/payment-upload" element={<PaymentUpload />} />
                  </Route>
                  
                  {/* Admin routes with role requirement */}
                  <Route 
                    path="/admin-dashboard/*" 
                    element={
                      <ProtectedRoute requiredRole="admin" redirectPath="/admin-login">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
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
