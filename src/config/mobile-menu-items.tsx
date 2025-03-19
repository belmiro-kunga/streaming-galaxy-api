
import React from 'react';
import { 
  Sparkles, 
  Clapperboard, 
  PlayCircle, 
  Film, 
  Tv, 
  Gamepad2, 
  Newspaper, 
  BadgePercent 
} from 'lucide-react';

export interface MobileMenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

export const mobileMenuItems: MobileMenuItem[] = [
  { icon: Sparkles, label: 'Conteúdo Grátis', href: '/free-content' },
  { icon: Clapperboard, label: 'Anime', href: '/anime' },
  { icon: PlayCircle, label: 'Animação', href: '/animation' },
  { icon: Film, label: 'Dorama', href: '/dorama' },
  { icon: Tv, label: 'Novela', href: '/novela' },
  { icon: Gamepad2, label: 'Desporto', href: '/sports' },
  { icon: Newspaper, label: 'TV', href: '/tv' },
  { icon: BadgePercent, label: 'Preço', href: '/subscription-plans' },
];
