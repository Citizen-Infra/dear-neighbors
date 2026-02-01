-- Seed neighborhoods for Novi Sad
insert into neighborhoods (name, type) values
  ('Novi Sad', 'city');

-- Get the city ID for parent references
do $$
declare
  city_id uuid;
begin
  select id into city_id from neighborhoods where name = 'Novi Sad' and type = 'city';

  insert into neighborhoods (name, type, parent_id) values
    ('Liman', 'mesna_zajednica', city_id),
    ('Grbavica', 'mesna_zajednica', city_id),
    ('Detelinara', 'mesna_zajednica', city_id),
    ('Podbara', 'mesna_zajednica', city_id),
    ('Novo Naselje', 'mesna_zajednica', city_id),
    ('Telep', 'mesna_zajednica', city_id),
    ('Petrovaradin', 'mesna_zajednica', city_id),
    ('Sremska Kamenica', 'mesna_zajednica', city_id),
    ('Futog', 'mesna_zajednica', city_id),
    ('Klisa', 'mesna_zajednica', city_id),
    ('Sajlovo', 'mesna_zajednica', city_id),
    ('Salajka', 'mesna_zajednica', city_id),
    ('Rotkvarija', 'mesna_zajednica', city_id),
    ('Adamovicevo Naselje', 'mesna_zajednica', city_id);
end $$;

-- Seed topics
insert into topics (name, slug) values
  ('Urban Planning', 'urban-planning'),
  ('Environment', 'environment'),
  ('Culture', 'culture'),
  ('Transport', 'transport'),
  ('Education', 'education'),
  ('Safety', 'safety'),
  ('Community Events', 'community-events'),
  ('Local Economy', 'local-economy'),
  ('Housing', 'housing'),
  ('Public Spaces', 'public-spaces');
