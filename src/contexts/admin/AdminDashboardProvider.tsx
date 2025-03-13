
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AdminDashboardContextType, StorageConfig, SystemConfig } from './types';
import { useUsersManagement } from './useUsersManagement';
import { usePaymentsManagement } from './usePaymentsManagement';
import { mockContentStats, generateUserStats } from './mockData';
import { initialSystemConfig } from './config/initialSystemConfig';

// Create the context
export const AdminDashboardContext = createContext<AdminDashboardContextType | undefined>(undefined);

// Provider component
export const AdminDashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Tab and UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  
  // Import all user management functions and state
  const userManagement = useUsersManagement();
  
  // Import all payment management functions
  const paymentManagement = usePaymentsManagement();
  
  // Get content stats from mock data
  const contentStats = mockContentStats;
  
  // Calculate user stats based on current users
  const userStats = generateUserStats(userManagement.users);
  
  // File Store state
  const [wasabiConfig, setWasabiConfig] = useState<StorageConfig>({
    driverName: 'wasabi',
    apiKey: '',
    secretKey: '',
    region: '',
    bucketName: '',
    endpoint: '',
    isDefault: false
  });

  const [cloudflareConfig, setCloudflareConfig] = useState<StorageConfig>({
    driverName: 'cloudflare',
    apiKey: '',
    secretKey: '',
    region: '',
    bucketName: '',
    endpoint: '',
    isDefault: false
  });

  // System Settings state
  const [systemConfig, setSystemConfig] = useState(initialSystemConfig);
  
  // Logout handler
  const handleLogout = () => {
    toast({
      title: "Sessão encerrada",
      description: "Você saiu da sua conta de administrador."
    });
    navigate('/admin-login');
  };
  
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
    
    // File Store
    wasabiConfig,
    cloudflareConfig,
    setWasabiConfig,
    setCloudflareConfig,
    
    // System Settings
    systemConfig,
    setSystemConfig,
    
    // Logout function
    handleLogout
  };
  
  return (
    <AdminDashboardContext.Provider value={contextValue}>
      {children}
    </AdminDashboardContext.Provider>
  );
};
