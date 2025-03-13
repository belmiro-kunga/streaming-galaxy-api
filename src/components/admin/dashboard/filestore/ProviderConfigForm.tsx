
import React from 'react';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Database, Key, Globe, HardDrive } from 'lucide-react';
import { StorageConfig } from './types';

interface ProviderConfigFormProps {
  config: StorageConfig;
  setConfig: (config: StorageConfig) => void;
  onSubmit: (e: React.FormEvent) => void;
  provider: string;
  handleDefaultChange: (provider: string, isDefault: boolean) => void;
}

export const ProviderConfigForm = ({ 
  config, 
  setConfig, 
  onSubmit, 
  provider,
  handleDefaultChange 
}: ProviderConfigFormProps) => {
  return (
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
};
