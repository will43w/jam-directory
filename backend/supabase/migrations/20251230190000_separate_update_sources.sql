-- Migration to separate update sources from contacts
-- Create new enum for update source types
CREATE TYPE update_source_type_enum AS ENUM ('website', 'facebook', 'instagram', 'twitter', 'other');

-- Create jam_update_source table
CREATE TABLE jam_update_source (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jam_id UUID NOT NULL REFERENCES jam(id) ON DELETE CASCADE,
    source_type update_source_type_enum NOT NULL,
    source_value TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false
);

-- Create index for performance
CREATE INDEX idx_jam_update_source_jam_id ON jam_update_source(jam_id);

-- Enable Row Level Security
ALTER TABLE jam_update_source ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jam_update_source table
-- Public read access
CREATE POLICY "Public can read update sources"
    ON jam_update_source FOR SELECT
    USING (true);

-- Admin full access
CREATE POLICY "Admins can insert update sources"
    ON jam_update_source FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update update sources"
    ON jam_update_source FOR UPDATE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete update sources"
    ON jam_update_source FOR DELETE
    USING (is_admin(auth.uid()));

-- Update contact_type_enum to include phone and distinguish DM-able contacts
-- Create a new enum with the updated values
CREATE TYPE contact_type_enum_new AS ENUM ('email', 'phone', 'instagram_dm', 'facebook_dm', 'website_contact', 'other');

-- Add a temporary column with the new type
ALTER TABLE jam_contact ADD COLUMN contact_type_new contact_type_enum_new;

-- Migrate data: convert old values to new values
UPDATE jam_contact SET contact_type_new = CASE
    WHEN contact_type::text = 'email' THEN 'email'::contact_type_enum_new
    WHEN contact_type::text = 'website' THEN 'website_contact'::contact_type_enum_new
    WHEN contact_type::text = 'instagram' THEN 'instagram_dm'::contact_type_enum_new
    WHEN contact_type::text = 'facebook' THEN 'facebook_dm'::contact_type_enum_new
    ELSE 'other'::contact_type_enum_new
END;

-- Drop the old column and rename the new one
ALTER TABLE jam_contact DROP COLUMN contact_type;
ALTER TABLE jam_contact RENAME COLUMN contact_type_new TO contact_type;
ALTER TABLE jam_contact ALTER COLUMN contact_type SET NOT NULL;

-- Drop the old enum and rename the new one
DROP TYPE contact_type_enum;
ALTER TYPE contact_type_enum_new RENAME TO contact_type_enum;

