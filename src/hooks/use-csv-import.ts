
import { useState } from 'react';
import Papa from 'papaparse';
import { contentAPI } from '@/services/content/contentAPI';
import { ContentItem } from '@/types/api/content';

// Definição de tipos para os dados do CSV
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

interface SerieCSV {
  'Título Série': string;
  'Título Original': string;
  Ano: string;
  Gênero: string;
  Origem: string;
  Diretor: string;
  Elenco: string;
  Idade: string;
  Temporada: string;
  'Número Temporadas': string;
  Episódio: string;
  'Título Episódio': string;
  Duração: string;
  Diretório: string;
  Thumbnail?: string;
  Link_480p?: string;
  Link_720p?: string;
  Link_1080p?: string;
}

type ConteudoCSV = FilmeCSV | SerieCSV;

export const useCSVImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<{
    success: boolean;
    message: string;
    imported: number;
    total: number;
  } | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  // Função para validar os dados do CSV
  const validateCSVData = (data: Record<string, unknown>[]): { 
    valid: boolean; 
    errors: string[] 
  } => {
    const errors: string[] = [];
    
    if (data.length === 0) {
      errors.push('O arquivo CSV está vazio.');
      return { valid: false, errors };
    }

    // Verificar se as colunas obrigatórias estão presentes para cada tipo
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // É uma série ou um filme?
      const isSerie = isSerieCsv(row);
      
      if (isSerie) {
        const serie = row as unknown as SerieCSV;
        // Validação para séries
        if (!serie['Título Série']) {
          errors.push(`Linha ${i + 1}: Campo 'Título Série' é obrigatório para séries.`);
        }
        if (!serie.Temporada) {
          errors.push(`Linha ${i + 1}: Campo 'Temporada' é obrigatório para séries.`);
        }
        if (!serie['Número Temporadas']) {
          errors.push(`Linha ${i + 1}: Campo 'Número Temporadas' é obrigatório para séries.`);
        }
        if (!serie.Episódio) {
          errors.push(`Linha ${i + 1}: Campo 'Episódio' é obrigatório para séries.`);
        }
        if (!serie['Título Episódio']) {
          errors.push(`Linha ${i + 1}: Campo 'Título Episódio' é obrigatório para séries.`);
        }
      } else {
        const filme = row as unknown as FilmeCSV;
        // Validação para filmes
        if (!filme.Título) {
          errors.push(`Linha ${i + 1}: Campo 'Título' é obrigatório para filmes.`);
        }
      }
      
      // Validação comum para ambos tipos
      const comum = row as unknown as ConteudoCSV;
      if (!comum.Diretório) {
        errors.push(`Linha ${i + 1}: Campo 'Diretório' é obrigatório.`);
      } else {
        // Verificar se o diretório é válido
        const diretoriosValidos = [
          'Netflix', 'Prime Video', 'Disney Plus', 'Max', 'Paramount Plus', 
          'Globoplay', 'Hulu', 'Crunchyroll', 'Cinema'
        ];
        
        if (!diretoriosValidos.includes(comum.Diretório)) {
          errors.push(`Linha ${i + 1}: Diretório '${comum.Diretório}' não é válido. Diretórios válidos: ${diretoriosValidos.join(', ')}.`);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  };

  // Função para verificar se uma linha representa uma série
  const isSerieCsv = (row: any): boolean => {
    const tseries = row as unknown as SerieCSV;
    return !!(tseries['Título Série'] && tseries.Temporada && tseries['Número Temporadas']);
  };

  // Função para processar o CSV e transformar em ContentItem[]
  const processCSVData = (data: Record<string, unknown>[]): ContentItem[] => {
    const contentItems: ContentItem[] = [];
    
    for (const row of data) {
      if (isSerieCsv(row)) {
        // Processar série
        const serie = row as unknown as SerieCSV;
        contentItems.push({
          id: `import-${Math.random().toString(36).substr(2, 9)}`,
          tipo: 'serie',
          titulo: serie['Título Série'],
          descricao: `Série: ${serie['Título Série']}`,
          ano_lancamento: parseInt(serie.Ano, 10) || new Date().getFullYear(),
          classificacao_etaria: serie.Idade.replace('+', ''),
          gratuito: false,
          duracao: serie.Duração || `${serie['Número Temporadas']} temporadas`,
          poster_url: serie.Thumbnail || '',
          backdrop_url: '',
          video_url: '',
          video_url_480p: serie.Link_480p || '',
          video_url_720p: serie.Link_720p || '',
          video_url_1080p: serie.Link_1080p || '',
          destaque: false,
          status: 'pendente',
          generos: serie.Gênero.split(',').map(g => g.trim()),
          data_adicao: new Date().toISOString(),
          metadata: {
            diretorio: serie.Diretório,
            titulo_original: serie['Título Original'],
            origem: serie.Origem,
            diretor: serie.Diretor,
            elenco: serie.Elenco,
            temporada: parseInt(serie.Temporada, 10) || 1,
            episodio: parseInt(serie.Episódio, 10) || 1,
            total_temporadas: parseInt(serie['Número Temporadas'], 10) || 1,
            titulo_episodio: serie['Título Episódio'],
            episodios: [
              {
                numero_temporada: parseInt(serie.Temporada, 10) || 1,
                numero_episodio: parseInt(serie.Episódio, 10) || 1,
                titulo: serie['Título Episódio'],
                duracao: serie.Duração
              }
            ]
          }
        });
      } else {
        // Processar filme
        const filme = row as unknown as FilmeCSV;
        contentItems.push({
          id: `import-${Math.random().toString(36).substr(2, 9)}`,
          tipo: 'filme',
          titulo: filme.Título,
          descricao: `Filme: ${filme.Título}`,
          ano_lancamento: parseInt(filme.Ano, 10) || new Date().getFullYear(),
          classificacao_etaria: filme.Idade.replace('+', ''),
          gratuito: false,
          duracao: filme.Duração,
          poster_url: filme.Thumbnail || '',
          backdrop_url: '',
          video_url: '',
          video_url_480p: filme.Link_480p || '',
          video_url_720p: filme.Link_720p || '',
          video_url_1080p: filme.Link_1080p || '',
          destaque: false,
          status: 'pendente',
          generos: filme.Gênero.split(',').map(g => g.trim()),
          data_adicao: new Date().toISOString(),
          metadata: {
            diretorio: filme.Diretório,
            titulo_original: filme['Título Original'],
            origem: filme.Origem,
            diretor: filme.Diretor,
            elenco: filme.Elenco
          }
        });
      }
    }
    
    return contentItems;
  };

  // Função principal para importar o CSV
  const importCSV = async (file: File): Promise<boolean> => {
    setIsImporting(true);
    setImportErrors([]);
    setImportStats(null);
    
    try {
      // Parsear o arquivo CSV
      const parseResult = await new Promise<Papa.ParseResult<Record<string, unknown>>>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results),
          error: (error) => reject(error)
        });
      });
      
      // Validar os dados do CSV
      const { valid, errors } = validateCSVData(parseResult.data);
      
      if (!valid) {
        setImportErrors(errors);
        setImportStats({
          success: false,
          message: 'Falha na validação do CSV.',
          imported: 0,
          total: parseResult.data.length
        });
        setIsImporting(false);
        return false;
      }
      
      // Processar os dados do CSV para o formato ContentItem
      const contentItems = processCSVData(parseResult.data);
      
      // Chamar a API para importar os conteúdos
      const result = await contentAPI.importContentFromCSV(contentItems);
      
      setImportStats(result);
      setIsImporting(false);
      return result.success;
      
    } catch (error) {
      console.error('Erro ao importar CSV:', error);
      setImportErrors([`Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`]);
      setImportStats({
        success: false,
        message: 'Falha ao processar o arquivo CSV.',
        imported: 0,
        total: 0
      });
      setIsImporting(false);
      return false;
    }
  };

  return {
    importCSV,
    isImporting,
    importStats,
    importErrors,
    resetImport: () => {
      setImportErrors([]);
      setImportStats(null);
    }
  };
};

export default useCSVImport;
