import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronRight, Flame, Star, Clock, Calendar, ChevronLeft } from "lucide-react";

// Dados de exemplo - Animes em Destaque
const featuredAnimes = [
  {
    id: "1",
    title: "Demon Slayer",
    thumbnail: "https://picsum.photos/seed/demonslayer/800/450",
    episodios: 26,
    categoria: "Ação, Fantasia",
    rating: 4.8,
  },
  {
    id: "2",
    title: "Attack on Titan",
    thumbnail: "https://picsum.photos/seed/aot/800/450",
    episodios: 87,
    categoria: "Ação, Drama",
    rating: 4.9,
  },
  {
    id: "3",
    title: "Jujutsu Kaisen",
    thumbnail: "https://picsum.photos/seed/jjk/800/450",
    episodios: 24,
    categoria: "Ação, Sobrenatural",
    rating: 4.7,
  },
];

// Dados de exemplo - Lançamentos da Temporada
const seasonalAnimes = [
  {
    id: "4",
    title: "Solo Leveling",
    thumbnail: "https://picsum.photos/seed/solo/400/600",
    episodios: 12,
    categoria: "Ação, Fantasia",
    ultimoEp: "EP 8",
    dia: "Sábado",
  },
  {
    id: "5",
    title: "Mashle",
    thumbnail: "https://picsum.photos/seed/mashle/400/600",
    episodios: 12,
    categoria: "Comédia, Fantasia",
    ultimoEp: "EP 6",
    dia: "Domingo",
  },
  {
    id: "6",
    title: "Blue Exorcist S3",
    thumbnail: "https://picsum.photos/seed/blueexorcist/400/600",
    episodios: 12,
    categoria: "Ação, Sobrenatural",
    ultimoEp: "EP 7",
    dia: "Quinta",
  },
];

// Dados de exemplo - Populares
const popularAnimes = [
  {
    id: "7",
    title: "One Piece",
    thumbnail: "https://picsum.photos/seed/onepiece/400/600",
    episodios: 1000,
    categoria: "Aventura, Ação",
    rating: 4.9,
  },
  {
    id: "8",
    title: "Naruto Shippuden",
    thumbnail: "https://picsum.photos/seed/naruto/400/600",
    episodios: 500,
    categoria: "Ação, Aventura",
    rating: 4.8,
  },
  {
    id: "9",
    title: "Dragon Ball Super",
    thumbnail: "https://picsum.photos/seed/dbs/400/600",
    episodios: 131,
    categoria: "Ação, Aventura",
    rating: 4.7,
  },
];

interface AnimeCardProps {
  title: string;
  thumbnail: string;
  episodios: number;
  categoria: string;
  rating?: number;
  ultimoEp?: string;
  dia?: string;
  onClick: () => void;
}

const AnimeCard = ({ title, thumbnail, episodios, categoria, rating, ultimoEp, dia, onClick }: AnimeCardProps) => (
  <div
    onClick={onClick}
    className="relative group cursor-pointer transition-all duration-300 w-full"
  >
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
      <img
        src={thumbnail}
        alt={title}
        className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-sm md:text-base line-clamp-2">{title}</h3>
          <p className="text-gray-300 text-xs mt-1">{categoria}</p>
          <div className="flex items-center mt-2 space-x-2">
            {rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-white text-sm">{rating}</span>
              </div>
            )}
            {ultimoEp && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-blue-400 mr-1" />
                <span className="text-white text-sm">{ultimoEp}</span>
              </div>
            )}
            {dia && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-white text-sm">{dia}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {ultimoEp && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
          NOVO
        </div>
      )}
    </div>
  </div>
);

