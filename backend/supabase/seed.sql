-- Seed data for Jazz Jam Directory
-- This file contains realistic example jams across different cities

-- ============================================================================
-- ADMIN USER SETUP
-- ============================================================================
-- To create a test admin user for development:
--
-- 1. Start your local Supabase instance: supabase start
-- 2. Create a user via Supabase Auth using the magic link flow:
--    - Go to http://127.0.0.1:54323 (Supabase Studio)
--    - Navigate to Authentication > Users
--    - Click "Add user" and enter email: whafner43counts@gmail.com
--    - Or use the magic link authentication flow in the app
--
-- 3. After the user is created, find their user_id (UUID) from the auth.users table
--    or from the Supabase Studio interface
--
-- 4. Insert the user into admin_users table:
--    INSERT INTO admin_users (user_id) 
--    SELECT id FROM auth.users WHERE email = 'whafner43counts@gmail.com';
--
--    Or manually with the UUID:
--    INSERT INTO admin_users (user_id) VALUES ('<user-uuid-from-auth-users>');
--
-- 5. Verify admin access by logging in with the magic link and clicking "Edit" on a jam page
-- ============================================================================

-- New York City Jams
INSERT INTO jam (id, name, city, venue_name, venue_address, latitude, longitude, description, skill_level, image_url, canonical_source_url, schedule) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Blue Note Monday Night Jam', 'New York', 'Blue Note Jazz Club', '131 W 3rd St, New York, NY 10012', 40.7306, -73.9986, 'Legendary Monday night jam session at the Blue Note. Open to all skill levels, but bring your A-game. House band starts at 8pm, sign-up sheet available at the door.', 'All Levels', NULL, 'https://www.bluenote.net', 'Every Monday at 8pm'),
('550e8400-e29b-41d4-a716-446655440002', 'Smalls Jazz Club Late Night', 'New York', 'Smalls Jazz Club', '183 W 10th St, New York, NY 10014', 40.7339, -74.0027, 'Intimate late-night jam session in the heart of Greenwich Village. Starts after the main show, usually around 11:30pm. Great vibe, welcoming community.', 'Intermediate', NULL, 'https://www.smallslive.com', 'Every Monday at 11:30pm'),
('550e8400-e29b-41d4-a716-446655440003', 'Jazz Standard Sunday Brunch Jam', 'New York', 'Jazz Standard', '116 E 27th St, New York, NY 10016', 40.7431, -73.9857, 'Sunday afternoon jam session during brunch service. More relaxed atmosphere, perfect for trying out new tunes.', 'All Levels', NULL, 'https://www.jazzstandard.com', 'Every Sunday at 1pm');

-- London Jams
INSERT INTO jam (id, name, city, venue_name, venue_address, latitude, longitude, description, skill_level, image_url, canonical_source_url, schedule) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'Ronnie Scott''s Late Night Session', 'London', 'Ronnie Scott''s Jazz Club', '47 Frith St, London W1D 4HT, UK', 51.5136, -0.1306, 'The iconic late-night jam at Ronnie''s. Starts after the main show. Professional musicians often drop by. Sign-up required.', 'Advanced', NULL, 'https://www.ronniescotts.co.uk', 'Every Monday at 11pm'),
('550e8400-e29b-41d4-a716-446655440005', 'Jazz Cafe Camden Tuesday Jam', 'London', 'Jazz Cafe', '5 Parkway, London NW1 7PG, UK', 51.5390, -0.1426, 'Weekly Tuesday night jam in Camden. Great sound system, friendly crowd. House rhythm section provided.', 'Intermediate', NULL, 'https://www.thejazzcafelondon.com', 'Every Tuesday at 9pm');

-- Chicago Jams
INSERT INTO jam (id, name, city, venue_name, venue_address, latitude, longitude, description, skill_level, image_url, canonical_source_url, schedule) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'Green Mill Monday Night', 'Chicago', 'Green Mill Cocktail Lounge', '4802 N Broadway, Chicago, IL 60640', 41.9686, -87.6597, 'Historic Monday night jam at the Green Mill. This is where the pros play. Come early to sign up, spots fill fast.', 'Advanced', NULL, 'https://www.greenmilljazz.com', 'Every Monday at 9pm'),
('550e8400-e29b-41d4-a716-446655440007', 'Andy''s Jazz Club Wednesday Session', 'Chicago', 'Andy''s Jazz Club', '11 E Hubbard St, Chicago, IL 60611', 41.8901, -87.6274, 'Mid-week jam session at Andy''s. More laid-back than Monday nights, great for intermediate players looking to grow.', 'Intermediate', NULL, 'https://www.andysjazzclub.com', 'Every Wednesday at 8:30pm');

