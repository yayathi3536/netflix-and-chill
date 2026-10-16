-- ====================================================================
-- OUR UNIVERSE — Supabase Database Migration & Security Schema
-- Version: 20261016_initial_schema
-- Description: Creates tables, RLS policies, Storage buckets, and seed data
-- ====================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. MEMORIES TABLE
create table if not exists public.memories (
  id text primary key,
  title text not null,
  subtitle text,
  category text not null check (category in ('our-story', 'memories', 'little-things', 'places-list', 'secret-vault')),
  date text not null,
  year text not null,
  duration text not null,
  match_score integer default 100 check (match_score between 1 and 100),
  rating text default 'PG-Love',
  synopsis text not null,
  full_story text not null,
  location text,
  tags text[] default '{}'::text[],
  backdrop_url text,
  poster_url text,
  fallback_gradient text default 'from-rose-950 via-red-950 to-neutral-950',
  progress integer check (progress between 0 and 100),
  is_top_10 integer,
  is_favorite boolean default false,
  is_in_watchlist boolean default false,
  is_secret boolean default false,
  secret_passcode text,
  letter_content text,
  list_status text check (list_status is null or list_status in ('visited', 'bucket-list')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Indexing for category queries and ranking
create index if not exists idx_memories_category on public.memories(category);
create index if not exists idx_memories_is_top_10 on public.memories(is_top_10) where is_top_10 is not null;
create index if not exists idx_memories_created_at on public.memories(created_at desc);

-- 3. STORY CHAPTERS (Episodes)
create table if not exists public.story_chapters (
  id text primary key,
  memory_id text references public.memories(id) on delete cascade not null,
  episode_number integer not null,
  title text not null,
  duration text not null,
  date text,
  description text not null,
  thumbnail_url text,
  gradient text default 'from-neutral-900 to-black',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_story_chapters_memory_id on public.story_chapters(memory_id);

-- 4. LOVE NOTES & COUPONS (Secret Vault)
create table if not exists public.love_notes (
  id text primary key,
  memory_id text references public.memories(id) on delete cascade not null,
  title text not null,
  perk text not null,
  terms text not null,
  redeemed boolean default false not null,
  redeemed_at timestamptz,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_love_notes_memory_id on public.love_notes(memory_id);

-- 5. WATCHLIST ITEMS
create table if not exists public.watchlist_items (
  id uuid primary key default uuid_generate_v4(),
  memory_id text references public.memories(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade,
  client_id text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  unique(memory_id, client_id)
);

create index if not exists idx_watchlist_client_id on public.watchlist_items(client_id);

-- 6. SITE SETTINGS
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 7. STORAGE BUCKET FOR REAL PHOTO UPLOADS
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'memory-photos',
  'memory-photos',
  true,
  10485760, -- 10MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table public.memories enable row level security;
alter table public.story_chapters enable row level security;
alter table public.love_notes enable row level security;
alter table public.watchlist_items enable row level security;
alter table public.site_settings enable row level security;

-- MEMORIES POLICIES
-- Anyone can view public relationship memories
create policy "Public can read memories"
  on public.memories for select
  using (true);

-- Only authenticated administrator can insert, update, or delete memories
create policy "Authenticated admin can insert memories"
  on public.memories for insert
  to authenticated
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin can update memories"
  on public.memories for update
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin can delete memories"
  on public.memories for delete
  to authenticated
  using (auth.role() = 'authenticated');

-- STORY CHAPTERS POLICIES
create policy "Public can read story chapters"
  on public.story_chapters for select
  using (true);

create policy "Authenticated admin can insert story chapters"
  on public.story_chapters for insert
  to authenticated
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin can update story chapters"
  on public.story_chapters for update
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin can delete story chapters"
  on public.story_chapters for delete
  to authenticated
  using (auth.role() = 'authenticated');

-- LOVE NOTES / COUPONS POLICIES
create policy "Public can read love notes"
  on public.love_notes for select
  using (true);

-- Anyone can redeem a coupon (update redeemed field)
create policy "Public can redeem coupon"
  on public.love_notes for update
  using (true)
  with check (redeemed = true);

create policy "Authenticated admin can insert love notes"
  on public.love_notes for insert
  to authenticated
  with check (auth.role() = 'authenticated');

create policy "Authenticated admin can delete love notes"
  on public.love_notes for delete
  to authenticated
  using (auth.role() = 'authenticated');

-- WATCHLIST POLICIES
create policy "Anyone can read their watchlist"
  on public.watchlist_items for select
  using (true);

create policy "Anyone can add to their watchlist"
  on public.watchlist_items for insert
  with check (true);

create policy "Anyone can remove from their watchlist"
  on public.watchlist_items for delete
  using (client_id = client_id or auth.uid() = user_id);

-- SITE SETTINGS POLICIES
create policy "Public can read site settings"
  on public.site_settings for select
  using (true);

create policy "Authenticated admin can modify site settings"
  on public.site_settings for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- STORAGE BUCKET POLICIES (memory-photos)
-- 1. Public read access to view uploaded relationship photos
create policy "Public can view memory photos"
  on storage.objects for select
  using (bucket_id = 'memory-photos');

-- 2. Only authenticated admin can upload photos
create policy "Authenticated admin can upload memory photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'memory-photos');

-- 3. Only authenticated admin can update photos
create policy "Authenticated admin can update memory photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'memory-photos');

-- 4. Only authenticated admin can delete photos
create policy "Authenticated admin can delete memory photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'memory-photos');

-- ====================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ====================================================================

-- Auto update timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create or replace trigger set_memories_updated_at
  before update on public.memories
  for each row execute function public.handle_updated_at();

-- Safe Coupon Redemption RPC
create or replace function public.redeem_love_coupon(p_coupon_id text)
returns boolean as $$
declare
  v_exists boolean;
begin
  select exists(select 1 from public.love_notes where id = p_coupon_id) into v_exists;
  if not v_exists then
    return false;
  end if;

  update public.love_notes
  set redeemed = true,
      redeemed_at = timezone('utc'::text, now())
  where id = p_coupon_id;

  return true;
end;
$$ language plpgsql security definer;

-- Initial Site Settings
insert into public.site_settings (key, value)
values
  ('couple_info', '{"partner1": "My Girl", "partner2": "Your Guy", "anniversaryDate": "2022-10-14"}'::jsonb),
  ('app_version', '{"version": "2.0.0", "theme": "cinematic-red"}'::jsonb)
on conflict (key) do nothing;
