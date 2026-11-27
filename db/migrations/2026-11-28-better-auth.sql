-- Better Auth 1.6 core schema
create schema if not exists better_auth;

create table if not exists better_auth."user" (
  "id" text primary key,
  "name" text not null,
  "email" text not null unique,
  "emailVerified" boolean not null default false,
  "image" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists better_auth."session" (
  "id" text primary key,
  "expiresAt" timestamptz not null,
  "token" text not null unique,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null references better_auth."user"("id") on delete cascade
);

create table if not exists better_auth."account" (
  "id" text primary key,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null references better_auth."user"("id") on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "scope" text,
  "password" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists better_auth."verification" (
  "id" text primary key,
  "identifier" text not null,
  "value" text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists idx_better_auth_session_user_id on better_auth."session"("userId");
create index if not exists idx_better_auth_account_user_id on better_auth."account"("userId");
create index if not exists idx_better_auth_verification_identifier on better_auth."verification"("identifier");

alter table better_auth."user" enable row level security;
alter table better_auth."session" enable row level security;
alter table better_auth."account" enable row level security;
alter table better_auth."verification" enable row level security;

revoke all on schema better_auth from public, anon, authenticated, service_role;
revoke all on all tables in schema better_auth from public, anon, authenticated, service_role;
alter default privileges in schema better_auth revoke all on tables from public, anon, authenticated, service_role;
