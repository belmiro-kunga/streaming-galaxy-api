
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Film, Tv } from "lucide-react";
import MediaContentTab from './MediaContentTab';
import TVChannelsTab from './TVChannelsTab';

export default function ContentManagerTab() {
  const [activeTab, setActiveTab] = useState("media");
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Gerenciamento de Conteúdo</h2>
        <p className="text-gray-400 mt-1">
          Gerencie filmes, séries e canais de TV disponíveis na plataforma
        </p>
      </div>
      
      <Tabs defaultValue="media" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-gray-800 mb-6">
          <TabsTrigger value="media" className="flex-1">
            <Film className="mr-2 h-4 w-4" /> Filmes e Séries
          </TabsTrigger>
          <TabsTrigger value="tv" className="flex-1">
            <Tv className="mr-2 h-4 w-4" /> Canais de TV
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="media">
          <MediaContentTab />
        </TabsContent>
        
        <TabsContent value="tv">
          <TVChannelsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
