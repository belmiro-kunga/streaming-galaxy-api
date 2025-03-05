
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Package, CreditCard, Settings, BarChart3, 
  FilePenLine, FileText, LogOut, ChevronDown, Bell, Search, Menu
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for demonstration
  const pendingPayments = [
    { id: "PAY-001", user: "João Silva", plan: "Premium", amount: "R$ 29,90", date: "2023-11-01" },
    { id: "PAY-002", user: "Maria Santos", plan: "Familiar", amount: "R$ 39,90", date: "2023-11-03" },
    { id: "PAY-003", user: "Pedro Alves", plan: "Premium", amount: "R$ 29,90", date: "2023-11-05" }
  ];
  
  const recentUsers = [
    { id: "USR-001", name: "Carlos Mendes", email: "carlos@email.com", date: "2023-11-01", status: "Ativo" },
    { id: "USR-002", name: "Ana Beatriz", email: "ana@email.com", date: "2023-11-02", status: "Pendente" },
    { id: "USR-003", name: "Lucas Ferreira", email: "lucas@email.com", date: "2023-11-04", status: "Ativo" }
  ];
  
  const contentStats = {
    totalContent: 245,
    movies: 180,
    series: 65,
    recent: 12
  };
  
  const userStats = {
    totalUsers: 1250,
    activeUsers: 980,
    premiumUsers: 450,
    familyPlans: 205
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
                      <p className="text-green-400 text-sm">36% do total</p>
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
                      <CardTitle>Novos Usuários</CardTitle>
                      <CardDescription className="text-gray-400">
                        Usuários registrados recentemente
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-4">
                          {recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                              <div>
                                <h3 className="font-medium">{user.name}</h3>
                                <div className="text-sm text-gray-400">{user.email}</div>
                                <div className="text-xs text-gray-500">{user.date}</div>
                              </div>
                              <div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  user.status === 'Ativo' ? 'bg-green-900 text-green-400' : 'bg-amber-900 text-amber-400'
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
                <h2 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h2>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <p className="text-gray-400">Interface de gerenciamento de usuários será implementada aqui.</p>
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
    </div>
  );
};

export default AdminDashboard;
