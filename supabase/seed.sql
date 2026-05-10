-- 9090 Homes — Seed Data
-- Run AFTER schema.sql
-- Creates amenities lookup and 10 realistic California sober living listings

-- ============================================================
-- Amenities
-- ============================================================
INSERT INTO public.amenities (name, slug) VALUES
  ('WiFi',                      'wifi'),
  ('Laundry on-site',           'laundry'),
  ('Private room available',    'private-room'),
  ('Shared room',               'shared-room'),
  ('Outdoor space',             'outdoor-space'),
  ('Gym access',                'gym'),
  ('AA/NA meetings nearby',     'meetings-nearby'),
  ('Transportation assistance', 'transportation'),
  ('House manager on-site',     'house-manager'),
  ('Structured schedule',       'structured-schedule'),
  ('Drug testing',              'drug-testing'),
  ('Case management',           'case-management'),
  ('Meal plan available',       'meal-plan'),
  ('Work program',              'work-program'),
  ('Smoking area (outside)',    'smoking')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Listings
-- Note: operator_id is NULL for seed data (unowned listings).
--       Set status = 'live' and verified = TRUE for display.
-- ============================================================

-- 1. LA – Silver Lake – Men's
INSERT INTO public.listings (
  id, name, slug, description, address, city, county, state, zip,
  lat, lng, gender, price_min, price_max, bed_count,
  pet_friendly, mat_friendly, phone, email, website,
  house_rules, status, verified, photos
) VALUES (
  gen_random_uuid(),
  'Serenity House Silver Lake',
  'serenity-house-silver-lake',
  'A structured, community-focused home for men in recovery. Nestled in a quiet residential pocket of Silver Lake, we''re close to two AA clubhouses and a gym. We focus on building real routines — sleep, work, meetings, accountability. The house has been operating since 2018 and has helped over 80 men find their footing.',
  '2318 Effie St',
  'Los Angeles',
  'Los Angeles',
  'CA',
  '90026',
  34.0839,
  -118.2711,
  'men',
  1200,
  1600,
  8,
  FALSE,
  FALSE,
  '(323) 555-0142',
  'intake@serenitysilverake.com',
  NULL,
  E'- 30-day minimum stay\n- 90-day meeting attendance required\n- Random UA testing twice per week\n- Curfew: 11pm Sun–Thu, 1am Fri–Sat\n- No guests in bedrooms\n- House chores on rotation\n- Employment or active job search required after 30 days',
  'live',
  TRUE,
  ARRAY[
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80'
  ]
);

-- 2. LA – West Hollywood – Women's
INSERT INTO public.listings (
  id, name, slug, description, address, city, county, state, zip,
  lat, lng, gender, price_min, price_max, bed_count,
  pet_friendly, mat_friendly, phone, email, website,
  house_rules, status, verified, photos
) VALUES (
  gen_random_uuid(),
  'New Chapter Women''s Living',
  'new-chapter-womens-living',
  'A women-only recovery home in West Hollywood, walking distance to meetings, coffee shops, and the bus line. We offer a warm, judgment-free environment that takes MAT seriously — we support the full spectrum of recovery. Small house, tight community. Women who are serious about their sobriety thrive here.',
  '1047 N Crescent Heights Blvd',
  'West Hollywood',
  'Los Angeles',
  'CA',
  '90046',
  34.0900,
  -118.3617,
  'women',
  1500,
  2000,
  6,
  TRUE,
  TRUE,
  '(310) 555-0187',
  'hello@newchapterwomens.com',
  NULL,
  E'- MAT-friendly: all medications prescribed by your doctor are welcome\n- No alcohol or illicit substances on premises\n- Weekly house meeting required\n- Pets welcome (max 1 small dog or cat)\n- 24-hour notice for overnight guests\n- Quiet hours: 10pm–7am',
  'live',
  TRUE,
  ARRAY[
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'
  ]
);

