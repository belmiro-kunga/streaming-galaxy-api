
import React from 'react';
import { ThumbsUp, ThumbsDown, Plus, Share2, Calendar, Clock, Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ContentItem } from '@/types/api/content';

interface ContentInfoProps {
  content: ContentItem;
}

const ContentInfo: React.FC<ContentInfoProps> = ({ content }) => {
  const { toast } = useToast();

  const handleLike = () => {
    toast({
      title: "Gostei",
      description: "Sua avaliação foi registrada.",
    });
  };

  const handleDislike = () => {
    toast({
      title: "Não gostei",
      description: "Sua avaliação foi registrada.",
    });
  };

  const addToWatchlist = () => {
    toast({
      title: "Adicionado à sua lista",
      description: `${content.titulo} foi adicionado à sua lista de desejos.`,
    });
  };

  const shareContent = () => {
    toast({
      title: "Compartilhar",
      description: `Link para ${content.titulo} copiado para a área de transferência.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{content.titulo}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-300">
            <span className="bg-red-600 px-1.5 py-0.5 rounded text-white text-xs">
              {content.classificacao_etaria}
            </span>
            <span>{content.ano_lancamento}</span>
            <span>•</span>
            <span>{content.duracao || '2h 15min'}</span>
            <span>•</span>
            <span className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">
              {content.tipo === 'filme' ? 'FILME' : 'SÉRIE'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleLike}
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/10 rounded-full w-10 h-10"
          >
            <ThumbsUp className="w-5 h-5" />
          </Button>
          
          <Button 
            onClick={handleDislike}
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/10 rounded-full w-10 h-10"
          >
            <ThumbsDown className="w-5 h-5" />
          </Button>
          
          <Button 
            onClick={addToWatchlist}
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/10 rounded-full w-10 h-10"
          >
            <Plus className="w-5 h-5" />
          </Button>
          
          <Button 
            onClick={shareContent}
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/10 rounded-full w-10 h-10"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
        {content.descricao}
      </p>

      <div className="pt-6 border-t border-white/10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-400 w-4 h-4" />
            <span className="text-sm">Lançamento: {content.ano_lancamento}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-gray-400 w-4 h-4" />
            <span className="text-sm">Duração: {content.duracao || '2h 15min'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="text-gray-400 w-4 h-4" />
            <span className="text-sm">Classificação: {content.classificacao_etaria}</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="text-gray-400 w-4 h-4" />
            <span className="text-sm">Disponível para download</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentInfo;
