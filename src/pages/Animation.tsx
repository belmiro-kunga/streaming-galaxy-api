import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FeaturedSlider, type FeaturedItem } from "@/components/FeaturedSlider";

// Dados de exemplo - Animações em Destaque
const featuredAnimations = [
  {
    id: "1",
    title: "Elementos",
    description: "Em uma cidade onde os elementos do fogo, água, terra e ar vivem em harmonia, uma jovem mulher flamejante e um rapaz que vai com o fluxo estão prestes a descobrir algo elementar: o quanto realmente têm em comum.",
    thumbnail: "https://picsum.photos/seed/elementos/1920/1080",
    logo: "https://picsum.photos/seed/elementos-logo/400/200",
    year: 2023,
    duration: "1h 42min",
    rating: "Livre",
    studio: "Pixar",
  },
  {
    id: "2",
    title: "Encanto",
    description: "Uma jovem colombiana pode ser a última esperança para sua família excepcional, quando descobre que a magia que cerca sua casa está em perigo.",
    thumbnail: "https://picsum.photos/seed/encanto/1920/1080",
    logo: "https://picsum.photos/seed/encanto-logo/400/200",
    year: 2021,
    duration: "1h 49min",
    rating: "Livre",
    studio: "Disney",
  },
];

// Coleções
const collections = [
  {
    id: "pixar",
    title: "Pixar",
    image: "https://picsum.photos/seed/pixar/400/200",
  },
  {
    id: "disney",
    title: "Disney Animation",
    image: "https://picsum.photos/seed/disney/400/200",
  },
  {
    id: "dreamworks",
    title: "DreamWorks",
    image: "https://picsum.photos/seed/dreamworks/400/200",
  },
];

// Animações Populares
const popularAnimations = [
  {
    id: "3",
    title: "Moana",
    thumbnail: "https://picsum.photos/seed/moana/400/600",
    year: 2016,
    studio: "Disney",
  },
  {
    id: "4",
    title: "Toy Story 4",
    thumbnail: "https://picsum.photos/seed/toystory4/400/600",
    year: 2019,
    studio: "Pixar",
  },
  {
    id: "5",
    title: "Frozen 2",
    thumbnail: "https://picsum.photos/seed/frozen2/400/600",
    year: 2019,
    studio: "Disney",
  },
];

const CollectionCard = ({ collection, onClick }: { collection: typeof collections[0], onClick: () => void }) => (
  <div
    onClick={onClick}
    className="relative aspect-[16/9] rounded-lg overflow-hidden group cursor-pointer"
  >
    <img
      src={collection.image}
      alt={collection.title}
      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
      <h3 className="text-white font-semibold text-sm sm:text-base">{collection.title}</h3>
    </div>
  </div>
);

export function Animation() {
  const navigate = useNavigate();

  const handleAnimationClick = (id: string) => {
    navigate(`/watch/${id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6 py-4">
        {/* Hero Section */}
        <div className="w-full lg:container lg:mx-auto lg:px-8 xl:px-14 2xl:px-20">
          <div className="lg:rounded-xl lg:overflow-hidden">
            <FeaturedSlider
              items={featuredAnimations as FeaturedItem[]}
              onItemClick={handleAnimationClick}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 xl:px-14 2xl:px-20">
          {/* Coleções */}
          <section className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Coleções</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onClick={() => navigate(`/collection/${collection.id}`)}
                />
              ))}
            </div>
          </section>

          {/* Populares */}
          <FeaturedSlider
            title="Populares na Disney+"
            items={popularAnimations as FeaturedItem[]}
            onItemClick={handleAnimationClick}
            aspectRatio="aspect-[21/9]"
            showGradients={false}
          />
        </div>
      </div>
    </MainLayout>
  );
} 