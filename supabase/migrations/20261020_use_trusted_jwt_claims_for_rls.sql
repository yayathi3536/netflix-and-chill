-- Replace SECURITY DEFINER helpers with direct checks against trusted JWT app_metadata.
-- app_metadata is server-controlled; user_metadata is deliberately not consulted.
drop policy if exists memories_read_approved on public.memories;
drop policy if exists memories_insert_admin on public.memories;
drop policy if exists memories_update_admin on public.memories;
drop policy if exists memories_delete_admin on public.memories;
create policy memories_read_approved on public.memories for select to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false) or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_approved') = 'true', false));
create policy memories_insert_admin on public.memories for insert to authenticated with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));
create policy memories_update_admin on public.memories for update to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false)) with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));
create policy memories_delete_admin on public.memories for delete to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));

drop policy if exists story_chapters_read_approved on public.story_chapters;
drop policy if exists story_chapters_insert_admin on public.story_chapters;
drop policy if exists story_chapters_update_admin on public.story_chapters;
drop policy if exists story_chapters_delete_admin on public.story_chapters;
create policy story_chapters_read_approved on public.story_chapters for select to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false) or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_approved') = 'true', false));
create policy story_chapters_insert_admin on public.story_chapters for insert to authenticated with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));
create policy story_chapters_update_admin on public.story_chapters for update to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false)) with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));
create policy story_chapters_delete_admin on public.story_chapters for delete to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));

drop policy if exists love_notes_read_approved on public.love_notes;
drop policy if exists love_notes_insert_admin on public.love_notes;
drop policy if exists love_notes_update_approved on public.love_notes;
drop policy if exists love_notes_delete_admin on public.love_notes;
create policy love_notes_read_approved on public.love_notes for select to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false) or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_approved') = 'true', false));
create policy love_notes_insert_admin on public.love_notes for insert to authenticated with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));
create policy love_notes_update_approved on public.love_notes for update to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false) or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_approved') = 'true', false)) with check ((coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false) or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_approved') = 'true', false)) and redeemed = true);
create policy love_notes_delete_admin on public.love_notes for delete to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));

drop policy if exists site_content_read_approved on public.site_content;
drop policy if exists site_content_insert_admin on public.site_content;
drop policy if exists site_content_update_admin on public.site_content;
drop policy if exists site_content_delete_admin on public.site_content;
create policy site_content_read_approved on public.site_content for select to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false) or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_approved') = 'true', false));
create policy site_content_insert_admin on public.site_content for insert to authenticated with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));
create policy site_content_update_admin on public.site_content for update to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false)) with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));
create policy site_content_delete_admin on public.site_content for delete to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles for all to authenticated using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false)) with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));
drop policy if exists profiles_owner_select on public.profiles;
create policy profiles_owner_select on public.profiles for select to authenticated using ((coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false) or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_approved') = 'true', false)) and auth.uid() = owner_id);
drop policy if exists profiles_owner_insert on public.profiles;
create policy profiles_owner_insert on public.profiles for insert to authenticated with check ((coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false) or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_approved') = 'true', false)) and auth.uid() = owner_id);
drop policy if exists profiles_owner_update on public.profiles;
create policy profiles_owner_update on public.profiles for update to authenticated using ((coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false) or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_approved') = 'true', false)) and auth.uid() = owner_id) with check ((coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false) or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_approved') = 'true', false)) and auth.uid() = owner_id);
drop policy if exists profiles_owner_delete on public.profiles;
create policy profiles_owner_delete on public.profiles for delete to authenticated using ((coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false) or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_approved') = 'true', false)) and auth.uid() = owner_id);

drop policy if exists memory_photos_insert_admin on storage.objects;
drop policy if exists memory_photos_update_admin on storage.objects;
drop policy if exists memory_photos_delete_admin on storage.objects;
create policy memory_photos_insert_admin on storage.objects for insert to authenticated with check (bucket_id = 'memory-photos' and coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));
create policy memory_photos_update_admin on storage.objects for update to authenticated using (bucket_id = 'memory-photos' and coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false)) with check (bucket_id = 'memory-photos' and coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));
create policy memory_photos_delete_admin on storage.objects for delete to authenticated using (bucket_id = 'memory-photos' and coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false));

drop function if exists public.is_approved_user();
drop function if exists public.is_admin_user();
