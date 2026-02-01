-- Seed major cities for selected countries (capitals already exist)
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT * FROM (VALUES
      -- United States
      ('United States', 'New York'),
      ('United States', 'Los Angeles'),
      ('United States', 'Chicago'),
      ('United States', 'Houston'),
      ('United States', 'Phoenix'),
      ('United States', 'Philadelphia'),
      ('United States', 'San Antonio'),
      ('United States', 'San Diego'),
      ('United States', 'Dallas'),
      ('United States', 'Austin'),
      ('United States', 'San Francisco'),
      ('United States', 'Seattle'),
      ('United States', 'Denver'),
      ('United States', 'Boston'),
      ('United States', 'Miami'),
      ('United States', 'Atlanta'),
      ('United States', 'Minneapolis'),
      ('United States', 'Portland'),
      ('United States', 'Detroit'),
      ('United States', 'Nashville'),

      -- United Kingdom
      ('United Kingdom', 'Manchester'),
      ('United Kingdom', 'Birmingham'),
      ('United Kingdom', 'Glasgow'),
      ('United Kingdom', 'Liverpool'),
      ('United Kingdom', 'Edinburgh'),
      ('United Kingdom', 'Bristol'),
      ('United Kingdom', 'Leeds'),
      ('United Kingdom', 'Sheffield'),
      ('United Kingdom', 'Newcastle'),
      ('United Kingdom', 'Nottingham'),
      ('United Kingdom', 'Cardiff'),
      ('United Kingdom', 'Belfast'),
      ('United Kingdom', 'Cambridge'),
      ('United Kingdom', 'Oxford'),
      ('United Kingdom', 'Brighton'),

      -- Germany
      ('Germany', 'Munich'),
      ('Germany', 'Hamburg'),
      ('Germany', 'Frankfurt'),
      ('Germany', 'Cologne'),
      ('Germany', 'Stuttgart'),
      ('Germany', 'Dusseldorf'),
      ('Germany', 'Leipzig'),
      ('Germany', 'Dortmund'),
      ('Germany', 'Essen'),
      ('Germany', 'Dresden'),
      ('Germany', 'Hanover'),
      ('Germany', 'Nuremberg'),
      ('Germany', 'Bremen'),

      -- France
      ('France', 'Marseille'),
      ('France', 'Lyon'),
      ('France', 'Toulouse'),
      ('France', 'Nice'),
      ('France', 'Nantes'),
      ('France', 'Strasbourg'),
      ('France', 'Montpellier'),
      ('France', 'Bordeaux'),
      ('France', 'Lille'),
      ('France', 'Rennes'),

      -- Italy
      ('Italy', 'Milan'),
      ('Italy', 'Naples'),
      ('Italy', 'Turin'),
      ('Italy', 'Palermo'),
      ('Italy', 'Genoa'),
      ('Italy', 'Bologna'),
      ('Italy', 'Florence'),
      ('Italy', 'Venice'),
      ('Italy', 'Verona'),
      ('Italy', 'Bari'),

      -- Spain
      ('Spain', 'Barcelona'),
      ('Spain', 'Valencia'),
      ('Spain', 'Seville'),
      ('Spain', 'Zaragoza'),
      ('Spain', 'Malaga'),
      ('Spain', 'Bilbao'),
      ('Spain', 'Granada'),
      ('Spain', 'Palma de Mallorca'),

      -- Netherlands
      ('Netherlands', 'Rotterdam'),
      ('Netherlands', 'The Hague'),
      ('Netherlands', 'Utrecht'),
      ('Netherlands', 'Eindhoven'),
      ('Netherlands', 'Groningen'),

      -- Belgium
      ('Belgium', 'Antwerp'),
      ('Belgium', 'Ghent'),
      ('Belgium', 'Liege'),
      ('Belgium', 'Bruges'),

      -- Austria
      ('Austria', 'Graz'),
      ('Austria', 'Linz'),
      ('Austria', 'Salzburg'),
      ('Austria', 'Innsbruck'),

      -- Poland
      ('Poland', 'Krakow'),
      ('Poland', 'Lodz'),
      ('Poland', 'Wroclaw'),
      ('Poland', 'Poznan'),
      ('Poland', 'Gdansk'),
      ('Poland', 'Katowice'),

      -- Czech Republic
      ('Czech Republic', 'Brno'),
      ('Czech Republic', 'Ostrava'),
      ('Czech Republic', 'Plzen'),

      -- Portugal
      ('Portugal', 'Porto'),
      ('Portugal', 'Braga'),
      ('Portugal', 'Faro'),

      -- Ireland
      ('Ireland', 'Cork'),
      ('Ireland', 'Galway'),
      ('Ireland', 'Limerick'),

      -- Sweden
      ('Sweden', 'Gothenburg'),
      ('Sweden', 'Malmo'),
      ('Sweden', 'Uppsala'),

      -- Denmark
      ('Denmark', 'Aarhus'),
      ('Denmark', 'Odense'),

      -- Finland
      ('Finland', 'Tampere'),
      ('Finland', 'Turku'),
      ('Finland', 'Oulu'),

      -- Greece
      ('Greece', 'Thessaloniki'),
      ('Greece', 'Patras'),
      ('Greece', 'Heraklion'),

      -- Romania
      ('Romania', 'Cluj-Napoca'),
      ('Romania', 'Timisoara'),
      ('Romania', 'Iasi'),
      ('Romania', 'Constanta'),

      -- Hungary
      ('Hungary', 'Debrecen'),
      ('Hungary', 'Szeged'),
      ('Hungary', 'Pecs'),

      -- Croatia
      ('Croatia', 'Split'),
      ('Croatia', 'Rijeka'),
      ('Croatia', 'Dubrovnik'),

      -- Bulgaria
      ('Bulgaria', 'Plovdiv'),
      ('Bulgaria', 'Varna'),

      -- Slovakia
      ('Slovakia', 'Kosice'),

      -- Slovenia
      ('Slovenia', 'Maribor'),

      -- Estonia
      ('Estonia', 'Tartu'),

      -- Latvia
      ('Latvia', 'Daugavpils'),

      -- Lithuania
      ('Lithuania', 'Kaunas'),

      -- India
      ('India', 'Mumbai'),
      ('India', 'Bangalore'),
      ('India', 'Hyderabad'),
      ('India', 'Ahmedabad'),
      ('India', 'Chennai'),
      ('India', 'Kolkata'),
      ('India', 'Pune'),
      ('India', 'Jaipur'),
      ('India', 'Lucknow'),
      ('India', 'Chandigarh'),
      ('India', 'Kochi'),
      ('India', 'Indore'),
      ('India', 'Goa'),

      -- Japan
      ('Japan', 'Osaka'),
      ('Japan', 'Yokohama'),
      ('Japan', 'Nagoya'),
      ('Japan', 'Sapporo'),
      ('Japan', 'Fukuoka'),
      ('Japan', 'Kobe'),
      ('Japan', 'Kyoto'),
      ('Japan', 'Hiroshima'),
      ('Japan', 'Sendai'),

      -- South Korea
      ('South Korea', 'Busan'),
      ('South Korea', 'Incheon'),
      ('South Korea', 'Daegu'),
      ('South Korea', 'Daejeon'),
      ('South Korea', 'Gwangju'),
      ('South Korea', 'Suwon'),
      ('South Korea', 'Jeju'),

      -- Australia
      ('Australia', 'Sydney'),
      ('Australia', 'Melbourne'),
      ('Australia', 'Brisbane'),
      ('Australia', 'Perth'),
      ('Australia', 'Adelaide'),
      ('Australia', 'Gold Coast'),
      ('Australia', 'Hobart'),
      ('Australia', 'Darwin'),

      -- New Zealand
      ('New Zealand', 'Auckland'),
      ('New Zealand', 'Christchurch'),
      ('New Zealand', 'Queenstown'),
      ('New Zealand', 'Hamilton'),

      -- South Africa
      ('South Africa', 'Johannesburg'),
      ('South Africa', 'Cape Town'),
      ('South Africa', 'Durban'),
      ('South Africa', 'Port Elizabeth'),
      ('South Africa', 'Bloemfontein'),

      -- Brazil
      ('Brazil', 'Sao Paulo'),
      ('Brazil', 'Rio de Janeiro'),
      ('Brazil', 'Salvador'),
      ('Brazil', 'Fortaleza'),
      ('Brazil', 'Belo Horizonte'),
      ('Brazil', 'Manaus'),
      ('Brazil', 'Curitiba'),
      ('Brazil', 'Recife'),
      ('Brazil', 'Porto Alegre'),
      ('Brazil', 'Florianopolis'),

      -- Argentina
      ('Argentina', 'Cordoba'),
      ('Argentina', 'Rosario'),
      ('Argentina', 'Mendoza'),
      ('Argentina', 'La Plata'),
      ('Argentina', 'Mar del Plata'),
      ('Argentina', 'Tucuman'),
      ('Argentina', 'Bariloche'),

      -- Chile
      ('Chile', 'Valparaiso'),
      ('Chile', 'Concepcion'),
      ('Chile', 'Antofagasta'),
      ('Chile', 'Temuco'),
      ('Chile', 'La Serena'),

      -- Mexico
      ('Mexico', 'Guadalajara'),
      ('Mexico', 'Monterrey'),
      ('Mexico', 'Puebla'),
      ('Mexico', 'Cancun'),
      ('Mexico', 'Tijuana'),
      ('Mexico', 'Merida'),
      ('Mexico', 'Oaxaca'),
      ('Mexico', 'Queretaro'),
      ('Mexico', 'Leon')
    ) AS t(country_name, city_name)
  LOOP
    INSERT INTO neighborhoods (name, type, parent_id)
    SELECT rec.city_name, 'city', n.id
    FROM neighborhoods n
    WHERE n.name = rec.country_name AND n.type = 'country';
  END LOOP;
END $$;
