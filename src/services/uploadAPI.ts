import { supabase } from '@/lib/supabase';

export interface UploadResponse {
  url: string;
  error: Error | null;
}

export const uploadAPI = {
  uploadImage: async (file: File, path: string): Promise<UploadResponse> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Upload error:', error);
      return { url: '', error: error as Error };
    }
  },

  uploadVideo: async (file: File, folder: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);
      
      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading video:', error);
      return { url: '', error };
    }
  },

  updateSiteConfig: async (config: { logo?: string; favicon?: string }) => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .upsert({ 
          id: 1, // Assumindo que temos apenas uma configuração
          ...config,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Config update error:', error);
      return { data: null, error };
    }
  },

  getSiteConfig: async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Config fetch error:', error);
      return { data: null, error };
    }
  }
};
