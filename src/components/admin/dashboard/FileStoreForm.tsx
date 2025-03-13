import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminDashboard } from '@/contexts/admin/AdminDashboardContext';
import { Database, Key, Globe, HardDrive } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface StorageConfig {
  driverName: string;
  apiKey: string;
  secretKey: string;
  region: string;
  bucketName: string;
  endpoint: string;
  isDefault: boolean;
}

const FileStoreForm = () => {
  const { wasabiConfig, cloudflareConfig, setWasabiConfig, setCloudflareConfig } = useAdminDashboard();

  const handleWasabiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Wasabi Config:', wasabiConfig);
    // Implementar lógica de salvamento
  };

  const handleCloudflareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cloudflare Config:', cloudflareConfig);
    // Implementar lógica de salvamento
  };

  const handleDefaultChange = (provider: string, isDefault: boolean) => {
    if (isDefault) {
      // Se este provedor está sendo definido como padrão, desativa o outro
      if (provider === 'wasabi') {
        setWasabiConfig({ ...wasabiConfig, isDefault: true });
        setCloudflareConfig({ ...cloudflareConfig, isDefault: false });
      } else {
        setWasabiConfig({ ...wasabiConfig, isDefault: false });
        setCloudflareConfig({ ...cloudflareConfig, isDefault: true });
      }
    } else {
      // Se está sendo desativado, apenas atualiza este provedor
      if (provider === 'wasabi') {
        setWasabiConfig({ ...wasabiConfig, isDefault: false });
      } else {
        setCloudflareConfig({ ...cloudflareConfig, isDefault: false });
      }
    }
  };

  const ConfigForm = ({ config, setConfig, onSubmit, provider }: any) => (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription className="text-gray-400">
            Configure suas credenciais de acesso para o {provider}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Label htmlFor={`${provider}-default`} className="text-sm text-gray-400">
              Serviço Padrão
            </Label>
            <Switch
              id={`${provider}-default`}
              checked={config.isDefault}
              onCheckedChange={(checked) => handleDefaultChange(provider, checked)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${provider}-driverName`} className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Driver Name
                </Label>
                <Input
                  id={`${provider}-driverName`}
                  value={config.driverName}
                  onChange={(e) => setConfig({ ...config, driverName: e.target.value })}
                  placeholder="Nome do driver"
                  className="bg-gray-900 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${provider}-region`} className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Region
                </Label>
                <Input
                  id={`${provider}-region`}
                  value={config.region}
                  onChange={(e) => setConfig({ ...config, region: e.target.value })}
                  placeholder="Região do serviço"
                  className="bg-gray-900 border-gray-800"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${provider}-apiKey`} className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  API Key
                </Label>
                <Input
                  id={`${provider}-apiKey`}
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="Sua chave de API"
                  className="bg-gray-900 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${provider}-secretKey`} className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Secret Key
                </Label>
                <Input
                  id={`${provider}-secretKey`}
                  type="password"
                  value={config.secretKey}
                  onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
                  placeholder="Sua chave secreta"
                  className="bg-gray-900 border-gray-800"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${provider}-bucketName`} className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Bucket Name
                </Label>
                <Input
                  id={`${provider}-bucketName`}
                  value={config.bucketName}
                  onChange={(e) => setConfig({ ...config, bucketName: e.target.value })}
                  placeholder="Nome do bucket"
                  className="bg-gray-900 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${provider}-endpoint`} className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Endpoint
                </Label>
                <Input
                  id={`${provider}-endpoint`}
                  value={config.endpoint}
                  onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                  placeholder="URL do endpoint"
                  className="bg-gray-900 border-gray-800"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Salvar Configuração
          </Button>
        </form>
      </CardContent>
    </Card>
  );

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
            <ConfigForm 
              config={wasabiConfig} 
              setConfig={setWasabiConfig} 
              onSubmit={handleWasabiSubmit}
              provider="wasabi"
            />
          </TabsContent>
          <TabsContent value="cloudflare">
            <ConfigForm 
              config={cloudflareConfig} 
              setConfig={setCloudflareConfig} 
              onSubmit={handleCloudflareSubmit}
              provider="cloudflare"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FileStoreForm; 