-- 3. LA – Culver City – Co-ed
INSERT INTO public.listings (
  id, name, slug, description, address, city, county, state, zip,
  lat, lng, gender, price_min, price_max, bed_count,
  pet_friendly, mat_friendly, phone, email, website,
  house_rules, status, verified, photos
) VALUES (
  gen_random_uuid(),
  'Pacific Recovery Homes – Culver City',
  'pacific-recovery-homes-culver-city',
  'Co-ed sober living in Culver City, designed for adults who are ready to work and integrate back into life. Larger house with private rooms available. The neighborhood is safe, walkable, and 10 minutes from the Metro E Line. We have three houses on the same block — the community is the thing that makes it work.',
  '4234 Inglewood Blvd',
  'Culver City',
  'Los Angeles',
  'CA',
  '90230',
  34.0211,
  -118.3965,
  'coed',
  1100,
  1400,
  10,
  FALSE,
  FALSE,
  '(424) 555-0239',
  'intake@pacificrecoveryhomes.com',
  'https://pacificrecoveryhomes.com',
  E'- 6-month minimum commitment encouraged\n- Weekly group house check-in\n- No alcohol on premises\n- UA testing on intake and random\n- Shared kitchen and common areas\n- Guests permitted in common areas only\n- Employment or school required within 60 days',
  'live',
  TRUE,
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'
  ]
);

-- 4. OC – Huntington Beach – Men's
INSERT INTO public.listings (
  id, name, slug, description, address, city, county, state, zip,
  lat, lng, gender, price_min, price_max, bed_count,
  pet_friendly, mat_friendly, phone, email, website,
  house_rules, status, verified, photos
) VALUES (
  gen_random_uuid(),
  'Surf City Sober Living',
  'surf-city-sober-living',
  'Men''s sober living two miles from the beach in Huntington Beach. We believe in the outdoors as part of recovery — surfing, beach runs, volleyball — alongside a solid meeting schedule and house accountability. Clean, well-maintained home with a large backyard. Dogs welcome.',
  '318 Main St',
  'Huntington Beach',
  'Orange',
  'CA',
  '92648',
  33.6595,
  -117.9988,
  'men',
  900,
  1200,
  8,
  TRUE,
  FALSE,
  '(714) 555-0156',
  'surfcitysl@gmail.com',
  NULL,
  E'- 30-day minimum\n- Meeting attendance required: 5 per week\n- Random UA testing\n- Dogs welcome (one per resident, housemate approval)\n- Curfew 12am\n- House chores and grocery split\n- No overnight female guests first 30 days',
  'live',
  TRUE,
  ARRAY[
    'https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'
  ]
);

-- 5. OC – Newport Beach – Women's
INSERT INTO public.listings (
  id, name, slug, description, address, city, county, state, zip,
  lat, lng, gender, price_min, price_max, bed_count,
  pet_friendly, mat_friendly, phone, email, website,
  house_rules, status, verified, photos
) VALUES (
  gen_random_uuid(),
  'Shoreline Women''s Sober Living',
  'shoreline-womens-sober-living',
  'Upscale women-only sober living in Newport Beach. Private rooms available. We serve women who want a structured environment without the institutional feel — this is a real home, not a facility. MAT-friendly and trauma-informed. Caseworker available on-site twice weekly.',
  '2710 W Coast Hwy',
  'Newport Beach',
  'Orange',
  'CA',
  '92663',
  33.6189,
  -117.9289,
  'women',
  1800,
  2400,
  5,
  FALSE,
  TRUE,
  '(949) 555-0263',
  'intake@shorelinewomens.com',
  'https://shorelinewomens.com',
  E'- MAT-friendly, all medications welcome with documentation\n- Private rooms available at premium pricing\n- Case management available twice weekly\n- No alcohol, no illicit substances\n- Quiet hours: 10pm\n- Phones permitted with reasonable boundaries\n- 60-day minimum stay',
  'live',
  TRUE,
  ARRAY[
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
  ]
);

-- 6. SD – Ocean Beach – Men's
INSERT INTO public.listings (
  id, name, slug, description, address, city, county, state, zip,
  lat, lng, gender, price_min, price_max, bed_count,
  pet_friendly, mat_friendly, phone, email, website,
  house_rules, status, verified, photos
) VALUES (
  gen_random_uuid(),
  'Ocean Beach Recovery Home',
  'ocean-beach-recovery-home',
  'Men''s sober living in the heart of Ocean Beach, San Diego. OB is a tight-knit neighborhood with a strong recovery community — there are four AA/NA meetings within walking distance. We are a working house: most residents have jobs within 90 days. Dogs welcome, surfboards in the garage.',
  '4904 Niagara Ave',
  'San Diego',
  'San Diego',
  'CA',
  '92107',
  32.7474,
  -117.2502,
  'men',
  850,
  1100,
  9,
  TRUE,
  FALSE,
  '(619) 555-0334',
  'obrecoveryhome@gmail.com',
  NULL,
  E'- First 30 days: curfew 10pm\n- Meeting attendance: 5 per week minimum\n- UA testing on intake and random thereafter\n- Dogs welcome (one per resident)\n- House meeting every Sunday 7pm\n- Chores and shared grocery costs\n- No alcohol or drugs on premises or in bloodstream',
  'live',
  TRUE,
  ARRAY[
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
  ]
);

