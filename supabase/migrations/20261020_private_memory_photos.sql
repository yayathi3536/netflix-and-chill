-- Keep memory photo objects private and allow signed URL generation only for approved users.
-- The frontend resolves legacy public URLs to short-lived signed URLs before rendering.
update storage.buckets
set public = false
where id = 'memory-photos';

drop policy if exists "Public read photos" on storage.objects;

create policy "Approved users can read memory photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'memory-photos'
  and (
    coalesce((auth.jwt() -> 'app_metadata' ->> 'is_approved') = 'true', false)
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true', false)
  )
);
