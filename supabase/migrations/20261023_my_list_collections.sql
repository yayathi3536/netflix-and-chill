-- OUR UNIVERSE: additive My List collections.
-- Existing memories (including Places/Visited records) are intentionally untouched.
create table if not exists public.my_list_items (
  id uuid primary key default gen_random_uuid(),
  collection text not null check (collection in ('bucket-list', 'things-to-do', 'watchlist')),
  title text not null check (length(trim(title)) between 1 and 160),
  description text,
  notes text,
  target_date date,
  status text not null,
  media_type text,
  sort_order integer not null default 0,
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint my_list_items_status_by_collection check (
    (collection = 'bucket-list' and status in ('planned', 'completed') and media_type is null)
    or (collection = 'things-to-do' and status in ('planned', 'in-progress', 'completed') and media_type is null)
    or (collection = 'watchlist' and status in ('want-to-watch', 'watching', 'watched') and media_type in ('movie', 'tv-show'))
  )
);
create index if not exists my_list_items_collection_sort_idx on public.my_list_items (collection, sort_order, created_at);
alter table public.my_list_items enable row level security;
drop policy if exists my_list_items_read_approved on public.my_list_items;
create policy my_list_items_read_approved on public.my_list_items for select to authenticated
using (coalesce(((auth.jwt() -> 'app_metadata') ->> 'is_admin') = 'true', false) or coalesce(((auth.jwt() -> 'app_metadata') ->> 'is_approved') = 'true', false));
drop policy if exists my_list_items_insert_admin on public.my_list_items;
create policy my_list_items_insert_admin on public.my_list_items for insert to authenticated
with check (coalesce(((auth.jwt() -> 'app_metadata') ->> 'is_admin') = 'true', false) and created_by = auth.uid());
drop policy if exists my_list_items_update_admin on public.my_list_items;
create policy my_list_items_update_admin on public.my_list_items for update to authenticated
using (coalesce(((auth.jwt() -> 'app_metadata') ->> 'is_admin') = 'true', false))
with check (coalesce(((auth.jwt() -> 'app_metadata') ->> 'is_admin') = 'true', false) and created_by = auth.uid());
drop policy if exists my_list_items_delete_admin on public.my_list_items;
create policy my_list_items_delete_admin on public.my_list_items for delete to authenticated
using (coalesce(((auth.jwt() -> 'app_metadata') ->> 'is_admin') = 'true', false));
grant select, insert, update, delete on public.my_list_items to authenticated;