-- Create the site_config table
create table if not exists public.site_config (
    id bigint primary key default 1,
    logo text,
    favicon text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint single_row check (id = 1)
);

-- Set up Row Level Security (RLS)
alter table public.site_config enable row level security;

-- Create policies
create policy "Allow authenticated users to view site config"
    on public.site_config for select
    to authenticated
    using (true);

create policy "Allow admins to update site config"
    on public.site_config for update
    to authenticated
    using (
        exists (
            select 1 from public.profiles
            where auth.uid() = id
            and (role = 'admin' or role = 'super_admin')
        )
    );

-- Create storage bucket for site assets
insert into storage.buckets (id, name, public) 
values ('site-assets', 'site-assets', true);

-- Set up storage policies
create policy "Allow public access to site assets"
    on storage.objects for select
    to public
    using ( bucket_id = 'site-assets' );

create policy "Allow admins to upload site assets"
    on storage.objects for insert
    to authenticated
    with check (
        bucket_id = 'site-assets'
        and exists (
            select 1 from public.profiles
            where auth.uid() = id
            and (role = 'admin' or role = 'super_admin')
        )
    );

-- Insert default config
insert into public.site_config (id)
values (1)
on conflict (id) do nothing;
