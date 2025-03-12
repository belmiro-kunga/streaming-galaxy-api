import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AdminDashboardContextType, StorageConfig, SystemConfig } from './types';
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

const initialSystemConfig = {
  general: {
    // Informações Básicas
    siteName: "",
    siteDescription: "",
    siteKeywords: "",

    // Layout e Aparência
    desktopLayout: true,
    mobileLayout: true,
    primaryFont: "inter",
    fontSize: "medium" as const,
    primaryColor: "#0066FF",
    secondaryColor: "#1A1A1A",
    accentColor: "#FF3366",

    // Cabeçalho
    showMainMenu: true,
    showSearchBar: true,
    showLoginButton: true,
    menuItems: "Home, Filmes, Séries, Categorias",

    // Rodapé
    showFooterLinks: true,
    showSocialIcons: true,
    footerText: "© 2024 Streaming Galaxy. Todos os direitos reservados.",
    socialLinks: "Facebook: https://facebook.com/streaminggalaxy\nInstagram: https://instagram.com/streaminggalaxy\nTwitter: https://twitter.com/streaminggalaxy",

    // Configurações Regionais
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h"
  },
  logo: {
    logo: '',
    favicon: '',
    footerLogo: ''
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notificationSound: true
  },
  paymentGateways: {
    stripe: false,
    paypal: false,
    mercadoPago: true,
    pix: true,
    manualPayment: true
  },
  templates: {
    activeTemplate: 'default',
    colorScheme: 'dark',
    fontFamily: 'Inter'
  },
  socialLogin: {
    google: false,
    facebook: false,
    apple: false
  },
  maintenance: {
    enabled: false,
    message: '',
    allowedIPs: []
  },
  policies: {
    termsOfService: '',
    privacyPolicy: '',
    cookiePolicy: '',
    refundPolicy: ''
  },
  gdpr: {
    enabled: false,
    cookieMessage: '',
    policyUrl: ''
  },
  robotsTxt: ''
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
