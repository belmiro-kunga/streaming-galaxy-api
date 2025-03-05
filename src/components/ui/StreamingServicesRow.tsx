
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StreamingServiceCard } from '@/components/ui/StreamingServiceCard';

export const StreamingServicesRow = () => {
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

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Plataformas de Streaming</h2>
      </div>
      <ScrollArea className="overflow-x-auto">
        <div className="flex space-x-4 pb-4">
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
      </ScrollArea>
    </div>
  );
};
