-- Keep authorization helper functions callable only by authenticated users.
-- RLS evaluates these functions in the signed-in request context.
revoke execute on function public.is_approved_user() from anon;
revoke execute on function public.is_admin_user() from anon;
grant execute on function public.is_approved_user() to authenticated;
grant execute on function public.is_admin_user() to authenticated;
