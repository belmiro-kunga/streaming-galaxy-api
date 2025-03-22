import React from 'react';
import {
  LayoutDashboard,
  Users,
  Tv,
  Settings,
  FileText,
  Clapperboard,
  Upload
} from 'lucide-react';
import { NavItem } from '@/components/ui/nav-item';
import { useAdminDashboard } from '@/contexts/admin';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { activeTab, setActiveTab } = useAdminDashboard();
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/admin-dashboard/${tab}`);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out md:translate-x-0 md:shadow-none`}
    >
      <div className="space-y-4 py-4">
        <div className="px-6 flex items-center justify-between">
          <a href="/admin-dashboard" className="flex items-center space-x-2 font-semibold">
            <FileText className="h-6 w-6 text-primary" />
            <span>Admin Dashboard</span>
          </a>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="space-y-1 px-2">
          <NavItem
            icon={<LayoutDashboard size={16} />}
            label="Visão Geral"
            active={activeTab === 'overview'}
            onClick={() => handleTabChange('overview')}
          />
          <NavItem
            icon={<Users size={16} />}
            label="Usuários"
            active={activeTab === 'users'}
            onClick={() => handleTabChange('users')}
          />
          
          {/* Seção de Conteúdo */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Gerenciar Conteúdo
            </p>
            
            <NavItem
              icon={<Clapperboard size={16} />}
              label="Filmes e Séries"
              active={activeTab === 'media-content'}
              onClick={() => handleTabChange('media-content')}
            />
            <NavItem
              icon={<Upload size={16} />}
              label="Importar Conteúdo"
              active={activeTab === 'content-import'}
              onClick={() => handleTabChange('content-import')}
            />
            <NavItem
              icon={<Tv size={16} />}
              label="Canais de TV"
              active={activeTab === 'tv-channels'}
              onClick={() => handleTabChange('tv-channels')}
            />
          </div>
          
          {/* Seção de Pagamentos */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Gerenciar Pagamentos
            </p>
            
            <NavItem
              icon={<Tv size={16} />}
              label="Pagamentos"
              active={activeTab === 'payments'}
              onClick={() => handleTabChange('payments')}
            />
          </div>

          <NavItem
            icon={<Settings size={16} />}
            label="Configurações"
            active={activeTab === 'settings'}
            onClick={() => handleTabChange('settings')}
          />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
