import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Dados de exemplo - Trending Movies
const trendingMovies = [
  {
    id: "1",
    title: "Top Gun: Maverick",
    thumbnail: "https://picsum.photos/seed/topgun/400/600",
    category: "Ação",
  },
  {
    id: "2",
    title: "SpongeBob SquarePants",
    thumbnail: "https://picsum.photos/seed/spongebob/400/600",
    category: "Animação",
  },
  {
    id: "3",
    title: "Future Man",
    thumbnail: "https://picsum.photos/seed/futureman/400/600",
    category: "Ficção Científica",
  },
  {
    id: "4",
    title: "South Park: Post Covid",
    thumbnail: "https://picsum.photos/seed/southpark/400/600",
    category: "Animação",
  },
  {
    id: "5",
    title: "Top Gun",
    thumbnail: "https://picsum.photos/seed/topgun2/400/600",
    category: "Ação",
  },
  {
    id: "6",
    title: "Sistas",
    thumbnail: "https://picsum.photos/seed/sistas/400/600",
    category: "Drama",
  },
];

// Dados de exemplo - Originals
const originals = [
  {
    id: "7",
    title: "Halo",
    thumbnail: "https://picsum.photos/seed/halo/400/600",
    category: "Ficção Científica",
  },
  {
    id: "8",
    title: "SEAL",
    thumbnail: "https://picsum.photos/seed/seal/400/600",
    category: "Ação",
  },
  {
    id: "9",
    title: "Mayor of Kingstown",
    thumbnail: "https://picsum.photos/seed/mayor/400/600",
    category: "Drama",
  },
  {
    id: "10",
    title: "Star Trek: Picard",
    thumbnail: "https://picsum.photos/seed/picard/400/600",
    category: "Ficção Científica",
  },
  {
    id: "11",
    title: "1883",
    thumbnail: "https://picsum.photos/seed/1883/400/600",
    category: "Faroeste",
  },
];

interface MovieCardProps {
  title: string;
  thumbnail: string;
  category: string;
  onClick: () => void;
}

const MovieCard = ({ title, thumbnail, category, onClick }: MovieCardProps) => (
  <div
    onClick={onClick}
    className="relative group cursor-pointer transition-all duration-300 w-full"
  >
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md">
      <img
        src={thumbnail}
        alt={title}
        className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2">{title}</h3>
          <p className="text-gray-300 text-xs mt-1">{category}</p>
        </div>
      </div>
    </div>
  </div>
);

interface MovieRowProps {
  title: string;
  movies: typeof trendingMovies;
  onMovieClick: (id: string) => void;
}

const MovieRow = ({ title, movies, onMovieClick }: MovieRowProps) => (
  <section className="mb-12">
    <div className="flex items-center mb-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="ml-2 w-2 h-2 rounded-full bg-red-600"></div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          thumbnail={movie.thumbnail}
          category={movie.category}
          onClick={() => onMovieClick(movie.id)}
        />
      ))}
    </div>
  </section>
);

export function FreeContent() {
  const navigate = useNavigate();

  const handleMovieClick = (id: string) => {
    navigate(`/watch/${id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Conteúdos Grátis</h1>
        
        <MovieRow
          title="Trending Movies"
          movies={trendingMovies}
          onMovieClick={handleMovieClick}
        />
        
        <MovieRow
          title="Originals"
          movies={originals}
          onMovieClick={handleMovieClick}
        />
      </div>
    </MainLayout>
  );
} 