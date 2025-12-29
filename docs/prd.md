# PRD — Jazz Jam Directory (MVP)

## Overview
A public, searchable directory of jazz jam sessions, optimized for mobile use and anonymous browsing.  
Primary goal: help musicians reliably discover active jazz jams in a city, with clear schedules and organizer contact info.  
Secondary goal: enable admins to maintain accurate data with minimal overhead.

No user accounts for regular visitors. No community signals yet.

---

## Goals
- Allow anyone to find jazz jams by city, day, venue, or name
- Clearly communicate when and where jams usually happen
- Provide organizer contact info so visitors can confirm details themselves
- Allow admins to easily add/edit jams and manage date exceptions
- Keep MVP lightweight, robust, and extensible

---

## Non-Goals (Explicitly Out of Scope)
- User accounts for musicians
- Activity / reliability scoring
- Community confirmations or voting
- Notifications
- Social features or comments
- Automation or scraping

---

## Target Users
1. **Musicians (anonymous)**
   - Searching for jams in their city or while traveling
   - Primarily on mobile
   - Arrive via Google search
2. **Admins (trusted)**
   - Maintain jam listings
   - Handle corrections and exceptions

---

## Tech Stack
- Frontend: React + TypeScript
- Backend/Data: Supabase (Postgres, Auth, RLS)
- Styling: flexible (Tailwind or equivalent)

---

## Data Model (MVP)

### `jam`
- `id` (uuid, pk)
- `name` (text)
- `city` (text)
- `venue_name` (text)
- `venue_address` (text)
- `latitude` (float, nullable)
- `longitude` (float, nullable)
- `description` (text)
- `skill_level` (text)
- `image_url` (text)
- `canonical_source_url` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

### `jam_schedule`
Defines the base recurring rule. TODO: Refine so that it can represent things like, "every other tuesday", or, "last Thursday of every month". 

- `id` (uuid, pk)
- `jam_id` (uuid, fk → jam.id)
- `weekday` (int, 0=Sun … 6=Sat)
- `start_time` (time)
- `end_time` (time, nullable)
- `timezone` (text, default city timezone)
- `is_active` (boolean)

---

### `jam_occurrence`
Stores **exceptions only** (overrides/cancellations).

- `id` (uuid, pk)
- `jam_id` (uuid, fk → jam.id)
- `date` (date)
- `start_time` (time, nullable)
- `end_time` (time, nullable)
- `status` (text: `created` | `cancelled` | `moved`)
- `notes` (text)
- `created_at` (timestamp)

---

### `jam_contact`
Organizer or venue contact info.

- `id` (uuid, pk)
- `jam_id` (uuid, fk → jam.id)
- `contact_type` (text: `email` | `instagram` | `facebook` | `website` | `other`)
- `contact_value` (text)
- `is_primary` (boolean)

---

### `jam_suggestion`
Community-submitted corrections (admin-reviewed).

- `id` (uuid, pk)
- `jam_id` (uuid, nullable)
- `suggestion_type` (text: `new_jam` | `update_info` | `inactive`)
- `message` (text)
- `source_url` (text, nullable)
- `created_at` (timestamp)

---

## UX Requirements

### 1. Jam Search Page (Public)
**Purpose:** discovery

**Features**
- Search input (name, venue, area)
- Filters:
  - Day of week
  - “Tonight”
- Results list:
  - Jam name
  - Venue
  - Next upcoming date (computed from schedule + exceptions)
- Optional map toggle using venue coordinates

Mobile-first layout.

---

### 2. Jam Detail Page (Public + Admin)
Single page with role-based UI.

#### Public View
- Jam image
- Name, venue, address
- Description
- Base schedule (“Every Tuesday at 7:30pm”)
- Upcoming dates (computed)
- Contact section:
  - “Best place to confirm tonight’s details”
- Canonical source link
- Button: **“Got info on this jam? Help the community out”**

#### Admin View (visible to admins only)
- Edit jam details
- Edit base schedule (including "active" status)
- Manage contacts
- Manage exceptions (see below)
- Delete jam

---

### 3. Exception Management (Admin)
**Calendar-based UI**
- Month view
- Auto-generated dots on dates implied by base schedule
- Clicking a date opens modal:
  - Confirm (no-op)
  - Cancel
  - Change time
  - Notes
- Only create `jam_occurrence` rows when overridden

---

### 4. “Got Info?” Submission Flow (Public)
- Modal form:
  - What’s wrong / missing?
    - Missing contact
    - Wrong time/day
    - Jam inactive
    - Other
  - Freeform message
  - Optional source link
- No login required
- Creates `jam_suggestion` row

---

## Permissions & Auth
- Supabase Auth for admins only
- RLS:
  - Public: read-only access to jams, schedules, contacts
  - Admins: full CRUD
  - Public: insert-only on `jam_suggestion`

---

## Derived Logic (Frontend or API)
- Compute upcoming jam dates from:
  - `jam_schedule`
  - overridden by `jam_occurrence`
- If an occurrence is cancelled → hide it
- If no exception → assume base rule applies

---

## SEO & Discovery
- One canonical URL per jam
- City-based landing pages (e.g. `/london/jazz-jams`)
- Jam detail pages indexable by search engines

---

## Success Criteria (MVP)
- Users can reliably find jams and contact organizers
- Admin can maintain listings with minimal friction
- No stale jams without visible uncertainty
- Ready foundation for:
  - activity signals
  - community ownership
  - jam update posts
  - social / promotional enhancements (jam owners dropping pics and vids)

---

## Future Phases (Not Implemented)
- Anonymous activity confirmations
- Community ownership takeover
- Jam update posts
- Social / promotional enhancements (jam owners dropping pics and vids)
