# 9090 Homes

**California Sober Living Directory** — A searchable map + list directory of cash-pay, standalone sober living homes.

Built for families and individuals searching for housing, and for operators who want to list their homes. The name "9090" is a recovery reference (90 meetings in 90 days).

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth + DB | Supabase (PostgreSQL + Auth + Storage) |
| Map | Mapbox GL JS |
| Email | Resend |
| Language | TypeScript |

---

## Getting started

### 1. Clone and install

```bash
git clone <repo>
cd 9090homes
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`:

- **Supabase**: Create a project at [supabase.com](https://supabase.com). Copy the Project URL, anon key, and service role key from Project Settings → API.
- **Mapbox**: Create an account at [mapbox.com](https://mapbox.com). Create a public token. In production, scope it to your domain.
- **Resend**: Create an account at [resend.com](https://resend.com). Add and verify a sending domain. Update `fromEmail` in `app/api/contact/route.ts` to match.

### 3. Set up the database

In the Supabase SQL editor, run **in order**:

1. `supabase/schema.sql` — creates all tables, indexes, triggers, RLS policies, and storage bucket
2. `supabase/seed.sql` — seeds amenity types and 10 California sober living listings

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
app/
  page.tsx                    # Home — hero + directory (map + list)
  listings/[slug]/            # Individual listing detail + contact form
  operator/
    login/                    # Email/password sign in
    signup/                   # Create operator account
    dashboard/                # Manage listings
    listings/new/             # Submit a new listing
    listings/[id]/edit/       # Edit existing listing
  admin/                      # Admin panel (approve/reject listings)
  api/
    contact/                  # POST — sends inquiry email via Resend
    admin/listings/           # PATCH — approve/reject (admin only)

components/
  nav.tsx                     # Top navigation
  directory-view.tsx          # Client: map + list split view
  map-view.tsx                # Mapbox GL JS map with clustering
  listing-card.tsx            # Card component for list view
  search-filters.tsx          # Filter bar (gender, county, price, etc.)
  listing-form.tsx            # Create/edit listing form
  photo-upload.tsx            # Supabase Storage photo uploader

lib/
  supabase/
    client.ts                 # Browser Supabase client
    server.ts                 # Server Supabase client + admin client
    types.ts                  # TypeScript types
  utils.ts                    # Shared helpers (formatPrice, geocode, etc.)

supabase/
  schema.sql                  # Full DB schema + RLS + storage policies
  seed.sql                    # 10 California listings + amenities
```

---

## Database schema

```
operators           ← extends auth.users
listings            ← sober living homes
amenities           ← lookup table (WiFi, Laundry, etc.)
listing_amenities   ← join table (listing ↔ amenities)
storage/listing-photos ← Supabase Storage bucket
```

All tables use Row Level Security. Public visitors can read `live` listings. Operators can only manage their own. Admins use the service role key via a server-only client.

---

## Making a user an admin

After signing up, run this in the Supabase SQL editor:

```sql
UPDATE public.operators
SET is_admin = TRUE
WHERE email = 'your@email.com';
```

Admins see an **Admin panel** link in their dashboard and can approve or reject pending listings.

---

## Listing lifecycle

```
Operator submits → status: "pending"
Admin approves  → status: "live", verified: true
Admin rejects   → status: "rejected"
```

Only `live` listings appear in the public directory and on the map.

---

## Resend setup

1. Add your domain in Resend → Domains
2. Update the `from` address in `app/api/contact/route.ts`:
   ```ts
   const fromEmail = 'inquiries@yourdomain.com'
   ```
3. Operators receive inquiry emails at the email they enter for their listing
4. Inquirers receive a confirmation email

---

## Deployment

Deploy to [Vercel](https://vercel.com) (recommended):

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Deploy

Make sure your Mapbox token is scoped to your production domain in production to prevent abuse.

---

## Design system

| Token | Value |
|-------|-------|
| Background | `#0f0f0f` (near-black) |
| Card background | `#1a1a1a` |
| Text primary | `#f0ede8` (warm off-white) |
| Text secondary | `#a09b96` |
| Accent (sage green) | `#7a9e7e` |
| Border | `#252525` |

Tailwind utility classes are defined in `tailwind.config.ts` and `app/globals.css`.

---

*Find a home. Start your 90.*
