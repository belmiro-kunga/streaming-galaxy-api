
import { useState } from 'react';
import Papa from 'papaparse';
import { contentAPI } from '@/services/api';
import { ContentItem } from '@/types/api';

type ImportStats = {
  success: boolean;
  message: string;
  imported?: number;
  total?: number;
  progress?: number;
};

export const useCSVImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const resetImport = () => {
    setImportStats(null);
    setImportErrors([]);
  };

  const convertCSVToContentItems = (results: Papa.ParseResult<Record<string, unknown>>): ContentItem[] => {
    const contentItems: ContentItem[] = [];
    const errors: string[] = [];

    results.data.forEach((row, index) => {
      try {
        // Skip empty rows or header row if it's not data
        if (Object.keys(row).length === 0 || 
            (index === 0 && row['Título'] === 'Título')) {
          return;
        }

        // Check if this is a movie or series by looking for series-specific fields
        const isSeries = row['Temporada'] !== undefined && 
                         row['Número Temporadas'] !== undefined && 
                         row['Episódio'] !== undefined;
        
        // Validate required fields
        const titulo = row['Título'] as string;
        const diretorio = row['Diretório'] as string;

        if (!titulo) {
          errors.push(`Linha ${index + 1}: Campo 'Título' é obrigatório`);
          return;
        }

        if (!diretorio) {
          errors.push(`Linha ${index + 1}: Campo 'Diretório' é obrigatório`);
          return;
        }

        // Check if directory is valid
        const validDirectories = [
          'Netflix', 'Prime Video', 'Disney Plus', 'Max', 
          'Paramount Plus', 'Globoplay', 'Hulu', 'Crunchyroll', 'Cinema'
        ];
        
        if (!validDirectories.includes(diretorio)) {
          errors.push(`Linha ${index + 1}: Diretório '${diretorio}' inválido. Use um dos seguintes: ${validDirectories.join(', ')}`);
          return;
        }

        // Base content item for both movies and series
        const contentItem: Partial<ContentItem> = {
          titulo: titulo,
          tipo: isSeries ? 'serie' : 'filme',
          descricao: (row['Sinopse'] || row['Descrição']) as string || '',
          ano_lancamento: parseInt(row['Ano'] as string) || new Date().getFullYear(),
          classificacao_etaria: (row['Idade'] || row['Classificação']) as string || '12',
          status: 'pendente',
          gratuito: row['Gratuito'] === 'sim' || row['Gratuito'] === 'true' || false,
          generos: row['Gênero'] ? (row['Gênero'] as string).split(',').map(g => g.trim()) : [],
          poster_url: row['Thumbnail'] as string || '',
          video_url_480p: row['Link_480p'] as string || '',
          video_url_720p: row['Link_720p'] as string || '',
          video_url_1080p: row['Link_1080p'] as string || '',
          metadata: {
            diretorio: diretorio,
            titulo_original: row['Título Original'] as string || titulo,
            origem: row['Origem'] as string || '',
            diretor: row['Diretor'] as string || '',
            elenco: row['Elenco'] as string || ''
          }
        };

        // Add series-specific fields
        if (isSeries) {
          const temporada = parseInt(row['Temporada'] as string) || 1;
          const totalTemporadas = parseInt(row['Número Temporadas'] as string) || 1;
          const episodio = parseInt(row['Episódio'] as string) || 1;
          const tituloEpisodio = row['Título Episódio'] as string || `Episódio ${episodio}`;
          const duracao = row['Duração'] as string || '45min';
          
          contentItem.duracao = `${totalTemporadas} temporadas`;
          contentItem.metadata = {
            ...contentItem.metadata,
            temporada: temporada,
            episodio: episodio,
            total_temporadas: totalTemporadas,
            titulo_episodio: tituloEpisodio,
            episodios: [{
              numero_temporada: temporada,
              numero_episodio: episodio,
              titulo: tituloEpisodio,
              duracao: duracao
            }]
          };
        } else {
          // Movie duration
          contentItem.duracao = row['Duração'] as string || '2h';
        }

        contentItems.push(contentItem as ContentItem);
      } catch (error) {
        console.error('Error processing row:', row, error);
        errors.push(`Linha ${index + 1}: Erro ao processar - ${(error as Error).message}`);
      }
    });

    setImportErrors(errors);
    return contentItems;
  };

  const importCSV = async (file: File) => {
    try {
      setIsImporting(true);
      setImportErrors([]);
      setImportStats({
        success: false,
        message: 'Iniciando importação...',
        progress: 5
      });

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: Papa.ParseResult<Record<string, unknown>>) => {
          try {
            setImportStats(prev => ({
              ...prev!,
              message: 'Validando arquivo CSV...',
              progress: 20
            }));
            
            if (results.errors && results.errors.length > 0) {
              setImportErrors(results.errors.map(error => 
                `Erro na linha ${error.row}: ${error.message}`
              ));
              setImportStats({
                success: false,
                message: 'Falha ao processar o arquivo CSV. Verifique os erros.',
                progress: 100
              });
              return;
            }

            if (!results.data || results.data.length === 0) {
              setImportErrors(['CSV não contém dados válidos.']);
              setImportStats({
                success: false,
                message: 'Arquivo CSV vazio ou inválido.',
                progress: 100
              });
              return;
            }

            // Convert CSV data to content items
            setImportStats(prev => ({
              ...prev!,
              message: 'Convertendo dados...',
              progress: 40
            }));
            
            const contentItems = convertCSVToContentItems(results);
            
            if (contentItems.length === 0) {
              setImportStats({
                success: false,
                message: 'Nenhum conteúdo válido para importar.',
                progress: 100
              });
              return;
            }

            // Send to API
            setImportStats(prev => ({
              ...prev!,
              message: 'Enviando para o servidor...',
              progress: 70,
              total: contentItems.length
            }));
            
            const result = await contentAPI.importContentFromCSV(contentItems);
            
            setImportStats({
              ...result,
              progress: 100
            });
          } catch (error) {
            console.error('Error processing CSV:', error);
            setImportErrors([`Erro ao processar CSV: ${(error as Error).message}`]);
            setImportStats({
              success: false,
              message: 'Erro ao processar dados. Verifique o formato do arquivo.',
              progress: 100
            });
          } finally {
            setIsImporting(false);
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          setImportErrors([`Erro ao analisar CSV: ${error.message}`]);
          setImportStats({
            success: false,
            message: 'Falha ao analisar o arquivo CSV.',
            progress: 100
          });
          setIsImporting(false);
        }
      });
    } catch (error) {
      console.error('CSV import error:', error);
      setImportErrors([`Erro: ${(error as Error).message}`]);
      setImportStats({
        success: false,
        message: 'Falha ao importar o arquivo CSV.',
        progress: 100
      });
      setIsImporting(false);
    }
  };

  return {
    importCSV,
    isImporting,
    importStats,
    importErrors,
    resetImport,
  };
};
