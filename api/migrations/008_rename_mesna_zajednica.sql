-- Rename mesna_zajednica type to neighborhood
UPDATE neighborhoods SET type = 'neighborhood' WHERE type = 'mesna_zajednica';

ALTER TABLE neighborhoods DROP CONSTRAINT IF EXISTS neighborhoods_type_check;
ALTER TABLE neighborhoods ADD CONSTRAINT neighborhoods_type_check
  CHECK (type IN ('country', 'city', 'neighborhood', 'block'));