const FeaturedAnimeCarousel = ({ animes, onAnimeClick }: { animes: typeof featuredAnimes, onAnimeClick: (id: string) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % animes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, animes.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((current) => (current - 1 + animes.length) % animes.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((current) => (current + 1) % animes.length);
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {animes.map((anime) => (
            <div key={anime.id} className="w-full flex-shrink-0">
              <FeaturedAnime anime={anime} onClick={() => onAnimeClick(anime.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Controles do carrossel */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {animes.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-4" : "bg-white/50"
            }`}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const FeaturedAnime = ({ anime, onClick }: { anime: typeof featuredAnimes[0], onClick: () => void }) => (
  <div
    onClick={onClick}
    className="relative aspect-video w-full cursor-pointer group"
  >
    <img
      src={anime.thumbnail}
      alt={anime.title}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{anime.title}</h2>
        <p className="text-gray-300 mb-4">{anime.categoria}</p>
        <div className="flex items-center space-x-4">
          <Button className="bg-red-600 hover:bg-red-700">
            Assistir Agora
          </Button>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            <span className="text-white">{anime.rating}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AnimeGrid = ({ title, animes, onAnimeClick }: { title: string, animes: any[], onAnimeClick: (id: string) => void }) => (
  <section className="mb-12">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="ml-2 w-2 h-2 rounded-full bg-red-600"></div>
      </div>
      <Button variant="ghost" className="text-gray-400 hover:text-white">
        Ver Todos <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
    <div className="relative group">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-4">
          {animes.map((anime) => (
            <div key={anime.id} className="flex-none w-[140px] sm:w-[160px] lg:w-[180px]">
              <AnimeCard
                {...anime}
                onClick={() => onAnimeClick(anime.id)}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Controles de navegação */}
      <div className="absolute left-0 top-0 bottom-0 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute right-0 top-0 bottom-0 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      {/* Gradientes para indicar scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#010B2C] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#010B2C] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  </section>
);

export function Anime() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("populares");

  const handleAnimeClick = (id: string) => {
    navigate(`/watch/${id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-8 py-8">
        {/* Hero Section responsivo */}
        <section className="mb-12">
          {/* Carrossel para Mobile e Tablet */}
          <div className="block lg:hidden">
            <FeaturedAnimeCarousel
              animes={featuredAnimes}
              onAnimeClick={handleAnimeClick}
            />
          </div>

          {/* Grid para Desktop */}
          <div className="hidden lg:block">
            <div className="relative group">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 pb-4">
                  {featuredAnimes.map((anime) => (
                    <div key={anime.id} className="flex-none w-[300px]">
                      <FeaturedAnime
                        anime={anime}
                        onClick={() => handleAnimeClick(anime.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Gradientes para indicar scroll */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#010B2C] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#010B2C] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Tabs de Navegação */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-8 bg-transparent border-b border-gray-800">
            <TabsTrigger
              value="populares"
              className="data-[state=active]:text-white data-[state=active]:border-red-600"
            >
              <Flame className="w-4 h-4 mr-2" />
              Populares
            </TabsTrigger>
            <TabsTrigger
              value="temporada"
              className="data-[state=active]:text-white data-[state=active]:border-red-600"
            >
              <Star className="w-4 h-4 mr-2" />
              Temporada
            </TabsTrigger>
          </TabsList>

          <TabsContent value="populares">
            <AnimeGrid
              title="Animes Populares"
              animes={popularAnimes}
              onAnimeClick={handleAnimeClick}
            />
          </TabsContent>

          <TabsContent value="temporada">
            <AnimeGrid
              title="Lançamentos da Temporada"
              animes={seasonalAnimes}
              onAnimeClick={handleAnimeClick}
            />
          </TabsContent>
        </Tabs>

        {/* Seção de Animes Populares */}
        <AnimeGrid
          title="Mais Assistidos"
          animes={popularAnimes}
          onAnimeClick={handleAnimeClick}
        />

        {/* Seção de Lançamentos */}
        <AnimeGrid
          title="Últimos Episódios"
          animes={seasonalAnimes}
          onAnimeClick={handleAnimeClick}
        />
      </div>
    </MainLayout>
  );
} 