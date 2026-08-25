-- Fixes published posts disappearing from /admin.
--
-- app/admin/page.tsx queries `posts` with no status filter, using the
-- session-authenticated client (lib/supabase/server.ts). CLAUDE.md documents
-- an anon SELECT policy scoped to status = 'published' and a write grant for
-- authenticated, but never an explicit authenticated SELECT policy — so once
-- a row's status flips to 'published', it can fall outside whatever narrower
-- policy the authenticated role actually has and vanish from the admin list
-- even though the row still exists.
--
-- Run the inspection query first to see what's actually there before adding
-- this policy, in case there's a conflicting narrower policy to replace
-- instead of add to:
--
--   select * from pg_policies where schemaname = 'public' and tablename = 'posts';

create policy "authenticated can select all posts"
  on public.posts
  for select
  to authenticated
  using (true);

-- Safe because the single admin account (omoleusuangbon@gmail.com) is
-- already fully trusted for writes; this only adds read visibility of
-- drafts + published together, which is exactly what /admin needs.
