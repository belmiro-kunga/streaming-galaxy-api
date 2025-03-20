
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import React, { useEffect } from 'react';
import { signOut } from '@/lib/supabase/auth';
import { UserProvider } from '@/contexts/UserContext';
import { BackgroundAudio } from '@/components/ui/BackgroundAudio';

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
            <RouterProvider router={router} />
          </UserProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
