export type Gender = 'men' | 'women' | 'coed'
export type ListingStatus = 'pending' | 'live' | 'rejected'

export interface Amenity {
  id: number
  name: string
  slug: string
}

export interface Listing {
  id: string
  operator_id: string | null
  name: string
  slug: string
  description: string | null
  address: string
  city: string
  county: string
  state: string
  zip: string
  lat: number
  lng: number
  gender: Gender
  price_min: number | null
  price_max: number | null
  bed_count: number | null
  pet_friendly: boolean
  mat_friendly: boolean
  phone: string | null
  email: string | null
  website: string | null
  house_rules: string | null
  status: ListingStatus
  verified: boolean
  photos: string[]
  created_at: string
  updated_at: string
  amenities?: Amenity[]
}

export interface Operator {
  id: string
  email: string
  name: string | null
  phone: string | null
  is_admin: boolean
  created_at: string
  avatar_url: string | null
  bio: string | null
  location: string | null
  website: string | null
  public_email: string | null
  public_phone: string | null
  updated_at: string
}

export interface ListingWithAmenities extends Listing {
  listing_amenities: { amenities: Amenity }[]
}

export interface FilterState {
  query: string
  gender: string
  county: string
  minPrice: string
  maxPrice: string
  minBeds: string
  petFriendly: boolean
  matFriendly: boolean
}
