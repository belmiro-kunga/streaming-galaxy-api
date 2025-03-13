
import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  sidebarOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

const Sidebar = ({ sidebarOpen, activeTab, setActiveTab, handleLogout }: SidebarProps) => {
  return (
    <motion.aside 
      className="bg-gray-900 border-r border-gray-800 w-64 flex-shrink-0 hidden md:block"
      animate={{ width: sidebarOpen ? 240 : 80 }}
      transition={{ duration: 0.3 }}
    >
      <ScrollArea className="h-full py-4">
        <nav className="px-3 space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-start py-2 px-3 ${activeTab === "overview" ? "bg-gray-800" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span>Visão Geral</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start py-2 px-3 ${activeTab === "home" ? "bg-gray-800" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <span>Home</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start py-2 px-3 ${activeTab === "users" ? "bg-gray-800" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <span>Usuários</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start py-2 px-3 ${activeTab === "plans" ? "bg-gray-800" : ""}`}
            onClick={() => setActiveTab("plans")}
          >
            <span>Planos</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start py-2 px-3 ${activeTab === "content" ? "bg-gray-800" : ""}`}
            onClick={() => setActiveTab("content")}
          >
            <span>Conteúdos</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start py-2 px-3 ${activeTab === "payments" ? "bg-gray-800" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            <span>Pagamentos</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start py-2 px-3 ${activeTab === "reports" ? "bg-gray-800" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <span>Relatórios</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start py-2 px-3 ${activeTab === "filestore" ? "bg-gray-800" : ""}`}
            onClick={() => setActiveTab("filestore")}
          >
            <span>File Store</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start py-2 px-3 ${activeTab === "settings" ? "bg-gray-800" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <span>Configurações do Sistema</span>
          </Button>
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
