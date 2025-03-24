
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImportCSV from './ImportCSV';
import CsvTemplateDownloader from './CsvTemplateDownloader';
import { FileText, Upload, FileDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ImportContentTab = () => {
  const [activeTab, setActiveTab] = useState('import');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Importar Conteúdo</h1>
          <p className="text-muted-foreground mt-1">
            Importe conteúdo usando arquivos CSV ou baixe templates
          </p>
        </div>
        
        <CsvTemplateDownloader />
      </div>
      
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> 
            Importar
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> 
            Instruções
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="mt-6">
          <ImportCSV />
        </TabsContent>
        
        <TabsContent value="info" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Como importar conteúdo</CardTitle>
              <CardDescription>
                Aprenda como preparar e importar seus dados corretamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. Prepare seu arquivo CSV</h3>
                <p className="text-sm text-muted-foreground">
                  Baixe um de nossos templates ou crie um arquivo CSV seguindo o formato especificado. 
                  Certifique-se de que todas as colunas obrigatórias estejam preenchidas.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">2. Verifique os dados</h3>
                <p className="text-sm text-muted-foreground">
                  Antes de importar, verifique se os dados estão corretos e completos. Isso evitará erros durante a importação.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">3. Faça upload do arquivo</h3>
                <p className="text-sm text-muted-foreground">
                  Na aba de importação, arraste e solte seu arquivo CSV ou clique para selecioná-lo do seu computador.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">4. Revise e confirme</h3>
                <p className="text-sm text-muted-foreground">
                  Após o upload, revise os dados antes de confirmar a importação.
                </p>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setActiveTab('import')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <FileDown className="h-4 w-4" />
                  Baixar Template CSV
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportContentTab;