-- 7. SD – North Park – Women's
INSERT INTO public.listings (
  id, name, slug, description, address, city, county, state, zip,
  lat, lng, gender, price_min, price_max, bed_count,
  pet_friendly, mat_friendly, phone, email, website,
  house_rules, status, verified, photos
) VALUES (
  gen_random_uuid(),
  'North Park Women''s House',
  'north-park-womens-house',
  'A women-only sober living in North Park, one of San Diego''s most walkable neighborhoods. We''re MAT-friendly, pet-friendly, and have been operating for six years. Our community includes women from all backgrounds and recovery paths — what matters is that you want to be sober and are willing to show up for each other.',
  '3815 Alabama St',
  'San Diego',
  'San Diego',
  'CA',
  '92104',
  32.7477,
  -117.1296,
  'women',
  1000,
  1300,
  7,
  TRUE,
  TRUE,
  '(619) 555-0412',
  'northparkwomens@protonmail.com',
  NULL,
  E'- MAT-friendly: all prescribed medications supported\n- Pets welcome with $200 pet deposit (cats and small dogs)\n- 30-day minimum stay\n- Weekly house meeting required\n- UA testing on intake and random\n- Quiet hours 11pm–7am\n- Guests in common areas only, no overnight guests first 60 days',
  'live',
  TRUE,
  ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
  ]
);

-- 8. SF – Castro – Co-ed
INSERT INTO public.listings (
  id, name, slug, description, address, city, county, state, zip,
  lat, lng, gender, price_min, price_max, bed_count,
  pet_friendly, mat_friendly, phone, email, website,
  house_rules, status, verified, photos
) VALUES (
  gen_random_uuid(),
  'Castro Sober Living',
  'castro-sober-living',
  'Co-ed sober living in the Castro, San Francisco. LGBTQ+ affirming. We are a harm-reduction informed house that meets people where they are — MAT-friendly, non-judgemental, community-first. Close to Muni lines, Castro AA, and a dozen meetings per week within four blocks. This house has been home to over 200 people since 2015.',
  '550 Noe St',
  'San Francisco',
  'San Francisco',
  'CA',
  '94114',
  37.7609,
  -122.4350,
  'coed',
  1600,
  2200,
  6,
  FALSE,
  TRUE,
  '(415) 555-0578',
  'castrosl@gmail.com',
  NULL,
  E'- LGBTQ+ affirming and welcoming\n- MAT-friendly, harm-reduction informed\n- 30-day minimum\n- Meeting attendance encouraged, not required (6+ per month strongly suggested)\n- UA testing on intake\n- No alcohol on premises\n- Quiet hours 11pm\n- House meeting every other Sunday',
  'live',
  TRUE,
  ARRAY[
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'
  ]
);

-- 9. Sacramento – Midtown – Men's
INSERT INTO public.listings (
  id, name, slug, description, address, city, county, state, zip,
  lat, lng, gender, price_min, price_max, bed_count,
  pet_friendly, mat_friendly, phone, email, website,
  house_rules, status, verified, photos
) VALUES (
  gen_random_uuid(),
  'Midtown Recovery Home Sacramento',
  'midtown-recovery-home-sacramento',
  'Men''s sober living in Midtown Sacramento. Affordable, no-frills, serious about recovery. We have a full house of men who are working and going to meetings. Big yard, two living rooms, good energy. Midtown has more AA meetings per square mile than almost anywhere in California — you won''t have excuses.',
  '1422 Q St',
  'Sacramento',
  'Sacramento',
  'CA',
  '95811',
  38.5766,
  -121.4820,
  'men',
  800,
  1000,
  10,
  FALSE,
  FALSE,
  '(916) 555-0623',
  'midtownrecoverysc@gmail.com',
  NULL,
  E'- 90-day minimum stay\n- 90 meetings in 90 days required for first-timers\n- Sponsor required by day 30\n- UA testing twice weekly\n- No curfew after 90 days, 11pm curfew before\n- Employment required by day 60\n- House chores and grocery contribution',
  'live',
  TRUE,
  ARRAY[
    'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&q=80'
  ]
);

