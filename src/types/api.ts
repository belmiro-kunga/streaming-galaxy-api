
// Types for our streaming platform API
export interface UserProfile {
  id: string;
  nome: string;
  fuso_horario: string;
  idioma_preferido: string;
  perfil: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  nome: string;
  descricao: string | null;
  qualidade_maxima: string | null;
  telas_simultaneas: number;
  limite_downloads: number;
  limite_perfis: number; // Added for profile limits
  ciclo_cobranca: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  precos?: PlanPrice[];
}

export interface PlanPrice {
  plano_id: string;
  moeda_codigo: string;
  preco: number;
}

export interface Currency {
  codigo: string;
  nome: string;
}

export interface UserSubscription {
  id: string;
  usuario_id: string;
  plano_id: string;
  moeda_codigo: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  downloads_utilizados: number;
  created_at: string;
  updated_at: string;
}

// New Profile Management types
export interface Profile {
  id: string;
  usuario_id: string;
  nome: string;
  avatar_url: string | null;
  is_crianca: boolean;
  controle_parental: ParentalControl | null;
  created_at: string;
  updated_at: string;
}

export interface ParentalControl {
  perfil_id: string;
  classificacao_maxima: string;
  restricoes_horario: TimeRestriction[];
  ativo: boolean;
}

export interface TimeRestriction {
  id: string;
  perfil_id: string;
  dias_semana: string; // 'weekdays', 'weekends', 'everyday', or specific day
  hora_inicio: string;
  hora_fim: string;
}

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

export interface MediaFile {
  id: string;
  conteudo_id: string | null;
  episodio_id: string | null;
  storage_path: string;
  qualidade: string;
  formato: string | null;
  tamanho_bytes: number | null;
  metadata: Record<string, any>;
}

export interface Device {
  id: string;
  usuario_id: string;
  tipo: string;
  identificador: string;
  metadata: Record<string, any>;
  created_at: string;
  ultimo_acesso: string | null;
}

export interface Download {
  id: string;
  usuario_id: string;
  arquivo_midia_id: string;
  dispositivo_id: string;
  status: string;
  data_expiracao: string;
  created_at: string;
  updated_at: string;
}

export interface PlaybackHistory {
  id: string;
  usuario_id: string;
  conteudo_id: string | null;
  episodio_id: string | null;
  posicao_tempo: number;
  percentual_assistido: number | null;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  usuario_id: string;
  conteudo_id: string;
  created_at: string;
}

export interface UserStatistics {
  id: string;
  nome: string;
  total_conteudos_assistidos: number;
  total_downloads: number;
  total_favoritos: number;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
