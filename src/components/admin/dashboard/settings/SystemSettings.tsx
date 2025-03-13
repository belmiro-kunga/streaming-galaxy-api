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