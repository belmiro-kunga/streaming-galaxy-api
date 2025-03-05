import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const isMobile = useMobile();

  if (isMobile) {
    return null; // Or render a mobile-specific sidebar
  }

  return (
    <div className={cn("w-64 border-r bg-secondary h-full flex-col py-4", className)}>
      <div className="px-6 py-2">
        <Button variant="ghost" className="w-full justify-start font-normal">
          Dashboard
        </Button>
      </div>
      <ScrollArea className="flex-1 space-y-2 px-3">
        <Separator />
        <Button variant="ghost" className="w-full justify-start font-normal">
          Customers
        </Button>
        <Button variant="ghost" className="w-full justify-start font-normal">
          Products
        </Button>
        <Button variant="ghost" className="w-full justify-start font-normal">
          Orders
        </Button>
        <Separator />
        <Button variant="ghost" className="w-full justify-start font-normal">
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start font-normal">
          Logout
        </Button>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
