import { User, Payment, UserStats, ContentStats } from './types';

// Mock user data
export const mockUsers: User[] = [
  { 
    id: "USR-001", 
    name: "Carlos Mendes", 
    email: "carlos@email.com", 
    first_name: "Carlos", 
    last_name: "Mendes", 
    phone: "923456789", 
    country: "Angola", 
    province: "Luanda", 
    created_at: "2023-11-01", 
    status: "Ativo", 
    subscription: "Premium" 
  },
  { 
    id: "USR-002", 
    name: "Ana Beatriz", 
    email: "ana@email.com", 
    first_name: "Ana", 
    last_name: "Beatriz", 
    phone: "912345678", 
    country: "Angola", 
    province: "Benguela", 
    created_at: "2023-11-02", 
    status: "Pendente", 
    subscription: "Familiar" 
  },
  { 
    id: "USR-003", 
    name: "Lucas Ferreira", 
    email: "lucas@email.com", 
    first_name: "Lucas", 
    last_name: "Ferreira", 
    phone: "934567890", 
    country: "Angola", 
    province: "Huambo", 
    created_at: "2023-11-04", 
    status: "Ativo", 
    subscription: "Básico" 
  },
  { 
    id: "USR-004", 
    name: "Mariana Costa", 
    email: "mariana@email.com", 
    first_name: "Mariana", 
    last_name: "Costa", 
    phone: "956789012", 
    country: "Angola", 
    province: "Bié", 
    created_at: "2023-11-05", 
    status: "Ativo", 
    subscription: "Gratuito" 
  },
  { 
    id: "USR-005", 
    name: "Paulo Rodrigues", 
    email: "paulo@email.com", 
    first_name: "Paulo", 
    last_name: "Rodrigues", 
    phone: "967890123", 
    country: "Angola", 
    province: "Cabinda", 
    created_at: "2023-11-07", 
    status: "Inativo", 
    subscription: null 
  }
];

// Updated mock payments data to match the Payment interface
export const mockPendingPayments: Payment[] = [
  { 
    id: "PAY-001", 
    user: "João Silva", 
    user_id: "USR-001", 
    plan: "Premium", 
    plan_id: "PLAN-001", 
    amount: "AOA 5,000", 
    date: "2023-11-01", 
    status: "pendente", 
    payment_proof_url: "https://example.com/proof1.jpg"
  },
  { 
    id: "PAY-002", 
    user: "Maria Santos", 
    user_id: "USR-002", 
    plan: "Familiar", 
    plan_id: "PLAN-002", 
    amount: "AOA 7,500", 
    date: "2023-11-03", 
    status: "pendente",
    payment_proof_url: "https://example.com/proof2.jpg"
  },
  { 
    id: "PAY-003", 
    user: "Pedro Alves", 
    user_id: "USR-003", 
    plan: "Premium", 
    plan_id: "PLAN-001", 
    amount: "AOA 5,000", 
    date: "2023-11-05", 
    status: "pendente",
    payment_proof_url: "https://example.com/proof3.jpg"
  }
];

// Mock content stats
export const mockContentStats: ContentStats = {
  totalContent: 245,
  movies: 180,
  series: 65,
  recent: 12
};

// Generate user stats based on mock users
export const generateUserStats = (users: User[]): UserStats => {
  return {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.status === "Ativo").length,
    premiumUsers: users.filter(user => user.subscription === "Premium").length,
    familyPlans: users.filter(user => user.subscription === "Familiar").length
  };
};
