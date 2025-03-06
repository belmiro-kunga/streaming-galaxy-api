
// Media and user interaction types
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
