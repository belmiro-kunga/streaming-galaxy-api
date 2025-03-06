
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Film, Tv } from "lucide-react";

const ContentTab = () => {
  // Mock content data for demonstration
  const mockContent = [
    { id: 1, title: "O Poderoso Chefão", type: "filme", category: "Drama", year: 1972, status: "active" },
    { id: 2, title: "Cidade de Deus", type: "filme", category: "Drama", year: 2002, status: "active" },
    { id: 3, title: "Breaking Bad", type: "série", category: "Drama", year: 2008, status: "active" },
    { id: 4, title: "The Boys", type: "série", category: "Ação", year: 2019, status: "active" },
    { id: 5, title: "Pantera Negra", type: "filme", category: "Ação", year: 2018, status: "active" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciamento de Conteúdos</h2>
        <Button className="bg-primary dark:bg-violet-600">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Novo
        </Button>
      </div>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Conteúdos Disponíveis</CardTitle>
          <CardDescription className="text-gray-400">
            Gerencie filmes, séries e documentários disponíveis na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left">Título</th>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-left">Categoria</th>
                  <th className="px-4 py-3 text-left">Ano</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {mockContent.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="px-4 py-3 flex items-center">
                      {item.type === 'filme' ? 
                        <Film className="mr-2 h-4 w-4 text-blue-400" /> : 
                        <Tv className="mr-2 h-4 w-4 text-green-400" />
                      }
                      {item.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.type === 'filme' ? 'bg-blue-900 text-blue-400' : 'bg-green-900 text-green-400'
                      }`}>
                        {item.type === 'filme' ? 'Filme' : 'Série'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3">{item.year}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTab;
