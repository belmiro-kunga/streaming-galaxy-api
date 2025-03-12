import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAdminDashboard } from '@/contexts/admin/AdminDashboardContext';
import { 
  Settings, Image, Bell, CreditCard, Palette, Share2, 
  Power, FileText, Cookie, FileCode, Globe, ChevronRight,
  Building2, Mail, Phone, MapPin, Clock, Layout, 
  Monitor, Smartphone, Type, Palette as ColorPalette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SystemSettings = () => {
  const { systemConfig, setSystemConfig } = useAdminDashboard();
  const [activeSection, setActiveSection] = React.useState('general');

  const sections = [
    {
      id: 'general',
      icon: Settings,
      title: 'Configurações Gerais',
      description: 'Configure as informações fundamentais do site',
      component: GeneralSettings
    },
    {
      id: 'logo',
      icon: Image,
      title: 'Logo e Favicon',
      description: 'Faça upload do seu logo e favicon aqui',
      component: LogoSettings
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notificações',
      description: 'Controle e configure os elementos de notificação do sistema',
      component: NotificationSettings
    },
    {
      id: 'payment',
      icon: CreditCard,
      title: 'Gateways de Pagamento',
      description: 'Configure gateways de pagamento automáticos ou manuais',
      component: PaymentSettings
    },
    {
      id: 'templates',
      icon: Palette,
      title: 'Templates',
      description: 'Controle o template do frontend do sistema',
      component: TemplateSettings
    },
    {
      id: 'social',
      icon: Share2,
      title: 'Login Social',
      description: 'Configure o login através de redes sociais',
      component: SocialLoginSettings
    },
    {
      id: 'maintenance',
      icon: Power,
      title: 'Modo Manutenção',
      description: 'Ative ou desative o modo de manutenção do sistema',
      component: MaintenanceSettings
    },
    {
      id: 'policies',
      icon: FileText,
      title: 'Políticas',
      description: 'Configure suas políticas e termos do sistema aqui',
      component: PolicySettings
    },
    {
      id: 'gdpr',
      icon: Cookie,
      title: 'GDPR Cookie',
      description: 'Configure a política de cookies GDPR se necessário',
      component: GDPRSettings
    },
    {
      id: 'robots',
      icon: FileCode,
      title: 'Robots.txt',
      description: 'Insira o conteúdo do robots.txt aqui',
      component: RobotsSettings
    },
    {
      id: 'extensions',
      icon: Globe,
      title: 'Extensões',
      description: 'Gerencie as extensões do sistema',
      component: ExtensionsSettings
    }
  ];

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || GeneralSettings;

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar de navegação */}
      <Card className="w-80 shrink-0 bg-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl">Configurações</CardTitle>
          <CardDescription>Gerencie seu sistema</CardDescription>
        </CardHeader>
        <ScrollArea className="h-[calc(100vh-15rem)]">
          <div className="space-y-1 p-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors",
                    "hover:bg-gray-800/50",
                    activeSection === section.id ? "bg-blue-600 text-white" : "text-gray-400"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{section.title}</span>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-transform",
                    activeSection === section.id ? "rotate-90" : ""
                  )} />
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </Card>

      {/* Conteúdo principal */}
      <div className="flex-1">
        <Card className="h-full bg-gray-950 border-gray-800">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              {React.createElement(sections.find(s => s.id === activeSection)?.icon || Settings, {
                className: "h-5 w-5"
              })}
              <CardTitle>{sections.find(s => s.id === activeSection)?.title}</CardTitle>
            </div>
            <CardDescription>
              {sections.find(s => s.id === activeSection)?.description}
            </CardDescription>
          </CardHeader>
          <Separator className="bg-gray-800" />
          <CardContent className="pt-6">
            <ActiveComponent config={systemConfig} setConfig={setSystemConfig} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const GeneralSettings = ({ config, setConfig }: any) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [localConfig, setLocalConfig] = React.useState(config.general);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConfig((prev: any) => ({
        ...prev,
        general: localConfig
      }));

      toast({
        title: "Configurações salvas",
        description: "As configurações gerais foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="header">Cabeçalho</TabsTrigger>
          <TabsTrigger value="footer">Rodapé</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Building2 className="h-5 w-5" />
              <h2>Informações do Site</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nome do Site</Label>
                <Input
                  id="siteName"
                  value={localConfig.siteName}
                  onChange={(e) => setLocalConfig({ ...localConfig, siteName: e.target.value })}
                  placeholder="Ex: Streaming Galaxy"
                  className="bg-gray-900 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descrição do Site</Label>
                <Input
                  id="siteDescription"
                  value={localConfig.siteDescription}
                  onChange={(e) => setLocalConfig({ ...localConfig, siteDescription: e.target.value })}
                  placeholder="Uma breve descrição do seu site"
                  className="bg-gray-900 border-gray-800"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteKeywords">Palavras-chave (SEO)</Label>
              <Input
                id="siteKeywords"
                value={localConfig.siteKeywords}
                onChange={(e) => setLocalConfig({ ...localConfig, siteKeywords: e.target.value })}
                placeholder="streaming, filmes, séries, etc"
                className="bg-gray-900 border-gray-800"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          {/* Layout e Aparência */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Layout className="h-5 w-5" />
              <h2>Layout e Aparência</h2>
            </div>
            
            <div className="grid gap-6">
              {/* Layout Responsivo */}
              <div className="space-y-4">
                <Label className="text-base">Layout Responsivo</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span>Layout Desktop</span>
                      </div>
                      <p className="text-sm text-gray-400">Configurar visualização desktop</p>
                    </div>
                    <Switch
                      checked={localConfig.desktopLayout}
                      onCheckedChange={(checked) => 
                        setLocalConfig({ ...localConfig, desktopLayout: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span>Layout Mobile</span>
                      </div>
                      <p className="text-sm text-gray-400">Configurar visualização mobile</p>
                    </div>
                    <Switch
                      checked={localConfig.mobileLayout}
                      onCheckedChange={(checked) => 
                        setLocalConfig({ ...localConfig, mobileLayout: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Tipografia */}
              <div className="space-y-4">
                <Label className="text-base">Tipografia</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryFont">Fonte Principal</Label>
                    <Select
                      value={localConfig.primaryFont}
                      onValueChange={(value) => setLocalConfig({ ...localConfig, primaryFont: value })}
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-800">
                        <SelectValue placeholder="Selecione a fonte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="poppins">Poppins</SelectItem>
                        <SelectItem value="opensans">Open Sans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Tamanho da Fonte Base</Label>
                    <Select
                      value={localConfig.fontSize}
                      onValueChange={(value) => setLocalConfig({ ...localConfig, fontSize: value })}
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-800">
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Pequeno (14px)</SelectItem>
                        <SelectItem value="medium">Médio (16px)</SelectItem>
                        <SelectItem value="large">Grande (18px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Cores */}
              <div className="space-y-4">
                <Label className="text-base">Esquema de Cores</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="primaryColor"
                        value={localConfig.primaryColor}
                        onChange={(e) => setLocalConfig({ ...localConfig, primaryColor: e.target.value })}
                        className="w-12 h-12 p-1 bg-gray-900 border-gray-800"
                      />
                      <Input
                        value={localConfig.primaryColor}
                        onChange={(e) => setLocalConfig({ ...localConfig, primaryColor: e.target.value })}
                        className="bg-gray-900 border-gray-800"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="secondaryColor"
                        value={localConfig.secondaryColor}
                        onChange={(e) => setLocalConfig({ ...localConfig, secondaryColor: e.target.value })}
                        className="w-12 h-12 p-1 bg-gray-900 border-gray-800"
                      />
                      <Input
                        value={localConfig.secondaryColor}
                        onChange={(e) => setLocalConfig({ ...localConfig, secondaryColor: e.target.value })}
                        className="bg-gray-900 border-gray-800"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Cor de Destaque</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="accentColor"
                        value={localConfig.accentColor}
                        onChange={(e) => setLocalConfig({ ...localConfig, accentColor: e.target.value })}
                        className="w-12 h-12 p-1 bg-gray-900 border-gray-800"
                      />
                      <Input
                        value={localConfig.accentColor}
                        onChange={(e) => setLocalConfig({ ...localConfig, accentColor: e.target.value })}
                        className="bg-gray-900 border-gray-800"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="header" className="space-y-6">
          {/* Configurações do Cabeçalho */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Layout className="h-5 w-5" />
              <h2>Configurações do Cabeçalho</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800">
                <div className="space-y-1">
                  <span>Menu Principal</span>
                  <p className="text-sm text-gray-400">Exibir menu de navegação principal</p>
                </div>
                <Switch
                  checked={localConfig.showMainMenu}
                  onCheckedChange={(checked) => 
                    setLocalConfig({ ...localConfig, showMainMenu: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800">
                <div className="space-y-1">
                  <span>Barra de Busca</span>
                  <p className="text-sm text-gray-400">Exibir barra de busca no cabeçalho</p>
                </div>
                <Switch
                  checked={localConfig.showSearchBar}
                  onCheckedChange={(checked) => 
                    setLocalConfig({ ...localConfig, showSearchBar: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800">
                <div className="space-y-1">
                  <span>Botão de Login</span>
                  <p className="text-sm text-gray-400">Exibir botão de login/registro</p>
                </div>
                <Switch
                  checked={localConfig.showLoginButton}
                  onCheckedChange={(checked) => 
                    setLocalConfig({ ...localConfig, showLoginButton: checked })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="menuItems">Itens do Menu</Label>
              <Textarea
                id="menuItems"
                value={localConfig.menuItems}
                onChange={(e) => setLocalConfig({ ...localConfig, menuItems: e.target.value })}
                placeholder="Home, Filmes, Séries, Categorias"
                className="min-h-[100px] bg-gray-900 border-gray-800"
              />
              <p className="text-sm text-gray-400">Separe os itens do menu por vírgula</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          {/* Configurações do Rodapé */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Layout className="h-5 w-5" />
              <h2>Configurações do Rodapé</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800">
                <div className="space-y-1">
                  <span>Links do Rodapé</span>
                  <p className="text-sm text-gray-400">Exibir links de navegação no rodapé</p>
                </div>
                <Switch
                  checked={localConfig.showFooterLinks}
                  onCheckedChange={(checked) => 
                    setLocalConfig({ ...localConfig, showFooterLinks: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800">
                <div className="space-y-1">
                  <span>Redes Sociais</span>
                  <p className="text-sm text-gray-400">Exibir ícones de redes sociais</p>
                </div>
                <Switch
                  checked={localConfig.showSocialIcons}
                  onCheckedChange={(checked) => 
                    setLocalConfig({ ...localConfig, showSocialIcons: checked })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="footerText">Texto do Rodapé</Label>
              <Textarea
                id="footerText"
                value={localConfig.footerText}
                onChange={(e) => setLocalConfig({ ...localConfig, footerText: e.target.value })}
                placeholder="© 2024 Streaming Galaxy. Todos os direitos reservados."
                className="min-h-[100px] bg-gray-900 border-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="socialLinks">Links Sociais</Label>
              <Textarea
                id="socialLinks"
                value={localConfig.socialLinks}
                onChange={(e) => setLocalConfig({ ...localConfig, socialLinks: e.target.value })}
                placeholder="Facebook: url, Instagram: url, Twitter: url"
                className="min-h-[100px] bg-gray-900 border-gray-800"
              />
              <p className="text-sm text-gray-400">Formato: Nome: URL (um por linha)</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
};

const LogoSettings = ({ config, setConfig }: any) => (
  <div className="space-y-6">
    {/* Implementar upload de imagens */}
  </div>
);

const NotificationSettings = ({ config, setConfig }: any) => (
  <div className="space-y-6">
    {/* Implementar configurações de notificações */}
  </div>
);

const PaymentSettings = ({ config, setConfig }: any) => (
  <div className="space-y-6">
    {/* Implementar configurações de pagamento */}
  </div>
);

const TemplateSettings = ({ config, setConfig }: any) => (
  <div className="space-y-6">
    {/* Implementar configurações de template */}
  </div>
);

const SocialLoginSettings = ({ config, setConfig }: any) => (
  <div className="space-y-6">
    {/* Implementar configurações de login social */}
  </div>
);

const MaintenanceSettings = ({ config, setConfig }: any) => (
  <div className="space-y-6">
    {/* Implementar configurações de modo manutenção */}
  </div>
);

const PolicySettings = ({ config, setConfig }: any) => (
  <div className="space-y-6">
    {/* Implementar configurações de políticas */}
  </div>
);

const GDPRSettings = ({ config, setConfig }: any) => (
  <div className="space-y-6">
    {/* Implementar configurações GDPR */}
  </div>
);

const RobotsSettings = ({ robotsTxt, setConfig }: any) => (
  <div className="space-y-6">
    {/* Implementar configurações do robots.txt */}
  </div>
);

const ExtensionsSettings = () => (
  <div className="space-y-6">
    {/* Implementar gerenciamento de extensões */}
  </div>
);

export default SystemSettings; 