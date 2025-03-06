
import { SubscriptionPlan } from '@/types/api';

// Mock database for subscription plans - making it mutable for reflection between pages
export const plansMockDB: SubscriptionPlan[] = [
  { 
    id: "weekly",
    nome: "Plano Semanal",
    descricao: "Ideal para períodos curtos",
    qualidade_maxima: "HD",
    telas_simultaneas: 1,
    limite_downloads: 5,
    limite_perfis: 1,
    ciclo_cobranca: "semanal",
    ativo: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    precos: [{ plano_id: "weekly", moeda_codigo: "AOA", preco: 500 }]
  },
  { 
    id: "biweekly",
    nome: "Plano Quinzenal",
    descricao: "Para quem deseja mais flexibilidade",
    qualidade_maxima: "HD",
    telas_simultaneas: 2,
    limite_downloads: 10,
    limite_perfis: 2,
    ciclo_cobranca: "quinzenal",
    ativo: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    precos: [{ plano_id: "biweekly", moeda_codigo: "AOA", preco: 850 }]
  },
  { 
    id: "standard",
    nome: "Standard",
    descricao: "Nossa opção mais popular",
    qualidade_maxima: "HD",
    telas_simultaneas: 2,
    limite_downloads: 20,
    limite_perfis: 3,
    ciclo_cobranca: "mensal",
    ativo: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    precos: [{ plano_id: "standard", moeda_codigo: "AOA", preco: 3000 }]
  },
  { 
    id: "premium",
    nome: "Premium",
    descricao: "Melhor experiência para famílias",
    qualidade_maxima: "Ultra HD",
    telas_simultaneas: 4,
    limite_downloads: 40,
    limite_perfis: 6,
    ciclo_cobranca: "mensal",
    ativo: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    precos: [{ plano_id: "premium", moeda_codigo: "AOA", preco: 5000 }]
  }
];
