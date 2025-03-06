
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlan } from '@/types/api';

interface User {
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

interface Payment {
  id: string;
  user: string;
  plan: string;
  amount: string;
  date: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  familyPlans: number;
}

interface ContentStats {
  totalContent: number;
  movies: number;
  series: number;
  recent: number;
}

interface AdminDashboardContextType {
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

export const AdminDashboardContext = createContext<AdminDashboardContextType | undefined>(undefined);

export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard must be used within an AdminDashboardProvider');
  }
  return context;
};

export const AdminDashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Tab and UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // User state
  const [users, setUsers] = useState<User[]>([
    { 
      id: "USR-001", 
      name: "Carlos Mendes", 
      email: "carlos@email.com", 
      first_name: "Carlos", 
      last_name: "Mendes", 
      phone: "923456789", 
      country: "Angola", 
      province: "Luanda", 
      created_at: "2023-11-01", 
      status: "Ativo", 
      subscription: "Premium" 
    },
    { 
      id: "USR-002", 
      name: "Ana Beatriz", 
      email: "ana@email.com", 
      first_name: "Ana", 
      last_name: "Beatriz", 
      phone: "912345678", 
      country: "Angola", 
      province: "Benguela", 
      created_at: "2023-11-02", 
      status: "Pendente", 
      subscription: "Familiar" 
    },
    { 
      id: "USR-003", 
      name: "Lucas Ferreira", 
      email: "lucas@email.com", 
      first_name: "Lucas", 
      last_name: "Ferreira", 
      phone: "934567890", 
      country: "Angola", 
      province: "Huambo", 
      created_at: "2023-11-04", 
      status: "Ativo", 
      subscription: "Básico" 
    },
    { 
      id: "USR-004", 
      name: "Mariana Costa", 
      email: "mariana@email.com", 
      first_name: "Mariana", 
      last_name: "Costa", 
      phone: "956789012", 
      country: "Angola", 
      province: "Bié", 
      created_at: "2023-11-05", 
      status: "Ativo", 
      subscription: "Gratuito" 
    },
    { 
      id: "USR-005", 
      name: "Paulo Rodrigues", 
      email: "paulo@email.com", 
      first_name: "Paulo", 
      last_name: "Rodrigues", 
      phone: "967890123", 
      country: "Angola", 
      province: "Cabinda", 
      created_at: "2023-11-07", 
      status: "Inativo", 
      subscription: null 
    }
  ]);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  
  // Dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // Computed properties
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const userStats = {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.status === "Ativo").length,
    premiumUsers: users.filter(user => user.subscription === "Premium").length,
    familyPlans: users.filter(user => user.subscription === "Familiar").length
  };

  // Mock data for demonstration
  const pendingPayments = [
    { id: "PAY-001", user: "João Silva", plan: "Premium", amount: "R$ 29,90", date: "2023-11-01" },
    { id: "PAY-002", user: "Maria Santos", plan: "Familiar", amount: "R$ 39,90", date: "2023-11-03" },
    { id: "PAY-003", user: "Pedro Alves", plan: "Premium", amount: "R$ 29,90", date: "2023-11-05" }
  ];
  
  const contentStats = {
    totalContent: 245,
    movies: 180,
    series: 65,
    recent: 12
  };
  
  // Actions
  const handleLogout = () => {
    toast({
      title: "Sessão encerrada",
      description: "Você saiu da sua conta de administrador."
    });
    navigate('/admin-login');
  };
  
  const approvePayment = (id: string) => {
    toast({
      title: "Pagamento aprovado",
      description: `O pagamento ${id} foi aprovado com sucesso.`
    });
  };
  
  const rejectPayment = (id: string) => {
    toast({
      title: "Pagamento rejeitado",
      description: `O pagamento ${id} foi rejeitado.`
    });
  };
  
  const addUser = () => {
    setDialogMode("add");
    setCurrentUser({ 
      id: "",
      name: "", 
      email: "", 
      first_name: "", 
      last_name: "", 
      phone: "", 
      country: "Angola", 
      province: "", 
      created_at: "",
      status: "Ativo", 
      subscription: null 
    });
    setIsUserDialogOpen(true);
  };
  
  const editUser = (user: User) => {
    setDialogMode("edit");
    setCurrentUser({ ...user });
    setIsUserDialogOpen(true);
  };
  
  const deleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast({
        title: "Usuário excluído",
        description: `O usuário ${userToDelete.name} foi excluído com sucesso.`
      });
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };
  
  const manageSubscription = (user: User) => {
    setCurrentUser(user);
    setSelectedSubscription(user.subscription || "");
    setIsSubscriptionDialogOpen(true);
  };
  
  const handleSaveUser = () => {
    if (currentUser) {
      if (dialogMode === "add") {
        const newUser = {
          ...currentUser,
          id: `USR-${users.length + 1}`.padStart(7, '0'),
          name: `${currentUser.first_name} ${currentUser.last_name}`,
          created_at: new Date().toISOString().split('T')[0]
        };
        setUsers([...users, newUser]);
        toast({
          title: "Usuário adicionado",
          description: `${newUser.name} foi adicionado com sucesso.`
        });
      } else {
        const updatedUser = {
          ...currentUser,
          name: `${currentUser.first_name} ${currentUser.last_name}`
        };
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        toast({
          title: "Usuário atualizado",
          description: `As informações de ${updatedUser.name} foram atualizadas.`
        });
      }
      setIsUserDialogOpen(false);
    }
  };
  
  const handleSaveSubscription = () => {
    if (currentUser) {
      setUsers(users.map(u => u.id === currentUser.id ? { ...u, subscription: selectedSubscription } : u));
      toast({
        title: "Assinatura atualizada",
        description: `A assinatura de ${currentUser.name} foi atualizada para ${selectedSubscription}.`
      });
      setIsSubscriptionDialogOpen(false);
    }
  };
  
  const contextValue: AdminDashboardContextType = {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    sidebarOpen,
    setSidebarOpen,
    users,
    setUsers,
    filteredUsers,
    currentUser,
    setCurrentUser,
    userStats,
    contentStats,
    pendingPayments,
    subscriptionPlans,
    setSubscriptionPlans,
    isUserDialogOpen,
    setIsUserDialogOpen,
    dialogMode,
    setDialogMode,
    isSubscriptionDialogOpen,
    setIsSubscriptionDialogOpen,
    selectedSubscription,
    setSelectedSubscription,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    handleLogout,
    approvePayment,
    rejectPayment,
    addUser,
    editUser,
    deleteUser,
    handleDeleteConfirm,
    manageSubscription,
    handleSaveUser,
    handleSaveSubscription
  };
  
  return (
    <AdminDashboardContext.Provider value={contextValue}>
      {children}
    </AdminDashboardContext.Provider>
  );
};
