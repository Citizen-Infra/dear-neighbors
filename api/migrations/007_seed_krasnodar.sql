-- Add Krasnodar with neighborhoods under Russia
DO $$
DECLARE
  russia_id uuid;
  krasnodar_id uuid;
BEGIN
  SELECT id INTO russia_id FROM neighborhoods WHERE name = 'Russia' AND type = 'country';

  INSERT INTO neighborhoods (name, type, parent_id) VALUES ('Krasnodar', 'city', russia_id)
  RETURNING id INTO krasnodar_id;

  INSERT INTO neighborhoods (name, type, parent_id) VALUES
    ('Tsentr', 'mesna_zajednica', krasnodar_id),
    ('Yubileyny', 'mesna_zajednica', krasnodar_id),
    ('Festivalny', 'mesna_zajednica', krasnodar_id),
    ('Cheremushki', 'mesna_zajednica', krasnodar_id),
    ('Gidrostroiteley', 'mesna_zajednica', krasnodar_id),
    ('Enka', 'mesna_zajednica', krasnodar_id),
    ('Komsomolsky', 'mesna_zajednica', krasnodar_id),
    ('Pashkovsky', 'mesna_zajednica', krasnodar_id),
    ('Slavyansky', 'mesna_zajednica', krasnodar_id),
    ('Severny', 'mesna_zajednica', krasnodar_id),
    ('Aviagorodok', 'mesna_zajednica', krasnodar_id);
END $$;
