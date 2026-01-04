-- Migration to simplify schedule structure
-- Add schedule text field to jam table
ALTER TABLE jam ADD COLUMN schedule TEXT;

-- Drop jam_occurrence table (no longer needed)
DROP TABLE IF EXISTS jam_occurrence CASCADE;

-- Drop jam_schedule table (no longer needed)
DROP TABLE IF EXISTS jam_schedule CASCADE;

-- Drop indexes related to schedules
DROP INDEX IF EXISTS idx_jam_schedule_jam_id;
DROP INDEX IF EXISTS idx_jam_schedule_weekday;
DROP INDEX IF EXISTS idx_jam_schedule_active;
DROP INDEX IF EXISTS idx_jam_occurrence_jam_id;
DROP INDEX IF EXISTS idx_jam_occurrence_date;

