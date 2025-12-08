-- Migration 0002: Enhanced RLS policies and seed data

-- Drop old broad policies
drop policy if exists "Admins manage public projects" on public.projects_public;
drop policy if exists "Admins manage internal projects" on public.projects_internal;
drop policy if exists "Admins manage repositories" on public.repositories;

-- Create user-specific admin policies
-- Only allow the specific GitHub user (you) to manage data
-- Replace 'YOUR_GITHUB_USER_ID' with your actual auth.users.id from Supabase

create policy "Owner manages public projects" on public.projects_public
  for all using (
    auth.uid() IN (
      select auth_user_id from public.users_profile 
      where github_login = 'klabacher' -- Your GitHub username
    )
  );

create policy "Owner manages internal projects" on public.projects_internal
  for all using (
    auth.uid() IN (
      select auth_user_id from public.users_profile 
      where github_login = 'klabacher'
    )
  );

create policy "Owner manages repositories" on public.repositories
  for all using (
    auth.uid() IN (
      select auth_user_id from public.users_profile 
      where github_login = 'klabacher'
    )
  );

-- Seed initial public project data from ProjectData.ts
insert into public.projects_public (id, title, short_description, full_description, github_url, live_url, tech_stack, images)
values (
  'CountSparks',
  'CountSparks - Contadores simplificados',
  'Dashboard completo para criação/monitoramento e facil integração de contadores web.',
  E'Este projeto foi desenvolvido para criar uma alternativa rapida, leve e personalizável aos tradicionais codigos de contadores.\nO mesmo codigo, feito repetidas vezes em JS, era pesado e dificil de integrar com outras plataformas.\n\nCom o CountSparks, o usuário pode criar contadores personalizados via dashboard, escolher entre varias opções de visualização e integrar facilmente via API ou embed code.\n\n**Foco na leveza e simplicidade:**\n- Sistema funciona direto na web e API simplificada com Supabase.\n\n**Principais Desafios:**\n- Ser simples e leve para integrar em qualquer site.\n- Oferecer personalização sem complicar a UX.\n- Construir um backend robusto para gerenciar milhares de contadores.\n- Criar customizações visuais dinâmicas e responsivas sem comprometer a performance.\n\n**Solução: (Em progresso)**\n- Centralizar a criação e gestão dos contadores em um dashboard intuitivo e facilitar a exportação/managment.',
  'https://github.com/klabacher/CountSparks',
  'https://klabacher.github.io/CountSparks/',
  jsonb_build_array(
    jsonb_build_object('name', 'React'),
    jsonb_build_object('name', 'TypeScript'),
    jsonb_build_object('name', 'TailwindCSS'),
    jsonb_build_object('name', 'Vite'),
    jsonb_build_object('name', 'ViTest'),
    jsonb_build_object('name', 'Redux'),
    jsonb_build_object('name', 'React Router')
  ),
  jsonb_build_array(
    jsonb_build_object('url', '/assets/countsparks/dashboard.png', 'title', 'Dashboard Principal', 'description', 'Visão geral para manutenção e criação de contadores.'),
    jsonb_build_object('url', '/assets/countsparks/frontpage.png', 'title', 'Pagina Inicial', 'description', 'Pagina inicial do projeto'),
    jsonb_build_object('url', '/assets/countsparks/login.png', 'title', 'Tela de Login', 'description', 'Sistema de autenticação via JWT e OAuth usando Supabase.'),
    jsonb_build_object('url', '/assets/countsparks/checagemdeemail.png', 'title', 'Verificação de Email', 'description', 'Fluxo de verificação de email para novos usuários usando Supabase.'),
    jsonb_build_object('url', '/assets/countsparks/final.png', 'title', 'Dashboard do Contador', 'description', 'Visualização final do contador integrado em um site. Muito trabalho pelo frente ainda! :D')
  )
)
on conflict (id) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  github_url = excluded.github_url,
  live_url = excluded.live_url,
  tech_stack = excluded.tech_stack,
  images = excluded.images;

-- Create function to auto-populate users_profile on first GitHub login
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users_profile (auth_user_id, github_login, github_avatar)
  values (
    new.id,
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (auth_user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call function on user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Add unique constraint to users_profile
alter table public.users_profile add constraint if not exists users_profile_auth_user_id_key unique (auth_user_id);
