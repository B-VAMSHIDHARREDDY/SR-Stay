"use client";

import { IndianRupee, MapPin, MessageCircle, Phone, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { PGListing } from "@/lib/types";

export function whatsappHref(number: string): string {
  const digits = number.replace(/\D/g, "");
  const withCountryCode = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${withCountryCode}`;
}

export function PgCard({
  pg,
  cityName,
  onOpen,
}: {
  pg: PGListing;
  cityName: string;
  onOpen: (pg: PGListing) => void;
}) {
  return (
    <Card
      hover
      padding="sm"
      className="flex h-full cursor-pointer flex-col"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(pg)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(pg);
        }
      }}
      aria-label={`View details for ${pg.name}`}
    >
      <div
        className="relative h-32 w-full rounded-xl bg-gradient-ember-soft bg-cover bg-center"
        style={pg.images[0] ? { backgroundImage: `url(${pg.images[0]})` } : undefined}
      >
        {pg.images.length > 1 && (
          <span className="absolute right-2 bottom-2 rounded-full bg-brand-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">
            +{pg.images.length - 1} photos
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-2">
        <p className="font-display font-semibold text-brand-black">{pg.name}</p>
        <Badge variant="neutral" className="shrink-0 capitalize">
          {pg.gender}
        </Badge>
      </div>
      <p className="mt-1 flex items-center gap-1 text-sm text-brand-black/55">
        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {pg.locality}, {cityName}
      </p>

      {pg.amenities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pg.amenities.slice(0, 4).map((a) => (
            <Badge key={a} variant="brand" className="!px-2 !py-1 text-[11px]">
              {a}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-black/8 pt-3">
        <p className="flex items-center font-display font-semibold text-brand-black">
          <IndianRupee className="h-3.5 w-3.5" aria-hidden="true" />
          {pg.price_monthly.toLocaleString("en-IN")}
          <span className="ml-1 text-xs font-normal text-brand-black/50">/mo</span>
        </p>
        {pg.sharing_types.length > 0 && (
          <span className="flex items-center gap-1 text-xs text-brand-black/50">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {pg.sharing_types.join(" / ")}
          </span>
        )}
      </div>

      {pg.owner_public_phone ? (
        <div className="mt-3 flex items-center gap-2">
          <a
            href={`tel:${pg.owner_public_phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-ember py-2.5 text-sm font-semibold text-white shadow-glow-red transition-[filter] hover:brightness-110"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            Call
          </a>
          <a
            href={whatsappHref(pg.owner_whatsapp_phone ?? pg.owner_public_phone)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Contact owner on WhatsApp"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-success/25 bg-success/8 text-success-dark transition-colors hover:bg-success/15"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      ) : (
        <p className="mt-3 rounded-full bg-black/5 py-2.5 text-center text-sm font-medium text-brand-black/40">
          Contact info coming soon
        </p>
      )}
    </Card>
  );
}
