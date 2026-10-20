-- OUR UNIVERSE: approved-account authorization hardening.
-- Existing accounts are grandfathered as approved. New signups require manual approval
-- by setting auth.users.raw_app_meta_data.is_approved = true in the Supabase Dashboard.
-- The existing admin role is preserved; user_metadata is never trusted for authorization.

create or replace function public.is_approved_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select
      (u.raw_app_meta_data ->> 'is_admin') = 'true'
      or (u.raw_app_meta_data ->> 'is_approved') = 'true'
    from auth.users as u
    where u.id = auth.uid()
      and u.deleted_at is null
  ), false);
$$;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select (u.raw_app_meta_data ->> 'is_admin') = 'true'
    from auth.users as u
    where u.id = auth.uid()
      and u.deleted_at is null
  ), false);
$$;

revoke all on function public.is_approved_user() from public;
revoke all on function public.is_admin_user() from public;
grant execute on function public.is_approved_user() to anon, authenticated;
grant execute on function public.is_admin_user() to anon, authenticated;

-- Preserve current access for all existing accounts; this does not grant approval to future signups.
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('is_approved', true)
where deleted_at is null
  and coalesce(raw_app_meta_data ->> 'is_approved', 'false') <> 'true';

-- Remove all current policies on the affected tables so old permissive policies cannot OR around
-- the new rules. This changes policies only; it does not delete or alter user content.
do $$
declare
  t text;
  p record;
begin
  foreach t in array array['memories', 'story_chapters', 'love_notes', 'site_content', 'profiles']
  loop
    if to_regclass('public.' || t) is not null then
      for p in
        select polname
        from pg_policy
        where polrelid = to_regclass('public.' || t)
      loop
        execute format('drop policy if exists %I on public.%I', p.polname, t);
      end loop;
    end if;
  end loop;
end;
$$;

alter table public.memories enable row level security;
alter table public.story_chapters enable row level security;
alter table public.love_notes enable row level security;
alter table public.site_content enable row level security;
alter table public.profiles enable row level security;

-- Approved users can read relationship content. Anonymous visitors and pending accounts cannot.
create policy memories_read_approved
on public.memories for select
to authenticated
using (public.is_approved_user());

create policy memories_insert_admin
on public.memories for insert
to authenticated
with check (public.is_admin_user());

create policy memories_update_admin
on public.memories for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

create policy memories_delete_admin
on public.memories for delete
to authenticated
using (public.is_admin_user());

create policy story_chapters_read_approved
on public.story_chapters for select
to authenticated
using (public.is_approved_user());

create policy story_chapters_insert_admin
on public.story_chapters for insert
to authenticated
with check (public.is_admin_user());

create policy story_chapters_update_admin
on public.story_chapters for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

create policy story_chapters_delete_admin
on public.story_chapters for delete
to authenticated
using (public.is_admin_user());

create policy love_notes_read_approved
on public.love_notes for select
to authenticated
using (public.is_approved_user());

create policy love_notes_insert_admin
on public.love_notes for insert
to authenticated
with check (public.is_admin_user());

create policy love_notes_update_approved
on public.love_notes for update
to authenticated
using (public.is_approved_user())
with check (public.is_approved_user() and redeemed = true);

create policy love_notes_delete_admin
on public.love_notes for delete
to authenticated
using (public.is_admin_user());

create policy site_content_read_approved
on public.site_content for select
to authenticated
using (public.is_approved_user());

create policy site_content_insert_admin
on public.site_content for insert
to authenticated
with check (public.is_admin_user());

create policy site_content_update_admin
on public.site_content for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

create policy site_content_delete_admin
on public.site_content for delete
to authenticated
using (public.is_admin_user());

-- Profiles remain scoped to their owner; admin can manage all profiles.
create policy profiles_admin_all
on public.profiles for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

create policy profiles_owner_select
on public.profiles for select
to authenticated
using (public.is_approved_user() and auth.uid() = owner_id);

create policy profiles_owner_insert
on public.profiles for insert
to authenticated
with check (public.is_approved_user() and auth.uid() = owner_id);

create policy profiles_owner_update
on public.profiles for update
to authenticated
using (public.is_approved_user() and auth.uid() = owner_id)
with check (public.is_approved_user() and auth.uid() = owner_id);

create policy profiles_owner_delete
on public.profiles for delete
to authenticated
using (public.is_approved_user() and auth.uid() = owner_id);

-- Keep public image reads unchanged for compatibility with the current getPublicUrl() frontend.
-- Restrict writes to the verified admin. This avoids breaking existing image URLs.
drop policy if exists "Authenticated upload photos" on storage.objects;
drop policy if exists "Admin can upload memory photos" on storage.objects;
drop policy if exists "Admin can update memory photos" on storage.objects;
drop policy if exists "Admin can delete memory photos" on storage.objects;

create policy memory_photos_insert_admin
on storage.objects for insert
to authenticated
with check (bucket_id = 'memory-photos' and public.is_admin_user());

create policy memory_photos_update_admin
on storage.objects for update
to authenticated
using (bucket_id = 'memory-photos' and public.is_admin_user())
with check (bucket_id = 'memory-photos' and public.is_admin_user());

create policy memory_photos_delete_admin
on storage.objects for delete
to authenticated
using (bucket_id = 'memory-photos' and public.is_admin_user());
