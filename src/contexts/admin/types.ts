// Define types for admin dashboard
import { SubscriptionPlan } from '@/types/api';

export interface User {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  province: string;
  created_at: string;
  status: string;
  subscription: string | null;
}

export interface Payment {
  id: string;
  user: string;
  user_id: string; // Adicionando ID do usuário para referência
  plan: string;
  plan_id: string; // Adicionando ID do plano para referência
  amount: string;
  date: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  payment_proof_url?: string; // URL para o comprovativo de pagamento
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  familyPlans: number;
}

export interface ContentStats {
  totalContent: number;
  movies: number;
  series: number;
  recent: number;
}

export interface StorageConfig {
  driverName: string;
  apiKey: string;
  secretKey: string;
  region: string;
  bucketName: string;
  endpoint: string;
  isDefault: boolean;
}

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
}

export interface LogoSettings {
  logo: string;
  favicon: string;
  footerLogo: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notificationSound: boolean;
}

export interface PaymentGatewaySettings {
  stripe: boolean;
  paypal: boolean;
  mercadoPago: boolean;
  pix: boolean;
  manualPayment: boolean;
}

export interface TemplateSettings {
  activeTemplate: string;
  colorScheme: string;
  fontFamily: string;
}

export interface SocialLoginSettings {
  google: boolean;
  facebook: boolean;
  apple: boolean;
}

export interface MaintenanceSettings {
  enabled: boolean;
  message: string;
  allowedIPs: string[];
}

export interface PolicySettings {
  termsOfService: string;
  privacyPolicy: string;
  cookiePolicy: string;
  refundPolicy: string;
}

export interface GDPRSettings {
  enabled: boolean;
  cookieMessage: string;
  policyUrl: string;
}

export interface GeneralConfig {
  // Informações Básicas
  siteName: string;
  siteDescription: string;
  siteKeywords: string;

  // Layout e Aparência
  desktopLayout: boolean;
  mobileLayout: boolean;
  primaryFont: string;
  fontSize: 'small' | 'medium' | 'large';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  // Cabeçalho
  showMainMenu: boolean;
  showSearchBar: boolean;
  showLoginButton: boolean;
  menuItems: string;

  // Rodapé
  showFooterLinks: boolean;
  showSocialIcons: boolean;
  footerText: string;
  socialLinks: string;

  // Configurações Regionais (mantidas do original)
  timezone: string;
  dateFormat: string;
  timeFormat: string;
}

export interface SystemConfig {
  general: GeneralConfig;
  logo: LogoSettings;
  notifications: NotificationSettings;
  paymentGateways: PaymentGatewaySettings;
  templates: TemplateSettings;
  socialLogin: SocialLoginSettings;
  maintenance: MaintenanceSettings;
  policies: PolicySettings;
  gdpr: GDPRSettings;
  robotsTxt: string;
}

export interface AdminDashboardContextType {
  // Tab state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // User management
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  filteredUsers: User[];
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  userStats: UserStats;
  
  // Content stats
  contentStats: ContentStats;
  
  // Payment management
  pendingPayments: Payment[];
  
  // Subscription plans
  subscriptionPlans: SubscriptionPlan[];
  setSubscriptionPlans: React.Dispatch<React.SetStateAction<SubscriptionPlan[]>>;

  // Dialog states
  isUserDialogOpen: boolean;
  setIsUserDialogOpen: (open: boolean) => void;
  dialogMode: "add" | "edit";
  setDialogMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  
  isSubscriptionDialogOpen: boolean;
  setIsSubscriptionDialogOpen: (open: boolean) => void;
  selectedSubscription: string;
  setSelectedSubscription: (subscription: string) => void;
  
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  userToDelete: User | null;
  setUserToDelete: React.Dispatch<React.SetStateAction<User | null>>;
  
  // File Store state
  wasabiConfig: StorageConfig;
  cloudflareConfig: StorageConfig;
  setWasabiConfig: (config: StorageConfig) => void;
  setCloudflareConfig: (config: StorageConfig) => void;
  
  // System Settings
  systemConfig: {
    general: GeneralConfig;
    logo: LogoSettings;
    notifications: NotificationSettings;
    paymentGateways: PaymentGatewaySettings;
    templates: TemplateSettings;
    socialLogin: SocialLoginSettings;
    maintenance: MaintenanceSettings;
    policies: PolicySettings;
    gdpr: GDPRSettings;
    robotsTxt: string;
  };
  setSystemConfig: React.Dispatch<React.SetStateAction<{
    general: GeneralConfig;
    logo: LogoSettings;
    notifications: NotificationSettings;
    paymentGateways: PaymentGatewaySettings;
    templates: TemplateSettings;
    socialLogin: SocialLoginSettings;
    maintenance: MaintenanceSettings;
    policies: PolicySettings;
    gdpr: GDPRSettings;
    robotsTxt: string;
  }>>;
  
  // Actions
  handleLogout: () => void;
  addUser: () => void;
  editUser: (user: User) => void;
  deleteUser: (user: User) => void;
  handleDeleteConfirm: () => void;
  manageSubscription: (user: User) => void;
  handleSaveUser: () => void;
  handleSaveSubscription: () => void;
  approvePayment: (id: string) => void;
  rejectPayment: (id: string) => void;
}
