-- Harden RLS: remove permissive/duplicate policies and use app_metadata.role = 'admin' as the single admin check.

-- Drop every existing policy on the four public tables, then recreate a minimal set.
do $$
declare p record;
begin
  for p in
    select tablename, policyname from pg_policies
    where schemaname = 'public' and tablename in ('reports', 'exams', 'user_scores', 'blogs')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- exams: public read, admin write
create policy exams_public_read on public.exams for select to anon, authenticated
  using (true);
create policy exams_admin_insert on public.exams for insert to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy exams_admin_update on public.exams for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy exams_admin_delete on public.exams for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- blogs: public reads published posts, admin reads/writes everything
create policy blogs_read on public.blogs for select to anon, authenticated
  using (published = true or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy blogs_admin_insert on public.blogs for insert to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy blogs_admin_update on public.blogs for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy blogs_admin_delete on public.blogs for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- user_scores: owners read/insert/delete their own rows, admin reads all; no updates
create policy user_scores_read on public.user_scores for select to authenticated
  using (user_id = (select auth.uid()) or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy user_scores_insert_own on public.user_scores for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy user_scores_delete_own on public.user_scores for delete to authenticated
  using (user_id = (select auth.uid()));

-- reports: anyone may submit a pending report; only the author or admin can read; only admin can update/delete
create policy reports_insert on public.reports for insert to anon, authenticated
  with check (
    (user_id is null or user_id = (select auth.uid()))
    and coalesce(status, 'pending') = 'pending'
    and admin_note is null
  );
create policy reports_read on public.reports for select to authenticated
  using (user_id = (select auth.uid()) or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy reports_admin_update on public.reports for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy reports_admin_delete on public.reports for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- delete_user_account: signed-in users only
revoke execute on function public.delete_user_account() from public, anon;
grant execute on function public.delete_user_account() to authenticated;
