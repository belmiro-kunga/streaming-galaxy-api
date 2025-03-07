export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      arquivos_midia: {
        Row: {
          conteudo_id: string | null
          episodio_id: string | null
          formato: string | null
          id: string
          metadata: Json | null
          qualidade: string | null
          storage_path: string
          tamanho_bytes: number | null
        }
        Insert: {
          conteudo_id?: string | null
          episodio_id?: string | null
          formato?: string | null
          id?: string
          metadata?: Json | null
          qualidade?: string | null
          storage_path: string
          tamanho_bytes?: number | null
        }
        Update: {
          conteudo_id?: string | null
          episodio_id?: string | null
          formato?: string | null
          id?: string
          metadata?: Json | null
          qualidade?: string | null
          storage_path?: string
          tamanho_bytes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "arquivos_midia_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_midia_episodio_id_fkey"
            columns: ["episodio_id"]
            isOneToOne: false
            referencedRelation: "episodios"
            referencedColumns: ["id"]
          },
        ]
      }
      assinaturas_usuario: {
        Row: {
          created_at: string | null
          data_fim: string
          data_inicio: string
          downloads_utilizados: number | null
          id: string
          moeda_codigo: string | null
          plano_id: string | null
          status: string | null
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_fim: string
          data_inicio: string
          downloads_utilizados?: number | null
          id?: string
          moeda_codigo?: string | null
          plano_id?: string | null
          status?: string | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          downloads_utilizados?: number | null
          id?: string
          moeda_codigo?: string | null
          plano_id?: string | null
          status?: string | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_usuario_moeda_codigo_fkey"
            columns: ["moeda_codigo"]
            isOneToOne: false
            referencedRelation: "moedas"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "assinaturas_usuario_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_assinatura"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_usuario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      canais_tv: {
        Row: {
          categoria: string | null
          created_at: string
          descricao: string | null
          disponivel: boolean | null
          id: string
          logo_url: string | null
          nome: string
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          disponivel?: boolean | null
          id?: string
          logo_url?: string | null
          nome: string
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          disponivel?: boolean | null
          id?: string
          logo_url?: string | null
          nome?: string
          updated_at?: string
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "conteudo_generos_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conteudo_generos_genero_id_fkey"
            columns: ["genero_id"]
            isOneToOne: false
            referencedRelation: "generos"
            referencedColumns: ["id"]
          },
        ]
      }
      conteudos: {
        Row: {
          ano_lancamento: number | null
          classificacao_etaria: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          descricao: string | null
          duracao: number | null
          gratuito: boolean | null
          id: string
          metadata: Json | null
          status: string | null
          tipo: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ano_lancamento?: number | null
          classificacao_etaria?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          descricao?: string | null
          duracao?: number | null
          gratuito?: boolean | null
          id?: string
          metadata?: Json | null
          status?: string | null
          tipo: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ano_lancamento?: number | null
          classificacao_etaria?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          descricao?: string | null
          duracao?: number | null
          gratuito?: boolean | null
          id?: string
          metadata?: Json | null
          status?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conteudos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      dispositivos: {
        Row: {
          created_at: string | null
          id: string
          identificador: string
          metadata: Json | null
          tipo: string
          ultimo_acesso: string | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          identificador: string
          metadata?: Json | null
          tipo: string
          ultimo_acesso?: string | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          identificador?: string
          metadata?: Json | null
          tipo?: string
          ultimo_acesso?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispositivos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      downloads: {
        Row: {
          arquivo_midia_id: string | null
          created_at: string | null
          data_expiracao: string
          dispositivo_id: string | null
          id: string
          status: string | null
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          arquivo_midia_id?: string | null
          created_at?: string | null
          data_expiracao: string
          dispositivo_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          arquivo_midia_id?: string | null
          created_at?: string | null
          data_expiracao?: string
          dispositivo_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_arquivo_midia_id_fkey"
            columns: ["arquivo_midia_id"]
            isOneToOne: false
            referencedRelation: "arquivos_midia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_dispositivo_id_fkey"
            columns: ["dispositivo_id"]
            isOneToOne: false
            referencedRelation: "dispositivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      episodios: {
        Row: {
          conteudo_id: string | null
          data_estreia: string | null
          descricao: string | null
          duracao: number | null
          id: string
          metadata: Json | null
          numero_episodio: number
          numero_temporada: number
          titulo: string
        }
        Insert: {
          conteudo_id?: string | null
          data_estreia?: string | null
          descricao?: string | null
          duracao?: number | null
          id?: string
          metadata?: Json | null
          numero_episodio: number
          numero_temporada: number
          titulo: string
        }
        Update: {
          conteudo_id?: string | null
          data_estreia?: string | null
          descricao?: string | null
          duracao?: number | null
          id?: string
          metadata?: Json | null
          numero_episodio?: number
          numero_temporada?: number
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "episodios_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
        ]
      }
      favoritos: {
        Row: {
          conteudo_id: string
          created_at: string | null
          usuario_id: string
        }
        Insert: {
          conteudo_id: string
          created_at?: string | null
          usuario_id: string
        }
        Update: {
          conteudo_id?: string
          created_at?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favoritos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
      }
      historico_reproducao: {
        Row: {
          conteudo_id: string | null
          created_at: string | null
          episodio_id: string | null
          id: string
          percentual_assistido: number | null
          posicao_tempo: number
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          conteudo_id?: string | null
          created_at?: string | null
          episodio_id?: string | null
          id?: string
          percentual_assistido?: number | null
          posicao_tempo: number
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          conteudo_id?: string | null
          created_at?: string | null
          episodio_id?: string | null
          id?: string
          percentual_assistido?: number | null
          posicao_tempo?: number
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_reproducao_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_reproducao_episodio_id_fkey"
            columns: ["episodio_id"]
            isOneToOne: false
            referencedRelation: "episodios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_reproducao_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
      }
      pagamentos: {
        Row: {
          comprovativo_url: string | null
          created_at: string
          id: string
          moeda_codigo: string
          plano_id: string
          status: string
          updated_at: string
          usuario_id: string
          valor: number
        }
        Insert: {
          comprovativo_url?: string | null
          created_at?: string
          id?: string
          moeda_codigo: string
          plano_id: string
          status?: string
          updated_at?: string
          usuario_id: string
          valor: number
        }
        Update: {
          comprovativo_url?: string | null
          created_at?: string
          id?: string
          moeda_codigo?: string
          plano_id?: string
          status?: string
          updated_at?: string
          usuario_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_moeda_codigo_fkey"
            columns: ["moeda_codigo"]
            isOneToOne: false
            referencedRelation: "moedas"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "pagamentos_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_assinatura"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis_usuario: {
        Row: {
          created_at: string | null
          fuso_horario: string | null
          id: string
          idioma_preferido: string | null
          nome: string
          perfil: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fuso_horario?: string | null
          id: string
          idioma_preferido?: string | null
          nome: string
          perfil?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fuso_horario?: string | null
          id?: string
          idioma_preferido?: string | null
          nome?: string
          perfil?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfis_usuario_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      planos_assinatura: {
        Row: {
          ativo: boolean | null
          ciclo_cobranca: string | null
          created_at: string | null
          descricao: string | null
          id: string
          limite_downloads: number | null
          limite_perfis: number | null
          nome: string
          qualidade_maxima: string | null
          telas_simultaneas: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          ciclo_cobranca?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          limite_downloads?: number | null
          limite_perfis?: number | null
          nome: string
          qualidade_maxima?: string | null
          telas_simultaneas?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          ciclo_cobranca?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          limite_downloads?: number | null
          limite_perfis?: number | null
          nome?: string
          qualidade_maxima?: string | null
          telas_simultaneas?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      precos_planos: {
        Row: {
          moeda_codigo: string
          plano_id: string
          preco: number
        }
        Insert: {
          moeda_codigo: string
          plano_id: string
          preco: number
        }
        Update: {
          moeda_codigo?: string
          plano_id?: string
          preco?: number
        }
        Relationships: [
          {
            foreignKeyName: "precos_planos_moeda_codigo_fkey"
            columns: ["moeda_codigo"]
            isOneToOne: false
            referencedRelation: "moedas"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "precos_planos_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_assinatura"
            referencedColumns: ["id"]
          },
        ]
      }
      preferencias_usuario: {
        Row: {
          autoplay: boolean | null
          created_at: string | null
          generos_favoritos: string[] | null
          id: string
          idioma_legendas: string | null
          legendas_ativadas: boolean | null
          notificacoes: boolean | null
          qualidade_preferida: string | null
          tema: string | null
          updated_at: string | null
        }
        Insert: {
          autoplay?: boolean | null
          created_at?: string | null
          generos_favoritos?: string[] | null
          id: string
          idioma_legendas?: string | null
          legendas_ativadas?: boolean | null
          notificacoes?: boolean | null
          qualidade_preferida?: string | null
          tema?: string | null
          updated_at?: string | null
        }
        Update: {
          autoplay?: boolean | null
          created_at?: string | null
          generos_favoritos?: string[] | null
          id?: string
          idioma_legendas?: string | null
          legendas_ativadas?: boolean | null
          notificacoes?: boolean | null
          qualidade_preferida?: string | null
          tema?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preferencias_usuario_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      traducoes_conteudo: {
        Row: {
          conteudo_id: string
          descricao: string | null
          idioma: string
          titulo: string
        }
        Insert: {
          conteudo_id: string
          descricao?: string | null
          idioma: string
          titulo: string
        }
        Update: {
          conteudo_id?: string
          descricao?: string | null
          idioma?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "traducoes_conteudo_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      estatisticas_usuario: {
        Row: {
          id: string | null
          nome: string | null
          total_conteudos_assistidos: number | null
          total_downloads: number | null
          total_favoritos: number | null
        }
        Relationships: [
          {
            foreignKeyName: "perfis_usuario_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_view: {
        Row: {
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          phone: string | null
          province: string | null
        }
        Insert: {
          country?: never
          created_at?: string | null
          email?: string | null
          first_name?: never
          id?: string | null
          last_name?: never
          phone?: never
          province?: never
        }
        Update: {
          country?: never
          created_at?: string | null
          email?: string | null
          first_name?: never
          id?: string | null
          last_name?: never
          phone?: never
          province?: never
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
