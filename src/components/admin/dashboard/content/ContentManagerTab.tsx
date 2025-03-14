
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Film, Tv, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import MediaContentTab from './MediaContentTab';
import TVChannelsTab from './TVChannelsTab';
import ContentForm from './ContentForm';

export default function ContentManagerTab() {
  const [activeTab, setActiveTab] = useState("media");
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Conteúdo</h2>
          <p className="text-gray-400 mt-1">
            Gerencie filmes, séries e canais de TV disponíveis na plataforma
          </p>
        </div>
        <Button className="bg-primary dark:bg-violet-600" onClick={() => setIsFormDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Conteúdo
        </Button>
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

      {/* Dialog para adicionar novo conteúdo */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-800 p-0">
          <ContentForm 
            onCancel={() => setIsFormDialogOpen(false)}
            onSubmit={(data) => {
              console.log('Conteúdo salvo:', data);
              setIsFormDialogOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
