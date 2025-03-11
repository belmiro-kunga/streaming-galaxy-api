import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, Plus, Info, ChevronLeft } from "lucide-react";

export interface FeaturedItem {
  id: string;
  title: string;
  thumbnail: string;
  year: number;
  studio: string;
  description?: string;
  logo?: string;
  duration?: string;
  rating?: string;
  episodes?: number;
  country?: string;
}

interface FeaturedSliderProps {
  title?: string;
  items: FeaturedItem[];
  onItemClick: (id: string) => void;
  aspectRatio?: string;
  showGradients?: boolean;
}

export function FeaturedSlider({ 
  title,
  items,
  onItemClick,
  aspectRatio = "aspect-[2.2/1]",
  showGradients = true,
}: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((current) => (current - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((current) => (current + 1) % items.length);
  };

  return (
    <section className="mb-6 sm:mb-8">
      {title && (
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
          <Button variant="ghost" className="text-gray-400 hover:text-white text-xs sm:text-sm">
            Ver Todos <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </Button>
        </div>
      )}
      <div className={`relative w-full ${aspectRatio} overflow-hidden group`}>
        {/* Container do Carrossel */}
        <div className="absolute inset-0 w-full h-full">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 w-full h-full transition-all duration-[850ms] ease-in-out transform ${
                index === currentIndex
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-[1.15] z-0"
              }`}
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {showGradients && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/25 to-black/90" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
                  <div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-black to-transparent" />
                  <div className="absolute inset-y-0 right-0 w-[20%] bg-gradient-to-l from-black to-transparent" />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 z-20">
          <div className={`transform transition-all duration-500 ${
            currentIndex === 0 ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
          }`}>
            {items[currentIndex].logo && (
              <img
                src={items[currentIndex].logo}
                alt={`${items[currentIndex].title} Logo`}
                className="w-32 sm:w-40 lg:w-44 mb-2 sm:mb-3 drop-shadow-2xl"
              />
            )}
            <div className="space-y-2 sm:space-y-3">
              <p className="text-white text-xs sm:text-sm font-medium">
                {items[currentIndex].year} 
                {items[currentIndex].duration && ` • ${items[currentIndex].duration}`}
                {items[currentIndex].rating && ` • ${items[currentIndex].rating}`}
                {items[currentIndex].episodes && ` • ${items[currentIndex].episodes} eps`}
              </p>
              {items[currentIndex].description && (
                <p className="text-white/90 text-xs sm:text-sm max-w-lg line-clamp-2 sm:line-clamp-3">
                  {items[currentIndex].description}
                </p>
              )}
              <div className="flex items-center space-x-2 sm:space-x-3 pt-2">
                <Button 
                  onClick={() => onItemClick(items[currentIndex].id)} 
                  className="h-8 sm:h-9 bg-white hover:bg-white/90 text-black text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Assistir
                </Button>
                <Button 
                  variant="outline" 
                  className="h-8 sm:h-9 border-2 text-xs sm:text-sm font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Minha Lista
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Controles de Navegação */}
        <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-between z-30">
          <div className="h-full flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              className="w-16 h-full rounded-none bg-black/10 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          </div>
          <div className="h-full flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="w-16 h-full rounded-none bg-black/10 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </div>

        {/* Indicadores */}
        <div className="absolute bottom-6 right-8 flex items-center space-x-1.5 z-30">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? "w-2.5 h-2.5 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/70"
              } rounded-full`}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 