-- 10. Sacramento – East Sac – Women's
INSERT INTO public.listings (
  id, name, slug, description, address, city, county, state, zip,
  lat, lng, gender, price_min, price_max, bed_count,
  pet_friendly, mat_friendly, phone, email, website,
  house_rules, status, verified, photos
) VALUES (
  gen_random_uuid(),
  'East Sacramento Women''s Sober Living',
  'east-sacramento-womens-sober-living',
  'Women''s sober living in a quiet East Sacramento neighborhood with tree-lined streets and a strong local AA community. This house has been owned and operated by a woman in long-term recovery for 11 years. We take two cats. We have a garden. We eat dinner together on Sundays. Small, intentional, real.',
  '3806 Folsom Blvd',
  'Sacramento',
  'Sacramento',
  'CA',
  '95816',
  38.5701,
  -121.4508,
  'women',
  750,
  950,
  8,
  TRUE,
  FALSE,
  '(916) 555-0701',
  'eastsacwomens@gmail.com',
  NULL,
  E'- Women only\n- Pets: cats welcome, no dogs (two resident cats in the house)\n- 30-day minimum stay\n- AA/NA meeting attendance: 4 per week\n- Sunday house dinner: attendance expected\n- Quiet hours: 10pm\n- No overnight male guests\n- UA testing on intake and random',
  'live',
  TRUE,
  ARRAY[
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80'
  ]
);

-- ============================================================
-- Seed amenity associations
-- (using subqueries to stay portable across gen_random_uuid IDs)
-- ============================================================

-- Serenity House Silver Lake → WiFi, Laundry, Meetings nearby, Drug testing, Structured schedule, House manager
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM public.listings l, public.amenities a
WHERE l.slug = 'serenity-house-silver-lake'
  AND a.slug IN ('wifi','laundry','meetings-nearby','drug-testing','structured-schedule','house-manager');

-- New Chapter Women's → WiFi, Laundry, Meetings nearby, Drug testing, Outdoor space, Case management
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM public.listings l, public.amenities a
WHERE l.slug = 'new-chapter-womens-living'
  AND a.slug IN ('wifi','laundry','meetings-nearby','drug-testing','outdoor-space','case-management');

-- Pacific Recovery Homes → WiFi, Laundry, Private room, Meetings nearby, Transportation, Drug testing
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM public.listings l, public.amenities a
WHERE l.slug = 'pacific-recovery-homes-culver-city'
  AND a.slug IN ('wifi','laundry','private-room','meetings-nearby','transportation','drug-testing');

-- Surf City → WiFi, Laundry, Outdoor space, Meetings nearby, Drug testing, Gym
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM public.listings l, public.amenities a
WHERE l.slug = 'surf-city-sober-living'
  AND a.slug IN ('wifi','laundry','outdoor-space','meetings-nearby','drug-testing','gym');

-- Shoreline Women's → WiFi, Laundry, Private room, Case management, Drug testing, Structured schedule
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM public.listings l, public.amenities a
WHERE l.slug = 'shoreline-womens-sober-living'
  AND a.slug IN ('wifi','laundry','private-room','case-management','drug-testing','structured-schedule');

-- Ocean Beach → WiFi, Laundry, Outdoor space, Meetings nearby, Drug testing
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM public.listings l, public.amenities a
WHERE l.slug = 'ocean-beach-recovery-home'
  AND a.slug IN ('wifi','laundry','outdoor-space','meetings-nearby','drug-testing');

-- North Park Women's → WiFi, Laundry, Meetings nearby, Drug testing, Outdoor space
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM public.listings l, public.amenities a
WHERE l.slug = 'north-park-womens-house'
  AND a.slug IN ('wifi','laundry','meetings-nearby','drug-testing','outdoor-space');

-- Castro → WiFi, Laundry, Meetings nearby, Transportation, Case management
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM public.listings l, public.amenities a
WHERE l.slug = 'castro-sober-living'
  AND a.slug IN ('wifi','laundry','meetings-nearby','transportation','case-management');

-- Midtown Sacramento → WiFi, Laundry, Meetings nearby, Drug testing, Structured schedule, Work program, Outdoor space
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM public.listings l, public.amenities a
WHERE l.slug = 'midtown-recovery-home-sacramento'
  AND a.slug IN ('wifi','laundry','meetings-nearby','drug-testing','structured-schedule','work-program','outdoor-space');

-- East Sac Women's → WiFi, Laundry, Meetings nearby, Outdoor space, Drug testing
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM public.listings l, public.amenities a
WHERE l.slug = 'east-sacramento-womens-sober-living'
  AND a.slug IN ('wifi','laundry','meetings-nearby','outdoor-space','drug-testing');
