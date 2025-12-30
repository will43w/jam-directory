# Supabase Backend Setup

This directory contains the Supabase database schema, migrations, and seed data for the Jazz Jam Directory.

## Structure

- `config.toml` - Supabase project configuration
- `migrations/` - Database migration files
- `seed.sql` - Seed data with example jams

## Setup Instructions

### 1. Start Supabase Local Development

From the `backend` directory:

```bash
supabase start
```

This will:
- Start a local PostgreSQL database
- Start Supabase Studio (available at http://localhost:54323)
- Apply all migrations
- Run the seed.sql file

### 2. Apply Migrations to Remote Database

If you need to apply migrations to a remote Supabase project:

```bash
supabase db push
```

### 3. Run Seed Data

Seed data is automatically run when you start Supabase locally. To manually seed:

```bash
supabase db reset
```

Or connect to your database and run:

```bash
psql -h <host> -U postgres -d postgres -f seed.sql
```

## Database Schema

### Tables

- **jam** - Main jam session records
- **jam_schedule** - Recurring schedule rules (weekday, time, timezone)
- **jam_occurrence** - Exception/override records for specific dates
- **jam_contact** - Contact information (email, social media, etc.)
- **jam_suggestion** - Community-submitted suggestions/corrections
- **admin_users** - Admin user references (links to auth.users)

### Row Level Security (RLS)

- **Public access**: Read-only access to jams, schedules, contacts, and occurrences
- **Public insert**: Anyone can submit suggestions (no auth required)
- **Admin access**: Full CRUD on all tables (requires admin_users entry)

## Setting Up Admin Users

To create an admin user:

1. Create a user via Supabase Auth (dashboard or API)
2. Get the user's UUID from `auth.users`
3. Insert into `admin_users` table:

```sql
INSERT INTO admin_users (user_id) VALUES ('<user-uuid-here>');
```

Or use the Supabase dashboard SQL editor to run this query.

## Environment Variables

The frontend needs these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

For local development, these are typically:
```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get from supabase status>
```

Get the anon key by running:
```bash
supabase status
```

## Useful Commands

- `supabase start` - Start local Supabase
- `supabase stop` - Stop local Supabase
- `supabase status` - Show local Supabase status and connection info
- `supabase db reset` - Reset database and re-run migrations + seed
- `supabase migration new <name>` - Create a new migration
- `supabase db push` - Push migrations to remote database
- `supabase db pull` - Pull schema from remote database

