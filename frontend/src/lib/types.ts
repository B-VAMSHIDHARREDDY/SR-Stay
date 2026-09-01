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
  contact_phone: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PGListingInput = Omit<PGListing, "id" | "created_at" | "updated_at">;

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

export interface UserProfile {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  gender: Gender | null;
  created_at: string;
}
