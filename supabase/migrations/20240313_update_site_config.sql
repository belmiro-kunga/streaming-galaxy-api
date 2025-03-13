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
