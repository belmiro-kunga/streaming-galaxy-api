
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Film, TrendingUp, Clock, BookmarkCheck, Download, 
  Settings, LogOut, CreditCard, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import UserProfileDisplay from '@/components/UserProfileDisplay';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isTVMode: boolean;
}

const DashboardSidebar = ({ 
  activeTab, 
  onTabChange, 
  onLogout,
  isTVMode 
}: DashboardSidebarProps) => {
  const navigate = useNavigate();

  const handleNavigation = (id: string) => {
    if (id === 'home') {
      navigate('/home');
    } else if (id === 'downloads') {
      navigate('/dashboard/downloads');
    } else if (id === 'profiles') {
      navigate('/dashboard/profiles');
    } else {
      onTabChange(id);
    }
  };

  const mainNavItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Home', id: 'home' },
    { icon: <Film className="h-5 w-5" />, label: 'Minha Lista', id: 'mylist' },
    { icon: <TrendingUp className="h-5 w-5" />, label: 'Populares', id: 'trending' },
    { icon: <Clock className="h-5 w-5" />, label: 'Histórico', id: 'history' },
    { icon: <BookmarkCheck className="h-5 w-5" />, label: 'Favoritos', id: 'favorites' },
    { icon: <Download className="h-5 w-5" />, label: 'Downloads', id: 'downloads' },
    { icon: <Users className="h-5 w-5" />, label: 'Perfis', id: 'profiles' }
  ];

  const settingsNavItems = [
    { icon: <CreditCard className="h-5 w-5" />, label: 'Assinatura', id: 'subscription' },
    { icon: <Settings className="h-5 w-5" />, label: 'Configurações', id: 'settings' },
    { icon: <LogOut className="h-5 w-5" />, label: 'Sair', id: 'logout' }
  ];

  return (
    <aside className="md:w-64 flex-shrink-0 space-y-1">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-3">
          <UserProfileDisplay />
          
          <nav className="space-y-1 mt-4">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
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
            {settingsNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'logout') {
                    onLogout();
                  } else if (item.id === 'settings') {
                    navigate('/user-settings');
                  } else {
                    onTabChange(item.id);
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
  );
};

export default DashboardSidebar;
