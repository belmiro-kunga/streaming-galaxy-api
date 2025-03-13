import { supabase } from '@/lib/supabase';

export interface SiteConfig {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  business_hours: string;
  footer_text: string;
  theme_color: string;
  accent_color: string;
  font_family: string;
  enable_dark_mode: boolean;
  enable_mobile_version: boolean;
  maintenance_mode: boolean;
  maintenance_message: string;
  logo?: string;
  favicon?: string;
}

export const siteConfigAPI = {
  // Buscar configurações do site
  getConfig: async (): Promise<{ data: SiteConfig | null; error: Error | null }> => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching site config:', error);
      return { data: null, error: error as Error };
    }
  },

  // Atualizar configurações do site
  updateConfig: async (config: Partial<SiteConfig>): Promise<{ data: SiteConfig | null; error: Error | null }> => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .update(config)
        .eq('id', 1)
        .select()
        .single();

      if (error) throw error;

      // Atualizar variáveis CSS globais
      if (config.theme_color) {
        document.documentElement.style.setProperty('--theme-color', config.theme_color);
      }
      if (config.accent_color) {
        document.documentElement.style.setProperty('--accent-color', config.accent_color);
      }
      if (config.font_family) {
        document.documentElement.style.setProperty('--font-family', config.font_family);
      }

      // Atualizar modo escuro
      if (typeof config.enable_dark_mode !== 'undefined') {
        document.documentElement.classList.toggle('dark', config.enable_dark_mode);
      }

      // Atualizar texto do footer
      if (config.footer_text) {
        const footerElement = document.getElementById('site-footer');
        if (footerElement) {
          footerElement.textContent = config.footer_text;
        }
      }

      // Atualizar título do site
      if (config.site_name) {
        document.title = config.site_name;
      }

      // Atualizar meta description
      if (config.site_description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', config.site_description);
        }
      }

      // Ativar/desativar modo de manutenção
      if (typeof config.maintenance_mode !== 'undefined') {
        if (config.maintenance_mode) {
          document.body.classList.add('maintenance-mode');
        } else {
          document.body.classList.remove('maintenance-mode');
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating site config:', error);
      return { data: null, error: error as Error };
    }
  }
};
