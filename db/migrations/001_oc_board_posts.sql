-- Message board posts for /outside-context/board (api/oc/board.ts).
-- Apply once: Neon SQL editor, or  psql "$DATABASE_URL" -f db/migrations/001_oc_board_posts.sql
-- Safe to re-run.
create table if not exists oc_board_posts (
  id           bigserial primary key,
  body         text not null check (char_length(body) between 1 and 1000),
  display_name text not null default 'Anonymous' check (char_length(display_name) <= 60),
  signup_id    bigint references oc_signups(id) on delete set null,
  ip_hash      text,
  hidden       boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists oc_board_posts_visible_idx on oc_board_posts (created_at desc) where not hidden;
create index if not exists oc_board_posts_ip_idx on oc_board_posts (ip_hash, created_at desc);
