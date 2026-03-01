-- ============================================================
-- CivicAlert — Supabase SQL Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ============================================================
-- 1. ACCESS REQUESTS TABLE
--    Stores form submissions from /access page.
--    Admin reviews these in Table Editor, then manually sends
--    invites via: Authentication → Users → Invite User
-- ============================================================
create table if not exists public.access_requests (
  id               uuid          primary key default gen_random_uuid(),
  organisation_name text         not null,
  user_email        text         not null,
  purpose           text         not null,
  status            text         not null default 'pending',  -- pending | approved | rejected
  submitted_at      timestamptz  not null default now()
);

-- Allow anyone (unauthenticated) to INSERT a request (public form)
alter table public.access_requests enable row level security;

create policy "public_can_submit_requests"
  on public.access_requests for insert
  to anon
  with check (true);

-- Only authenticated users (admins) can read requests
create policy "auth_can_read_requests"
  on public.access_requests for select
  to authenticated
  using (true);

-- Only authenticated users (admins) can update status
create policy "auth_can_update_requests"
  on public.access_requests for update
  to authenticated
  using (true);

-- ============================================================
-- 2. INCIDENTS TABLE
--    Stores every litter alert triggered from the dashboard.
-- ============================================================
create table if not exists public.incidents (
  id           uuid         primary key default gen_random_uuid(),
  user_id      uuid         not null references auth.users(id) on delete cascade,
  class_name   text         not null default 'litter',
  confidence   float4,
  location     text         not null default 'Dashboard',
  triggered_at timestamptz  not null default now()
);

-- Users only see their own incidents
alter table public.incidents enable row level security;

create policy "users_insert_own_incidents"
  on public.incidents for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users_read_own_incidents"
  on public.incidents for select
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- HOW TO APPROVE AN ACCESS REQUEST (no admin panel needed):
--
-- 1. Go to Supabase Dashboard → Table Editor → access_requests
-- 2. Find the row you want to approve
-- 3. Update the "status" column to "approved"
-- 4. Go to Authentication → Users → click "Invite User"
-- 5. Enter the user's email — Supabase sends invite email FREE ✅
-- 6. User clicks the link and sets their own password
-- ============================================================
