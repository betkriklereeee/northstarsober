-- 9090 Homes — Supabase Schema
-- Run this in the Supabase SQL editor

-- ============================================================
-- Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Operators (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.operators (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  name        TEXT,
  phone       TEXT,
  is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create operator record on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.operators (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Amenities lookup
-- ============================================================
CREATE TABLE IF NOT EXISTS public.amenities (
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE,
  slug  TEXT NOT NULL UNIQUE
);

-- ============================================================
-- Listings
-- ============================================================
CREATE TABLE IF NOT EXISTS public.listings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id  UUID REFERENCES public.operators(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  address      TEXT NOT NULL,
  city         TEXT NOT NULL,
  county       TEXT NOT NULL,
  state        TEXT NOT NULL DEFAULT 'CA',
  zip          TEXT NOT NULL,
  lat          DECIMAL(10, 7) NOT NULL,
  lng          DECIMAL(10, 7) NOT NULL,
  gender       TEXT NOT NULL CHECK (gender IN ('men', 'women', 'coed')),
  price_min    INTEGER CHECK (price_min >= 0),
  price_max    INTEGER CHECK (price_max >= 0),
  bed_count    INTEGER CHECK (bed_count > 0),
  pet_friendly BOOLEAN NOT NULL DEFAULT FALSE,
  mat_friendly BOOLEAN NOT NULL DEFAULT FALSE,
  phone        TEXT,
  email        TEXT,
  website      TEXT,
  house_rules  TEXT,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'live', 'rejected')),
  verified     BOOLEAN NOT NULL DEFAULT FALSE,
  photos       TEXT[] NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast geo/filter queries
CREATE INDEX IF NOT EXISTS listings_status_idx     ON public.listings (status);
CREATE INDEX IF NOT EXISTS listings_city_idx       ON public.listings (city);
CREATE INDEX IF NOT EXISTS listings_county_idx     ON public.listings (county);
CREATE INDEX IF NOT EXISTS listings_gender_idx     ON public.listings (gender);
CREATE INDEX IF NOT EXISTS listings_operator_idx   ON public.listings (operator_id);
CREATE INDEX IF NOT EXISTS listings_slug_idx       ON public.listings (slug);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS listings_updated_at ON public.listings;
CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Listing ↔ Amenities join
-- ============================================================
CREATE TABLE IF NOT EXISTS public.listing_amenities (
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  amenity_id  INTEGER NOT NULL REFERENCES public.amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (listing_id, amenity_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

-- Operators table
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Operators: read own record"
  ON public.operators FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Operators: update own record"
  ON public.operators FOR UPDATE
  USING (auth.uid() = id);

-- Listings table
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings: public can read live"
  ON public.listings FOR SELECT
  USING (status = 'live');

CREATE POLICY "Listings: operators can read own"
  ON public.listings FOR SELECT
  USING (auth.uid() = operator_id);

CREATE POLICY "Listings: operators can insert"
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = operator_id);

CREATE POLICY "Listings: operators can update own"
  ON public.listings FOR UPDATE
  USING (auth.uid() = operator_id);

-- Amenities: public read
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Amenities: public read"
  ON public.amenities FOR SELECT
  USING (TRUE);

-- Listing amenities: public read of live listings
ALTER TABLE public.listing_amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listing amenities: public read"
  ON public.listing_amenities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_id AND (l.status = 'live' OR l.operator_id = auth.uid())
    )
  );

CREATE POLICY "Listing amenities: operators can manage own"
  ON public.listing_amenities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_id AND l.operator_id = auth.uid()
    )
  );

-- ============================================================
-- Storage: listing-photos bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-photos', 'listing-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Photos: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-photos');

CREATE POLICY "Photos: authenticated upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listing-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Photos: owner update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Photos: owner delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
