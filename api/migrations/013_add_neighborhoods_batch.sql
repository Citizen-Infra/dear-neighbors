-- Add neighborhoods for 9 cities: Belgrade, Moscow, London, Auckland, Wellington,
-- Toronto (new city), New York, Los Angeles, Houston
DO $$
DECLARE
  city_id uuid;
  canada_id uuid;
BEGIN
  -- === Toronto: insert city first (Canada only has Ottawa) ===
  SELECT id INTO canada_id FROM neighborhoods WHERE name = 'Canada' AND type = 'country';

  INSERT INTO neighborhoods (name, type, parent_id) VALUES ('Toronto', 'city', canada_id)
  RETURNING id INTO city_id;

  INSERT INTO neighborhoods (name, type, parent_id) VALUES
    ('Downtown', 'neighborhood', city_id),
    ('Yorkville', 'neighborhood', city_id),
    ('The Annex', 'neighborhood', city_id),
    ('Kensington Market', 'neighborhood', city_id),
    ('Queen West', 'neighborhood', city_id),
    ('Liberty Village', 'neighborhood', city_id),
    ('Leslieville', 'neighborhood', city_id),
    ('Parkdale', 'neighborhood', city_id),
    ('High Park', 'neighborhood', city_id),
    ('Scarborough', 'neighborhood', city_id);

  -- === Belgrade, Serbia ===
  SELECT id INTO city_id FROM neighborhoods WHERE name = 'Belgrade' AND type = 'city';

  INSERT INTO neighborhoods (name, type, parent_id) VALUES
    ('Stari Grad', 'neighborhood', city_id),
    ('Vračar', 'neighborhood', city_id),
    ('Zvezdara', 'neighborhood', city_id),
    ('Novi Beograd', 'neighborhood', city_id),
    ('Zemun', 'neighborhood', city_id),
    ('Čukarica', 'neighborhood', city_id),
    ('Voždovac', 'neighborhood', city_id),
    ('Palilula', 'neighborhood', city_id),
    ('Savski Venac', 'neighborhood', city_id),
    ('Rakovica', 'neighborhood', city_id);

  -- === Moscow, Russia ===
  SELECT id INTO city_id FROM neighborhoods WHERE name = 'Moscow' AND type = 'city';

  INSERT INTO neighborhoods (name, type, parent_id) VALUES
    ('Arbat', 'neighborhood', city_id),
    ('Tverskaya', 'neighborhood', city_id),
    ('Zamoskvorechye', 'neighborhood', city_id),
    ('Kitay-Gorod', 'neighborhood', city_id),
    ('Khamovniki', 'neighborhood', city_id),
    ('Presnya', 'neighborhood', city_id),
    ('Basmanny', 'neighborhood', city_id),
    ('Taganka', 'neighborhood', city_id),
    ('Sokol', 'neighborhood', city_id),
    ('Kuzminki', 'neighborhood', city_id);

  -- === London, United Kingdom ===
  SELECT id INTO city_id FROM neighborhoods WHERE name = 'London' AND type = 'city';

  INSERT INTO neighborhoods (name, type, parent_id) VALUES
    ('Westminster', 'neighborhood', city_id),
    ('Camden', 'neighborhood', city_id),
    ('Islington', 'neighborhood', city_id),
    ('Hackney', 'neighborhood', city_id),
    ('Southwark', 'neighborhood', city_id),
    ('Lambeth', 'neighborhood', city_id),
    ('Greenwich', 'neighborhood', city_id),
    ('Kensington', 'neighborhood', city_id),
    ('Brixton', 'neighborhood', city_id),
    ('Shoreditch', 'neighborhood', city_id);

  -- === Auckland, New Zealand ===
  SELECT id INTO city_id FROM neighborhoods WHERE name = 'Auckland' AND type = 'city';

  INSERT INTO neighborhoods (name, type, parent_id) VALUES
    ('Auckland CBD', 'neighborhood', city_id),
    ('Ponsonby', 'neighborhood', city_id),
    ('Parnell', 'neighborhood', city_id),
    ('Newmarket', 'neighborhood', city_id),
    ('Mt Eden', 'neighborhood', city_id),
    ('Remuera', 'neighborhood', city_id),
    ('Grey Lynn', 'neighborhood', city_id),
    ('Devonport', 'neighborhood', city_id),
    ('Takapuna', 'neighborhood', city_id),
    ('Manukau', 'neighborhood', city_id);

  -- === Wellington, New Zealand ===
  SELECT id INTO city_id FROM neighborhoods WHERE name = 'Wellington' AND type = 'city';

  INSERT INTO neighborhoods (name, type, parent_id) VALUES
    ('Te Aro', 'neighborhood', city_id),
    ('Thorndon', 'neighborhood', city_id),
    ('Lambton', 'neighborhood', city_id),
    ('Kelburn', 'neighborhood', city_id),
    ('Newtown', 'neighborhood', city_id),
    ('Mt Victoria', 'neighborhood', city_id),
    ('Brooklyn', 'neighborhood', city_id),
    ('Karori', 'neighborhood', city_id),
    ('Miramar', 'neighborhood', city_id),
    ('Island Bay', 'neighborhood', city_id);

  -- === New York, United States ===
  SELECT id INTO city_id FROM neighborhoods WHERE name = 'New York' AND type = 'city';

  INSERT INTO neighborhoods (name, type, parent_id) VALUES
    ('Manhattan', 'neighborhood', city_id),
    ('Brooklyn', 'neighborhood', city_id),
    ('Queens', 'neighborhood', city_id),
    ('Bronx', 'neighborhood', city_id),
    ('Staten Island', 'neighborhood', city_id),
    ('Williamsburg', 'neighborhood', city_id),
    ('Harlem', 'neighborhood', city_id),
    ('SoHo', 'neighborhood', city_id),
    ('Astoria', 'neighborhood', city_id),
    ('Park Slope', 'neighborhood', city_id);

  -- === Los Angeles, United States ===
  SELECT id INTO city_id FROM neighborhoods WHERE name = 'Los Angeles' AND type = 'city';

  INSERT INTO neighborhoods (name, type, parent_id) VALUES
    ('Hollywood', 'neighborhood', city_id),
    ('Downtown LA', 'neighborhood', city_id),
    ('Santa Monica', 'neighborhood', city_id),
    ('Venice', 'neighborhood', city_id),
    ('Silver Lake', 'neighborhood', city_id),
    ('Echo Park', 'neighborhood', city_id),
    ('Koreatown', 'neighborhood', city_id),
    ('West Hollywood', 'neighborhood', city_id),
    ('Los Feliz', 'neighborhood', city_id),
    ('Culver City', 'neighborhood', city_id);

  -- === Houston, United States ===
  SELECT id INTO city_id FROM neighborhoods WHERE name = 'Houston' AND type = 'city';

  INSERT INTO neighborhoods (name, type, parent_id) VALUES
    ('Downtown', 'neighborhood', city_id),
    ('Midtown', 'neighborhood', city_id),
    ('Montrose', 'neighborhood', city_id),
    ('The Heights', 'neighborhood', city_id),
    ('River Oaks', 'neighborhood', city_id),
    ('Galleria', 'neighborhood', city_id),
    ('Medical Center', 'neighborhood', city_id),
    ('Memorial', 'neighborhood', city_id),
    ('EaDo', 'neighborhood', city_id),
    ('Third Ward', 'neighborhood', city_id);
END $$;
