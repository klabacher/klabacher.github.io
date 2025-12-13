-- Dashboard admin schema

-- Users profile (linked to auth.users)
create table if not exists public.users_profile (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  github_login text,
  github_avatar text,
  created_at timestamptz default now()
);

-- Public projects (mirror of ProjectData)
create table if not exists public.projects_public (
  id text primary key,
  title text not null,
  short_description text,
  full_description text,
  github_url text,
  live_url text,
  tech_stack jsonb,
  images jsonb,
  created_at timestamptz default now()
);

-- Internal projects / ideas / plans
create table if not exists public.projects_internal (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text,
  status text,
  priority text,
  notes text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Repositories snapshot
create table if not exists public.repositories (
  id uuid primary key default gen_random_uuid(),
  github_full_name text not null,
  visibility text,
  stars int,
  forks int,
  language text,
  tags text[],
  synced_at timestamptz default now()
);

-- Enable RLS
alter table public.users_profile enable row level security;
alter table public.projects_public enable row level security;
alter table public.projects_internal enable row level security;
alter table public.repositories enable row level security;

-- Policies
drop policy if exists "Users read own profile" on public.users_profile;
create policy "Users read own profile" on public.users_profile
  for select using (auth.uid() = auth_user_id);

drop policy if exists "Users update own profile" on public.users_profile;
create policy "Users update own profile" on public.users_profile
  for update using (auth.uid() = auth_user_id);

drop policy if exists "Public projects readable" on public.projects_public;
create policy "Public projects readable" on public.projects_public
  for select using (true);

drop policy if exists "Admins manage public projects" on public.projects_public;
create policy "Admins manage public projects" on public.projects_public
  for all using (auth.role() = 'authenticated');

drop policy if exists "Admins manage internal projects" on public.projects_internal;
create policy "Admins manage internal projects" on public.projects_internal
  for all using (auth.role() = 'authenticated');

drop policy if exists "Admins manage repositories" on public.repositories;
create policy "Admins manage repositories" on public.repositories
  for all using (auth.role() = 'authenticated');

-- Indexes
create index if not exists idx_projects_public_created_at on public.projects_public(created_at desc);
create index if not exists idx_projects_internal_created_at on public.projects_internal(created_at desc);
create index if not exists idx_repositories_synced_at on public.repositories(synced_at desc);
