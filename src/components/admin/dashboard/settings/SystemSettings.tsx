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
  PackageOpen, Lock, Moon, Laptop,
  Building2, Mail, Phone, MapPin, Clock, Layout, 
  Monitor, Smartphone, Type, Palette as ColorPalette,
  Search, User, Plus, Trash2, Link, Tv, AlertTriangle, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAdminDashboard } from '@/contexts/admin/AdminDashboardContext';
import { 
  Power, Cookie, FileCode, Globe, ChevronRight,
  Building2 as BuildingIcon, Mail as MailIcon, Phone as PhoneIcon, MapPin as MapPinIcon, Clock as ClockIcon, Layout as LayoutIcon, 
  Monitor as MonitorIcon, Smartphone as SmartphoneIcon, Type as TypeIcon, Palette as ColorPaletteIcon
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
  const [activeTab, setActiveTab] = useState("basic");

  // Opções de fonte
  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Poppins", label: "Poppins" }
  ];

  // Opções de tamanho de fonte
  const fontSizes = [
    { value: "sm", label: "Pequeno" },
    { value: "md", label: "Médio" },
    { value: "lg", label: "Grande" },
    { value: "xl", label: "Extra Grande" }
  ];

  // Itens do menu padrão
  const defaultMenuItems = [
    { id: 1, label: "Início", link: "/" },
    { id: 2, label: "Filmes", link: "/filmes" },
    { id: 3, label: "Séries", link: "/series" },
    { id: 4, label: "Categorias", link: "/categorias" }
  ];

  useEffect(() => {
    const loadConfig = async () => {
      const { data, error } = await siteConfigAPI.getConfig();
      if (data) {
        setLocalConfig({
          ...data,
          menuItems: data.menuItems || defaultMenuItems,
          socialLinks: data.socialLinks || []
        });
        setConfig(data);
      }
    };
    loadConfig();
  }, []);

  const handleChange = (field: string, value: any) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  const handleMenuItemChange = (index: number, field: string, value: string) => {
    const newMenuItems = [...(localConfig.menuItems || defaultMenuItems)];
    newMenuItems[index] = { ...newMenuItems[index], [field]: value };
    handleChange('menuItems', newMenuItems);
  };

  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const newSocialLinks = [...(localConfig.socialLinks || [])];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    handleChange('socialLinks', newSocialLinks);
  };

  const addMenuItem = () => {
    const newMenuItems = [...(localConfig.menuItems || defaultMenuItems)];
    newMenuItems.push({ id: Date.now(), label: "", link: "" });
    handleChange('menuItems', newMenuItems);
  };

  const addSocialLink = () => {
    const newSocialLinks = [...(localConfig.socialLinks || [])];
    newSocialLinks.push({ id: Date.now(), platform: "", url: "", icon: "" });
    handleChange('socialLinks', newSocialLinks);
  };

  const removeMenuItem = (index: number) => {
    const newMenuItems = [...(localConfig.menuItems || defaultMenuItems)];
    newMenuItems.splice(index, 1);
    handleChange('menuItems', newMenuItems);
  };

  const removeSocialLink = (index: number) => {
    const newSocialLinks = [...(localConfig.socialLinks || [])];
    newSocialLinks.splice(index, 1);
    handleChange('socialLinks', newSocialLinks);
  };

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
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Configure as informações e aparência do seu site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="basic" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <Building2 className="h-4 w-4" />
                Informações Básicas
              </TabsTrigger>
              <TabsTrigger value="appearance" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <Palette className="h-4 w-4" />
                Layout e Aparência
              </TabsTrigger>
              <TabsTrigger value="header" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <Layout className="h-4 w-4" />
                Cabeçalho
              </TabsTrigger>
              <TabsTrigger value="footer" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <ScrollText className="h-4 w-4" />
                Rodapé
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <TabsContent value="basic" className="m-0">
                <div className="grid gap-4 py-4">
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
              </TabsContent>

              <TabsContent value="appearance" className="m-0">
                <div className="grid gap-6 py-4">
                  <div className="space-y-4">
                    <Label>Layout Responsivo</Label>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          <Label htmlFor="responsiveLayout">Desktop/Mobile</Label>
                        </div>
                        <Switch
                          id="responsiveLayout"
                          checked={localConfig.responsive_layout}
                          onCheckedChange={(checked) => handleChange('responsive_layout', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tv className="h-4 w-4" />
                          <div className="space-y-1">
                            <Label htmlFor="tvLayout">Modo TV</Label>
                            <p className="text-xs text-muted-foreground">
                              Ativo apenas em telas ≥ 28 polegadas
                            </p>
                          </div>
                        </div>
                        <Switch
                          id="tvLayout"
                          checked={localConfig.tv_layout}
                          onCheckedChange={(checked) => handleChange('tv_layout', checked)}
                        />
                      </div>

                      {localConfig.tv_layout && (
                        <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                          <div className="grid gap-2">
                            <Label>Posicionamento dos Botões</Label>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor="actionButtonsPosition">Posição dos Botões de Ação</Label>
                                  <p className="text-xs text-muted-foreground">Ajusta a posição vertical dos botões em telas grandes</p>
                                </div>
                                <Select
                                  value={localConfig.action_buttons_position || 'bottom'}
                                  onValueChange={(value) => handleChange('action_buttons_position', value)}
                                >
                                  <SelectTrigger id="actionButtonsPosition" className="w-[140px]">
                                    <SelectValue placeholder="Selecione a posição" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="top">Topo</SelectItem>
                                    <SelectItem value="middle">Meio</SelectItem>
                                    <SelectItem value="bottom">Base</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor="actionButtonsOffset">Deslocamento Vertical</Label>
                                  <p className="text-xs text-muted-foreground">Ajuste fino da posição vertical (em pixels)</p>
                                </div>
                                <Input
                                  id="actionButtonsOffset"
                                  type="number"
                                  min="-200"
                                  max="200"
                                  value={localConfig.action_buttons_offset || '0'}
                                  onChange={(e) => handleChange('action_buttons_offset', e.target.value)}
                                  className="w-24 text-right"
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor="showActionButtonsOnHover">Mostrar ao Passar Mouse</Label>
                                  <p className="text-xs text-muted-foreground">Exibe botões apenas ao passar o mouse</p>
                                </div>
                                <Switch
                                  id="showActionButtonsOnHover"
                                  checked={localConfig.show_action_buttons_on_hover}
                                  onCheckedChange={(checked) => handleChange('show_action_buttons_on_hover', checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor="actionButtonsAnimation">Animação dos Botões</Label>
                                  <p className="text-xs text-muted-foreground">Efeito de transição ao exibir/ocultar</p>
                                </div>
                                <Switch
                                  id="actionButtonsAnimation"
                                  checked={localConfig.action_buttons_animation}
                                  onCheckedChange={(checked) => handleChange('action_buttons_animation', checked)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Progressive Web App (PWA)</Label>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          <Label htmlFor="enablePwa">Habilitar PWA</Label>
                        </div>
                        <Switch
                          id="enablePwa"
                          checked={localConfig.enable_pwa}
                          onCheckedChange={(checked) => handleChange('enable_pwa', checked)}
                        />
                      </div>

                      {localConfig.enable_pwa && (
                        <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                          <div className="grid gap-2">
                            <Label htmlFor="pwaName">Nome do App</Label>
                            <Input
                              id="pwaName"
                              value={localConfig.pwa_name || ''}
                              onChange={(e) => handleChange('pwa_name', e.target.value)}
                              placeholder="Streaming Galaxy"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="pwaShortName">Nome Curto</Label>
                            <Input
                              id="pwaShortName"
                              value={localConfig.pwa_short_name || ''}
                              onChange={(e) => handleChange('pwa_short_name', e.target.value)}
                              placeholder="SG App"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="pwaDescription">Descrição do App</Label>
                            <Textarea
                              id="pwaDescription"
                              value={localConfig.pwa_description || ''}
                              onChange={(e) => handleChange('pwa_description', e.target.value)}
                              placeholder="Sua plataforma de streaming favorita"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="pwaThemeColor">Cor do Tema</Label>
                            <div className="flex gap-2">
                              <Input
                                id="pwaThemeColor"
                                type="color"
                                value={localConfig.pwa_theme_color || '#000000'}
                                onChange={(e) => handleChange('pwa_theme_color', e.target.value)}
                                className="w-20 p-1 h-10"
                              />
                              <Input
                                value={localConfig.pwa_theme_color || '#000000'}
                                onChange={(e) => handleChange('pwa_theme_color', e.target.value)}
                                placeholder="#000000"
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label>Orientação da Tela</Label>
                            <Select
                              value={localConfig.pwa_orientation || 'any'}
                              onValueChange={(value) => handleChange('pwa_orientation', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a orientação" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Qualquer</SelectItem>
                                <SelectItem value="portrait">Retrato</SelectItem>
                                <SelectItem value="landscape">Paisagem</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <Label>Tipografia</Label>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="mainFont">Fonte Principal</Label>
                        <Select
                          value={localConfig.main_font || 'Inter'}
                          onValueChange={(value) => handleChange('main_font', value)}
                        >
                          <SelectTrigger id="mainFont">
                            <SelectValue placeholder="Selecione uma fonte" />
                          </SelectTrigger>
                          <SelectContent>
                            {fontOptions.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="fontSize">Tamanho da Fonte</Label>
                        <Select
                          value={localConfig.font_size || 'md'}
                          onValueChange={(value) => handleChange('font_size', value)}
                        >
                          <SelectTrigger id="fontSize">
                            <SelectValue placeholder="Selecione o tamanho" />
                          </SelectTrigger>
                          <SelectContent>
                            {fontSizes.map((size) => (
                              <SelectItem key={size.value} value={size.value}>
                                {size.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <Label>Esquema de Cores</Label>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="primaryColor">Cor Primária</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={localConfig.primary_color || '#000000'}
                            onChange={(e) => handleChange('primary_color', e.target.value)}
                            className="w-20 p-1 h-10"
                          />
                          <Input
                            value={localConfig.primary_color || '#000000'}
                            onChange={(e) => handleChange('primary_color', e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="secondaryColor">Cor Secundária</Label>
                        <div className="flex gap-2">
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={localConfig.secondary_color || '#666666'}
                            onChange={(e) => handleChange('secondary_color', e.target.value)}
                            className="w-20 p-1 h-10"
                          />
                          <Input
                            value={localConfig.secondary_color || '#666666'}
                            onChange={(e) => handleChange('secondary_color', e.target.value)}
                            placeholder="#666666"
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
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="header" className="m-0">
                <div className="grid gap-6 py-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layout className="h-4 w-4" />
                        <Label htmlFor="showMainMenu">Menu Principal</Label>
                      </div>
                      <Switch
                        id="showMainMenu"
                        checked={localConfig.show_main_menu}
                        onCheckedChange={(checked) => handleChange('show_main_menu', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        <Label htmlFor="showSearch">Barra de Busca</Label>
                      </div>
                      <Switch
                        id="showSearch"
                        checked={localConfig.show_search}
                        onCheckedChange={(checked) => handleChange('show_search', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <Label htmlFor="showLogin">Botão de Login</Label>
                      </div>
                      <Switch
                        id="showLogin"
                        checked={localConfig.show_login}
                        onCheckedChange={(checked) => handleChange('show_login', checked)}
                      />
                    </div>
                  </div>

                  {localConfig.show_main_menu && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Itens do Menu</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addMenuItem}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Item
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {(localConfig.menuItems || defaultMenuItems).map((item: any, index: number) => (
                          <div key={item.id} className="flex gap-4 items-start">
                            <div className="grid gap-4 flex-1">
                              <Input
                                placeholder="Label do Menu"
                                value={item.label}
                                onChange={(e) => handleMenuItemChange(index, 'label', e.target.value)}
                              />
                              <Input
                                placeholder="Link do Menu"
                                value={item.link}
                                onChange={(e) => handleMenuItemChange(index, 'link', e.target.value)}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeMenuItem(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="footer" className="m-0">
                <div className="grid gap-6 py-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        <Label htmlFor="showFooterNav">Links de Navegação</Label>
                      </div>
                      <Switch
                        id="showFooterNav"
                        checked={localConfig.show_footer_nav}
                        onCheckedChange={(checked) => handleChange('show_footer_nav', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        <Label htmlFor="showSocialIcons">Ícones Sociais</Label>
                      </div>
                      <Switch
                        id="showSocialIcons"
                        checked={localConfig.show_social_icons}
                        onCheckedChange={(checked) => handleChange('show_social_icons', checked)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="footerText">Texto do Rodapé</Label>
                    <Textarea
                      id="footerText"
                      value={localConfig.footer_text || ''}
                      onChange={(e) => handleChange('footer_text', e.target.value)}
                      placeholder="© 2024 Streaming Galaxy. Todos os direitos reservados."
                      className="min-h-[100px]"
                    />
                  </div>

                  {localConfig.show_social_icons && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Links Sociais</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSocialLink}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Rede Social
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {(localConfig.socialLinks || []).map((link: any, index: number) => (
                          <div key={link.id} className="flex gap-4 items-start">
                            <div className="grid gap-4 flex-1">
                              <Select
                                value={link.platform}
                                onValueChange={(value) => handleSocialLinkChange(index, 'platform', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a plataforma" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="facebook">Facebook</SelectItem>
                                  <SelectItem value="twitter">Twitter</SelectItem>
                                  <SelectItem value="instagram">Instagram</SelectItem>
                                  <SelectItem value="youtube">YouTube</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="URL da rede social"
                                value={link.url}
                                onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeSocialLink(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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

const NotificationSettings = ({ config, setConfig }: any) => {
  const [localConfig, setLocalConfig] = useState(config?.notifications || {});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await siteConfigAPI.updateConfig({
        ...config,
        notifications: localConfig
      });
      
      if (error) throw error;

      setConfig({ ...config, notifications: localConfig });
      toast({
        title: "Sucesso!",
        description: "As configurações de notificações foram atualizadas.",
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
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Notificações</CardTitle>
          <CardDescription>
            Configure como as notificações serão exibidas e enviadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="general" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <Bell className="h-4 w-4" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="email" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="push" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <Bell className="h-4 w-4" />
                Push
              </TabsTrigger>
              <TabsTrigger value="alerts" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <AlertTriangle className="h-4 w-4" />
                Alertas
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <TabsContent value="general" className="m-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="enableNotifications">Ativar Notificações</Label>
                      <p className="text-xs text-muted-foreground">
                        Habilita o sistema de notificações
                      </p>
                    </div>
                    <Switch
                      id="enableNotifications"
                      checked={localConfig.enabled}
                      onCheckedChange={(checked) => handleChange('enabled', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Tipos de Notificação</Label>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="systemNotifications">Notificações do Sistema</Label>
                          <p className="text-xs text-muted-foreground">
                            Atualizações, manutenção e informações importantes
                          </p>
                        </div>
                        <Switch
                          id="systemNotifications"
                          checked={localConfig.system_notifications}
                          onCheckedChange={(checked) => handleChange('system_notifications', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="userNotifications">Notificações de Usuário</Label>
                          <p className="text-xs text-muted-foreground">
                            Ações de usuários, comentários e interações
                          </p>
                        </div>
                        <Switch
                          id="userNotifications"
                          checked={localConfig.user_notifications}
                          onCheckedChange={(checked) => handleChange('user_notifications', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="contentNotifications">Notificações de Conteúdo</Label>
                          <p className="text-xs text-muted-foreground">
                            Novos conteúdos, atualizações e recomendações
                          </p>
                        </div>
                        <Switch
                          id="contentNotifications"
                          checked={localConfig.content_notifications}
                          onCheckedChange={(checked) => handleChange('content_notifications', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="email" className="m-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="enableEmailNotifications">Notificações por Email</Label>
                      <p className="text-xs text-muted-foreground">
                        Envia notificações importantes por email
                      </p>
                    </div>
                    <Switch
                      id="enableEmailNotifications"
                      checked={localConfig.email_notifications}
                      onCheckedChange={(checked) => handleChange('email_notifications', checked)}
                    />
                  </div>

                  {localConfig.email_notifications && (
                    <div className="space-y-4 mt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="emailFrequency">Frequência de Emails</Label>
                        <Select
                          value={localConfig.email_frequency || 'instant'}
                          onValueChange={(value) => handleChange('email_frequency', value)}
                        >
                          <SelectTrigger id="emailFrequency">
                            <SelectValue placeholder="Selecione a frequência" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instant">Instantâneo</SelectItem>
                            <SelectItem value="daily">Diário</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label>Tipos de Email</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="emailUpdates"
                              checked={localConfig.email_updates}
                              onCheckedChange={(checked) => handleChange('email_updates', checked)}
                            />
                            <Label htmlFor="emailUpdates">Atualizações do Sistema</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="emailNews"
                              checked={localConfig.email_news}
                              onCheckedChange={(checked) => handleChange('email_news', checked)}
                            />
                            <Label htmlFor="emailNews">Novidades e Conteúdo</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="emailMarketing"
                              checked={localConfig.email_marketing}
                              onCheckedChange={(checked) => handleChange('email_marketing', checked)}
                            />
                            <Label htmlFor="emailMarketing">Marketing e Promoções</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="push" className="m-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="enablePushNotifications">Notificações Push</Label>
                      <p className="text-xs text-muted-foreground">
                        Envia notificações push para navegadores e dispositivos
                      </p>
                    </div>
                    <Switch
                      id="enablePushNotifications"
                      checked={localConfig.push_notifications}
                      onCheckedChange={(checked) => handleChange('push_notifications', checked)}
                    />
                  </div>

                  {localConfig.push_notifications && (
                    <div className="space-y-4 mt-4">
                      <div className="grid gap-2">
                        <Label>Plataformas</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="webPush"
                              checked={localConfig.web_push}
                              onCheckedChange={(checked) => handleChange('web_push', checked)}
                            />
                            <Label htmlFor="webPush">Navegador Web</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="mobilePush"
                              checked={localConfig.mobile_push}
                              onCheckedChange={(checked) => handleChange('mobile_push', checked)}
                            />
                            <Label htmlFor="mobilePush">Dispositivos Móveis</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="desktopPush"
                              checked={localConfig.desktop_push}
                              onCheckedChange={(checked) => handleChange('desktop_push', checked)}
                            />
                            <Label htmlFor="desktopPush">Aplicativo Desktop</Label>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="pushIcon">Ícone das Notificações Push</Label>
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-900">
                            {localConfig.push_icon ? (
                              <img src={localConfig.push_icon} alt="Push Icon" className="w-8 h-8" />
                            ) : (
                              <Bell className="w-6 h-6 text-gray-500" />
                            )}
                          </div>
                          <Input
                            id="pushIcon"
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Implementar lógica de upload
                                handleChange('push_icon', URL.createObjectURL(file));
                              }
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Recomendado: PNG 192x192px
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="m-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="enableAlerts">Alertas do Sistema</Label>
                      <p className="text-xs text-muted-foreground">
                        Exibe alertas importantes no painel administrativo
                      </p>
                    </div>
                    <Switch
                      id="enableAlerts"
                      checked={localConfig.alerts_enabled}
                      onCheckedChange={(checked) => handleChange('alerts_enabled', checked)}
                    />
                  </div>

                  {localConfig.alerts_enabled && (
                    <div className="space-y-4 mt-4">
                      <div className="grid gap-2">
                        <Label>Tipos de Alerta</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="errorAlerts"
                              checked={localConfig.error_alerts}
                              onCheckedChange={(checked) => handleChange('error_alerts', checked)}
                            />
                            <Label htmlFor="errorAlerts">Erros Críticos</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="warningAlerts"
                              checked={localConfig.warning_alerts}
                              onCheckedChange={(checked) => handleChange('warning_alerts', checked)}
                            />
                            <Label htmlFor="warningAlerts">Avisos</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="infoAlerts"
                              checked={localConfig.info_alerts}
                              onCheckedChange={(checked) => handleChange('info_alerts', checked)}
                            />
                            <Label htmlFor="infoAlerts">Informações</Label>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="alertDuration">Duração dos Alertas (segundos)</Label>
                        <Input
                          id="alertDuration"
                          type="number"
                          min="1"
                          max="60"
                          value={localConfig.alert_duration || 5}
                          onChange={(e) => handleChange('alert_duration', parseInt(e.target.value))}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="alertPosition">Posição dos Alertas</Label>
                        <Select
                          value={localConfig.alert_position || 'top-right'}
                          onValueChange={(value) => handleChange('alert_position', value)}
                        >
                          <SelectTrigger id="alertPosition">
                            <SelectValue placeholder="Selecione a posição" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top-right">Superior Direito</SelectItem>
                            <SelectItem value="top-left">Superior Esquerdo</SelectItem>
                            <SelectItem value="bottom-right">Inferior Direito</SelectItem>
                            <SelectItem value="bottom-left">Inferior Esquerdo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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
    </div>
  );
};

const PaymentSettings = ({ config, setConfig }: any) => {
  const [localConfig, setLocalConfig] = useState(config?.payment || {});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  const handleGatewayChange = (gateway: string, field: string, value: any) => {
    setLocalConfig({
      ...localConfig,
      gateways: {
        ...localConfig.gateways,
        [gateway]: {
          ...(localConfig.gateways?.[gateway] || {}),
          [field]: value
        }
      }
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await siteConfigAPI.updateConfig({
        ...config,
        payment: localConfig
      });
      
      if (error) throw error;

      setConfig({ ...config, payment: localConfig });
      toast({
        title: "Sucesso!",
        description: "As configurações de pagamento foram atualizadas.",
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
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Pagamento</CardTitle>
          <CardDescription>
            Configure os métodos de pagamento e gateways disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="automatic" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="automatic" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <CreditCard className="h-4 w-4" />
                Gateways Automáticos
              </TabsTrigger>
              <TabsTrigger value="manual" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <Building2 className="h-4 w-4" />
                Pagamentos Manuais
              </TabsTrigger>
              <TabsTrigger value="receipts" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <FileText className="h-4 w-4" />
                Comprovativos
              </TabsTrigger>
              <TabsTrigger value="general" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <Settings className="h-4 w-4" />
                Configurações Gerais
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <TabsContent value="automatic" className="m-0">
                <div className="space-y-6">
                  {/* Stripe */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="enableStripe">Stripe</Label>
                        <p className="text-xs text-muted-foreground">
                          Processe pagamentos com cartão de crédito via Stripe
                        </p>
                      </div>
                      <Switch
                        id="enableStripe"
                        checked={localConfig.gateways?.stripe?.enabled}
                        onCheckedChange={(checked) => handleGatewayChange('stripe', 'enabled', checked)}
                      />
                    </div>

                    {localConfig.gateways?.stripe?.enabled && (
                      <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                        <div className="grid gap-2">
                          <Label htmlFor="stripePublicKey">Chave Pública</Label>
                          <Input
                            id="stripePublicKey"
                            value={localConfig.gateways?.stripe?.public_key || ''}
                            onChange={(e) => handleGatewayChange('stripe', 'public_key', e.target.value)}
                            placeholder="pk_test_..."
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="stripeSecretKey">Chave Secreta</Label>
                          <Input
                            id="stripeSecretKey"
                            type="password"
                            value={localConfig.gateways?.stripe?.secret_key || ''}
                            onChange={(e) => handleGatewayChange('stripe', 'secret_key', e.target.value)}
                            placeholder="sk_test_..."
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="stripeWebhookSecret">Chave do Webhook</Label>
                          <Input
                            id="stripeWebhookSecret"
                            type="password"
                            value={localConfig.gateways?.stripe?.webhook_secret || ''}
                            onChange={(e) => handleGatewayChange('stripe', 'webhook_secret', e.target.value)}
                            placeholder="whsec_..."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* PayPal */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="enablePaypal">PayPal</Label>
                        <p className="text-xs text-muted-foreground">
                          Aceite pagamentos via PayPal
                        </p>
                      </div>
                      <Switch
                        id="enablePaypal"
                        checked={localConfig.gateways?.paypal?.enabled}
                        onCheckedChange={(checked) => handleGatewayChange('paypal', 'enabled', checked)}
                      />
                    </div>

                    {localConfig.gateways?.paypal?.enabled && (
                      <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                        <div className="grid gap-2">
                          <Label htmlFor="paypalClientId">Client ID</Label>
                          <Input
                            id="paypalClientId"
                            value={localConfig.gateways?.paypal?.client_id || ''}
                            onChange={(e) => handleGatewayChange('paypal', 'client_id', e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="paypalSecret">Secret</Label>
                          <Input
                            id="paypalSecret"
                            type="password"
                            value={localConfig.gateways?.paypal?.secret || ''}
                            onChange={(e) => handleGatewayChange('paypal', 'secret', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="paypalSandbox"
                            checked={localConfig.gateways?.paypal?.sandbox}
                            onCheckedChange={(checked) => handleGatewayChange('paypal', 'sandbox', checked)}
                          />
                          <Label htmlFor="paypalSandbox">Modo Sandbox</Label>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Mercado Pago */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="enableMercadoPago">Mercado Pago</Label>
                        <p className="text-xs text-muted-foreground">
                          Integração com Mercado Pago
                        </p>
                      </div>
                      <Switch
                        id="enableMercadoPago"
                        checked={localConfig.gateways?.mercadopago?.enabled}
                        onCheckedChange={(checked) => handleGatewayChange('mercadopago', 'enabled', checked)}
                      />
                    </div>

                    {localConfig.gateways?.mercadopago?.enabled && (
                      <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                        <div className="grid gap-2">
                          <Label htmlFor="mercadopagoAccessToken">Access Token</Label>
                          <Input
                            id="mercadopagoAccessToken"
                            type="password"
                            value={localConfig.gateways?.mercadopago?.access_token || ''}
                            onChange={(e) => handleGatewayChange('mercadopago', 'access_token', e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="mercadopagoPublicKey">Public Key</Label>
                          <Input
                            id="mercadopagoPublicKey"
                            value={localConfig.gateways?.mercadopago?.public_key || ''}
                            onChange={(e) => handleGatewayChange('mercadopago', 'public_key', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="m-0">
                <div className="space-y-6">
                  {/* PIX */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="enablePix">PIX</Label>
                        <p className="text-xs text-muted-foreground">
                          Receba pagamentos via PIX
                        </p>
                      </div>
                      <Switch
                        id="enablePix"
                        checked={localConfig.manual_methods?.pix?.enabled}
                        onCheckedChange={(checked) => handleChange('manual_methods', {
                          ...localConfig.manual_methods,
                          pix: { ...localConfig.manual_methods?.pix, enabled: checked }
                        })}
                      />
                    </div>

                    {localConfig.manual_methods?.pix?.enabled && (
                      <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                        <div className="grid gap-2">
                          <Label htmlFor="pixKey">Chave PIX</Label>
                          <Input
                            id="pixKey"
                            value={localConfig.manual_methods?.pix?.key || ''}
                            onChange={(e) => handleChange('manual_methods', {
                              ...localConfig.manual_methods,
                              pix: { ...localConfig.manual_methods?.pix, key: e.target.value }
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="pixInstructions">Instruções</Label>
                          <Textarea
                            id="pixInstructions"
                            value={localConfig.manual_methods?.pix?.instructions || ''}
                            onChange={(e) => handleChange('manual_methods', {
                              ...localConfig.manual_methods,
                              pix: { ...localConfig.manual_methods?.pix, instructions: e.target.value }
                            })}
                            placeholder="Instruções para pagamento via PIX..."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Transferência Bancária */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="enableBankTransfer">Transferência Bancária</Label>
                        <p className="text-xs text-muted-foreground">
                          Receba por transferência bancária
                        </p>
                      </div>
                      <Switch
                        id="enableBankTransfer"
                        checked={localConfig.manual_methods?.bank_transfer?.enabled}
                        onCheckedChange={(checked) => handleChange('manual_methods', {
                          ...localConfig.manual_methods,
                          bank_transfer: { ...localConfig.manual_methods?.bank_transfer, enabled: checked }
                        })}
                      />
                    </div>

                    {localConfig.manual_methods?.bank_transfer?.enabled && (
                      <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                        <div className="grid gap-2">
                          <Label htmlFor="bankName">Banco</Label>
                          <Input
                            id="bankName"
                            value={localConfig.manual_methods?.bank_transfer?.bank_name || ''}
                            onChange={(e) => handleChange('manual_methods', {
                              ...localConfig.manual_methods,
                              bank_transfer: { ...localConfig.manual_methods?.bank_transfer, bank_name: e.target.value }
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="accountHolder">Titular da Conta</Label>
                          <Input
                            id="accountHolder"
                            value={localConfig.manual_methods?.bank_transfer?.account_holder || ''}
                            onChange={(e) => handleChange('manual_methods', {
                              ...localConfig.manual_methods,
                              bank_transfer: { ...localConfig.manual_methods?.bank_transfer, account_holder: e.target.value }
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="accountNumber">Número da Conta</Label>
                          <Input
                            id="accountNumber"
                            value={localConfig.manual_methods?.bank_transfer?.account_number || ''}
                            onChange={(e) => handleChange('manual_methods', {
                              ...localConfig.manual_methods,
                              bank_transfer: { ...localConfig.manual_methods?.bank_transfer, account_number: e.target.value }
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bankBranch">Agência</Label>
                          <Input
                            id="bankBranch"
                            value={localConfig.manual_methods?.bank_transfer?.branch || ''}
                            onChange={(e) => handleChange('manual_methods', {
                              ...localConfig.manual_methods,
                              bank_transfer: { ...localConfig.manual_methods?.bank_transfer, branch: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="receipts" className="m-0">
                <div className="space-y-6">
                  {/* Configurações de Notificação */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="enableReceiptNotifications">Notificações de Comprovativo</Label>
                        <p className="text-xs text-muted-foreground">
                          Receba notificações quando novos comprovativos forem enviados
                        </p>
                      </div>
                      <Switch
                        id="enableReceiptNotifications"
                        checked={localConfig.receipt_notifications?.enabled}
                        onCheckedChange={(checked) => handleChange('receipt_notifications', {
                          ...localConfig.receipt_notifications,
                          enabled: checked
                        })}
                      />
                    </div>

                    {localConfig.receipt_notifications?.enabled && (
                      <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                        <div className="grid gap-2">
                          <Label>Métodos de Notificação</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="emailNotification"
                                checked={localConfig.receipt_notifications?.email}
                                onCheckedChange={(checked) => handleChange('receipt_notifications', {
                                  ...localConfig.receipt_notifications,
                                  email: checked
                                })}
                              />
                              <Label htmlFor="emailNotification">Email</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="pushNotification"
                                checked={localConfig.receipt_notifications?.push}
                                onCheckedChange={(checked) => handleChange('receipt_notifications', {
                                  ...localConfig.receipt_notifications,
                                  push: checked
                                })}
                              />
                              <Label htmlFor="pushNotification">Notificação Push</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="smsNotification"
                                checked={localConfig.receipt_notifications?.sms}
                                onCheckedChange={(checked) => handleChange('receipt_notifications', {
                                  ...localConfig.receipt_notifications,
                                  sms: checked
                                })}
                              />
                              <Label htmlFor="smsNotification">SMS</Label>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="notificationEmails">Emails para Notificação</Label>
                          <Textarea
                            id="notificationEmails"
                            placeholder="Digite os emails separados por vírgula"
                            value={localConfig.receipt_notifications?.emails?.join(', ') || ''}
                            onChange={(e) => handleChange('receipt_notifications', {
                              ...localConfig.receipt_notifications,
                              emails: e.target.value.split(',').map(email => email.trim())
                            })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Você pode adicionar múltiplos emails separados por vírgula
                          </p>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="notificationPhones">Números para SMS</Label>
                          <Textarea
                            id="notificationPhones"
                            placeholder="Digite os números separados por vírgula"
                            value={localConfig.receipt_notifications?.phones?.join(', ') || ''}
                            onChange={(e) => handleChange('receipt_notifications', {
                              ...localConfig.receipt_notifications,
                              phones: e.target.value.split(',').map(phone => phone.trim())
                            })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Você pode adicionar múltiplos números separados por vírgula
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Configurações de Upload */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="receiptRequirements">Requisitos do Comprovativo</Label>
                        <p className="text-xs text-muted-foreground">
                          Configure os requisitos para upload de comprovativos
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="allowedFormats">Formatos Permitidos</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="formatPNG"
                              checked={localConfig.receipt_requirements?.formats?.includes('png')}
                              onCheckedChange={(checked) => {
                                const formats = new Set(localConfig.receipt_requirements?.formats || []);
                                checked ? formats.add('png') : formats.delete('png');
                                handleChange('receipt_requirements', {
                                  ...localConfig.receipt_requirements,
                                  formats: Array.from(formats)
                                });
                              }}
                            />
                            <Label htmlFor="formatPNG">PNG</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="formatJPG"
                              checked={localConfig.receipt_requirements?.formats?.includes('jpg')}
                              onCheckedChange={(checked) => {
                                const formats = new Set(localConfig.receipt_requirements?.formats || []);
                                checked ? formats.add('jpg') : formats.delete('jpg');
                                handleChange('receipt_requirements', {
                                  ...localConfig.receipt_requirements,
                                  formats: Array.from(formats)
                                });
                              }}
                            />
                            <Label htmlFor="formatJPG">JPG/JPEG</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="formatPDF"
                              checked={localConfig.receipt_requirements?.formats?.includes('pdf')}
                              onCheckedChange={(checked) => {
                                const formats = new Set(localConfig.receipt_requirements?.formats || []);
                                checked ? formats.add('pdf') : formats.delete('pdf');
                                handleChange('receipt_requirements', {
                                  ...localConfig.receipt_requirements,
                                  formats: Array.from(formats)
                                });
                              }}
                            />
                            <Label htmlFor="formatPDF">PDF</Label>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="maxFileSize">Tamanho Máximo do Arquivo (MB)</Label>
                        <Input
                          id="maxFileSize"
                          type="number"
                          min="1"
                          max="20"
                          value={localConfig.receipt_requirements?.max_size || 5}
                          onChange={(e) => handleChange('receipt_requirements', {
                            ...localConfig.receipt_requirements,
                            max_size: parseInt(e.target.value)
                          })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="receiptInstructions">Instruções para o Usuário</Label>
                        <Textarea
                          id="receiptInstructions"
                          placeholder="Digite as instruções para envio do comprovativo..."
                          value={localConfig.receipt_requirements?.instructions || ''}
                          onChange={(e) => handleChange('receipt_requirements', {
                            ...localConfig.receipt_requirements,
                            instructions: e.target.value
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Configurações de Validação */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="autoValidation">Validação Automática</Label>
                        <p className="text-xs text-muted-foreground">
                          Configure regras para validação automática de comprovativos
                        </p>
                      </div>
                      <Switch
                        id="autoValidation"
                        checked={localConfig.receipt_validation?.auto_validate}
                        onCheckedChange={(checked) => handleChange('receipt_validation', {
                          ...localConfig.receipt_validation,
                          auto_validate: checked
                        })}
                      />
                    </div>

                    {localConfig.receipt_validation?.auto_validate && (
                      <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                        <div className="grid gap-2">
                          <Label>Regras de Validação</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="validateAmount"
                                checked={localConfig.receipt_validation?.validate_amount}
                                onCheckedChange={(checked) => handleChange('receipt_validation', {
                                  ...localConfig.receipt_validation,
                                  validate_amount: checked
                                })}
                              />
                              <Label htmlFor="validateAmount">Verificar valor do pagamento</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="validateDate"
                                checked={localConfig.receipt_validation?.validate_date}
                                onCheckedChange={(checked) => handleChange('receipt_validation', {
                                  ...localConfig.receipt_validation,
                                  validate_date: checked
                                })}
                              />
                              <Label htmlFor="validateDate">Verificar data do pagamento</Label>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="validationTimeout">Tempo para Validação Manual (horas)</Label>
                          <Input
                            id="validationTimeout"
                            type="number"
                            min="1"
                            max="72"
                            value={localConfig.receipt_validation?.timeout || 24}
                            onChange={(e) => handleChange('receipt_validation', {
                              ...localConfig.receipt_validation,
                              timeout: parseInt(e.target.value)
                            })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Tempo máximo para validação manual antes de notificar o administrador
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="general" className="m-0">
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="testMode">Modo de Teste</Label>
                        <p className="text-xs text-muted-foreground">
                          Ativa o modo de teste para todos os gateways
                        </p>
                      </div>
                      <Switch
                        id="testMode"
                        checked={localConfig.test_mode}
                        onCheckedChange={(checked) => handleChange('test_mode', checked)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="currency">Moeda Padrão</Label>
                      <Select
                        value={localConfig.currency || 'AOA'}
                        onValueChange={(value) => handleChange('currency', value)}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Selecione a moeda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AOA">Kwanza Angolano (AOA)</SelectItem>
                          <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="currencyFormat">Formato da Moeda</Label>
                      <Select
                        value={localConfig.currency_format || 'symbol_first'}
                        onValueChange={(value) => handleChange('currency_format', value)}
                      >
                        <SelectTrigger id="currencyFormat">
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="symbol_first">Símbolo antes do valor (ex: Kz 1.000)</SelectItem>
                          <SelectItem value="symbol_last">Símbolo depois do valor (ex: 1.000 Kz)</SelectItem>
                          <SelectItem value="code_first">Código antes do valor (ex: AOA 1.000)</SelectItem>
                          <SelectItem value="code_last">Código depois do valor (ex: 1.000 AOA)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="decimalSeparator">Separador Decimal</Label>
                      <Select
                        value={localConfig.decimal_separator || ','}
                        onValueChange={(value) => handleChange('decimal_separator', value)}
                      >
                        <SelectTrigger id="decimalSeparator">
                          <SelectValue placeholder="Selecione o separador" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=",">Vírgula (1.000,00)</SelectItem>
                          <SelectItem value=".">Ponto (1,000.00)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="thousandsSeparator">Separador de Milhar</Label>
                      <Select
                        value={localConfig.thousands_separator || '.'}
                        onValueChange={(value) => handleChange('thousands_separator', value)}
                      >
                        <SelectTrigger id="thousandsSeparator">
                          <SelectValue placeholder="Selecione o separador" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=".">Ponto (1.000)</SelectItem>
                          <SelectItem value=",">Vírgula (1,000)</SelectItem>
                          <SelectItem value=" ">Espaço (1 000)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="showCurrencySelector">Seletor de Moeda no Frontend</Label>
                        <p className="text-xs text-muted-foreground">
                          Permite que usuários escolham a moeda de exibição
                        </p>
                      </div>
                      <Switch
                        id="showCurrencySelector"
                        checked={localConfig.show_currency_selector}
                        onCheckedChange={(checked) => handleChange('show_currency_selector', checked)}
                      />
                    </div>

                    {localConfig.show_currency_selector && (
                      <div className="grid gap-2">
                        <Label>Moedas Disponíveis para Seleção</Label>
                        <div className="space-y-2">
                          {['AOA', 'BRL', 'EUR', 'USD'].map((currency) => (
                            <div key={currency} className="flex items-center space-x-2">
                              <Checkbox
                                id={`currency_${currency}`}
                                checked={localConfig.available_currencies?.includes(currency)}
                                onCheckedChange={(checked) => {
                                  const currencies = new Set(localConfig.available_currencies || []);
                                  checked ? currencies.add(currency) : currencies.delete(currency);
                                  handleChange('available_currencies', Array.from(currencies));
                                }}
                              />
                              <Label htmlFor={`currency_${currency}`}>{currency}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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
    </div>
  );
};

const TemplateSettings = ({ config, setConfig }: any) => {
  const [localConfig, setLocalConfig] = useState(config?.template || {});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await siteConfigAPI.updateConfig({
        ...config,
        template: localConfig
      });
      
      if (error) throw error;

      setConfig({ ...config, template: localConfig });
      toast({
        title: "Sucesso!",
        description: "As configurações do template foram atualizadas.",
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
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Template</CardTitle>
          <CardDescription>
            Personalize a aparência e o layout do frontend do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="layout" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="layout" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <Layout className="h-4 w-4" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="cards" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <PackageOpen className="h-4 w-4" />
                Cards
              </TabsTrigger>
              <TabsTrigger value="hero" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <Image className="h-4 w-4" />
                Hero
              </TabsTrigger>
              <TabsTrigger value="sections" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <ScrollText className="h-4 w-4" />
                Seções
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <TabsContent value="layout" className="m-0">
                <div className="space-y-6">
                  {/* Layout Principal */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="layoutStyle">Estilo do Layout</Label>
                        <p className="text-xs text-muted-foreground">
                          Escolha o estilo de layout principal
                        </p>
                      </div>
                      <Select
                        value={localConfig.layout_style || 'netflix'}
                        onValueChange={(value) => handleChange('layout_style', value)}
                      >
                        <SelectTrigger id="layoutStyle" className="w-[180px]">
                          <SelectValue placeholder="Selecione o estilo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="netflix">Estilo Netflix</SelectItem>
                          <SelectItem value="prime">Estilo Prime Video</SelectItem>
                          <SelectItem value="disney">Estilo Disney+</SelectItem>
                          <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="stickyHeader">Cabeçalho Fixo</Label>
                        <p className="text-xs text-muted-foreground">
                          Mantém o cabeçalho fixo durante a rolagem
                        </p>
                      </div>
                      <Switch
                        id="stickyHeader"
                        checked={localConfig.sticky_header}
                        onCheckedChange={(checked) => handleChange('sticky_header', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="transparentHeader">Cabeçalho Transparente</Label>
                        <p className="text-xs text-muted-foreground">
                          Aplica transparência ao cabeçalho sobre o hero
                        </p>
                      </div>
                      <Switch
                        id="transparentHeader"
                        checked={localConfig.transparent_header}
                        onCheckedChange={(checked) => handleChange('transparent_header', checked)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="containerWidth">Largura do Container</Label>
                      <Select
                        value={localConfig.container_width || 'xl'}
                        onValueChange={(value) => handleChange('container_width', value)}
                      >
                        <SelectTrigger id="containerWidth">
                          <SelectValue placeholder="Selecione a largura" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sm">Pequeno (640px)</SelectItem>
                          <SelectItem value="md">Médio (768px)</SelectItem>
                          <SelectItem value="lg">Grande (1024px)</SelectItem>
                          <SelectItem value="xl">Extra Grande (1280px)</SelectItem>
                          <SelectItem value="2xl">2XL (1536px)</SelectItem>
                          <SelectItem value="full">Largura Total</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Navegação */}
                  <div className="space-y-4">
                    <Label>Navegação</Label>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="infiniteScroll">Rolagem Infinita</Label>
                          <p className="text-xs text-muted-foreground">
                            Carrega mais conteúdo automaticamente ao rolar
                          </p>
                        </div>
                        <Switch
                          id="infiniteScroll"
                          checked={localConfig.infinite_scroll}
                          onCheckedChange={(checked) => handleChange('infinite_scroll', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="smoothScroll">Rolagem Suave</Label>
                          <p className="text-xs text-muted-foreground">
                            Ativa animação suave na rolagem da página
                          </p>
                        </div>
                        <Switch
                          id="smoothScroll"
                          checked={localConfig.smooth_scroll}
                          onCheckedChange={(checked) => handleChange('smooth_scroll', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="backToTop">Botão Voltar ao Topo</Label>
                          <p className="text-xs text-muted-foreground">
                            Exibe botão para retornar ao topo da página
                          </p>
                        </div>
                        <Switch
                          id="backToTop"
                          checked={localConfig.back_to_top}
                          onCheckedChange={(checked) => handleChange('back_to_top', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cards" className="m-0">
                <div className="space-y-6">
                  {/* Estilo dos Cards */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cardStyle">Estilo dos Cards</Label>
                      <Select
                        value={localConfig.card_style || 'modern'}
                        onValueChange={(value) => handleChange('card_style', value)}
                      >
                        <SelectTrigger id="cardStyle">
                          <SelectValue placeholder="Selecione o estilo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Moderno</SelectItem>
                          <SelectItem value="classic">Clássico</SelectItem>
                          <SelectItem value="minimal">Minimalista</SelectItem>
                          <SelectItem value="gradient">Gradiente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="cardSize">Tamanho dos Cards</Label>
                      <Select
                        value={localConfig.card_size || 'medium'}
                        onValueChange={(value) => handleChange('card_size', value)}
                      >
                        <SelectTrigger id="cardSize">
                          <SelectValue placeholder="Selecione o tamanho" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Pequeno</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="cardHoverEffect">Efeito Hover</Label>
                        <p className="text-xs text-muted-foreground">
                          Aplica efeito de hover nos cards
                        </p>
                      </div>
                      <Switch
                        id="cardHoverEffect"
                        checked={localConfig.card_hover_effect}
                        onCheckedChange={(checked) => handleChange('card_hover_effect', checked)}
                      />
                    </div>

                    {localConfig.card_hover_effect && (
                      <div className="grid gap-2">
                        <Label htmlFor="hoverEffectStyle">Estilo do Efeito Hover</Label>
                        <Select
                          value={localConfig.hover_effect_style || 'scale'}
                          onValueChange={(value) => handleChange('hover_effect_style', value)}
                        >
                          <SelectTrigger id="hoverEffectStyle">
                            <SelectValue placeholder="Selecione o efeito" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scale">Escala</SelectItem>
                            <SelectItem value="lift">Elevação</SelectItem>
                            <SelectItem value="glow">Brilho</SelectItem>
                            <SelectItem value="rotate">Rotação</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Informações do Card */}
                  <div className="space-y-4">
                    <Label>Informações Exibidas</Label>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="showTitle">Título</Label>
                          <p className="text-xs text-muted-foreground">
                            Exibe o título do conteúdo
                          </p>
                        </div>
                        <Switch
                          id="showTitle"
                          checked={localConfig.show_title}
                          onCheckedChange={(checked) => handleChange('show_title', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="showYear">Ano</Label>
                          <p className="text-xs text-muted-foreground">
                            Exibe o ano de lançamento
                          </p>
                        </div>
                        <Switch
                          id="showYear"
                          checked={localConfig.show_year}
                          onCheckedChange={(checked) => handleChange('show_year', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="showRating">Classificação</Label>
                          <p className="text-xs text-muted-foreground">
                            Exibe a classificação indicativa
                          </p>
                        </div>
                        <Switch
                          id="showRating"
                          checked={localConfig.show_rating}
                          onCheckedChange={(checked) => handleChange('show_rating', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="showDuration">Duração</Label>
                          <p className="text-xs text-muted-foreground">
                            Exibe a duração do conteúdo
                          </p>
                        </div>
                        <Switch
                          id="showDuration"
                          checked={localConfig.show_duration}
                          onCheckedChange={(checked) => handleChange('show_duration', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hero" className="m-0">
                <div className="space-y-6">
                  {/* Configurações do Hero */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="enableHero">Habilitar Hero</Label>
                        <p className="text-xs text-muted-foreground">
                          Exibe seção hero na página inicial
                        </p>
                      </div>
                      <Switch
                        id="enableHero"
                        checked={localConfig.enable_hero}
                        onCheckedChange={(checked) => handleChange('enable_hero', checked)}
                      />
                    </div>

                    {localConfig.enable_hero && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="heroStyle">Estilo do Hero</Label>
                          <Select
                            value={localConfig.hero_style || 'fullscreen'}
                            onValueChange={(value) => handleChange('hero_style', value)}
                          >
                            <SelectTrigger id="heroStyle">
                              <SelectValue placeholder="Selecione o estilo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fullscreen">Tela Cheia</SelectItem>
                              <SelectItem value="contained">Contido</SelectItem>
                              <SelectItem value="boxed">Em Caixa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="autoplayHero">Autoplay</Label>
                            <p className="text-xs text-muted-foreground">
                              Alterna automaticamente os itens do hero
                            </p>
                          </div>
                          <Switch
                            id="autoplayHero"
                            checked={localConfig.hero_autoplay}
                            onCheckedChange={(checked) => handleChange('hero_autoplay', checked)}
                          />
                        </div>

                        {localConfig.hero_autoplay && (
                          <div className="grid gap-2">
                            <Label htmlFor="autoplayInterval">Intervalo do Autoplay (segundos)</Label>
                            <Input
                              id="autoplayInterval"
                              type="number"
                              min="3"
                              max="15"
                              value={localConfig.hero_autoplay_interval || 5}
                              onChange={(e) => handleChange('hero_autoplay_interval', parseInt(e.target.value))}
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="heroOverlay">Overlay Gradiente</Label>
                            <p className="text-xs text-muted-foreground">
                              Aplica overlay gradiente sobre a imagem
                            </p>
                          </div>
                          <Switch
                            id="heroOverlay"
                            checked={localConfig.hero_overlay}
                            onCheckedChange={(checked) => handleChange('hero_overlay', checked)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sections" className="m-0">
                <div className="space-y-6">
                  {/* Configurações das Seções */}
                  <div className="space-y-4">
                    <Label>Seções da Página Inicial</Label>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="showContinueWatching">Continuar Assistindo</Label>
                          <p className="text-xs text-muted-foreground">
                            Exibe seção de conteúdos em progresso
                          </p>
                        </div>
                        <Switch
                          id="showContinueWatching"
                          checked={localConfig.show_continue_watching}
                          onCheckedChange={(checked) => handleChange('show_continue_watching', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="showTrending">Em Alta</Label>
                          <p className="text-xs text-muted-foreground">
                            Exibe seção de conteúdos populares
                          </p>
                        </div>
                        <Switch
                          id="showTrending"
                          checked={localConfig.show_trending}
                          onCheckedChange={(checked) => handleChange('show_trending', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="showNewReleases">Lançamentos</Label>
                          <p className="text-xs text-muted-foreground">
                            Exibe seção de novos conteúdos
                          </p>
                        </div>
                        <Switch
                          id="showNewReleases"
                          checked={localConfig.show_new_releases}
                          onCheckedChange={(checked) => handleChange('show_new_releases', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="showCategories">Categorias</Label>
                          <p className="text-xs text-muted-foreground">
                            Exibe seções por categoria
                          </p>
                        </div>
                        <Switch
                          id="showCategories"
                          checked={localConfig.show_categories}
                          onCheckedChange={(checked) => handleChange('show_categories', checked)}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-2">
                      <Label htmlFor="sectionStyle">Estilo das Seções</Label>
                      <Select
                        value={localConfig.section_style || 'carousel'}
                        onValueChange={(value) => handleChange('section_style', value)}
                      >
                        <SelectTrigger id="sectionStyle">
                          <SelectValue placeholder="Selecione o estilo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="carousel">Carrossel</SelectItem>
                          <SelectItem value="grid">Grade</SelectItem>
                          <SelectItem value="list">Lista</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="itemsPerRow">Itens por Linha</Label>
                      <Select
                        value={localConfig.items_per_row || '6'}
                        onValueChange={(value) => handleChange('items_per_row', value)}
                      >
                        <SelectTrigger id="itemsPerRow">
                          <SelectValue placeholder="Selecione a quantidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4 Itens</SelectItem>
                          <SelectItem value="5">5 Itens</SelectItem>
                          <SelectItem value="6">6 Itens</SelectItem>
                          <SelectItem value="7">7 Itens</SelectItem>
                          <SelectItem value="8">8 Itens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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
    </div>
  );
};

const SocialLoginSettings = ({ config, setConfig }: any) => {
  const [localConfig, setLocalConfig] = useState(config?.social_login || {});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (provider: string, field: string, value: any) => {
    setLocalConfig({
      ...localConfig,
      [provider]: {
        ...(localConfig[provider] || {}),
        [field]: value
      }
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await siteConfigAPI.updateConfig({
        ...config,
        social_login: localConfig
      });
      
      if (error) throw error;

      setConfig({ ...config, social_login: localConfig });
      toast({
        title: "Sucesso!",
        description: "As configurações de login social foram atualizadas.",
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
      <Card>
        <CardHeader>
          <CardTitle>Login Social</CardTitle>
          <CardDescription>
            Configure os provedores de autenticação social
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Google */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="enableGoogle">Google</Label>
                  <p className="text-xs text-muted-foreground">
                    Permitir login com conta Google
                  </p>
                </div>
                <Switch
                  id="enableGoogle"
                  checked={localConfig.google?.enabled}
                  onCheckedChange={(checked) => handleChange('google', 'enabled', checked)}
                />
              </div>

              {localConfig.google?.enabled && (
                <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                  <div className="grid gap-2">
                    <Label htmlFor="googleClientId">Client ID</Label>
                    <Input
                      id="googleClientId"
                      value={localConfig.google?.client_id || ''}
                      onChange={(e) => handleChange('google', 'client_id', e.target.value)}
                      placeholder="Seu Google Client ID"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="googleClientSecret">Client Secret</Label>
                    <Input
                      id="googleClientSecret"
                      type="password"
                      value={localConfig.google?.client_secret || ''}
                      onChange={(e) => handleChange('google', 'client_secret', e.target.value)}
                      placeholder="Seu Google Client Secret"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="googleRedirectUri">URI de Redirecionamento</Label>
                    <Input
                      id="googleRedirectUri"
                      value={localConfig.google?.redirect_uri || ''}
                      onChange={(e) => handleChange('google', 'redirect_uri', e.target.value)}
                      placeholder="https://seu-dominio.com/auth/google/callback"
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Facebook */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="enableFacebook">Facebook</Label>
                  <p className="text-xs text-muted-foreground">
                    Permitir login com conta Facebook
                  </p>
                </div>
                <Switch
                  id="enableFacebook"
                  checked={localConfig.facebook?.enabled}
                  onCheckedChange={(checked) => handleChange('facebook', 'enabled', checked)}
                />
              </div>

              {localConfig.facebook?.enabled && (
                <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                  <div className="grid gap-2">
                    <Label htmlFor="facebookAppId">App ID</Label>
                    <Input
                      id="facebookAppId"
                      value={localConfig.facebook?.app_id || ''}
                      onChange={(e) => handleChange('facebook', 'app_id', e.target.value)}
                      placeholder="Seu Facebook App ID"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="facebookAppSecret">App Secret</Label>
                    <Input
                      id="facebookAppSecret"
                      type="password"
                      value={localConfig.facebook?.app_secret || ''}
                      onChange={(e) => handleChange('facebook', 'app_secret', e.target.value)}
                      placeholder="Seu Facebook App Secret"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="facebookRedirectUri">URI de Redirecionamento</Label>
                    <Input
                      id="facebookRedirectUri"
                      value={localConfig.facebook?.redirect_uri || ''}
                      onChange={(e) => handleChange('facebook', 'redirect_uri', e.target.value)}
                      placeholder="https://seu-dominio.com/auth/facebook/callback"
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Configurações Gerais */}
            <div className="space-y-4">
              <Label>Configurações Gerais</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="defaultProvider">Provedor Padrão</Label>
                    <p className="text-xs text-muted-foreground">
                      Provedor exibido por padrão no botão de login
                    </p>
                  </div>
                  <Select
                    value={localConfig.default_provider || 'none'}
                    onValueChange={(value) => handleChange('default_provider', '', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o provedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="rememberUser">Lembrar Usuário</Label>
                    <p className="text-xs text-muted-foreground">
                      Mantém o usuário conectado entre sessões
                    </p>
                  </div>
                  <Switch
                    id="rememberUser"
                    checked={localConfig.remember_user}
                    onCheckedChange={(checked) => handleChange('remember_user', '', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="linkAccounts">Vincular Contas</Label>
                    <p className="text-xs text-muted-foreground">
                      Permite vincular múltiplos provedores à mesma conta
                    </p>
                  </div>
                  <Switch
                    id="linkAccounts"
                    checked={localConfig.link_accounts}
                    onCheckedChange={(checked) => handleChange('link_accounts', '', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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
    </div>
  );
};

const MaintenanceSettings = ({ config, setConfig }: any) => {
  const [localConfig, setLocalConfig] = useState(config?.maintenance || {});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await siteConfigAPI.updateConfig({
        ...config,
        maintenance: localConfig
      });
      
      if (error) throw error;

      setConfig({ ...config, maintenance: localConfig });
      toast({
        title: "Sucesso!",
        description: "As configurações do modo de manutenção foram atualizadas.",
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
      <Card>
        <CardHeader>
          <CardTitle>Modo de Manutenção</CardTitle>
          <CardDescription>
            Configure o modo de manutenção do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Ativar/Desativar Modo Manutenção */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="enableMaintenance">Modo de Manutenção</Label>
                  <p className="text-xs text-muted-foreground">
                    Ativa o modo de manutenção para todos os usuários
                  </p>
                </div>
                <Switch
                  id="enableMaintenance"
                  checked={localConfig.enabled}
                  onCheckedChange={(checked) => handleChange('enabled', checked)}
                />
              </div>

              {localConfig.enabled && (
                <div className="pl-6 space-y-4 border-l-2 border-gray-800">
                  <div className="grid gap-2">
                    <Label htmlFor="maintenanceMessage">Mensagem de Manutenção</Label>
                    <Textarea
                      id="maintenanceMessage"
                      value={localConfig.message || ''}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Sistema em manutenção. Voltaremos em breve!"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="maintenanceEndTime">Previsão de Término</Label>
                    <Input
                      id="maintenanceEndTime"
                      type="datetime-local"
                      value={localConfig.end_time || ''}
                      onChange={(e) => handleChange('end_time', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="allowAdminAccess">Permitir Acesso Admin</Label>
                      <p className="text-xs text-muted-foreground">
                        Permite que administradores acessem o sistema
                      </p>
                    </div>
                    <Switch
                      id="allowAdminAccess"
                      checked={localConfig.allow_admin_access}
                      onCheckedChange={(checked) => handleChange('allow_admin_access', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="showProgressBar">Barra de Progresso</Label>
                      <p className="text-xs text-muted-foreground">
                        Exibe uma barra de progresso estimado
                      </p>
                    </div>
                    <Switch
                      id="showProgressBar"
                      checked={localConfig.show_progress_bar}
                      onCheckedChange={(checked) => handleChange('show_progress_bar', checked)}
                    />
                  </div>

                  {localConfig.show_progress_bar && (
                    <div className="grid gap-2">
                      <Label htmlFor="maintenanceProgress">Progresso Atual (%)</Label>
                      <Input
                        id="maintenanceProgress"
                        type="number"
                        min="0"
                        max="100"
                        value={localConfig.progress || 0}
                        onChange={(e) => handleChange('progress', parseInt(e.target.value))}
                      />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label>Páginas Acessíveis</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="accessHomepage"
                          checked={localConfig.accessible_pages?.includes('home')}
                          onCheckedChange={(checked) => {
                            const pages = new Set(localConfig.accessible_pages || []);
                            checked ? pages.add('home') : pages.delete('home');
                            handleChange('accessible_pages', Array.from(pages));
                          }}
                        />
                        <Label htmlFor="accessHomepage">Página Inicial</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="accessContact"
                          checked={localConfig.accessible_pages?.includes('contact')}
                          onCheckedChange={(checked) => {
                            const pages = new Set(localConfig.accessible_pages || []);
                            checked ? pages.add('contact') : pages.delete('contact');
                            handleChange('accessible_pages', Array.from(pages));
                          }}
                        />
                        <Label htmlFor="accessContact">Contato</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="accessStatus"
                          checked={localConfig.accessible_pages?.includes('status')}
                          onCheckedChange={(checked) => {
                            const pages = new Set(localConfig.accessible_pages || []);
                            checked ? pages.add('status') : pages.delete('status');
                            handleChange('accessible_pages', Array.from(pages));
                          }}
                        />
                        <Label htmlFor="accessStatus">Página de Status</Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Notificações</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="notifyEmail"
                          checked={localConfig.notifications?.email}
                          onCheckedChange={(checked) => handleChange('notifications', {
                            ...localConfig.notifications,
                            email: checked
                          })}
                        />
                        <Label htmlFor="notifyEmail">Notificar por Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="notifyPush"
                          checked={localConfig.notifications?.push}
                          onCheckedChange={(checked) => handleChange('notifications', {
                            ...localConfig.notifications,
                            push: checked
                          })}
                        />
                        <Label htmlFor="notifyPush">Notificações Push</Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="customCss">CSS Personalizado</Label>
                    <Textarea
                      id="customCss"
                      value={localConfig.custom_css || ''}
                      onChange={(e) => handleChange('custom_css', e.target.value)}
                      placeholder="Adicione CSS personalizado para a página de manutenção"
                      className="font-mono min-h-[100px]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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
    </div>
  );
};

const PolicySettings = ({ config, setConfig }: any) => {
  const [localConfig, setLocalConfig] = useState(config?.policies || {});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await siteConfigAPI.updateConfig({
        ...config,
        policies: localConfig
      });
      
      if (error) throw error;

      setConfig({ ...config, policies: localConfig });
      toast({
        title: "Sucesso!",
        description: "As políticas do sistema foram atualizadas.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as políticas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Políticas do Sistema</CardTitle>
          <CardDescription>
            Configure as políticas e termos do seu sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="terms" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <ScrollText className="h-4 w-4" />
                Termos de Uso
              </TabsTrigger>
              <TabsTrigger value="privacy" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <Lock className="h-4 w-4" />
                Política de Privacidade
              </TabsTrigger>
              <TabsTrigger value="cookies" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <Cookie className="h-4 w-4" />
                Política de Cookies
              </TabsTrigger>
              <TabsTrigger value="refund" className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none",
                "flex items-center gap-2 px-4 py-2"
              )}>
                <CreditCard className="h-4 w-4" />
                Política de Reembolso
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <TabsContent value="terms" className="m-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="requireTerms">Exigir Aceitação</Label>
                      <p className="text-xs text-muted-foreground">
                        Exige que usuários aceitem os termos ao se registrar
                      </p>
                    </div>
                    <Switch
                      id="requireTerms"
                      checked={localConfig.require_terms_acceptance}
                      onCheckedChange={(checked) => handleChange('require_terms_acceptance', checked)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="termsVersion">Versão dos Termos</Label>
                    <Input
                      id="termsVersion"
                      value={localConfig.terms_version || '1.0'}
                      onChange={(e) => handleChange('terms_version', e.target.value)}
                      placeholder="1.0"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="termsLastUpdate">Última Atualização</Label>
                    <Input
                      id="termsLastUpdate"
                      type="date"
                      value={localConfig.terms_last_update || ''}
                      onChange={(e) => handleChange('terms_last_update', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="termsContent">Conteúdo dos Termos de Uso</Label>
                    <Textarea
                      id="termsContent"
                      value={localConfig.terms_content || ''}
                      onChange={(e) => handleChange('terms_content', e.target.value)}
                      placeholder="Digite os termos de uso do sistema..."
                      className="min-h-[300px]"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="privacy" className="m-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="requirePrivacy">Exigir Aceitação</Label>
                      <p className="text-xs text-muted-foreground">
                        Exige que usuários aceitem a política de privacidade
                      </p>
                    </div>
                    <Switch
                      id="requirePrivacy"
                      checked={localConfig.require_privacy_acceptance}
                      onCheckedChange={(checked) => handleChange('require_privacy_acceptance', checked)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="privacyVersion">Versão da Política</Label>
                    <Input
                      id="privacyVersion"
                      value={localConfig.privacy_version || '1.0'}
                      onChange={(e) => handleChange('privacy_version', e.target.value)}
                      placeholder="1.0"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="privacyLastUpdate">Última Atualização</Label>
                    <Input
                      id="privacyLastUpdate"
                      type="date"
                      value={localConfig.privacy_last_update || ''}
                      onChange={(e) => handleChange('privacy_last_update', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Dados Coletados</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="collectEmail"
                          checked={localConfig.collected_data?.includes('email')}
                          onCheckedChange={(checked) => {
                            const data = new Set(localConfig.collected_data || []);
                            checked ? data.add('email') : data.delete('email');
                            handleChange('collected_data', Array.from(data));
                          }}
                        />
                        <Label htmlFor="collectEmail">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="collectName"
                          checked={localConfig.collected_data?.includes('name')}
                          onCheckedChange={(checked) => {
                            const data = new Set(localConfig.collected_data || []);
                            checked ? data.add('name') : data.delete('name');
                            handleChange('collected_data', Array.from(data));
                          }}
                        />
                        <Label htmlFor="collectName">Nome</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="collectLocation"
                          checked={localConfig.collected_data?.includes('location')}
                          onCheckedChange={(checked) => {
                            const data = new Set(localConfig.collected_data || []);
                            checked ? data.add('location') : data.delete('location');
                            handleChange('collected_data', Array.from(data));
                          }}
                        />
                        <Label htmlFor="collectLocation">Localização</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="collectDevice"
                          checked={localConfig.collected_data?.includes('device')}
                          onCheckedChange={(checked) => {
                            const data = new Set(localConfig.collected_data || []);
                            checked ? data.add('device') : data.delete('device');
                            handleChange('collected_data', Array.from(data));
                          }}
                        />
                        <Label htmlFor="collectDevice">Informações do Dispositivo</Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="privacyContent">Política de Privacidade</Label>
                    <Textarea
                      id="privacyContent"
                      value={localConfig.privacy_content || ''}
                      onChange={(e) => handleChange('privacy_content', e.target.value)}
                      placeholder="Digite a política de privacidade..."
                      className="min-h-[300px]"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cookies" className="m-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="showCookieConsent">Aviso de Cookies</Label>
                      <p className="text-xs text-muted-foreground">
                        Exibe banner de consentimento de cookies
                      </p>
                    </div>
                    <Switch
                      id="showCookieConsent"
                      checked={localConfig.show_cookie_consent}
                      onCheckedChange={(checked) => handleChange('show_cookie_consent', checked)}
                    />
                  </div>

                  {localConfig.show_cookie_consent && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="cookieConsentMessage">Mensagem do Banner</Label>
                        <Textarea
                          id="cookieConsentMessage"
                          value={localConfig.cookie_consent_message || ''}
                          onChange={(e) => handleChange('cookie_consent_message', e.target.value)}
                          placeholder="Este site usa cookies para melhorar sua experiência..."
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Tipos de Cookies</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="necessaryCookies"
                              checked={localConfig.cookie_types?.includes('necessary')}
                              onCheckedChange={(checked) => {
                                const types = new Set(localConfig.cookie_types || []);
                                checked ? types.add('necessary') : types.delete('necessary');
                                handleChange('cookie_types', Array.from(types));
                              }}
                            />
                            <Label htmlFor="necessaryCookies">Necessários</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="analyticsCookies"
                              checked={localConfig.cookie_types?.includes('analytics')}
                              onCheckedChange={(checked) => {
                                const types = new Set(localConfig.cookie_types || []);
                                checked ? types.add('analytics') : types.delete('analytics');
                                handleChange('cookie_types', Array.from(types));
                              }}
                            />
                            <Label htmlFor="analyticsCookies">Análise</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="marketingCookies"
                              checked={localConfig.cookie_types?.includes('marketing')}
                              onCheckedChange={(checked) => {
                                const types = new Set(localConfig.cookie_types || []);
                                checked ? types.add('marketing') : types.delete('marketing');
                                handleChange('cookie_types', Array.from(types));
                              }}
                            />
                            <Label htmlFor="marketingCookies">Marketing</Label>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="cookiePolicy">Política de Cookies</Label>
                    <Textarea
                      id="cookiePolicy"
                      value={localConfig.cookie_policy || ''}
                      onChange={(e) => handleChange('cookie_policy', e.target.value)}
                      placeholder="Digite a política de cookies..."
                      className="min-h-[300px]"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="refund" className="m-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="enableRefunds">Permitir Reembolsos</Label>
                      <p className="text-xs text-muted-foreground">
                        Habilita política de reembolso no sistema
                      </p>
                    </div>
                    <Switch
                      id="enableRefunds"
                      checked={localConfig.enable_refunds}
                      onCheckedChange={(checked) => handleChange('enable_refunds', checked)}
                    />
                  </div>

                  {localConfig.enable_refunds && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="refundPeriod">Período de Reembolso (dias)</Label>
                        <Input
                          id="refundPeriod"
                          type="number"
                          min="1"
                          max="365"
                          value={localConfig.refund_period || 7}
                          onChange={(e) => handleChange('refund_period', parseInt(e.target.value))}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Motivos de Reembolso Aceitos</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="technicalIssues"
                              checked={localConfig.refund_reasons?.includes('technical')}
                              onCheckedChange={(checked) => {
                                const reasons = new Set(localConfig.refund_reasons || []);
                                checked ? reasons.add('technical') : reasons.delete('technical');
                                handleChange('refund_reasons', Array.from(reasons));
                              }}
                            />
                            <Label htmlFor="technicalIssues">Problemas Técnicos</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="qualityIssues"
                              checked={localConfig.refund_reasons?.includes('quality')}
                              onCheckedChange={(checked) => {
                                const reasons = new Set(localConfig.refund_reasons || []);
                                checked ? reasons.add('quality') : reasons.delete('quality');
                                handleChange('refund_reasons', Array.from(reasons));
                              }}
                            />
                            <Label htmlFor="qualityIssues">Problemas de Qualidade</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="wrongPurchase"
                              checked={localConfig.refund_reasons?.includes('wrong_purchase')}
                              onCheckedChange={(checked) => {
                                const reasons = new Set(localConfig.refund_reasons || []);
                                checked ? reasons.add('wrong_purchase') : reasons.delete('wrong_purchase');
                                handleChange('refund_reasons', Array.from(reasons));
                              }}
                            />
                            <Label htmlFor="wrongPurchase">Compra Acidental</Label>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="refundPolicy">Política de Reembolso</Label>
                        <Textarea
                          id="refundPolicy"
                          value={localConfig.refund_policy || ''}
                          onChange={(e) => handleChange('refund_policy', e.target.value)}
                          placeholder="Digite a política de reembolso..."
                          className="min-h-[300px]"
                        />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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
    </div>
  );
};

const GDPRSettings = ({ config, setConfig }: any) => (
    <div className="space-y-6">
    {/* Implementar configurações GDPR */}
                </div>
);

const RobotsSettings = ({ config, setConfig }: any) => {
  const [localConfig, setLocalConfig] = useState(config?.robots || {});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await siteConfigAPI.updateConfig({
        ...config,
        robots: localConfig
      });
      
      if (error) throw error;

      setConfig({ ...config, robots: localConfig });
      toast({
        title: "Sucesso!",
        description: "O conteúdo do robots.txt foi atualizado.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o robots.txt.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Configurações do Robots.txt</CardTitle>
          <CardDescription className="text-gray-400">
            Configure o arquivo robots.txt para controlar o acesso dos motores de busca ao seu site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="enableRobots" className="text-gray-100">Ativar Robots.txt Personalizado</Label>
                  <p className="text-xs text-gray-400">
                    Permite personalizar as regras de acesso dos motores de busca
                  </p>
                </div>
                <Switch
                  id="enableRobots"
                  checked={localConfig.enabled}
                  onCheckedChange={(checked) => handleChange('enabled', checked)}
                />
              </div>

              {localConfig.enabled && (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="robotsContent" className="text-gray-100">Conteúdo do Robots.txt</Label>
                    <Textarea
                      id="robotsContent"
                      value={localConfig.content || defaultRobotsContent}
                      onChange={(e) => handleChange('content', e.target.value)}
                      placeholder={`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://seusite.com/sitemap.xml`}
                      className="min-h-[300px] font-mono bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-500"
                    />
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-100 mb-2">Exemplos de Regras Comuns:</h4>
                    <div className="space-y-2 text-xs text-gray-400">
                      <p>• Permitir todos os robôs: User-agent: * / Allow: /</p>
                      <p>• Bloquear pasta admin: Disallow: /admin/</p>
                      <p>• Bloquear robô específico: User-agent: Googlebot / Disallow: /privado/</p>
                      <p>• Adicionar sitemap: Sitemap: https://seusite.com/sitemap.xml</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleChange('content', defaultRobotsContent)}
                      className="text-gray-100 border-gray-700 hover:bg-gray-800"
                    >
                      Restaurar Padrão
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open('/robots.txt', '_blank')}
                      className="text-gray-100 border-gray-700 hover:bg-gray-800"
                    >
                      Visualizar Atual
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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
    </div>
  );
};

const defaultRobotsContent = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Bloquear diretórios sensíveis
Disallow: /private/
Disallow: /admin/
Disallow: /backend/
Disallow: /wp-admin/

# Permitir arquivos estáticos
Allow: /*.js$
Allow: /*.css$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.gif$
Allow: /*.svg$

# Adicione seu sitemap aqui
Sitemap: https://seusite.com/sitemap.xml`;

const ExtensionsSettings = ({ config, setConfig }: any) => {
  const [localConfig, setLocalConfig] = useState(config?.extensions || {});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  const handleCountryChange = (action: 'block' | 'allow', country: string) => {
    const currentList = localConfig[`${action}ed_countries`] || [];
    const updatedList = currentList.includes(country)
      ? currentList.filter((c: string) => c !== country)
      : [...currentList, country];
    
    handleChange(`${action}ed_countries`, updatedList);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await siteConfigAPI.updateConfig({
        ...config,
        extensions: localConfig
      });
      
      if (error) throw error;

      setConfig({ ...config, extensions: localConfig });
      toast({
        title: "Sucesso!",
        description: "As configurações de extensões foram atualizadas.",
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

  const countries = [
    { code: 'BR', name: 'Brasil' },
    { code: 'US', name: 'Estados Unidos' },
    { code: 'PT', name: 'Portugal' },
    { code: 'ES', name: 'Espanha' },
    { code: 'FR', name: 'França' },
    { code: 'DE', name: 'Alemanha' },
    { code: 'IT', name: 'Itália' },
    { code: 'GB', name: 'Reino Unido' },
    { code: 'JP', name: 'Japão' },
    { code: 'CN', name: 'China' },
    { code: 'RU', name: 'Rússia' },
    { code: 'IN', name: 'Índia' },
    { code: 'CA', name: 'Canadá' },
    { code: 'AU', name: 'Austrália' },
    { code: 'MX', name: 'México' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Bloqueio Geográfico</CardTitle>
          <CardDescription className="text-gray-400">
            Controle o acesso ao site por localização geográfica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="enableGeoBlocking" className="text-gray-100">Ativar Bloqueio Geográfico</Label>
                  <p className="text-xs text-gray-400">
                    Permite controlar o acesso ao site por país
                  </p>
                </div>
                <Switch
                  id="enableGeoBlocking"
                  checked={localConfig.geo_blocking_enabled}
                  onCheckedChange={(checked) => handleChange('geo_blocking_enabled', checked)}
                />
              </div>

              {localConfig.geo_blocking_enabled && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Select
                        value={localConfig.geo_blocking_mode || 'blacklist'}
                        onValueChange={(value) => handleChange('geo_blocking_mode', value)}
                      >
                        <SelectTrigger className="w-[200px] bg-gray-900 border-gray-700 text-gray-100">
                          <SelectValue placeholder="Selecione o modo" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="blacklist">Lista de Bloqueio</SelectItem>
                          <SelectItem value="whitelist">Lista de Permissão</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-400">
                        {localConfig.geo_blocking_mode === 'blacklist' 
                          ? 'Bloquear acesso dos países selecionados'
                          : 'Permitir acesso apenas dos países selecionados'}
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <Label className="text-gray-100">
                        {localConfig.geo_blocking_mode === 'blacklist' 
                          ? 'Países Bloqueados'
                          : 'Países Permitidos'}
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {countries.map((country) => (
                          <div
                            key={country.code}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`country-${country.code}`}
                              checked={localConfig[`${localConfig.geo_blocking_mode === 'blacklist' ? 'block' : 'allow'}ed_countries`]?.includes(country.code)}
                              onCheckedChange={() => handleCountryChange(
                                localConfig.geo_blocking_mode === 'blacklist' ? 'block' : 'allow',
                                country.code
                              )}
                              className="border-gray-700 data-[state=checked]:bg-primary"
                            />
                            <Label
                              htmlFor={`country-${country.code}`}
                              className="text-sm text-gray-100"
                            >
                              {country.name} ({country.code})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-100 mb-2">Mensagem de Bloqueio</h4>
                      <Textarea
                        value={localConfig.blocking_message || 'Desculpe, o acesso a este site não está disponível em sua região.'}
                        onChange={(e) => handleChange('blocking_message', e.target.value)}
                        placeholder="Mensagem exibida para usuários bloqueados"
                        className="bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="enableRedirect"
                        checked={localConfig.enable_redirect}
                        onCheckedChange={(checked) => handleChange('enable_redirect', checked)}
                      />
                      <div className="grid gap-1.5">
                        <Label htmlFor="enableRedirect" className="text-gray-100">
                          Redirecionar usuários bloqueados
                        </Label>
                        <p className="text-xs text-gray-400">
                          Redireciona para uma URL alternativa em vez de mostrar mensagem de bloqueio
                        </p>
                      </div>
                    </div>

                    {localConfig.enable_redirect && (
                      <div className="grid gap-2">
                        <Label htmlFor="redirectUrl" className="text-gray-100">URL de Redirecionamento</Label>
                        <Input
                          id="redirectUrl"
                          value={localConfig.redirect_url || ''}
                          onChange={(e) => handleChange('redirect_url', e.target.value)}
                          placeholder="https://exemplo.com/blocked"
                          className="bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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
    </div>
  );
};

export default SystemSettings; 