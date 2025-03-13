
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFileStore } from './filestore/useFileStore';
import { ProviderConfigForm } from './filestore/ProviderConfigForm';

const FileStoreForm = () => {
  const { 
    wasabiConfig, 
    cloudflareConfig, 
    setWasabiConfig, 
    setCloudflareConfig, 
    handleWasabiSubmit, 
    handleCloudflareSubmit, 
    handleDefaultChange 
  } = useFileStore();

  return (
    <Card className="bg-gray-950 border-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Configuração de Armazenamento</CardTitle>
        <CardDescription className="text-gray-400">
          Configure os serviços de armazenamento para seus arquivos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wasabi" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger 
              value="wasabi"
              className="data-[state=active]:bg-blue-600"
            >
              Wasabi {wasabiConfig.isDefault && '(Padrão)'}
            </TabsTrigger>
            <TabsTrigger 
              value="cloudflare"
              className="data-[state=active]:bg-blue-600"
            >
              Cloudflare {cloudflareConfig.isDefault && '(Padrão)'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="wasabi">
            <ProviderConfigForm 
              config={wasabiConfig} 
              setConfig={setWasabiConfig} 
              onSubmit={handleWasabiSubmit}
              provider="wasabi"
              handleDefaultChange={handleDefaultChange}
            />
          </TabsContent>
          <TabsContent value="cloudflare">
            <ProviderConfigForm 
              config={cloudflareConfig} 
              setConfig={setCloudflareConfig} 
              onSubmit={handleCloudflareSubmit}
              provider="cloudflare"
              handleDefaultChange={handleDefaultChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FileStoreForm;
