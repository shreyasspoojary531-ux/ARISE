-- ARISE post-auth onboarding storage
-- 1. acceptance is stored separately from the player profile.
-- 2. player profile stores registration and body metrics.

create table if not exists public.onboarding_contracts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  accepted boolean not null default false,
  accepted_at timestamptz,
  declined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.player_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  age integer not null,
  goal text not null,
  height numeric,
  weight numeric,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_onboarding_contracts_updated_at
before update on public.onboarding_contracts
for each row
execute function public.set_updated_at();

create trigger set_player_profiles_updated_at
before update on public.player_profiles
for each row
execute function public.set_updated_at();

alter table public.onboarding_contracts enable row level security;
alter table public.player_profiles enable row level security;

drop policy if exists "Authenticated users can read their onboarding contract" on public.onboarding_contracts;
create policy "Authenticated users can read their onboarding contract"
on public.onboarding_contracts
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Authenticated users can create their onboarding contract" on public.onboarding_contracts;
create policy "Authenticated users can create their onboarding contract"
on public.onboarding_contracts
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can update their onboarding contract" on public.onboarding_contracts;
create policy "Authenticated users can update their onboarding contract"
on public.onboarding_contracts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can read their player profile" on public.player_profiles;
create policy "Authenticated users can read their player profile"
on public.player_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Authenticated users can create their player profile" on public.player_profiles;
create policy "Authenticated users can create their player profile"
on public.player_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can update their player profile" on public.player_profiles;
create policy "Authenticated users can update their player profile"
on public.player_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
