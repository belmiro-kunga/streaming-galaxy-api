
import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Tv,
  Film,
  Upload,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { useAdminDashboard } from '@/contexts/admin';
import { useLocation, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { activeTab, setActiveTab, pendingPayments } = useAdminDashboard();
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/admin-dashboard/${tab}`);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const NavItem = ({ 
    icon, 
    label, 
    tabName, 
    badge 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    tabName: string;
    badge?: number | string;
  }) => {
    const isActive = activeTab === tabName;
    
    return (
      <button
        onClick={() => handleTabChange(tabName)}
        className={cn(
          "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors mb-1",
          isActive 
            ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground font-medium" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
      >
        <span className="mr-3 text-lg">{icon}</span>
        <span className="flex-1">{label}</span>
        {badge && (
          <span className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            isActive 
              ? "bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary-foreground" 
              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          )}>
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold dark:text-white">CinePlay</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="Visão Geral" 
              tabName="overview" 
            />
            <NavItem 
              icon={<Users size={18} />} 
              label="Usuários" 
              tabName="users" 
            />
            <NavItem 
              icon={<BarChart3 size={18} />} 
              label="Relatórios" 
              tabName="reports" 
            />
          </nav>
          
          <Separator className="my-4 dark:bg-gray-700" />
          
          <div className="mb-2">
            <h3 className="px-3 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
              Gerenciar Conteúdo
            </h3>
          </div>
          
          <nav className="space-y-1">
            <NavItem 
              icon={<Film size={18} />} 
              label="Filmes e Séries" 
              tabName="media-content" 
            />
            <NavItem 
              icon={<Upload size={18} />} 
              label="Importar Conteúdo" 
              tabName="content-import" 
            />
            <NavItem 
              icon={<Tv size={18} />} 
              label="Canais de TV" 
              tabName="tv-channels" 
            />
          </nav>
          
          <Separator className="my-4 dark:bg-gray-700" />
          
          <div className="mb-2">
            <h3 className="px-3 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
              Gerenciar Pagamentos
            </h3>
          </div>
          
          <nav className="space-y-1">
            <NavItem 
              icon={<CreditCard size={18} />} 
              label="Pagamentos" 
              tabName="payments"
              badge={pendingPayments?.length || 0}
            />
          </nav>
          
          <Separator className="my-4 dark:bg-gray-700" />
          
          <nav className="space-y-1">
            <NavItem 
              icon={<Settings size={18} />} 
              label="Configurações" 
              tabName="settings" 
            />
          </nav>
        </div>
        
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center w-full p-2 text-sm text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft className="mr-2 h-4 w-4" />
                <span>Recolher</span>
              </>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
