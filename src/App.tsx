
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import ApiDocs from "./pages/ApiDocs";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Kids from "./pages/Kids";
import ProfileManagement from "./pages/ProfileManagement";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import UserSettingsPage from "./pages/UserSettingsPage";
import PaymentUpload from "./pages/PaymentUpload";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/welcome" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/downloads" element={<Dashboard />} />
              <Route path="/dashboard/profiles" element={<ProfileManagement />} />
              <Route path="/kids" element={<Kids />} />
              <Route path="/subscription-plans" element={<SubscriptionPlans />} />
              <Route path="/user-settings" element={<UserSettingsPage />} />
              <Route path="/payment-upload" element={<PaymentUpload />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
