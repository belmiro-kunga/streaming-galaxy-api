
-- Adicionar novas colunas para configurações gerais
alter table public.site_config
add column if not exists site_name text default 'Streaming Galaxy',
add column if not exists site_description text default 'Sua plataforma de streaming',
add column if not exists contact_email text,
add column if not exists contact_phone text,
add column if not exists address text,
add column if not exists business_hours text,
add column if not exists footer_text text default '© 2024 Streaming Galaxy. Todos os direitos reservados.',
add column if not exists theme_color text default '#000000',
add column if not exists accent_color text default '#FF0000',
add column if not exists font_family text default 'Inter',
add column if not exists enable_dark_mode boolean default true,
add column if not exists enable_mobile_version boolean default true,
add column if not exists maintenance_mode boolean default false,
add column if not exists maintenance_message text;

-- Criar bucket para imagens de conteúdo se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket específico para trailers de séries
INSERT INTO storage.buckets (id, name, public)
VALUES ('series-trailers', 'series-trailers', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para acesso público ao bucket de imagens
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'site-assets' OR bucket_id = 'series-trailers')
ON CONFLICT DO NOTHING;

CREATE POLICY "Insert site-assets by authenticated users" ON storage.objects
FOR INSERT WITH CHECK (
  (bucket_id = 'site-assets' OR bucket_id = 'series-trailers') AND
  auth.role() = 'authenticated'
)
ON CONFLICT DO NOTHING;

CREATE POLICY "Update site-assets by authenticated users" ON storage.objects
FOR UPDATE USING (
  (bucket_id = 'site-assets' OR bucket_id = 'series-trailers') AND
  auth.role() = 'authenticated'
)
ON CONFLICT DO NOTHING;

CREATE POLICY "Delete site-assets by authenticated users" ON storage.objects
FOR DELETE USING (
  (bucket_id = 'site-assets' OR bucket_id = 'series-trailers') AND
  auth.role() = 'authenticated'
)
ON CONFLICT DO NOTHING;
