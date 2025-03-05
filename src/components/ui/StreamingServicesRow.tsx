
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StreamingServiceCard } from '@/components/ui/StreamingServiceCard';
import { Button } from '@/components/ui/button';

export const StreamingServicesRow = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const streamingServices = [
    {
      name: 'Netflix',
      logo: 'https://source.unsplash.com/random/48x48?logo,netflix',
      color: 'bg-gradient-to-br from-red-600 to-red-900',
      link: '/streaming/netflix'
    },
    {
      name: 'HBO Max',
      logo: 'https://source.unsplash.com/random/48x48?logo,hbo',
      color: 'bg-gradient-to-br from-purple-600 to-purple-900',
      link: '/streaming/hbomax'
    },
    {
      name: 'Prime Video',
      logo: 'https://source.unsplash.com/random/48x48?logo,amazon',
      color: 'bg-gradient-to-br from-blue-600 to-blue-900',
      link: '/streaming/primevideo'
    },
    {
      name: 'Disney+',
      logo: 'https://source.unsplash.com/random/48x48?logo,disney',
      color: 'bg-gradient-to-br from-blue-400 to-blue-700',
      link: '/streaming/disneyplus'
    },
    {
      name: 'Apple TV+',
      logo: 'https://source.unsplash.com/random/48x48?logo,apple',
      color: 'bg-gradient-to-br from-gray-600 to-gray-900',
      link: '/streaming/appletv'
    },
    {
      name: 'Paramount+',
      logo: 'https://source.unsplash.com/random/48x48?logo,paramount',
      color: 'bg-gradient-to-br from-blue-500 to-blue-800',
      link: '/streaming/paramountplus'
    },
    {
      name: 'Hulu',
      logo: 'https://source.unsplash.com/random/48x48?logo,hulu',
      color: 'bg-gradient-to-br from-green-500 to-green-800',
      link: '/streaming/hulu'
    },
    {
      name: 'Crunchyroll',
      logo: 'https://source.unsplash.com/random/48x48?logo,crunchyroll',
      color: 'bg-gradient-to-br from-orange-500 to-orange-800',
      link: '/streaming/crunchyroll'
    },
    {
      name: 'Globoplay',
      logo: 'https://source.unsplash.com/random/48x48?logo,globo',
      color: 'bg-gradient-to-br from-red-500 to-red-800',
      link: '/streaming/globoplay'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const scrollAmount = 300; // Adjust scroll amount as needed
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  // Check if we're in TV mode for larger focus indicators
  const isTVMode = window.innerWidth >= 1920;

  return (
    <div className="mb-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Plataformas de Streaming</h2>
        <Button 
          variant="ghost" 
          className="text-sm text-gray-400 flex items-center hover:text-white"
          onClick={() => window.location.href = '/streaming/all'}
        >
          Ver Todos <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <div className="relative group">
        {/* Left scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          tabIndex={0}
        >
          <ChevronLeft className={`${isTVMode ? 'w-8 h-8' : 'w-6 h-6'}`} />
        </Button>
        
        {/* Custom scroll container */}
        <div 
          ref={scrollRef}
          className="overflow-x-auto flex space-x-4 pb-4 scrollbar-hide scroll-smooth"
          style={{ 
            scrollBehavior: 'smooth',
            msOverflowStyle: 'none', /* IE and Edge */
            scrollbarWidth: 'none' /* Firefox */
          }}
        >
          {streamingServices.map((service, index) => (
            <StreamingServiceCard
              key={index}
              name={service.name}
              logo={service.logo}
              color={service.color}
              link={service.link}
            />
          ))}
        </div>
        
        {/* Right scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          tabIndex={0}
        >
          <ChevronRight className={`${isTVMode ? 'w-8 h-8' : 'w-6 h-6'}`} />
        </Button>
      </div>
    </div>
  );
};
