# Database

Neon Postgres, tables `oc_*`. The original tables (`oc_signups`, `oc_interest`, `oc_events`) were created by hand before this folder existed.

New schema changes go in `migrations/` as numbered `.sql` files. Apply each one once, in order, against the database in `DATABASE_URL` (Neon SQL editor, or `psql "$DATABASE_URL" -f db/migrations/NNN_name.sql`). Try them on a Neon branch first. Write them to be safe to re-run (`if not exists`).

## Moderating the message board

```sql
-- latest posts
select id, display_name, left(body, 80) as body, created_at, hidden from oc_board_posts order by id desc limit 20;
-- hide one (it disappears from /outside-context/board right away)
update oc_board_posts set hidden = true where id = 123;
-- undo
update oc_board_posts set hidden = false where id = 123;
```
