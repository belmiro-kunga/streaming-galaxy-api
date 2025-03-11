import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, Plus, Star, Info, ChevronLeft } from "lucide-react";
import { FeaturedSlider, type FeaturedItem } from "@/components/FeaturedSlider";

// Dados de exemplo - Doramas em Destaque
const featuredDoramas = [
  {
    id: "1",
    title: "True Beauty",
    description: "Uma estudante do ensino médio se torna popular depois de dominar a arte da maquiagem através de tutoriais do YouTube. Mas o que acontece quando seu crush a vê sem maquiagem?",
    thumbnail: "https://picsum.photos/seed/truebeauty/1920/1080",
    logo: "https://picsum.photos/seed/truebeauty-logo/400/200",
    year: 2023,
    duration: "1h 10min",
    rating: "13+",
    studio: "tvN",
    episodes: 16,
    country: "Coreia do Sul"
  },
  {
    id: "2",
    title: "Boys Over Flowers",
    description: "Uma garota comum entra em uma escola de elite e enfrenta o F4, um grupo dos garotos mais populares da escola.",
    thumbnail: "https://picsum.photos/seed/boysoverflowers/1920/1080",
    logo: "https://picsum.photos/seed/boysoverflowers-logo/400/200",
    year: 2009,
    duration: "1h 5min",
    rating: "12+",
    studio: "KBS2",
    episodes: 25,
    country: "Coreia do Sul"
  },
];

// Categorias de Doramas
const categories = [
  {
    id: "romance",
    title: "Romance",
    image: "https://picsum.photos/seed/romance/400/200",
  },
  {
    id: "comedia",
    title: "Comédia",
    image: "https://picsum.photos/seed/comedia/400/200",
  },
  {
    id: "drama",
    title: "Drama",
    image: "https://picsum.photos/seed/drama/400/200",
  },
  {
    id: "acao",
    title: "Ação",
    image: "https://picsum.photos/seed/acao/400/200",
  },
];

// Doramas Populares
const popularDoramas = [
  {
    id: "3",
    title: "Descendentes do Sol",
    thumbnail: "https://picsum.photos/seed/descendants/400/600",
    year: 2016,
    studio: "KBS2",
    rating: "14+",
    episodes: 16,
  },
  {
    id: "4",
    title: "Goblin",
    thumbnail: "https://picsum.photos/seed/goblin/400/600",
    year: 2016,
    studio: "tvN",
    rating: "14+",
    episodes: 16,
  },
  {
    id: "5",
    title: "Heirs",
    thumbnail: "https://picsum.photos/seed/heirs/400/600",
    year: 2013,
    studio: "SBS",
    rating: "12+",
    episodes: 20,
  },
];

// Doramas em Alta
const trendingDoramas = [
  {
    id: "6",
    title: "Hospital Playlist",
    thumbnail: "https://picsum.photos/seed/hospital/400/600",
    year: 2020,
    studio: "tvN",
    rating: "14+",
    episodes: 12,
  },
  {
    id: "7",
    title: "Reply 1988",
    thumbnail: "https://picsum.photos/seed/reply1988/400/600",
    year: 2015,
    studio: "tvN",
    rating: "12+",
    episodes: 20,
  },
  {
    id: "8",
    title: "Signal",
    thumbnail: "https://picsum.photos/seed/signal/400/600",
    year: 2016,
    studio: "tvN",
    rating: "16+",
    episodes: 16,
  },
];

const CategoryCard = ({ category, onClick }: { category: typeof categories[0], onClick: () => void }) => (
  <div
    onClick={onClick}
    className="relative aspect-[16/9] rounded-lg overflow-hidden group cursor-pointer"
  >
    <img
      src={category.image}
      alt={category.title}
      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
      <h3 className="text-white font-semibold text-sm sm:text-base">{category.title}</h3>
    </div>
  </div>
);

const DoramaCard = ({ dorama, onClick }: { dorama: FeaturedItem, onClick: () => void }) => (
  <div
    onClick={onClick}
    className="relative aspect-[2/3] rounded-lg overflow-hidden group cursor-pointer"
  >
    <img
      src={dorama.thumbnail}
      alt={dorama.title}
      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{dorama.title}</h3>
        <div className="flex items-center text-gray-300 text-xs space-x-2">
          <span>{dorama.year}</span>
          <span>•</span>
          <span>{dorama.episodes} eps</span>
          {dorama.rating && (
            <>
              <span>•</span>
              <span>{dorama.rating}</span>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

const DoramaGrid = ({ title, items, onItemClick }: { title: string, items: FeaturedItem[], onItemClick: (id: string) => void }) => (
  <section className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
      <Button variant="ghost" className="text-gray-400 hover:text-white text-xs sm:text-sm">
        Ver Todos <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
      </Button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {items.map((item) => (
        <DoramaCard
          key={item.id}
          dorama={item}
          onClick={() => onItemClick(item.id)}
        />
      ))}
    </div>
  </section>
);

export function Dorama() {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);

  const handleDoramaClick = (id: string) => {
    navigate(`/watch/${id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6 py-4">
        {/* Hero Section */}
        <div className="w-full lg:container lg:mx-auto lg:px-8 xl:px-14 2xl:px-20">
          <div className="lg:rounded-xl lg:overflow-hidden">
            <FeaturedSlider
              items={featuredDoramas as FeaturedItem[]}
              onItemClick={handleDoramaClick}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 xl:px-14 2xl:px-20">
          {/* Categorias */}
          <section className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Categorias</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => navigate(`/category/${category.id}`)}
                />
              ))}
            </div>
          </section>

          {/* Populares */}
          <DoramaGrid
            title="Populares"
            items={popularDoramas as FeaturedItem[]}
            onItemClick={handleDoramaClick}
          />

          {/* Em Alta */}
          <DoramaGrid
            title="Em Alta"
            items={trendingDoramas as FeaturedItem[]}
            onItemClick={handleDoramaClick}
          />
        </div>
      </div>
    </MainLayout>
  );
} 