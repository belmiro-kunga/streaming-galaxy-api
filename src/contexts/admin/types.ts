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
