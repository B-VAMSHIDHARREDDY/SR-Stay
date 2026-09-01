"use client";

import { PgListingForm } from "@/components/admin/pg-listing-form";
import { createPg } from "@/lib/pg-api";

export default function NewListingPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-brand-black">Add PG Listing</h1>
      <PgListingForm onSubmit={createPg} submitLabel="Create listing" />
    </div>
  );
}
