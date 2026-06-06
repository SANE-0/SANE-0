-- SANE SCORE APP — Supabase Schema (safe to re-run)
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null default '',
  email      text,
  role       text not null default 'member' check (role in ('member','coach','admin')),
  created_at timestamptz default now()
);
create table if not exists scores (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references profiles(id) on delete cascade,
  date             date not null,
  checked          jsonb not null default '{}',
  total_score      int not null default 0,
  sleep_score      int not null default 0,
  activity_score   int not null default 0,
  nutrition_score  int not null default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  unique (user_id, date)
);
alter table profiles enable row level security;
alter table scores   enable row level security;
drop policy if exists "Public profiles are viewable by all"            on profiles;
drop policy if exists "Users can insert their own profile"             on profiles;
drop policy if exists "Users can update their own profile"             on profiles;
drop policy if exists "Scores are viewable by all authenticated users" on scores;
drop policy if exists "Users can insert their own scores"              on scores;
drop policy if exists "Users can update their own scores"              on scores;
create policy "Public profiles are viewable by all"            on profiles for select using (true);
create policy "Users can insert their own profile"             on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile"             on profiles for update using (auth.uid() = id);
create policy "Scores are viewable by all authenticated users" on scores for select using (auth.role() = 'authenticated');
create policy "Users can insert their own scores"              on scores for insert with check (auth.uid() = user_id);
create policy "Users can update their own scores"              on scores for update using (auth.uid() = user_id);
create or replace function update_updated_at() returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists scores_updated_at on scores;
create trigger scores_updated_at before update on scores for each row execute function update_updated_at();
create or replace function handle_new_user() returns trigger as $$ begin insert into public.profiles (id, email, name) values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name','')); return new; end; $$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
-- TO MAKE YOURSELF A COACH: update profiles set role = 'coach' where email = 'your@email.com';
