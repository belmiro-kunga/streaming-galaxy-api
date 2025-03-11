import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const streamingServices = [
  {
    id: 'netflix',
    name: 'Netflix',
    image: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png',
    color: 'from-red-800 to-red-600',
    route: '/netflix'
  },
  {
    id: 'disney',
    name: 'Disney Plus',
    image: 'https://cnbl-cdn.bamgrid.com/assets/7ecc8bcb60ad77193058d63e321bd21cbac2fc67281dbd9927676ea4a4c83594/original',
    color: 'from-blue-800 to-blue-600',
    route: '/disney-plus'
  },
  {
    id: 'max',
    name: 'Max',
    image: 'https://play-lh.googleusercontent.com/1iyX7VdQ7MlM7iotI9XDtTwgiVmqFGzqwz10L4ZTrwx5hgDVruX7HKz5JFYbCHBKmQ',
    color: 'from-purple-800 to-purple-600',
    route: '/max'
  },
  {
    id: 'prime',
    name: 'Prime Video',
    image: 'https://m.media-amazon.com/images/G/01/digital/video/web/Logo-min.png',
    color: 'from-blue-900 to-blue-700',
    route: '/prime-video'
  },
  {
    id: 'apple',
    name: 'Apple TV',
    image: 'https://www.apple.com/v/apple-tv-plus/ag/images/meta/apple-tv-plus-logo_dark__dtxdrtsr2ieu_og.png',
    color: 'from-gray-900 to-gray-700',
    route: '/apple-tv'
  },
  {
    id: 'paramount',
    name: 'Paramount Plus',
    image: 'https://www.paramountplus.com/assets/favicon/android-chrome-512x512.png',
    color: 'from-blue-700 to-blue-500',
    route: '/paramount-plus'
  },
  {
    id: 'hulu',
    name: 'Hulu',
    image: 'https://assetshuluimcom-a.akamaihd.net/h3o/facebook_share_thumb_default_hulu.jpg',
    color: 'from-green-700 to-green-500',
    route: '/hulu'
  },
  {
    id: 'globoplay',
    name: 'Globo Play',
    image: 'https://play-lh.googleusercontent.com/FwrIf0Vk1CNhEAK_wIBzQHJB3UxkDfDZwGpGBUZKRBVvlSB0O8KKY6JGHDDpBk6Kpg',
    color: 'from-red-600 to-red-400',
    route: '/globoplay'
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    image: 'https://play-lh.googleusercontent.com/0SAFn-nZhi6XDoMDNk7jWrQZs1Lbqy9zWy_5nfTWraQjDlM9fW4R8wZQp_0b9BJC9g',
    color: 'from-orange-600 to-orange-400',
    route: '/crunchyroll'
  }
];

export const StreamingCards = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group -mt-8">
      {/* Botão de navegação esquerda */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-4 hidden md:block"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Container do carrossel */}
      <div
        ref={scrollContainerRef}
        className="flex flex-nowrap overflow-x-auto gap-2 scrollbar-hide scroll-smooth snap-x snap-mandatory whitespace-nowrap"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {streamingServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(service.route)}
            className={`inline-flex flex-none w-[130px] sm:w-[160px] cursor-pointer bg-gradient-to-br ${service.color} rounded-xl shadow-lg snap-center`}
          >
            <div className="aspect-[4/3] p-3 flex flex-col items-center justify-center">
              <img
                src={service.image}
                alt={service.name}
                className="w-12 h-12 md:w-14 md:h-14 object-contain mb-2"
              />
              <h3 className="text-white text-xs md:text-sm font-semibold text-center whitespace-nowrap">
                {service.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Botão de navegação direita */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-4 hidden md:block"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Gradientes para indicar scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none" />
    </div>
  );
}; 