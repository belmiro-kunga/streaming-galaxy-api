
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AdminDashboardContextType } from './types';
import { SubscriptionPlan } from '@/types/api';
import { useUsersManagement } from './useUsersManagement';
import { usePaymentsManagement } from './usePaymentsManagement';
import { mockContentStats, generateUserStats } from './mockData';

// Create the context
export const AdminDashboardContext = createContext<AdminDashboardContextType | undefined>(undefined);

// Hook for using the context
export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard must be used within an AdminDashboardProvider');
  }
  return context;
};

// Provider component
export const AdminDashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Tab and UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  
  // Import all user management functions and state
  const userManagement = useUsersManagement();
  
  // Import all payment management functions
  const paymentManagement = usePaymentsManagement();
  
  // Get content stats from mock data
  const contentStats = mockContentStats;
  
  // Calculate user stats based on current users
  const userStats = generateUserStats(userManagement.users);
  
  // Logout handler
  const handleLogout = () => {
    toast({
      title: "Sessão encerrada",
      description: "Você saiu da sua conta de administrador."
    });
    navigate('/admin-login');
  };
  
  // The subscriptionDialog component expects a "currentUser" property,
  // but our refactored code has this state in both userDialog and userSubscription.
  // For compatibility, we'll expose the userSubscription.currentUser as subscriptionUser.
  const contextValue: AdminDashboardContextType = {
    // Tab and UI state
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    
    // User state and functions
    ...userManagement,
    userStats,
    
    // Content stats
    contentStats,
    
    // Payment state and functions
    ...paymentManagement,
    
    // Subscription plans
    subscriptionPlans,
    setSubscriptionPlans,
    
    // Logout function
    handleLogout
  };
  
  return (
    <AdminDashboardContext.Provider value={contextValue}>
      {children}
    </AdminDashboardContext.Provider>
  );
};
