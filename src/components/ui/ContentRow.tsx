
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContentCard } from '@/components/ui/ContentCard';
import { ContentItem } from '@/types/api';

interface ContentRowProps {
  title: string;
  content: ContentItem[];
  seeAllLink?: string;
}

export const ContentRow = ({ title, content, seeAllLink }: ContentRowProps) => {
  if (!content || content.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {seeAllLink && (
          <button className="text-sm text-gray-400 flex items-center">
            Ver Todos <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
      <ScrollArea className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-4">
          {content.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
