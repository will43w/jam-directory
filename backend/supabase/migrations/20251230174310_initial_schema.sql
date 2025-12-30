-- Create ENUM types
CREATE TYPE contact_type_enum AS ENUM ('email', 'instagram', 'facebook', 'website', 'other');
CREATE TYPE occurrence_status_enum AS ENUM ('created', 'cancelled', 'moved');
CREATE TYPE suggestion_type_enum AS ENUM ('new_jam', 'update_info', 'inactive', 'other');

-- Create jam table
CREATE TABLE jam (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    description TEXT,
    skill_level TEXT,
    image_url TEXT,
    canonical_source_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create jam_schedule table
CREATE TABLE jam_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jam_id UUID NOT NULL REFERENCES jam(id) ON DELETE CASCADE,
    weekday INTEGER NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
    start_time TIME NOT NULL,
    end_time TIME,
    timezone TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create jam_occurrence table
CREATE TABLE jam_occurrence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jam_id UUID NOT NULL REFERENCES jam(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    status occurrence_status_enum NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(jam_id, date)
);

-- Create jam_contact table
CREATE TABLE jam_contact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jam_id UUID NOT NULL REFERENCES jam(id) ON DELETE CASCADE,
    contact_type contact_type_enum NOT NULL,
    contact_value TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false
);

-- Create jam_suggestion table
CREATE TABLE jam_suggestion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jam_id UUID REFERENCES jam(id) ON DELETE SET NULL,
    suggestion_type suggestion_type_enum NOT NULL,
    message TEXT NOT NULL,
    source_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create admin_users table
CREATE TABLE admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_jam_city ON jam(city);
CREATE INDEX idx_jam_schedule_jam_id ON jam_schedule(jam_id);
CREATE INDEX idx_jam_schedule_weekday ON jam_schedule(weekday);
CREATE INDEX idx_jam_schedule_active ON jam_schedule(is_active) WHERE is_active = true;
CREATE INDEX idx_jam_occurrence_jam_id ON jam_occurrence(jam_id);
CREATE INDEX idx_jam_occurrence_date ON jam_occurrence(date);
CREATE INDEX idx_jam_contact_jam_id ON jam_contact(jam_id);
CREATE INDEX idx_jam_suggestion_jam_id ON jam_suggestion(jam_id);
CREATE INDEX idx_jam_suggestion_created_at ON jam_suggestion(created_at);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users WHERE admin_users.user_id = is_admin.user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on jam table
CREATE TRIGGER update_jam_updated_at
    BEFORE UPDATE ON jam
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE jam ENABLE ROW LEVEL SECURITY;
ALTER TABLE jam_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE jam_occurrence ENABLE ROW LEVEL SECURITY;
ALTER TABLE jam_contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE jam_suggestion ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jam table
-- Public read access
CREATE POLICY "Public can read jams"
    ON jam FOR SELECT
    USING (true);

-- Admin full access
CREATE POLICY "Admins can insert jams"
    ON jam FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update jams"
    ON jam FOR UPDATE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete jams"
    ON jam FOR DELETE
    USING (is_admin(auth.uid()));

-- RLS Policies for jam_schedule table
-- Public read access
CREATE POLICY "Public can read schedules"
    ON jam_schedule FOR SELECT
    USING (true);

-- Admin full access
CREATE POLICY "Admins can insert schedules"
    ON jam_schedule FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update schedules"
    ON jam_schedule FOR UPDATE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete schedules"
    ON jam_schedule FOR DELETE
    USING (is_admin(auth.uid()));

-- RLS Policies for jam_occurrence table
-- Public read access
CREATE POLICY "Public can read occurrences"
    ON jam_occurrence FOR SELECT
    USING (true);

-- Admin full access
CREATE POLICY "Admins can insert occurrences"
    ON jam_occurrence FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update occurrences"
    ON jam_occurrence FOR UPDATE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete occurrences"
    ON jam_occurrence FOR DELETE
    USING (is_admin(auth.uid()));

-- RLS Policies for jam_contact table
-- Public read access
CREATE POLICY "Public can read contacts"
    ON jam_contact FOR SELECT
    USING (true);

-- Admin full access
CREATE POLICY "Admins can insert contacts"
    ON jam_contact FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update contacts"
    ON jam_contact FOR UPDATE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete contacts"
    ON jam_contact FOR DELETE
    USING (is_admin(auth.uid()));

-- RLS Policies for jam_suggestion table
-- Public insert access (no auth required)
CREATE POLICY "Public can submit suggestions"
    ON jam_suggestion FOR INSERT
    WITH CHECK (true);

-- Admin read access
CREATE POLICY "Admins can read suggestions"
    ON jam_suggestion FOR SELECT
    USING (is_admin(auth.uid()));

-- Admin update/delete access (for managing suggestions)
CREATE POLICY "Admins can update suggestions"
    ON jam_suggestion FOR UPDATE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete suggestions"
    ON jam_suggestion FOR DELETE
    USING (is_admin(auth.uid()));

-- RLS Policies for admin_users table
-- Only admins can read admin_users
CREATE POLICY "Admins can read admin_users"
    ON admin_users FOR SELECT
    USING (is_admin(auth.uid()));

-- Only admins can insert into admin_users
CREATE POLICY "Admins can insert admin_users"
    ON admin_users FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

-- Only admins can delete from admin_users
CREATE POLICY "Admins can delete admin_users"
    ON admin_users FOR DELETE
    USING (is_admin(auth.uid()));

