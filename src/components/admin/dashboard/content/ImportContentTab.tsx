
import React from 'react';
import ImportCSV from './ImportCSV';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, Info } from 'lucide-react';
import CsvTemplateDownloader from './CsvTemplateDownloader';

const ImportContentTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Importação de Conteúdo</h2>
          <p className="text-muted-foreground">
            Importe seu catálogo de filmes e séries usando arquivos CSV
          </p>
        </div>
        <CsvTemplateDownloader />
      </div>
      
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="import">
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </TabsTrigger>
          <TabsTrigger value="instructions">
            <Info className="h-4 w-4 mr-2" />
            Instruções
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="mt-6">
          <ImportCSV />
        </TabsContent>
        
        <TabsContent value="instructions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Como importar conteúdo</CardTitle>
              <CardDescription>
                Siga estas instruções para importar corretamente seu catálogo
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-base mb-3">Estrutura para Filmes:</h4>
                  <p className="mb-2">Cada linha representa um filme e deve conter:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Título (obrigatório)</li>
                    <li>Título Original (obrigatório)</li>
                    <li>Ano (obrigatório)</li>
                    <li>Gênero (obrigatório)</li>
                    <li>Origem (obrigatório)</li>
                    <li>Duração (obrigatório)</li>
                    <li>Diretor (obrigatório)</li>
                    <li>Elenco (obrigatório)</li>
                    <li>Idade (obrigatório)</li>
                    <li>Diretório (obrigatório)</li>
                    <li>Thumbnail (opcional)</li>
                    <li>Link_480p (opcional)</li>
                    <li>Link_720p (opcional)</li>
                    <li>Link_1080p (opcional)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-base mb-3">Estrutura para Séries:</h4>
                  <p className="mb-2">Cada linha representa um episódio e deve conter:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Título (obrigatório)</li>
                    <li>Título Original (obrigatório)</li>
                    <li>Ano (obrigatório)</li>
                    <li>Gênero (obrigatório)</li>
                    <li>Origem (obrigatório)</li>
                    <li>Diretor (obrigatório)</li>
                    <li>Elenco (obrigatório)</li>
                    <li>Idade (obrigatório)</li>
                    <li>Temporada (obrigatório)</li>
                    <li>Número Temporadas (obrigatório)</li>
                    <li>Episódio (obrigatório)</li>
                    <li>Título Episódio (obrigatório)</li>
                    <li>Duração (obrigatório)</li>
                    <li>Diretório (obrigatório)</li>
                    <li>Thumbnail (opcional)</li>
                    <li>Link_480p (opcional)</li>
                    <li>Link_720p (opcional)</li>
                    <li>Link_1080p (opcional)</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-base mb-3">Diretórios Disponíveis:</h4>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  <div className="bg-muted px-3 py-2 rounded-md">Netflix</div>
                  <div className="bg-muted px-3 py-2 rounded-md">Prime Video</div>
                  <div className="bg-muted px-3 py-2 rounded-md">Disney Plus</div>
                  <div className="bg-muted px-3 py-2 rounded-md">Max</div>
                  <div className="bg-muted px-3 py-2 rounded-md">Paramount Plus</div>
                  <div className="bg-muted px-3 py-2 rounded-md">Globoplay</div>
                  <div className="bg-muted px-3 py-2 rounded-md">Hulu</div>
                  <div className="bg-muted px-3 py-2 rounded-md">Crunchyroll</div>
                  <div className="bg-muted px-3 py-2 rounded-md">Cinema</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-base mb-3">Processo de Importação:</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Faça o download do template usando o botão "Baixar Template CSV"</li>
                  <li>Preencha o arquivo com seus dados</li>
                  <li>Faça o upload do arquivo CSV</li>
                  <li>O sistema validará o arquivo e mostrará uma prévia</li>
                  <li>Clique em "Importar" para iniciar o processo</li>
                  <li>Após a importação, todos os conteúdos terão status pendente</li>
                  <li>Verifique e aprove os conteúdos importados na seção "Filmes e Séries"</li>
                </ol>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">Observações Importantes:</h4>
                <ul className="list-disc pl-5 space-y-1 text-amber-700 dark:text-amber-400">
                  <li>O sistema identifica automaticamente filmes e séries pela presença dos campos de temporada</li>
                  <li>Os campos de link para vídeos são opcionais</li>
                  <li>O valor no campo "Diretório" determina em qual seção do site o conteúdo será exibido</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportContentTab;
