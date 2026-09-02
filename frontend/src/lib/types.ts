export type Gender = "male" | "female" | "unisex";

export interface PGListing {
  id: string;
  name: string;
  city: string;
  locality: string;
  address: string;
  gender: Gender;
  price_monthly: number;
  security_deposit: number | null;
  sharing_types: string[];
  amenities: string[];
  images: string[];
  description: string;
  owner_id: string | null;
  /** Computed from the linked owner's phone numbers — never sent, only returned. */
  owner_public_phone: string | null;
  owner_whatsapp_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PGListingInput = Omit<
  PGListing,
  "id" | "created_at" | "updated_at" | "owner_public_phone" | "owner_whatsapp_phone"
>;

export interface PGSearchResponse {
  items: PGListing[];
  total: number;
  page: number;
  page_size: number;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export interface Amenity {
  id: string;
  name: string;
}

/** Not a closed union at the API layer (the DB column is a plain string so
 * new types need no migration) — kept as a union here because the admin UI
 * only exposes these three today. Extend alongside the backend's PhoneType. */
export type PhoneType = "public" | "whatsapp" | "private";

export interface OwnerPhoneNumber {
  id: string;
  type: PhoneType;
  number: string;
}

export interface OwnerPhoneNumberInput {
  type: PhoneType;
  number: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string | null;
  notes: string;
  pg_count: number;
  phone_numbers: OwnerPhoneNumber[];
  created_at: string;
  updated_at: string;
}

export interface OwnerInput {
  name: string;
  email: string | null;
  notes: string;
  phone_numbers: OwnerPhoneNumberInput[];
}

export interface UserProfile {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  gender: Gender | null;
  created_at: string;
}
