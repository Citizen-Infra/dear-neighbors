-- Admins table
create table admins (
  user_id uuid primary key references auth.users(id)
);

alter table admins enable row level security;
create policy "admins_read" on admins for select using (true);

-- Seed first admin
insert into admins (user_id) values ('dd1755c5-b26b-4547-a207-3b6b625c438c');

-- Allow link deletion by submitter or admin
create policy "links_delete" on links for delete using (
  auth.uid() = submitted_by
  or exists (select 1 from admins where user_id = auth.uid())
);
