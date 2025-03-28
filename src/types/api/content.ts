
// Content types
export interface ContentItem {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  ano_lancamento: number;
  classificacao_etaria: string;
  gratuito: boolean;
  video_url?: string;
  video_url_480p?: string;
  video_url_720p?: string;
  video_url_1080p?: string;
  trailer_url?: string;
  poster_url?: string;
  backdrop_url?: string;
  duracao?: string; // This is a string in ContentItem
  avaliacao?: number;
  generos?: string[];
  destaque?: boolean;
  data_adicao?: string;
  status?: string; // Campo adicional para status (pendente, aprovado, rejeitado)
  metadata?: {
    diretorio?: string; // Netflix, Prime Video, etc.
    titulo_original?: string;
    origem?: string;
    diretor?: string;
    elenco?: string;
    temporada?: number;
    episodio?: number;
    total_temporadas?: number;
    titulo_episodio?: string;
    episodios?: Array<{
      numero_temporada: number;
      numero_episodio: number;
      titulo: string;
      duracao?: string;
    }>;
  };
}

export interface Content {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string | null;
  ano_lancamento: number | null;
  duracao: number | null; // This is a number in Content
  classificacao_etaria: string | null;
  status: string;
  gratuito: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  deleted_at: string | null;
  generos?: Genre[];
  traducoes?: ContentTranslation[];
  video_url_480p?: string;
  video_url_720p?: string;
  video_url_1080p?: string;
  poster_url?: string;
  backdrop_url?: string;
  trailer_url?: string;
  destaque?: boolean;
}

export interface ContentTranslation {
  conteudo_id: string;
  idioma: string;
  titulo: string;
  descricao: string | null;
}

export interface Genre {
  id: string;
  nome: string;
}

export interface Episode {
  id: string;
  conteudo_id: string;
  numero_temporada: number;
  numero_episodio: number;
  titulo: string;
  descricao: string | null;
  duracao: number | null;
  data_estreia: string | null;
  metadata: Record<string, any>;
}

export interface ContentFilterOptions {
  genre?: string;
  year?: number;
  classification?: string;
  type?: 'filme' | 'serie';
  free?: boolean;
}
