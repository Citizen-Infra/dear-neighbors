-- Add 'country' level to neighborhood hierarchy
ALTER TABLE neighborhoods DROP CONSTRAINT IF EXISTS neighborhoods_type_check;
ALTER TABLE neighborhoods ADD CONSTRAINT neighborhoods_type_check
  CHECK (type IN ('country', 'city', 'mesna_zajednica', 'block'));

-- Insert Serbia as root country
INSERT INTO neighborhoods (name, type) VALUES ('Serbia', 'country');

-- Reparent Novi Sad under Serbia
UPDATE neighborhoods SET parent_id = (
  SELECT id FROM neighborhoods WHERE name = 'Serbia' AND type = 'country'
) WHERE name = 'Novi Sad' AND type = 'city';