-- Los Angeles Jams
INSERT INTO jam (id, name, city, venue_name, venue_address, latitude, longitude, description, skill_level, image_url, canonical_source_url, schedule) VALUES
('550e8400-e29b-41d4-a716-446655440008', 'The Baked Potato Sunday Night', 'Los Angeles', 'The Baked Potato', '3787 Cahuenga Blvd W, Studio City, CA 91604', 34.1481, -118.3665, 'Sunday night fusion jam at the legendary Baked Potato. Bring your chops, this is a high-level session.', 'Advanced', NULL, 'https://www.thebakedpotato.com', 'Every Sunday at 9pm'),
('550e8400-e29b-41d4-a716-446655440009', 'Catalina Bar & Grill Thursday Jam', 'Los Angeles', 'Catalina Bar & Grill', '6725 W Sunset Blvd, Los Angeles, CA 90028', 34.0981, -118.3408, 'Thursday night jam in Hollywood. Great venue, professional sound. All instruments welcome.', 'All Levels', NULL, 'https://www.catalinajazzclub.com', 'Every Thursday at 8pm');

-- Paris Jams
INSERT INTO jam (id, name, city, venue_name, venue_address, latitude, longitude, description, skill_level, image_url, canonical_source_url, schedule) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Sunset Sunside Sunday Afternoon', 'Paris', 'Sunset Sunside', '60 Rue des Lombards, 75001 Paris, France', 48.8606, 2.3472, 'Sunday afternoon jam in the heart of Paris. International crowd, welcoming atmosphere. Great for meeting other musicians.', 'All Levels', NULL, 'https://www.sunset-sunside.com', 'Every Sunday at 3pm');

-- Update Sources for New York Jams
INSERT INTO jam_update_source (jam_id, source_type, source_value, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'website', 'https://www.bluenote.net', true),
('550e8400-e29b-41d4-a716-446655440001', 'instagram', '@bluenotejazz', false),
('550e8400-e29b-41d4-a716-446655440002', 'website', 'https://www.smallslive.com', true),
('550e8400-e29b-41d4-a716-446655440003', 'website', 'https://www.jazzstandard.com', true),
('550e8400-e29b-41d4-a716-446655440003', 'facebook', 'JazzStandardNYC', false);

-- Contacts for New York Jams
INSERT INTO jam_contact (jam_id, contact_type, contact_value, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'email', 'info@smallslive.com', true);

-- Update Sources for London Jams
INSERT INTO jam_update_source (jam_id, source_type, source_value, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'website', 'https://www.ronniescotts.co.uk', true),
('550e8400-e29b-41d4-a716-446655440004', 'instagram', '@ronniescottsjazz', false),
('550e8400-e29b-41d4-a716-446655440005', 'website', 'https://www.thejazzcafelondon.com', true);

-- Contacts for London Jams
INSERT INTO jam_contact (jam_id, contact_type, contact_value, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440005', 'email', 'bookings@thejazzcafe.com', true);

-- Update Sources for Chicago Jams
INSERT INTO jam_update_source (jam_id, source_type, source_value, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'website', 'https://www.greenmilljazz.com', true),
('550e8400-e29b-41d4-a716-446655440007', 'website', 'https://www.andysjazzclub.com', true),
('550e8400-e29b-41d4-a716-446655440007', 'instagram', '@andysjazzclub', false);

-- Contacts for Chicago Jams
INSERT INTO jam_contact (jam_id, contact_type, contact_value, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'email', 'info@greenmilljazz.com', true);

-- Update Sources for Los Angeles Jams
INSERT INTO jam_update_source (jam_id, source_type, source_value, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440008', 'website', 'https://www.thebakedpotato.com', true),
('550e8400-e29b-41d4-a716-446655440008', 'facebook', 'TheBakedPotato', false),
('550e8400-e29b-41d4-a716-446655440009', 'website', 'https://www.catalinajazzclub.com', true);

-- Contacts for Los Angeles Jams
INSERT INTO jam_contact (jam_id, contact_type, contact_value, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440009', 'email', 'info@catalinajazzclub.com', true);

-- Update Sources for Paris Jam
INSERT INTO jam_update_source (jam_id, source_type, source_value, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'website', 'https://www.sunset-sunside.com', true),
('550e8400-e29b-41d4-a716-446655440010', 'instagram', '@sunset_sunside', false);

