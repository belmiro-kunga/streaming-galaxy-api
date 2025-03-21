
import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  sidebarOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

const Sidebar = ({ sidebarOpen, activeTab, setActiveTab, handleLogout }: SidebarProps) => {
  const location = useLocation();
  
  return (
    <motion.aside 
      className="bg-gray-900 border-r border-gray-800 w-64 flex-shrink-0 hidden md:block"
      animate={{ width: sidebarOpen ? 240 : 80 }}
      transition={{ duration: 0.3 }}
    >
      <ScrollArea className="h-full py-4">
        <nav className="px-3 space-y-1">
          <Link to="/admin-dashboard/overview">
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-3 ${location.pathname.includes("/admin-dashboard/overview") ? "bg-gray-800" : ""}`}
            >
              <span>Visão Geral</span>
            </Button>
          </Link>
          
          <Link to="/admin-dashboard/home">
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-3 ${location.pathname.includes("/admin-dashboard/home") ? "bg-gray-800" : ""}`}
            >
              <span>Home</span>
            </Button>
          </Link>
          
          <Link to="/admin-dashboard/users">
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-3 ${location.pathname.includes("/admin-dashboard/users") ? "bg-gray-800" : ""}`}
            >
              <span>Usuários</span>
            </Button>
          </Link>
          
          <Link to="/admin-dashboard/plans">
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-3 ${location.pathname.includes("/admin-dashboard/plans") ? "bg-gray-800" : ""}`}
            >
              <span>Planos</span>
            </Button>
          </Link>
          
          <Link to="/admin-dashboard/content">
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-3 ${location.pathname.includes("/admin-dashboard/content") ? "bg-gray-800" : ""}`}
            >
              <span>Conteúdos</span>
            </Button>
          </Link>
          
          <Link to="/admin-dashboard/payments">
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-3 ${location.pathname.includes("/admin-dashboard/payments") ? "bg-gray-800" : ""}`}
            >
              <span>Pagamentos</span>
            </Button>
          </Link>
          
          <Link to="/admin-dashboard/reports">
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-3 ${location.pathname.includes("/admin-dashboard/reports") ? "bg-gray-800" : ""}`}
            >
              <span>Relatórios</span>
            </Button>
          </Link>
          
          <Link to="/admin-dashboard/filestore">
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-3 ${location.pathname.includes("/admin-dashboard/filestore") ? "bg-gray-800" : ""}`}
            >
              <span>File Store</span>
            </Button>
          </Link>
          
          <Link to="/admin-dashboard/settings">
            <Button
              variant="ghost"
              className={`w-full justify-start py-2 px-3 ${location.pathname.includes("/admin-dashboard/settings") ? "bg-gray-800" : ""}`}
            >
              <span>Configurações do Sistema</span>
            </Button>
          </Link>
        </nav>
        
        <div className="px-3 mt-6 pt-6 border-t border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start py-2 px-3 text-red-400 hover:text-red-300 hover:bg-gray-800"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span>Sair</span>
          </Button>
        </div>
      </ScrollArea>
    </motion.aside>
  );
};

export default Sidebar;
