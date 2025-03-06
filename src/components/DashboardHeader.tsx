
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const DashboardHeader = () => {
  const { profile } = useUser();
  
  const initials = profile 
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}` 
    : 'U';
    
  return (
    <header className="bg-black/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/home" className="text-2xl font-bold">CinePlay</Link>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <Link to="/user-settings" className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-800 transition-colors">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
