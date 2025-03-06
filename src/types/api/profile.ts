
// Profile Management types
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
