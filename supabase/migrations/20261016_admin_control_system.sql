-- ====================================================================
-- OUR UNIVERSE — Complete Admin Control System & RLS Migration
-- Run this script in the Supabase SQL Editor (SQL Editor -> New Query)
-- ====================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. SITE CONTENT TABLE (Headings, Paragraphs, Love Letters & Couple Info)
create table if not exists public.site_content (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  section text not null default 'general',
  label text,
  value text not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_site_content_key on public.site_content(key);
create index if not exists idx_site_content_section on public.site_content(section);

-- 3. MEMORIES TABLE (Moments, Episodes, Dates, Media)
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

create index if not exists idx_memories_category on public.memories(category);
create index if not exists idx_memories_created_at on public.memories(created_at desc);

-- 4. STORY CHAPTERS (Episodes in Original Series)
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

-- 5. LOVE NOTES & COUPONS (Secret Vault)
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

-- 6. WATCHLIST ITEMS
create table if not exists public.watchlist_items (
  id uuid primary key default uuid_generate_v4(),
  memory_id text references public.memories(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade,
  client_id text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  unique(memory_id, client_id)
);

-- 7. STORAGE BUCKET FOR PHOTO & MEDIA UPLOADS
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'memory-photos',
  'memory-photos',
  true,
  10485760, -- 10MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Rule: Public has SELECT (read-only); Only verified Admin can INSERT/UPDATE/DELETE
-- ====================================================================

alter table public.site_content enable row level security;
alter table public.memories enable row level security;
alter table public.story_chapters enable row level security;
alter table public.love_notes enable row level security;
alter table public.watchlist_items enable row level security;

-- A. SITE CONTENT POLICIES
-- 1. Public can read all site texts and letters
drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  using (true);

-- 2. Only authenticated admin can modify site texts
drop policy if exists "Admin can insert site content" on public.site_content;
create policy "Admin can insert site content"
  on public.site_content for insert
  to authenticated
  with check (auth.role() = 'authenticated');

drop policy if exists "Admin can update site content" on public.site_content;
create policy "Admin can update site content"
  on public.site_content for update
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Admin can delete site content" on public.site_content;
create policy "Admin can delete site content"
  on public.site_content for delete
  to authenticated
  using (auth.role() = 'authenticated');

-- B. MEMORIES POLICIES
-- 1. Public can read memories
drop policy if exists "Public can read memories" on public.memories;
create policy "Public can read memories"
  on public.memories for select
  using (true);

-- 2. Only authenticated admin can create, update, or delete memories
drop policy if exists "Admin can insert memories" on public.memories;
create policy "Admin can insert memories"
  on public.memories for insert
  to authenticated
  with check (auth.role() = 'authenticated');

drop policy if exists "Admin can update memories" on public.memories;
create policy "Admin can update memories"
  on public.memories for update
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Admin can delete memories" on public.memories;
create policy "Admin can delete memories"
  on public.memories for delete
  to authenticated
  using (auth.role() = 'authenticated');

-- C. STORY CHAPTERS POLICIES
drop policy if exists "Public can read story chapters" on public.story_chapters;
create policy "Public can read story chapters"
  on public.story_chapters for select
  using (true);

drop policy if exists "Admin can insert story chapters" on public.story_chapters;
create policy "Admin can insert story chapters"
  on public.story_chapters for insert
  to authenticated
  with check (auth.role() = 'authenticated');

drop policy if exists "Admin can update story chapters" on public.story_chapters;
create policy "Admin can update story chapters"
  on public.story_chapters for update
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Admin can delete story chapters" on public.story_chapters;
create policy "Admin can delete story chapters"
  on public.story_chapters for delete
  to authenticated
  using (auth.role() = 'authenticated');

-- D. LOVE NOTES / COUPONS POLICIES
drop policy if exists "Public can read love notes" on public.love_notes;
create policy "Public can read love notes"
  on public.love_notes for select
  using (true);

drop policy if exists "Public can redeem coupon" on public.love_notes;
create policy "Public can redeem coupon"
  on public.love_notes for update
  using (true)
  with check (redeemed = true);

drop policy if exists "Admin can insert love notes" on public.love_notes;
create policy "Admin can insert love notes"
  on public.love_notes for insert
  to authenticated
  with check (auth.role() = 'authenticated');

drop policy if exists "Admin can delete love notes" on public.love_notes;
create policy "Admin can delete love notes"
  on public.love_notes for delete
  to authenticated
  using (auth.role() = 'authenticated');

-- E. WATCHLIST POLICIES
drop policy if exists "Anyone can read watchlist" on public.watchlist_items;
create policy "Anyone can read watchlist"
  on public.watchlist_items for select
  using (true);

drop policy if exists "Anyone can add to watchlist" on public.watchlist_items;
create policy "Anyone can add to watchlist"
  on public.watchlist_items for insert
  with check (true);

drop policy if exists "Anyone can remove from watchlist" on public.watchlist_items;
create policy "Anyone can remove from watchlist"
  on public.watchlist_items for delete
  using (true);

-- F. STORAGE BUCKET POLICIES (memory-photos)
drop policy if exists "Public can view memory photos" on storage.objects;
create policy "Public can view memory photos"
  on storage.objects for select
  using (bucket_id = 'memory-photos');

drop policy if exists "Admin can upload memory photos" on storage.objects;
create policy "Admin can upload memory photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'memory-photos');

drop policy if exists "Admin can update memory photos" on storage.objects;
create policy "Admin can update memory photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'memory-photos');

drop policy if exists "Admin can delete memory photos" on storage.objects;
create policy "Admin can delete memory photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'memory-photos');

-- ====================================================================
-- SEED INITIAL SITE CONTENT & TEXTS
-- ====================================================================
insert into public.site_content (key, section, label, value)
values
  ('hero_title', 'hero', 'Hero Title', 'The Story of Us'),
  ('hero_subtitle', 'hero', 'Hero Subtitle', 'Chapter Infinity: Our Forever Run'),
  ('hero_synopsis', 'hero', 'Hero Synopsis', 'From an unexpected first conversation to building our whole universe together. A cinematic journey of late-night laughter, kitchen cooking disasters, spontaneous road trips, and finding home in each other’s arms.'),
  ('hero_badge', 'hero', 'Hero Ribbon Badge', '#1 in Our Hearts Today'),
  ('hero_series_tag', 'hero', 'Hero Tag Label', 'Original Series'),
  ('letter_title', 'letter', 'Love Letter Heading', 'To My One and Only Sanctuary'),
  ('letter_subtitle', 'letter', 'Letter Subheading', 'Vault Unlocked · For Your Eyes Only'),
  ('letter_date', 'letter', 'Letter Date', 'Ongoing & Everlasting'),
  ('letter_content', 'letter', 'Letter Body', 'They say the universe is expanding every single millisecond, but honestly, my whole world shrank to the sweetest, warmest size the day you walked into my life.

Looking back at where we started, every single wrong turn led us straight to the right person. Thank you for loving me on the quiet days, laughing at my terrible jokes, stealing my warmest hoodies, and turning mundane grocery store runs into core memories.

You are my favorite plot twist, my safest sanctuary, and the only person I want to re-watch life with over and over again.

Happy Anniversary, my love. Forever and always.'),
  ('letter_signoff', 'letter', 'Letter Sign-off', 'Yours always & forever, with all my love ❤️'),
  ('partner1_name', 'couple', 'Partner 1 Name', 'My Girl 👑'),
  ('partner2_name', 'couple', 'Partner 2 Name', 'Your Guy 🌙'),
  ('anniversary_date', 'couple', 'Anniversary Date', '2022-10-14'),
  ('secret_passcode', 'couple', 'Vault Passcode', '1402'),
  ('section_continue_title', 'sections', 'Continue Watching Title', 'Continue Watching: Our Memories'),
  ('section_continue_sub', 'sections', 'Continue Watching Subtitle', 'Pick up right where we left off'),
  ('section_our_story_title', 'sections', 'Our Story Title', 'Original Series: Our Story'),
  ('section_our_story_sub', 'sections', 'Our Story Subtitle', 'Top 10 Relationship Chapters of All Time'),
  ('section_little_things_title', 'sections', 'Little Things Title', 'Collection: Little Things I Love About You'),
  ('section_little_things_sub', 'sections', 'Little Things Subtitle', 'Micro-moments that steal my heart every single day'),
  ('section_places_title', 'sections', 'Places Title', 'My List: Places and Experiences Together'),
  ('section_places_sub', 'sections', 'Places Subtitle', 'Our travel passport & dream bucket list'),
  ('section_vault_title', 'sections', 'Secret Vault Title', 'Hidden Episodes: Personal Surprises and Letters'),
  ('section_vault_sub', 'sections', 'Secret Vault Subtitle', 'Locked confidential notes for your eyes only')
on conflict (key) do nothing;
