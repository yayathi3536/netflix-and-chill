-- ====================================================================
-- OUR UNIVERSE — Custom Storyline Order Migration
-- Version: 20261022_custom_storyline_order
-- Description: Adds sort_order column to memories table while maintaining
--              full backwards compatibility with is_top_10 and existing RLS.
-- ====================================================================

-- 1. ADD SORT_ORDER COLUMN IF NOT EXISTS
alter table public.memories add column if not exists sort_order integer;

-- 2. CREATE INDEX FOR FAST ORDERED RETRIEVAL
create index if not exists idx_memories_sort_order on public.memories(sort_order) where sort_order is not null;

-- 3. BACKFILL FROM EXISTING IS_TOP_10
update public.memories 
set sort_order = is_top_10 
where sort_order is null and is_top_10 is not null;

-- 4. ENSURE SITE_SETTINGS CAN STORE CUSTOM ORDER METADATA
insert into public.site_settings (key, value)
values ('storyline_custom_order', '[]'::jsonb)
on conflict (key) do nothing;
