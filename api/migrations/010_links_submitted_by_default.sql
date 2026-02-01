-- Fix: links.submitted_by was missing a default, so inserts had null
-- and the RLS insert policy (auth.uid() = submitted_by) rejected them.
alter table links alter column submitted_by set default auth.uid();
