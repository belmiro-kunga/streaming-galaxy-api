import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Film, TrendingUp, Clock, BookmarkCheck, Download, 
  Settings, LogOut, Gift, CreditCard, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTVMode } from '@/hooks/use-tv-mode';
import { useUser } from '@/contexts/UserContext';
import { signOut } from '@/lib/supabase/auth';
import ProfileManagement from '@/components/ProfileManagement';
import DashboardHeader from '@/components/DashboardHeader';
import UserProfileDisplay from '@/components/UserProfileDisplay';

const Dashboard = () => {
  const location = useLocation();
  const isDownloadsPath = location.pathname === '/dashboard/downloads';
  const isProfilesPath = location.pathname === '/dashboard/profiles';
  const [activeTab, setActiveTab] = useState<string>(
    isDownloadsPath ? 'downloads' : isProfilesPath ? 'profiles' : 'home'
  );
  const { toast } = useToast();
  const { isTVMode } = useTVMode();
  const navigate = useNavigate();
  const { profile } = useUser();
  
  useEffect(() => {
    if (isDownloadsPath) {
      setActiveTab('downloads');
    } else if (isProfilesPath) {
      setActiveTab('profiles');
    }
  }, [isDownloadsPath, isProfilesPath]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    toast({
      title: `${tab.charAt(0).toUpperCase() + tab.slice(1)}`,
      description: `Você está na seção ${tab}.`
    });
    
    if (tab === 'home') {
      navigate('/home');
    } else if (tab === 'settings') {
      navigate('/user-settings');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const userSubscription = {
    plan: 'Premium',
    startDate: '2023-07-15',
    nextBillingDate: '2023-08-15',
    price: 'R$ 39,90',
    status: 'Ativo'
  };

  const watchHistory = [
    { id: '1', title: 'O Gambito da Rainha', progress: 75, image: 'https://via.placeholder.com/300x170' },
    { id: '2', title: 'Stranger Things', progress: 40, image: 'https://via.placeholder.com/300x170' },
    { id: '3', title: 'Breaking Bad', progress: 90, image: 'https://via.placeholder.com/300x170' }
  ];

  const downloads = [
    { id: '1', title: 'Black Mirror', size: '1.2 GB', expiresIn: '15 dias', image: 'https://via.placeholder.com/300x170' },
    { id: '2', title: 'The Crown', size: '950 MB', expiresIn: '30 dias', image: 'https://via.placeholder.com/300x170' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 flex-shrink-0 space-y-1">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-3">
              <UserProfileDisplay />
              
              <nav className="space-y-1 mt-4">
                {[
                  { icon: <Home className="h-5 w-5" />, label: 'Home', id: 'home' },
                  { icon: <Film className="h-5 w-5" />, label: 'Minha Lista', id: 'mylist' },
                  { icon: <TrendingUp className="h-5 w-5" />, label: 'Populares', id: 'trending' },
                  { icon: <Clock className="h-5 w-5" />, label: 'Histórico', id: 'history' },
                  { icon: <BookmarkCheck className="h-5 w-5" />, label: 'Favoritos', id: 'favorites' },
                  { icon: <Download className="h-5 w-5" />, label: 'Downloads', id: 'downloads' },
                  { icon: <Users className="h-5 w-5" />, label: 'Perfis', id: 'profiles' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'home') {
                        navigate('/home');
                      } else if (item.id === 'downloads') {
                        navigate('/dashboard/downloads');
                      } else if (item.id === 'profiles') {
                        navigate('/dashboard/profiles');
                      } else {
                        handleTabChange(item.id);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-gray-800 text-gray-300'
                    } ${isTVMode ? 'focus:ring focus:ring-primary/50 text-lg py-3' : ''}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800 mt-4">
            <CardContent className="p-3">
              <nav className="space-y-1">
                {[
                  { icon: <CreditCard className="h-5 w-5" />, label: 'Assinatura', id: 'subscription' },
                  { icon: <Settings className="h-5 w-5" />, label: 'Configurações', id: 'settings' },
                  { icon: <LogOut className="h-5 w-5" />, label: 'Sair', id: 'logout' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'logout') {
                        handleLogout();
                      } else if (item.id === 'settings') {
                        navigate('/user-settings');
                      } else {
                        handleTabChange(item.id);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-gray-800 text-gray-300'
                    } ${isTVMode ? 'focus:ring focus:ring-primary/50 text-lg py-3' : ''}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && (
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Olá, {profile?.first_name || 'Usuário'}!
                        </h2>
                        <p className="text-gray-300">Bem-vindo de volta à CinePlay</p>
                      </div>
                      <Button className="mt-4 md:mt-0" size="lg">
                        <Gift className="mr-2 h-5 w-5" />
                        Convide amigos
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <h2 className="text-xl font-bold mb-4">Resumo da Assinatura</h2>
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Plano atual</p>
                        <p className="text-xl font-semibold">{userSubscription.plan}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Próxima cobrança</p>
                        <p className="text-xl font-semibold">{userSubscription.nextBillingDate}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Valor mensal</p>
                        <p className="text-xl font-semibold">{userSubscription.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <h2 className="text-xl font-bold mb-4">Continue Assistindo</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {watchHistory.map((item) => (
                    <Card key={item.id} className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                      <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-400">{item.progress}% assistido</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'downloads' || isDownloadsPath) && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Seus Downloads</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {downloads.map((item) => (
                    <Card key={item.id} className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                      <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{item.size}</span>
                          <span>Expira em {item.expiresIn}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'profiles' || isProfilesPath) && (
              <ProfileManagement />
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Detalhes da Assinatura</h2>
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle>Plano {userSubscription.plan}</CardTitle>
                    <CardDescription>
                      Assinado em {userSubscription.startDate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Próxima cobrança</p>
                        <p className="text-lg">{userSubscription.nextBillingDate}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Valor mensal</p>
                        <p className="text-lg">{userSubscription.price}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Status</p>
                        <p className="text-lg">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {userSubscription.status}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-800">
                      <h3 className="font-semibold mb-3">Métodos de pagamento</h3>
                      <div className="flex items-center p-3 bg-gray-800/50 rounded-lg">
                        <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded mr-3"></div>
                        <div>
                          <p className="font-medium">Cartão final 4242</p>
                          <p className="text-sm text-gray-400">Expira em 12/25</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    Alterar plano
                  </Button>
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    Atualizar forma de pagamento
                  </Button>
                  <Button variant="destructive">
                    Cancelar assinatura
                  </Button>
                </div>
              </div>
            )}

            {(activeTab === 'mylist' || activeTab === 'trending' || activeTab === 'history' || 
              activeTab === 'favorites' || activeTab === 'settings') && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  {activeTab === 'mylist' && <Film className="h-8 w-8 text-gray-400" />}
                  {activeTab === 'trending' && <TrendingUp className="h-8 w-8 text-gray-400" />}
                  {activeTab === 'history' && <Clock className="h-8 w-8 text-gray-400" />}
                  {activeTab === 'favorites' && <BookmarkCheck className="h-8 w-8 text-gray-400" />}
                  {activeTab === 'settings' && <Settings className="h-8 w-8 text-gray-400" />}
                </div>
                <h2 className="text-xl font-bold mb-2">
                  {activeTab === 'mylist' && 'Minha Lista'}
                  {activeTab === 'trending' && 'Populares'}
                  {activeTab === 'history' && 'Histórico'}
                  {activeTab === 'favorites' && 'Favoritos'}
                  {activeTab === 'settings' && 'Configurações'}
                </h2>
                <p className="text-gray-400 text-center max-w-md">
                  Esta funcionalidade será implementada em breve. Estamos trabalhando para trazer a melhor experiência possível.
                </p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
