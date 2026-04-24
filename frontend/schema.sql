-- ═══════════════════════════════════════════════════════════
--  SpeciWise — Supabase Schema
--  Run this entire file in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ── 1. PROFILES ──────────────────────────────────────────────
-- Auto-created when a user signs up via Supabase Auth trigger
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  email       text unique not null,
  full_name   text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Trigger: auto-insert profile on new auth user
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. QUIZ SESSIONS ─────────────────────────────────────────
-- One row per quiz attempt (a user can have many)
create table public.quiz_sessions (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  status       text default 'in_progress'
                 check (status in ('in_progress', 'completed')),
  started_at   timestamptz default now(),
  completed_at timestamptz
);

-- ── 3. QUIZ RESULTS ──────────────────────────────────────────
-- One row per completed stage (domain / branch / cs_spec / ee_spec)
create table public.quiz_results (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references public.profiles(id) on delete cascade not null,
  session_id       uuid references public.quiz_sessions(id) on delete cascade not null,
  stage            text not null
                     check (stage in ('domain','branch','cs_spec','ee_spec')),
  top_result_key   text not null,   -- e.g. 'ENG', 'CS', 'CC'
  top_result_name  text not null,   -- e.g. 'Engineering & Technology'
  runner_up_key    text,
  runner_up_name   text,
  scores           jsonb not null,  -- raw score object  { ENG: 24, MED: 8, ... }
  percentages      jsonb,           -- percentage object { ENG: 100, MED: 33, ... }
  created_at       timestamptz default now()
);

-- ── 4. ANALYTICS EVENTS ──────────────────────────────────────
-- Lightweight event log (page views, quiz start, stage done, etc.)
create table public.analytics_events (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  session_id  uuid references public.quiz_sessions(id) on delete set null,
  event_type  text not null,  -- 'quiz_started' | 'stage_completed' | 'quiz_abandoned'
  event_data  jsonb,          -- any extra metadata
  created_at  timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
--  Users can only read/write their OWN rows.
-- ═══════════════════════════════════════════════════════════

-- profiles
alter table public.profiles enable row level security;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- quiz_sessions
alter table public.quiz_sessions enable row level security;
create policy "Users can insert own sessions"
  on public.quiz_sessions for insert with check (auth.uid() = user_id);
create policy "Users can view own sessions"
  on public.quiz_sessions for select using (auth.uid() = user_id);
create policy "Users can update own sessions"
  on public.quiz_sessions for update using (auth.uid() = user_id);

-- quiz_results
alter table public.quiz_results enable row level security;
create policy "Users can insert own results"
  on public.quiz_results for insert with check (auth.uid() = user_id);
create policy "Users can view own results"
  on public.quiz_results for select using (auth.uid() = user_id);

-- analytics_events
alter table public.analytics_events enable row level security;
create policy "Users can insert own events"
  on public.analytics_events for insert with check (auth.uid() = user_id);
create policy "Users can view own events"
  on public.analytics_events for select using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
--  HELPFUL VIEWS (optional — for Supabase dashboard analytics)
-- ═══════════════════════════════════════════════════════════

create or replace view public.session_summary as
select
  qs.id           as session_id,
  p.email,
  qs.status,
  qs.started_at,
  qs.completed_at,
  count(qr.id)    as stages_completed,
  max(case when qr.stage='domain'  then qr.top_result_name end) as domain_match,
  max(case when qr.stage='branch'  then qr.top_result_name end) as branch_match,
  max(case when qr.stage='cs_spec' then qr.top_result_name end) as cs_spec_match,
  max(case when qr.stage='ee_spec' then qr.top_result_name end) as ee_spec_match
from public.quiz_sessions qs
join public.profiles p on p.id = qs.user_id
left join public.quiz_results qr on qr.session_id = qs.id
group by qs.id, p.email, qs.status, qs.started_at, qs.completed_at;
