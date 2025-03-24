
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const CsvTemplateDownloader = () => {
  const { toast } = useToast();

  const movieTemplateData = [
    'Título,Título Original,Ano,Gênero,Origem,Duração,Diretor,Elenco,Idade,Diretório,Thumbnail,Link_480p,Link_720p,Link_1080p',
    'Exemplo Filme,Original Title,2023,Ação,EUA,2h15min,John Doe,"Ator 1, Ator 2",12,Netflix,https://exemplo.com/thumbnail.jpg,,,',
  ].join('\n');

  const seriesTemplateData = [
    'Título,Título Original,Ano,Gênero,Origem,Diretor,Elenco,Idade,Temporada,Número Temporadas,Episódio,Título Episódio,Duração,Diretório,Thumbnail,Link_480p,Link_720p,Link_1080p',
    'Exemplo Série,Original Series,2023,Comédia,Brasil,Jane Doe,"Ator 1, Ator 2",16,1,3,1,Episódio Piloto,45min,Prime Video,https://exemplo.com/thumbnail.jpg,,,',
  ].join('\n');

  const downloadTemplate = (type: 'movie' | 'series' | 'combined') => {
    try {
      let data = '';
      let filename = '';
      
      if (type === 'movie') {
        data = movieTemplateData;
        filename = 'template_filmes.csv';
      } else if (type === 'series') {
        data = seriesTemplateData;
        filename = 'template_series.csv';
      } else {
        data = movieTemplateData + '\n\n' + seriesTemplateData;
        filename = 'template_completo.csv';
      }
      
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Download iniciado',
        description: `O template ${filename} está sendo baixado.`,
      });
    } catch (error) {
      console.error('Erro ao gerar o arquivo CSV:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao baixar',
        description: 'Ocorreu um erro ao gerar o arquivo CSV.',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="gap-2">
          <Download className="h-4 w-4" />
          Baixar Template CSV
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => downloadTemplate('combined')}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Template Completo</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadTemplate('movie')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Template para Filmes</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadTemplate('series')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Template para Séries</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CsvTemplateDownloader;
