
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Package, CreditCard, Settings, BarChart3, 
  FilePenLine, FileText, LogOut, ChevronDown, Bell, Search, Menu,
  UserPlus, Pencil, Trash, BadgeDollarSign
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionPlan } from '@/types/api';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  
  // User management state
  const [users, setUsers] = useState([
    { id: "USR-001", name: "Carlos Mendes", email: "carlos@email.com", created_at: "2023-11-01", status: "Ativo", subscription: "Premium" },
    { id: "USR-002", name: "Ana Beatriz", email: "ana@email.com", created_at: "2023-11-02", status: "Pendente", subscription: "Familiar" },
    { id: "USR-003", name: "Lucas Ferreira", email: "lucas@email.com", created_at: "2023-11-04", status: "Ativo", subscription: "Básico" },
    { id: "USR-004", name: "Mariana Costa", email: "mariana@email.com", created_at: "2023-11-05", status: "Ativo", subscription: "Gratuito" },
    { id: "USR-005", name: "Paulo Rodrigues", email: "paulo@email.com", created_at: "2023-11-07", status: "Inativo", subscription: null }
  ]);
  
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    { 
      id: "plan-1", 
      nome: "Básico", 
      descricao: "Acesso a conteúdo em HD", 
      qualidade_maxima: "HD", 
      telas_simultaneas: 1, 
      limite_downloads: 5, 
      limite_perfis: 1,
      ciclo_cobranca: "mensal", 
      ativo: true, 
      created_at: "2023-01-01", 
      updated_at: "2023-01-01",
      precos: [{ plano_id: "plan-1", moeda_codigo: "BRL", preco: 19.90 }]
    },
    { 
      id: "plan-2", 
      nome: "Premium", 
      descricao: "Acesso a conteúdo em 4K", 
      qualidade_maxima: "4K", 
      telas_simultaneas: 4, 
      limite_downloads: 20, 
      limite_perfis: 5,
      ciclo_cobranca: "mensal", 
      ativo: true, 
      created_at: "2023-01-01", 
      updated_at: "2023-01-01",
      precos: [{ plano_id: "plan-2", moeda_codigo: "BRL", preco: 39.90 }]
    },
    { 
      id: "plan-3", 
      nome: "Familiar", 
      descricao: "Ideal para família", 
      qualidade_maxima: "4K", 
      telas_simultaneas: 6, 
      limite_downloads: 30, 
      limite_perfis: 6,
      ciclo_cobranca: "mensal", 
      ativo: true, 
      created_at: "2023-01-01", 
      updated_at: "2023-01-01",
      precos: [{ plano_id: "plan-3", moeda_codigo: "BRL", preco: 49.90 }]
    },
  ]);
  
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
    setCurrentUser({ name: "", email: "", status: "Ativo", subscription: null });
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
        created_at: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      toast({
        title: "Usuário adicionado",
        description: `${newUser.name} foi adicionado com sucesso.`
      });
    } else {
      setUsers(users.map(u => u.id === currentUser.id ? currentUser : u));
      toast({
        title: "Usuário atualizado",
        description: `As informações de ${currentUser.name} foram atualizadas.`
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
      <header className="border-b border-gray-800 bg-gray-900 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-full hover:bg-gray-800">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-primary">CinePlay Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar..." 
              className="w-64 pl-10 bg-gray-800 border-gray-700 text-white h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              A
            </div>
            <span className="hidden md:inline font-medium">Admin</span>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside 
          className="bg-gray-900 border-r border-gray-800 w-64 flex-shrink-0 hidden md:block"
          animate={{ width: sidebarOpen ? 240 : 80 }}
          transition={{ duration: 0.3 }}
        >
          <ScrollArea className="h-full py-4">
            <nav className="px-3 space-y-1">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 py-2 px-3 ${activeTab === "overview" ? "bg-gray-800" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <BarChart3 className="h-5 w-5" />
                {sidebarOpen && <span>Visão Geral</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 py-2 px-3 ${activeTab === "users" ? "bg-gray-800" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                <Users className="h-5 w-5" />
                {sidebarOpen && <span>Usuários</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 py-2 px-3 ${activeTab === "content" ? "bg-gray-800" : ""}`}
                onClick={() => setActiveTab("content")}
              >
                <Package className="h-5 w-5" />
                {sidebarOpen && <span>Conteúdos</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 py-2 px-3 ${activeTab === "payments" ? "bg-gray-800" : ""}`}
                onClick={() => setActiveTab("payments")}
              >
                <CreditCard className="h-5 w-5" />
                {sidebarOpen && <span>Pagamentos</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 py-2 px-3 ${activeTab === "reports" ? "bg-gray-800" : ""}`}
                onClick={() => setActiveTab("reports")}
              >
                <FileText className="h-5 w-5" />
                {sidebarOpen && <span>Relatórios</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 py-2 px-3 ${activeTab === "settings" ? "bg-gray-800" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-5 w-5" />
                {sidebarOpen && <span>Configurações</span>}
              </Button>
            </nav>
            
            <div className="px-3 mt-6 pt-6 border-t border-gray-800">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 py-2 px-3 text-red-400 hover:text-red-300 hover:bg-gray-800"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                {sidebarOpen && <span>Sair</span>}
              </Button>
            </div>
          </ScrollArea>
        </motion.aside>
        
        {/* Mobile sidebar overlay */}
        {!sidebarOpen && <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-950">
          <div className="container mx-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="overview" className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Painel de Controle</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total de Usuários</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{userStats.totalUsers}</div>
                      <p className="text-green-400 text-sm">+12% neste mês</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Usuários Premium</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{userStats.premiumUsers}</div>
                      <p className="text-green-400 text-sm">{Math.round(userStats.premiumUsers / userStats.totalUsers * 100)}% do total</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total de Conteúdos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{contentStats.totalContent}</div>
                      <p className="text-sm">{contentStats.movies} filmes, {contentStats.series} séries</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Pagamentos Pendentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{pendingPayments.length}</div>
                      <p className="text-amber-400 text-sm">Aguardando aprovação</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle>Aprovações de Pagamento</CardTitle>
                      <CardDescription className="text-gray-400">
                        Confirmações pendentes de pagamento
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-4">
                          {pendingPayments.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                              <div>
                                <h3 className="font-medium">{payment.user}</h3>
                                <div className="text-sm text-gray-400">
                                  {payment.plan} - {payment.amount}
                                </div>
                                <div className="text-xs text-gray-500">{payment.date}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-8 bg-green-950 border-green-800 text-green-400 hover:bg-green-900"
                                  onClick={() => approvePayment(payment.id)}
                                >
                                  Aprovar
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-8 bg-red-950 border-red-800 text-red-400 hover:bg-red-900"
                                  onClick={() => rejectPayment(payment.id)}
                                >
                                  Rejeitar
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle>Usuários Recentes</CardTitle>
                      <CardDescription className="text-gray-400">
                        Últimos usuários registrados
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-4">
                          {users.slice(0, 5).map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                              <div>
                                <h3 className="font-medium">{user.name}</h3>
                                <div className="text-sm text-gray-400">{user.email}</div>
                                <div className="text-xs text-gray-500">{user.created_at}</div>
                              </div>
                              <div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  user.status === 'Ativo' ? 'bg-green-900 text-green-400' : 
                                  user.status === 'Pendente' ? 'bg-amber-900 text-amber-400' : 
                                  'bg-red-900 text-red-400'
                                }`}>
                                  {user.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="users">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
                  <Button 
                    onClick={addUser} 
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                  >
                    <UserPlus size={16} />
                    <span>Adicionar Usuário</span>
                  </Button>
                </div>
                
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Buscar por nome ou email..." 
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-800">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nome</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assinatura</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data Registro</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-800/50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm">{user.id}</td>
                                <td className="px-4 py-3 whitespace-nowrap font-medium">{user.name}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    user.status === 'Ativo' ? 'bg-green-900 text-green-400' : 
                                    user.status === 'Pendente' ? 'bg-amber-900 text-amber-400' : 
                                    'bg-red-900 text-red-400'
                                  }`}>
                                    {user.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  {user.subscription ? (
                                    <span className="text-sm">{user.subscription}</span>
                                  ) : (
                                    <span className="text-sm text-gray-500">Sem assinatura</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{user.created_at}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2 flex justify-end">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => manageSubscription(user)}
                                    className="h-8 w-8 bg-gray-800 hover:bg-gray-700"
                                    title="Gerenciar assinatura"
                                  >
                                    <BadgeDollarSign size={16} className="text-primary" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => editUser(user)}
                                    className="h-8 w-8 bg-gray-800 hover:bg-gray-700"
                                    title="Editar usuário"
                                  >
                                    <Pencil size={16} className="text-blue-400" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => deleteUser(user)}
                                    className="h-8 w-8 bg-gray-800 hover:bg-gray-700"
                                    title="Excluir usuário"
                                  >
                                    <Trash size={16} className="text-red-400" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                                Nenhum usuário encontrado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="content">
                <h2 className="text-2xl font-bold mb-6">Gerenciamento de Conteúdos</h2>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <p className="text-gray-400">Interface de gerenciamento de conteúdos será implementada aqui.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payments">
                <h2 className="text-2xl font-bold mb-6">Gerenciamento de Pagamentos</h2>
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Pagamentos Pendentes</CardTitle>
                    <CardDescription className="text-gray-400">
                      Confirme ou rejeite os pagamentos enviados pelos usuários
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-4">
                        {pendingPayments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                            <div>
                              <h3 className="font-medium">{payment.user}</h3>
                              <div className="text-sm text-gray-400">
                                Plano: {payment.plan}
                              </div>
                              <div className="text-sm text-gray-400">
                                Valor: {payment.amount}
                              </div>
                              <div className="text-xs text-gray-500">Data: {payment.date}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button 
                                variant="outline"
                                className="bg-gray-700 hover:bg-gray-600"
                              >
                                Ver Comprovante
                              </Button>
                              <Button 
                                variant="outline"
                                className="bg-green-950 border-green-800 text-green-400 hover:bg-green-900"
                                onClick={() => approvePayment(payment.id)}
                              >
                                Aprovar
                              </Button>
                              <Button 
                                variant="outline"
                                className="bg-red-950 border-red-800 text-red-400 hover:bg-red-900"
                                onClick={() => rejectPayment(payment.id)}
                              >
                                Rejeitar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reports">
                <h2 className="text-2xl font-bold mb-6">Relatórios</h2>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <p className="text-gray-400">Interface de relatórios será implementada aqui.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <h2 className="text-2xl font-bold mb-6">Configurações</h2>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <p className="text-gray-400">Interface de configurações será implementada aqui.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* User Add/Edit Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Adicionar Novo Usuário" : "Editar Usuário"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {dialogMode === "add" 
                ? "Preencha os dados para adicionar um novo usuário ao sistema." 
                : "Atualize as informações do usuário."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                value={currentUser?.name || ""}
                onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={currentUser?.email || ""}
                onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={currentUser?.status || "Ativo"} 
                onValueChange={(value) => setCurrentUser({...currentUser, status: value})}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSaveUser}
              disabled={!currentUser?.name || !currentUser?.email}
              className="bg-primary hover:bg-primary/90"
            >
              {dialogMode === "add" ? "Adicionar" : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Subscription Dialog */}
      <Dialog open={isSubscriptionDialogOpen} onOpenChange={setIsSubscriptionDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Gerenciar Assinatura</DialogTitle>
            <DialogDescription className="text-gray-400">
              Atualize o plano de assinatura do usuário {currentUser?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subscription">Plano de Assinatura</Label>
              <Select 
                value={selectedSubscription} 
                onValueChange={setSelectedSubscription}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="">Sem assinatura</SelectItem>
                  {subscriptionPlans.map(plan => (
                    <SelectItem key={plan.id} value={plan.nome}>
                      {plan.nome} - {plan.precos?.[0]?.preco ? `R$ ${plan.precos[0].preco.toFixed(2)}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedSubscription && subscriptionPlans.find(p => p.nome === selectedSubscription) && (
              <div className="bg-gray-800 p-4 rounded-md">
                <h4 className="font-medium mb-2">Detalhes do plano:</h4>
                {(() => {
                  const plan = subscriptionPlans.find(p => p.nome === selectedSubscription);
                  if (!plan) return null;
                  return (
                    <div className="text-sm space-y-1 text-gray-300">
                      <p>{plan.descricao}</p>
                      <p>Qualidade máxima: {plan.qualidade_maxima}</p>
                      <p>Telas simultâneas: {plan.telas_simultaneas}</p>
                      <p>Limite de downloads: {plan.limite_downloads}</p>
                      <p>Limite de perfis: {plan.limite_perfis}</p>
                      <p className="font-medium text-primary">
                        Preço: {plan.precos?.[0]?.preco ? `R$ ${plan.precos[0].preco.toFixed(2)}` : ""}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSaveSubscription}
              className="bg-primary hover:bg-primary/90"
            >
              Atualizar Assinatura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o usuário {userToDelete?.name}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
