
import { useState } from 'react';
import Papa from 'papaparse';
import { contentAPI } from '@/services/content/contentAPI';
import { ContentItem } from '@/types/api';

// Tipos para os dados CSV
interface FilmeCSV {
  Título: string;
  'Título Original': string;
  Ano: string;
  Gênero: string;
  Origem: string;
  Duração: string;
  Diretor: string;
  Elenco: string;
  Idade: string;
  Diretório: string;
  Thumbnail?: string;
  Link_480p?: string;
  Link_720p?: string;
  Link_1080p?: string;
}

interface SerieCSV extends Omit<FilmeCSV, 'Duração'> {
  Temporada: string;
  'Número Temporadas': string;
  Episódio: string;
  'Título Episódio': string;
  Duração: string;
}

type ConteudoCSV = FilmeCSV | SerieCSV;

interface ImportResult {
  total: number;
  success: number;
  errors: string[];
}

const DIRECTORIES = [
  'Netflix',
  'Prime Video',
  'Disney Plus',
  'Max',
  'Paramount Plus',
  'Globoplay',
  'Hulu',
  'Crunchyroll',
  'Cinema',
];

export const useCSVImport = () => {
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const resetImport = () => {
    setPreviewData([]);
    setValidationErrors([]);
    setImporting(false);
    setProgress(0);
    setImportResult(null);
  };

  const validateCSV = (data: Record<string, unknown>[]) => {
    const errors: string[] = [];

    // Verificar se o arquivo está vazio
    if (data.length === 0) {
      errors.push('O arquivo CSV está vazio');
      return errors;
    }

    // Obter as colunas do primeiro registro
    const firstRow = data[0];
    const requiredColumns = [
      'Título', 'Título Original', 'Ano', 'Gênero', 'Origem', 
      'Diretor', 'Elenco', 'Idade', 'Diretório'
    ];

    // Verificar colunas obrigatórias
    for (const column of requiredColumns) {
      if (!(column in firstRow)) {
        errors.push(`Coluna obrigatória ausente: ${column}`);
      }
    }

    // Verificar se o Diretório é válido
    data.forEach((row, index) => {
      const directory = row['Diretório'] as string;
      if (!directory || !DIRECTORIES.includes(directory)) {
        errors.push(`Linha ${index + 1}: Diretório '${directory}' inválido. Opções válidas: ${DIRECTORIES.join(', ')}`);
      }
    });

    return errors;
  };

  const isSerieRow = (row: Record<string, unknown>): row is SerieCSV => {
    return 'Temporada' in row && 'Episódio' in row && 'Número Temporadas' in row;
  };

  const mapCSVRowToContentItem = (row: ConteudoCSV): Partial<ContentItem> => {
    const isSerie = isSerieRow(row as Record<string, unknown>);
    
    const generos = row['Gênero'].split(',').map(g => g.trim());
    const classificacaoMapping: Record<string, string> = {
      'L': 'L',
      '10+': '10',
      '12+': '12',
      '14+': '14',
      '16+': '16',
      '18+': '18'
    };
    
    // Extrair a classificação etária
    const classificacao = Object.keys(classificacaoMapping).find(key => 
      row['Idade'].includes(key)
    ) || 'L';
    
    // Extrair ano como número
    const ano = parseInt(row['Ano'], 10);
    
    if (isSerie) {
      const serieRow = row as SerieCSV;
      // Para séries, retornamos dados completos da série
      return {
        tipo: 'serie',
        titulo: serieRow['Título'],
        descricao: `${serieRow['Título Original']} (${serieRow['Origem']}) - Diretor: ${serieRow['Diretor']}. Elenco: ${serieRow['Elenco']}`,
        ano_lancamento: ano,
        classificacao_etaria: classificacaoMapping[classificacao] || '14',
        gratuito: false,
        duracao: serieRow['Duração'],
        poster_url: serieRow['Thumbnail'] || '',
        video_url_480p: serieRow['Link_480p'] || '',
        video_url_720p: serieRow['Link_720p'] || '',
        video_url_1080p: serieRow['Link_1080p'] || '',
        generos: generos,
        metadata: {
          temporada: parseInt(serieRow['Temporada'], 10),
          episodio: parseInt(serieRow['Episódio'], 10),
          titulo_episodio: serieRow['Título Episódio'],
          total_temporadas: parseInt(serieRow['Número Temporadas'], 10),
          diretor: serieRow['Diretor'],
          elenco: serieRow['Elenco'],
          origem: serieRow['Origem'],
          titulo_original: serieRow['Título Original'],
          diretorio: serieRow['Diretório']
        }
      };
    } else {
      const filmeRow = row as FilmeCSV;
      // Para filmes, retornamos dados básicos
      return {
        tipo: 'filme',
        titulo: filmeRow['Título'],
        descricao: `${filmeRow['Título Original']} (${filmeRow['Origem']}) - Diretor: ${filmeRow['Diretor']}. Elenco: ${filmeRow['Elenco']}`,
        ano_lancamento: ano,
        classificacao_etaria: classificacaoMapping[classificacao] || '14',
        gratuito: false,
        duracao: filmeRow['Duração'],
        poster_url: filmeRow['Thumbnail'] || '',
        video_url_480p: filmeRow['Link_480p'] || '',
        video_url_720p: filmeRow['Link_720p'] || '',
        video_url_1080p: filmeRow['Link_1080p'] || '',
        generos: generos,
        metadata: {
          diretor: filmeRow['Diretor'],
          elenco: filmeRow['Elenco'],
          origem: filmeRow['Origem'],
          titulo_original: filmeRow['Título Original'],
          diretorio: filmeRow['Diretório']
        }
      };
    }
  };
  
  const processCSVData = async (data: Record<string, unknown>[]) => {
    const result: ImportResult = {
      total: data.length,
      success: 0,
      errors: []
    };
    
    // Inicializar processamento de filmes e séries
    const filmeItems: Partial<ContentItem>[] = [];
    const serieItems: Record<string, Partial<ContentItem>[]> = {};
    
    // Agrupar séries por título para processamento em lote
    data.forEach((row, index) => {
      try {
        if (isSerieRow(row as Record<string, unknown>)) {
          const serieRow = row as SerieCSV;
          const serieTitulo = serieRow['Título'];
          
          if (!serieItems[serieTitulo]) {
            serieItems[serieTitulo] = [];
          }
          
          serieItems[serieTitulo].push(mapCSVRowToContentItem(serieRow));
        } else {
          filmeItems.push(mapCSVRowToContentItem(row as FilmeCSV));
        }
      } catch (error) {
        result.errors.push(`Erro ao processar linha ${index + 1}: ${(error as Error).message}`);
      }
    });
    
    // Importar filmes
    for (let i = 0; i < filmeItems.length; i++) {
      try {
        await contentAPI.saveContent(filmeItems[i]);
        result.success++;
        setProgress((i + 1) / (filmeItems.length + Object.keys(serieItems).length) * 100);
      } catch (error) {
        result.errors.push(`Erro ao importar filme ${filmeItems[i].titulo}: ${(error as Error).message}`);
      }
    }
    
    // Importar séries 
    let serieCounter = 0;
    const totalSeries = Object.keys(serieItems).length;
    
    for (const [serieTitulo, episodios] of Object.entries(serieItems)) {
      try {
        // Ordenar episódios por temporada e número
        episodios.sort((a, b) => {
          const tempA = (a.metadata as any).temporada;
          const tempB = (b.metadata as any).temporada;
          if (tempA !== tempB) return tempA - tempB;
          
          const epA = (a.metadata as any).episodio;
          const epB = (b.metadata as any).episodio;
          return epA - epB;
        });
        
        // Usar o primeiro episódio como base para criar a série
        const firstEpisode = episodios[0];
        
        // Separar dados da série e episódios
        const serieBase = { 
          ...firstEpisode,
          metadata: {
            ...firstEpisode.metadata as Record<string, unknown>,
            episodios: episodios.map(ep => ({
              numero_temporada: (ep.metadata as any).temporada,
              numero_episodio: (ep.metadata as any).episodio,
              titulo: (ep.metadata as any).titulo_episodio,
              duracao: ep.duracao
            }))
          }
        };
        
        await contentAPI.saveContent(serieBase);
        result.success++;
        
        serieCounter++;
        setProgress((filmeItems.length + serieCounter) / (filmeItems.length + totalSeries) * 100);
      } catch (error) {
        result.errors.push(`Erro ao importar série ${serieTitulo}: ${(error as Error).message}`);
      }
    }
    
    return result;
  };

  const importData = async (file: File) => {
    resetImport();
    setImporting(true);
    
    try {
      // Parsear o CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const data = results.data as Record<string, unknown>[];
          
          // Fornecer uma prévia dos dados
          setPreviewData(data.slice(0, 5));
          
          // Validar o CSV
          const errors = validateCSV(data);
          setValidationErrors(errors);
          
          if (errors.length === 0) {
            // Processar os dados se não houver erros de validação
            const result = await processCSVData(data);
            setImportResult(result);
          }
          
          setImporting(false);
        },
        error: (error) => {
          setValidationErrors([`Erro ao analisar o arquivo: ${error.message}`]);
          setImporting(false);
        }
      });
    } catch (error) {
      setValidationErrors([`Erro ao processar arquivo: ${(error as Error).message}`]);
      setImporting(false);
    }
  };
  
  return {
    importData,
    previewData,
    validationErrors,
    importing,
    progress,
    importResult,
    resetImport
  };
};
