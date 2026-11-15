-- Board sections: "introduce" (Introduce yourself) and "general" (General). Safe to re-run.
alter table oc_board_posts add column if not exists section text not null default 'general';
do $$ begin
  alter table oc_board_posts add constraint oc_board_posts_section_check check (section in ('introduce', 'general'));
exception when duplicate_object then null; end $$;
create index if not exists oc_board_posts_section_idx on oc_board_posts (section, created_at desc) where not hidden;
-- One-off, 2026-11-15: the first two posts (ids 1, 2) were "Let your AI introduce you" answers.
update oc_board_posts set section = 'introduce' where id in (1, 2) and section = 'general';
