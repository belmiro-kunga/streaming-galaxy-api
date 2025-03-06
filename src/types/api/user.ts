
// User profile types
export interface UserProfile {
  id: string;
  nome: string;
  fuso_horario: string;
  idioma_preferido: string;
  perfil: string;
  created_at: string;
  updated_at: string;
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

export interface UserStatistics {
  id: string;
  nome: string;
  total_conteudos_assistidos: number;
  total_downloads: number;
  total_favoritos: number;
}
