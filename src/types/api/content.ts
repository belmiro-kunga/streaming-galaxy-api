
// Content types
export interface ContentItem {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  ano_lancamento: number;
  classificacao_etaria: string;
  gratuito: boolean;
}

export interface Content {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string | null;
  ano_lancamento: number | null;
  duracao: number | null;
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
