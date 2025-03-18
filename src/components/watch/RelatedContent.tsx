
import React from 'react';
import { ContentRow } from '@/components/ui/ContentRow';
import { ContentItem } from '@/types/api/content';

interface RelatedContentProps {
  continuePlaying: ContentItem[];
  relatedContent: ContentItem[];
  trendingContent: ContentItem[];
}

const RelatedContent: React.FC<RelatedContentProps> = ({
  continuePlaying,
  relatedContent,
  trendingContent,
}) => {
  return (
    <div className="space-y-8 sm:space-y-12">
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Continuar Assistindo</h2>
        <ContentRow title="" content={continuePlaying} />
      </section>
      
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Recomendados para Você</h2>
        <ContentRow title="" content={relatedContent} />
      </section>
      
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Em Alta</h2>
        <ContentRow title="" content={trendingContent} />
      </section>
    </div>
  );
};

export default RelatedContent;
