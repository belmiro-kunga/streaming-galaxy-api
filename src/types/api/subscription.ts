
// Subscription and plan types
export interface SubscriptionPlan {
  id: string;
  nome: string;
  descricao: string | null;
  qualidade_maxima: string | null;
  telas_simultaneas: number;
  limite_downloads: number;
  limite_perfis: number; // Updated to reflect new DB schema
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
