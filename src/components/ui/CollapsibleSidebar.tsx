
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { commonHamburgerItems } from '@/config/menu-items';
import { useNavigate } from 'react-router-dom';
import { CollapsibleSidebarProps } from '@/types/ui';

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={cn("fixed right-0 top-20 z-40 h-[calc(100vh-5rem)]", className)}>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex h-full"
      >
        <CollapsibleTrigger asChild>
          <Button 
            variant="secondary" 
            size="icon"
            className="h-10 w-10 rounded-l-md rounded-r-none bg-gray-800 hover:bg-gray-700 text-white border-r border-gray-700"
          >
            {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent 
          className="data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right"
        >
          <div className="w-64 bg-gray-900 border-l border-gray-800 h-full flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-medium text-white">Mais Conteúdos</h3>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="py-4 px-2">
                {commonHamburgerItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className="w-full justify-start py-2 px-3 mb-1 text-gray-300 hover:text-white hover:bg-gray-800"
                    onClick={() => navigate(item.path)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
