"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PgListingForm } from "@/components/admin/pg-listing-form";
import { listAdminPgs, updatePg } from "@/lib/pg-api";
import type { PGListing } from "@/lib/types";

export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const [pg, setPg] = useState<PGListing | null | undefined>(undefined);

  useEffect(() => {
    listAdminPgs().then((all) => {
      setPg(all.find((p) => p.id === params.id) ?? null);
    });
  }, [params.id]);

  if (pg === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-red" aria-hidden="true" />
      </div>
    );
  }

  if (pg === null) {
    return <p className="text-sm text-brand-black/60">Listing not found.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-brand-black">Edit PG Listing</h1>
      <PgListingForm initial={pg} onSubmit={(payload) => updatePg(pg.id, payload)} submitLabel="Save changes" />
    </div>
  );
}
