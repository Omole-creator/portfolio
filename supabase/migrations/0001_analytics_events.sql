-- First-party analytics event log for the admin metrics dashboard.
-- One row per unique (visitor_id, event_type, resource_id): this is the
-- entire dedup mechanism. A visitor is counted once per project, once per
-- blog post, once per CTA, and once per page path, for life. Time-bucketed
-- charts are just this same log grouped by date_trunc, so a visitor's one
-- counted row naturally rolls up into whichever day/week/month/quarter/year
-- it happened in.

create extension if not exists pgcrypto;

create table public.analytics_events (
  id            uuid primary key default gen_random_uuid(),
  visitor_id    uuid not null,
  event_type    text not null check (event_type in ('page_view','project_view','post_view','cta_click')),
  resource_id   text not null,        -- path for page_view; project slug; post slug; cta id
  path          text not null,        -- pathname the event fired from, e.g. /blog/my-post
  referrer      text,
  country       text,                 -- from x-vercel-ip-country (production only)
  region        text,                 -- from x-vercel-ip-country-region
  city          text,                 -- from x-vercel-ip-city
  device_type   text,                 -- 'mobile' | 'tablet' | 'desktop' | null
  browser       text,
  os            text,
  user_agent    text,
  first_seen_at timestamptz not null, -- from the visitor's long-lived "first seen" cookie
  occurred_at   timestamptz not null default now(),
  constraint analytics_events_unique_visit unique (visitor_id, event_type, resource_id)
);

create index analytics_events_event_resource_idx on public.analytics_events (event_type, resource_id);
create index analytics_events_path_idx on public.analytics_events (path);
create index analytics_events_occurred_at_brin on public.analytics_events using brin (occurred_at);

alter table public.analytics_events enable row level security;

-- Anonymous visitors may insert their own event rows and nothing else. No
-- anon select policy exists on purpose (default deny) — visitor-level
-- geo/UA data must never be publicly readable.
create policy "anon can insert analytics events"
  on public.analytics_events
  for insert
  to anon
  with check (true);

-- Only the signed-in admin (authenticated role) can read the raw event log.
create policy "authenticated can read analytics events"
  on public.analytics_events
  for select
  to authenticated
  using (true);

-- After applying: confirm the anon key cannot select from this table
-- (should return an empty array or 403), and confirm the authenticated
-- session used by /admin can.
