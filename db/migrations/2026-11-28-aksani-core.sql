-- AKSANI Core Schema v1
-- Separate schema keeps the application portable and leaves legacy public tables untouched.
create schema if not exists aksani;

create table if not exists aksani.profiles (
  user_id text primary key,
  email text not null unique,
  full_name text not null,
  phone text,
  avatar_url text,
  role text not null default 'member' check (role in ('admin','pembina','member')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aksani.mentoring_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  mentor_user_id text references aksani.profiles(user_id) on delete set null,
  created_by text references aksani.profiles(user_id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aksani.mentoring_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references aksani.mentoring_groups(id) on delete cascade,
  user_id text not null references aksani.profiles(user_id) on delete cascade,
  status text not null default 'active' check (status in ('active','inactive')),
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table if not exists aksani.activity_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists aksani.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references aksani.profiles(user_id) on delete cascade,
  entry_date date not null default current_date,
  category_id uuid references aksani.activity_categories(id) on delete set null,
  activity_name text not null,
  quantity numeric(12,2) not null default 1 check (quantity >= 0),
  unit_label text not null default 'kali',
  is_completed boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aksani.community_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_type text not null default 'community' check (event_type in ('kajian','social','sport','learning','community','other')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  meeting_url text,
  capacity integer check (capacity is null or capacity > 0),
  status text not null default 'published' check (status in ('draft','published','cancelled','completed')),
  created_by text references aksani.profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);

create table if not exists aksani.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references aksani.community_events(id) on delete cascade,
  user_id text not null references aksani.profiles(user_id) on delete cascade,
  status text not null default 'registered' check (status in ('registered','attended','cancelled')),
  registered_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table if not exists aksani.library_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content_type text not null check (content_type in ('quran','hadith','article','video','book','other')),
  author text,
  source text,
  content_url text,
  body text,
  access_level text not null default 'public' check (access_level in ('public','member')),
  is_published boolean not null default false,
  created_by text references aksani.profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aksani.donation_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  target_amount_idr bigint check (target_amount_idr is null or target_amount_idr >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'draft' check (status in ('draft','active','completed','cancelled')),
  created_by text references aksani.profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table if not exists aksani.donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references aksani.donation_campaigns(id) on delete set null,
  donor_user_id text references aksani.profiles(user_id) on delete set null,
  donor_name text,
  amount_idr bigint not null check (amount_idr > 0),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  payment_reference text unique,
  donor_note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_aksani_daily_entries_user_date on aksani.daily_entries(user_id, entry_date desc);
create index if not exists idx_aksani_groups_mentor on aksani.mentoring_groups(mentor_user_id);
create index if not exists idx_aksani_group_members_user on aksani.mentoring_group_members(user_id);
create index if not exists idx_aksani_events_starts on aksani.community_events(starts_at) where status = 'published';
create index if not exists idx_aksani_event_registrations_user on aksani.event_registrations(user_id);
create index if not exists idx_aksani_library_published on aksani.library_items(content_type, created_at desc) where is_published = true;
create index if not exists idx_aksani_donations_campaign on aksani.donations(campaign_id, created_at desc);

alter table aksani.profiles enable row level security;
alter table aksani.mentoring_groups enable row level security;
alter table aksani.mentoring_group_members enable row level security;
alter table aksani.activity_categories enable row level security;
alter table aksani.daily_entries enable row level security;
alter table aksani.community_events enable row level security;
alter table aksani.event_registrations enable row level security;
alter table aksani.library_items enable row level security;
alter table aksani.donation_campaigns enable row level security;
alter table aksani.donations enable row level security;

revoke all on schema aksani from public, anon, authenticated, service_role;
revoke all on all tables in schema aksani from public, anon, authenticated, service_role;
alter default privileges in schema aksani revoke all on tables from public, anon, authenticated, service_role;

insert into aksani.activity_categories (slug,name,description,sort_order)
values
 ('ibadah','Ibadah','Amalan ibadah harian',1),
 ('quran','Al-Qur’an','Tilawah, hafalan, dan tadabbur',2),
 ('ilmu','Menuntut Ilmu','Belajar, membaca, dan kajian',3),
 ('olahraga','Olahraga','Aktivitas fisik dan kesehatan',4),
 ('sosial','Aksi Sosial','Berbagi, donasi, dan pelayanan masyarakat',5),
 ('pengembangan','Pengembangan Diri','Keterampilan, inovasi, dan produktivitas',6)
on conflict (slug) do nothing;
