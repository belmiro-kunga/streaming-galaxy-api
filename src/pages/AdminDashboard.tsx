import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TabsContent, Tabs } from "@/components/ui/tabs";
import { SubscriptionPlan } from '@/types/api';
import { planAPI } from '@/services/plans';

// Admin Dashboard Components
import Header from '@/components/admin/dashboard/Header';
import Sidebar from '@/components/admin/dashboard/Sidebar';
import OverviewTab from '@/components/admin/dashboard/overview/OverviewTab';
import UsersTab from '@/components/admin/dashboard/users/UsersTab';
import ContentTab from '@/components/admin/dashboard/ContentTab';
import PaymentsTab from '@/components/admin/dashboard/payments/PaymentsTab';
import ReportsTab from '@/components/admin/dashboard/ReportsTab';
import SettingsTab from '@/components/admin/dashboard/SettingsTab';
import SubscriptionPlansManager from '@/components/admin/SubscriptionPlansManager';

// Dialog Components
import UserDialog from '@/components/admin/dashboard/dialogs/UserDialog';
import SubscriptionDialog from '@/components/admin/dashboard/dialogs/SubscriptionDialog';
import DeleteConfirmationDialog from '@/components/admin/dashboard/dialogs/DeleteConfirmationDialog';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  
  // User management state
  const [users, setUsers] = useState([
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
  
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  
  // User dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  
  // Subscription dialog states
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string>("");
  
  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  
  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await planAPI.getAllPlans();
        setSubscriptionPlans(data);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      }
    };
    
    fetchPlans();
  }, []);
  
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
  
  const userStats = {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.status === "Ativo").length,
    premiumUsers: users.filter(user => user.subscription === "Premium").length,
    familyPlans: users.filter(user => user.subscription === "Familiar").length
  };

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
  
  // User management functions
  const addUser = () => {
    setDialogMode("add");
    setCurrentUser({ 
      name: "", 
      email: "", 
      first_name: "", 
      last_name: "", 
      phone: "", 
      country: "Angola", 
      province: "", 
      status: "Ativo", 
      subscription: null 
    });
    setIsUserDialogOpen(true);
  };
  
  const editUser = (user: any) => {
    setDialogMode("edit");
    setCurrentUser({ ...user });
    setIsUserDialogOpen(true);
  };
  
  const deleteUser = (user: any) => {
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
  
  const manageSubscription = (user: any) => {
    setCurrentUser(user);
    setSelectedSubscription(user.subscription || "");
    setIsSubscriptionDialogOpen(true);
  };
  
  const handleSaveUser = () => {
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
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top header */}
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        setActiveTab={setActiveTab}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          handleLogout={handleLogout} 
        />
        
        {/* Mobile sidebar overlay */}
        {!sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-950">
          <div className="container mx-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="overview">
                <OverviewTab 
                  userStats={userStats}
                  contentStats={contentStats}
                  pendingPayments={pendingPayments}
                  users={users}
                  approvePayment={approvePayment}
                  rejectPayment={rejectPayment}
                />
              </TabsContent>
              
              <TabsContent value="users">
                <UsersTab 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filteredUsers={filteredUsers}
                  addUser={addUser}
                  editUser={editUser}
                  deleteUser={deleteUser}
                  manageSubscription={manageSubscription}
                />
              </TabsContent>
              
              <TabsContent value="plans">
                <SubscriptionPlansManager />
              </TabsContent>
              
              <TabsContent value="content">
                <ContentTab />
              </TabsContent>
              
              <TabsContent value="payments">
                <PaymentsTab 
                  pendingPayments={pendingPayments}
                  approvePayment={approvePayment}
                  rejectPayment={rejectPayment}
                />
              </TabsContent>
              
              <TabsContent value="reports">
                <ReportsTab />
              </TabsContent>
              
              <TabsContent value="settings">
                <SettingsTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* Dialogs */}
      <UserDialog 
        isOpen={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        dialogMode={dialogMode}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        handleSave={handleSaveUser}
      />
      
      <SubscriptionDialog 
        isOpen={isSubscriptionDialogOpen}
        onOpenChange={setIsSubscriptionDialogOpen}
        currentUser={currentUser}
        selectedSubscription={selectedSubscription}
        setSelectedSubscription={setSelectedSubscription}
        subscriptionPlans={subscriptionPlans}
        handleSave={handleSaveSubscription}
      />
      
      <DeleteConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userToDelete={userToDelete}
        handleConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminDashboard;
