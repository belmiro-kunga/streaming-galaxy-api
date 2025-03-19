
import { Home, Film, Tv2, Download, Gift, Gamepad2, Theater, Drama, Radio, Dumbbell, Tv } from "lucide-react";
import React from "react";

export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

// Menu inferior e superior principal
export const mainMenuItems: MenuItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Início", path: "/home" },
  { icon: <Film className="w-5 h-5" />, label: "Filmes", path: "/movies" },
  { icon: <Tv2 className="w-5 h-5" />, label: "Séries", path: "/series" },
  { icon: <Download className="w-5 h-5" />, label: "Downloads", path: "/downloads" },
];

// Menu hamburger comum para todas as páginas
export const commonHamburgerItems: MenuItem[] = [
  { icon: <Gift className="w-5 h-5" />, label: "Conteúdos Grátis", path: "/free" },
  { icon: <Gamepad2 className="w-5 h-5" />, label: "Anime", path: "/anime" },
  { icon: <Theater className="w-5 h-5" />, label: "Animação", path: "/animation" },
  { icon: <Drama className="w-5 h-5" />, label: "Dorama", path: "/dorama" },
  { icon: <Radio className="w-5 h-5" />, label: "Novela", path: "/novela" },
  { icon: <Dumbbell className="w-5 h-5" />, label: "Desporto", path: "/sports" },
  { icon: <Tv className="w-5 h-5" />, label: "TV", path: "/tv" },
];

// Função para obter os itens do menu hamburger baseado na página atual
export function getHamburgerItems(currentPath: string) {
  // Se estiver na página de downloads, mostra apenas os itens comuns
  if (currentPath === "/downloads") {
    return commonHamburgerItems;
  }

  // Para outras páginas, mostra os itens principais + comuns
  return [
    ...mainMenuItems.filter(item => item.path !== currentPath), // Remove o item da página atual
    ...commonHamburgerItems
  ];
}
