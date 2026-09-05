-- ===========================================
-- MyTradingCoach – Supabase Database Schema
-- Run this entire file in the Supabase SQL Editor
-- ===========================================

-- 1. Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Rules
create table if not exists public.rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null default '',
  updated_at timestamptz default now() not null,
  unique(user_id)
);

alter table public.rules enable row level security;

create policy "Users can manage own rules"
  on public.rules for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. Patterns (memory)
create table if not exists public.patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text,
  ai_description text not null,
  classification text not null,
  type text not null default 'example' check (type in ('good', 'failed', 'example')),
  created_at timestamptz default now() not null
);

create index if not exists patterns_user_id_idx on public.patterns(user_id);

alter table public.patterns enable row level security;

create policy "Users can manage own patterns"
  on public.patterns for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Analyses
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chart_image_url text,
  tradingview_link text,
  ai_response text not null,
  probability integer,
  bias text,
  setup_status text,
  created_at timestamptz default now() not null
);

create index if not exists analyses_user_id_idx on public.analyses(user_id);

alter table public.analyses enable row level security;

create policy "Users can manage own analyses"
  on public.analyses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. Storage bucket for chart images
insert into storage.buckets (id, name, public)
values ('charts', 'charts', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload to their own folder
create policy "Users can upload charts"
  on storage.objects for insert
  with check (
    bucket_id = 'charts'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Anyone can view charts"
  on storage.objects for select
  using (bucket_id = 'charts');

create policy "Users can delete own charts"
  on storage.objects for delete
  using (
    bucket_id = 'charts'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Optional: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
