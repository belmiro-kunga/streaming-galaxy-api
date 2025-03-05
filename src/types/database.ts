
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      perfis_usuario: {
        Row: {
          id: string
          nome: string
          fuso_horario: string
          idioma_preferido: string
          perfil: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nome: string
          fuso_horario?: string
          idioma_preferido?: string
          perfil?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          fuso_horario?: string
          idioma_preferido?: string
          perfil?: string
          created_at?: string
          updated_at?: string
        }
      }
      planos_assinatura: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          qualidade_maxima: string | null
          telas_simultaneas: number
          limite_downloads: number
          ciclo_cobranca: string
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          qualidade_maxima?: string | null
          telas_simultaneas: number
          limite_downloads?: number
          ciclo_cobranca?: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          qualidade_maxima?: string | null
          telas_simultaneas?: number
          limite_downloads?: number
          ciclo_cobranca?: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      moedas: {
        Row: {
          codigo: string
          nome: string
        }
        Insert: {
          codigo: string
          nome: string
        }
        Update: {
          codigo?: string
          nome?: string
        }
      }
      precos_planos: {
        Row: {
          plano_id: string
          moeda_codigo: string
          preco: number
        }
        Insert: {
          plano_id: string
          moeda_codigo: string
          preco: number
        }
        Update: {
          plano_id?: string
          moeda_codigo?: string
          preco?: number
        }
      }
      assinaturas_usuario: {
        Row: {
          id: string
          usuario_id: string
          plano_id: string
          moeda_codigo: string
          data_inicio: string
          data_fim: string
          status: string
          downloads_utilizados: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          plano_id: string
          moeda_codigo: string
          data_inicio: string
          data_fim: string
          status?: string
          downloads_utilizados?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          usuario_id?: string
          plano_id?: string
          moeda_codigo?: string
          data_inicio?: string
          data_fim?: string
          status?: string
          downloads_utilizados?: number
          created_at?: string
          updated_at?: string
        }
      }
      conteudos: {
        Row: {
          id: string
          tipo: string
          titulo: string
          descricao: string | null
          ano_lancamento: number | null
          duracao: number | null
          classificacao_etaria: string | null
          status: string
          gratuito: boolean
          metadata: Json | null
          created_at: string
          updated_at: string
          created_by: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          tipo: string
          titulo: string
          descricao?: string | null
          ano_lancamento?: number | null
          duracao?: number | null
          classificacao_etaria?: string | null
          status?: string
          gratuito?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          tipo?: string
          titulo?: string
          descricao?: string | null
          ano_lancamento?: number | null
          duracao?: number | null
          classificacao_etaria?: string | null
          status?: string
          gratuito?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          deleted_at?: string | null
        }
      }
      traducoes_conteudo: {
        Row: {
          conteudo_id: string
          idioma: string
          titulo: string
          descricao: string | null
        }
        Insert: {
          conteudo_id: string
          idioma: string
          titulo: string
          descricao?: string | null
        }
        Update: {
          conteudo_id?: string
          idioma?: string
          titulo?: string
          descricao?: string | null
        }
      }
      generos: {
        Row: {
          id: string
          nome: string
        }
        Insert: {
          id?: string
          nome: string
        }
        Update: {
          id?: string
          nome?: string
        }
      }
      conteudo_generos: {
        Row: {
          conteudo_id: string
          genero_id: string
        }
        Insert: {
          conteudo_id: string
          genero_id: string
        }
        Update: {
          conteudo_id?: string
          genero_id?: string
        }
      }
      episodios: {
        Row: {
          id: string
          conteudo_id: string
          numero_temporada: number
          numero_episodio: number
          titulo: string
          descricao: string | null
          duracao: number | null
          data_estreia: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          conteudo_id: string
          numero_temporada: number
          numero_episodio: number
          titulo: string
          descricao?: string | null
          duracao?: number | null
          data_estreia?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          conteudo_id?: string
          numero_temporada?: number
          numero_episodio?: number
          titulo?: string
          descricao?: string | null
          duracao?: number | null
          data_estreia?: string | null
          metadata?: Json | null
        }
      }
      arquivos_midia: {
        Row: {
          id: string
          conteudo_id: string | null
          episodio_id: string | null
          storage_path: string
          qualidade: string
          formato: string | null
          tamanho_bytes: number | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          conteudo_id?: string | null
          episodio_id?: string | null
          storage_path: string
          qualidade?: string
          formato?: string | null
          tamanho_bytes?: number | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          conteudo_id?: string | null
          episodio_id?: string | null
          storage_path?: string
          qualidade?: string
          formato?: string | null
          tamanho_bytes?: number | null
          metadata?: Json | null
        }
      }
      dispositivos: {
        Row: {
          id: string
          usuario_id: string
          tipo: string
          identificador: string
          metadata: Json | null
          created_at: string
          ultimo_acesso: string | null
        }
        Insert: {
          id?: string
          usuario_id: string
          tipo: string
          identificador: string
          metadata?: Json | null
          created_at?: string
          ultimo_acesso?: string | null
        }
        Update: {
          id?: string
          usuario_id?: string
          tipo?: string
          identificador?: string
          metadata?: Json | null
          created_at?: string
          ultimo_acesso?: string | null
        }
      }
      downloads: {
        Row: {
          id: string
          usuario_id: string
          arquivo_midia_id: string
          dispositivo_id: string
          status: string
          data_expiracao: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          arquivo_midia_id: string
          dispositivo_id: string
          status?: string
          data_expiracao: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          usuario_id?: string
          arquivo_midia_id?: string
          dispositivo_id?: string
          status?: string
          data_expiracao?: string
          created_at?: string
          updated_at?: string
        }
      }
      historico_reproducao: {
        Row: {
          id: string
          usuario_id: string
          conteudo_id: string | null
          episodio_id: string | null
          posicao_tempo: number
          percentual_assistido: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          conteudo_id?: string | null
          episodio_id?: string | null
          posicao_tempo: number
          percentual_assistido?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          usuario_id?: string
          conteudo_id?: string | null
          episodio_id?: string | null
          posicao_tempo?: number
          percentual_assistido?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      favoritos: {
        Row: {
          usuario_id: string
          conteudo_id: string
          created_at: string
        }
        Insert: {
          usuario_id: string
          conteudo_id: string
          created_at?: string
        }
        Update: {
          usuario_id?: string
          conteudo_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      estatisticas_usuario: {
        Row: {
          id: string
          nome: string
          total_conteudos_assistidos: number | null
          total_downloads: number | null
          total_favoritos: number | null
        }
      }
    }
    Functions: {
      [_ in string]: unknown
    }
    Enums: {
      [_ in string]: unknown
    }
  }
}
