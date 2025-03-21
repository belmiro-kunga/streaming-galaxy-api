
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContentCard } from '@/components/ui/ContentCard';
import { ContentItem } from '@/types/api';

export interface ContentRowProps {
  title: string;
  content: ContentItem[];
  seeAllLink?: string;
  isPremiumUser?: boolean;
}

export const ContentRow = ({ title, content, seeAllLink, isPremiumUser = true }: ContentRowProps) => {
  if (!content || content.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {seeAllLink && (
          <Link to={seeAllLink} className="text-sm text-gray-400 flex items-center hover:text-white transition-colors">
            Ver Todos <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>
      <ScrollArea className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-4">
          {content.map((item) => (
            <ContentCard key={item.id} item={item} isPremiumUser={isPremiumUser} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
