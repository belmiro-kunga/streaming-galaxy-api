
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GenreFilterProps } from '@/types/ui';

export const GenreFilter = ({ genres, activeGenres, toggleGenre }: GenreFilterProps) => {
  return (
    <ScrollArea className="whitespace-nowrap pb-4">
      <div className="flex space-x-2 py-2">
        {genres.map((genre) => {
          const isActive = activeGenres.includes(genre.id);
          return (
            <Button
              key={genre.id}
              onClick={() => toggleGenre(genre.id)}
              className={
                isActive
                  ? "bg-red-600 hover:bg-red-700 text-white rounded-full px-6"
                  : "text-white bg-gray-800/60 border-gray-700 hover:bg-gray-700 rounded-full px-6"
              }
              variant={isActive ? "default" : "outline"}
            >
              {genre.nome}
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
};
