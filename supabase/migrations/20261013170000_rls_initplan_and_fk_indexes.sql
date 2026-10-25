-- Evaluate auth.jwt() once per query instead of per row, and index foreign keys.

alter policy exams_admin_insert on public.exams
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy exams_admin_update on public.exams
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy exams_admin_delete on public.exams
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

alter policy blogs_read on public.blogs
  using (published = true or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy blogs_admin_insert on public.blogs
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy blogs_admin_update on public.blogs
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy blogs_admin_delete on public.blogs
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

alter policy user_scores_read on public.user_scores
  using (user_id = (select auth.uid()) or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

alter policy reports_read on public.reports
  using (user_id = (select auth.uid()) or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy reports_admin_update on public.reports
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy reports_admin_delete on public.reports
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create index if not exists idx_reports_user_id on public.reports (user_id);
create index if not exists idx_user_scores_user_id on public.user_scores (user_id);
create index if not exists idx_user_scores_exam_id on public.user_scores (exam_id);
