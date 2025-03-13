import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Settings, Image, Bell, CreditCard, 
  Palette, Share2, Loader2,
  ShieldCheck, ScrollText, Bot, 
  PackageOpen, Lock, Moon, Laptop
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAdminDashboard } from '@/contexts/admin/AdminDashboardContext';
import { 
  Power, FileText, Cookie, FileCode, Globe, ChevronRight,
  Building2, Mail, Phone, MapPin, Clock, Layout, 
  Monitor, Smartphone, Type, Palette as ColorPalette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';

// APIs
const siteConfigAPI = {
  getConfig: async () => {
    const { data, error } = await supabase
      .from('system_config')
      .select('*')
      .single();
    return { data, error };
  },
  updateConfig: async (config: any) => {
    const { error } = await supabase
      .from('system_config')
      .upsert(config);
    return { error };
  }
};

const uploadAPI = {
  getSiteConfig: async () => {
    const { data, error } = await supabase
      .from('system_config')
      .select('logo, favicon')
      .single();
    return { data, error };
  },
  uploadImage: async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file);

    if (uploadError) {
      return { error: uploadError };
    }

    const { data } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  },
  updateSiteConfig: async (config: any) => {
    const { error } = await supabase
      .from('system_config')
      .upsert(config);
    return { error };
  }
};

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
  const [localConfig, setLocalConfig] = useState(config || {});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Carregar configurações existentes
  useEffect(() => {
    const loadConfig = async () => {
      const { data, error } = await siteConfigAPI.getConfig();
      if (data) {
        setLocalConfig(data);
        setConfig(data);
      }
    };
    loadConfig();
  }, []);

  // Atualizar configurações locais
  const handleChange = (field: string, value: any) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  // Salvar configurações
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await siteConfigAPI.updateConfig(localConfig);
      if (error) throw error;

      setConfig(localConfig);
      toast({
        title: "Sucesso!",
        description: "As configurações gerais foram atualizadas.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações Gerais</h3>
        <p className="text-sm text-muted-foreground">
          Configure as informações básicas do seu site de streaming.
        </p>
      </div>

      <Separator />

      <div className="grid gap-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Informações Básicas</h4>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="siteName">Nome do Site</Label>
              <Input
                id="siteName"
                value={localConfig.site_name || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                placeholder="Streaming Galaxy"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="siteDescription">Descrição do Site</Label>
              <Textarea
                id="siteDescription"
                value={localConfig.site_description || ''}
                onChange={(e) => handleChange('site_description', e.target.value)}
                placeholder="Sua plataforma de streaming"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Informações de Contato</h4>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Email de Contato</Label>
              <Input
                id="contactEmail"
                type="email"
                value={localConfig.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="contato@streamingalaxy.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactPhone">Telefone de Contato</Label>
              <Input
                id="contactPhone"
                value={localConfig.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="(00) 0000-0000"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={localConfig.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Rua Example, 123"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="businessHours">Horário de Funcionamento</Label>
              <Input
                id="businessHours"
                value={localConfig.business_hours || ''}
                onChange={(e) => handleChange('business_hours', e.target.value)}
                placeholder="Seg-Sex: 9h às 18h"
              />
            </div>
          </div>
        </div>

        {/* Aparência */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Aparência</h4>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="themeColor">Cor Principal</Label>
              <div className="flex gap-2">
                <Input
                  id="themeColor"
                  type="color"
                  value={localConfig.theme_color || '#000000'}
                  onChange={(e) => handleChange('theme_color', e.target.value)}
                  className="w-20 p-1 h-10"
                />
                <Input
                  value={localConfig.theme_color || '#000000'}
                  onChange={(e) => handleChange('theme_color', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accentColor">Cor de Destaque</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={localConfig.accent_color || '#FF0000'}
                  onChange={(e) => handleChange('accent_color', e.target.value)}
                  className="w-20 p-1 h-10"
                />
                <Input
                  value={localConfig.accent_color || '#FF0000'}
                  onChange={(e) => handleChange('accent_color', e.target.value)}
                  placeholder="#FF0000"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fontFamily">Fonte Principal</Label>
              <Select
                value={localConfig.font_family || 'Inter'}
                onValueChange={(value) => handleChange('font_family', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="darkMode"
                checked={localConfig.enable_dark_mode}
                onCheckedChange={(checked) => handleChange('enable_dark_mode', checked)}
              />
              <Label htmlFor="darkMode">Habilitar Modo Escuro</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mobileVersion"
                checked={localConfig.enable_mobile_version}
                onCheckedChange={(checked) => handleChange('enable_mobile_version', checked)}
              />
              <Label htmlFor="mobileVersion">Habilitar Versão Mobile</Label>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Rodapé</h4>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="footerText">Texto do Rodapé</Label>
            <Textarea
              id="footerText"
              value={localConfig.footer_text || ''}
              onChange={(e) => handleChange('footer_text', e.target.value)}
              placeholder=" 2024 Streaming Galaxy. Todos os direitos reservados."
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Modo de Manutenção */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Modo de Manutenção</h4>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="maintenanceMode"
                checked={localConfig.maintenance_mode}
                onCheckedChange={(checked) => handleChange('maintenance_mode', checked)}
              />
              <Label htmlFor="maintenanceMode">Ativar Modo de Manutenção</Label>
            </div>

            {localConfig.maintenance_mode && (
              <div className="grid gap-2">
                <Label htmlFor="maintenanceMessage">Mensagem de Manutenção</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={localConfig.maintenance_message || ''}
                  onChange={(e) => handleChange('maintenance_message', e.target.value)}
                  placeholder="Site em manutenção. Voltaremos em breve!"
                  className="min-h-[100px]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <Button 
        onClick={handleSave} 
        disabled={isLoading}
        className="min-w-[200px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          'Salvar Alterações'
        )}
      </Button>
    </div>
  );
};

const LogoSettings = ({ config, setConfig }: any) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Carregar configurações existentes
  useEffect(() => {
    const loadConfig = async () => {
      const { data, error } = await uploadAPI.getSiteConfig();
      if (data) {
        if (data.logo) setLogoPreview(data.logo);
        if (data.favicon) setFaviconPreview(data.favicon);
        setConfig(data);
      }
    };
    loadConfig();
  }, []);

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamanho (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "O arquivo deve ter no máximo 2MB",
          variant: "destructive",
        });
        return;
      }

      // Preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const { url, error } = await uploadAPI.uploadImage(file, 'logos');
        if (error) throw error;
        setConfig({ ...config, logo: url });
      } catch (error) {
        toast({
          title: "Erro no upload",
          description: "Não foi possível fazer o upload do logo.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFaviconChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamanho (500KB)
      if (file.size > 500 * 1024) {
        toast({
          title: "Erro",
          description: "O favicon deve ter no máximo 500KB",
          variant: "destructive",
        });
        return;
      }

      // Preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const { url, error } = await uploadAPI.uploadImage(file, 'favicons');
        if (error) throw error;
        setConfig({ ...config, favicon: url });
      } catch (error) {
        toast({
          title: "Erro no upload",
          description: "Não foi possível fazer o upload do favicon.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await uploadAPI.updateSiteConfig({
        logo: config.logo,
        favicon: config.favicon
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "As configurações de logo foram atualizadas.",
      });

      // Atualizar o favicon no documento
      if (config.favicon) {
        const linkElement = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
        linkElement.type = 'image/x-icon';
        linkElement.rel = 'shortcut icon';
        linkElement.href = config.favicon;
        document.getElementsByTagName('head')[0].appendChild(linkElement);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Logo</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie a identidade visual do seu streaming.
        </p>
      </div>

      <Separator />

      <div className="grid gap-6">
        {/* Logo Principal */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Logo Principal</h4>
            <p className="text-sm text-muted-foreground">
              Este logo será exibido no cabeçalho e áreas principais do site.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-900">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
              ) : (
                <Image className="w-12 h-12 text-gray-500" />
              )}
            </div>
            
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/png,image/svg+xml"
                onChange={handleLogoChange}
                className="max-w-sm"
              />
              <p className="text-xs text-muted-foreground">
                Recomendado: PNG ou SVG com fundo transparente. Tamanho máximo: 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Favicon */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Favicon</h4>
            <p className="text-sm text-muted-foreground">
              Ícone exibido na aba do navegador.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-900">
              {faviconPreview ? (
                <img src={faviconPreview} alt="Favicon Preview" className="max-w-full max-h-full object-contain" />
              ) : (
                <Image className="w-8 h-8 text-gray-500" />
              )}
            </div>
            
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/x-icon,image/png"
                onChange={handleFaviconChange}
                className="max-w-sm"
              />
              <p className="text-xs text-muted-foreground">
                Formato: ICO ou PNG. Tamanho recomendado: 32x32px ou 16x16px. Máximo: 500KB
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <Button 
        onClick={handleSave} 
        disabled={isLoading}
        className="min-w-[200px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          'Salvar Alterações'
        )}
      </Button>
    </div>
  );
};

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