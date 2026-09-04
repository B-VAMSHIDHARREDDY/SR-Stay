"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Home, IndianRupee, MapPin, MessageCircle, Phone, Users } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { whatsappHref } from "@/components/pg-card";
import type { PGListing } from "@/lib/types";

export function PgDetailModal({
  pg,
  cityName,
  onClose,
}: {
  pg: PGListing | null;
  cityName: string;
  onClose: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveImage(0);
  }, [pg?.id]);

  const images = pg?.images ?? [];

  function prevImage() {
    setActiveImage((i) => (i - 1 + images.length) % images.length);
  }

  function nextImage() {
    setActiveImage((i) => (i + 1) % images.length);
  }

  return (
    <Modal open={!!pg} onClose={onClose} title={pg?.name ?? ""} size="lg">
      {pg && (
        <div className="space-y-5">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gradient-ember-soft sm:h-80">
            {images.length > 0 ? (
              <img
                src={images[activeImage]}
                alt={`${pg.name} — photo ${activeImage + 1} of ${images.length}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-brand-red">
                <Home className="h-12 w-12" aria-hidden="true" />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-black/50 text-white transition-colors hover:bg-brand-black/70"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-black/50 text-white transition-colors hover:bg-brand-black/70"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
                <span className="absolute bottom-3 right-3 rounded-full bg-brand-black/60 px-2.5 py-1 text-xs font-semibold text-white">
                  {activeImage + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="ui-scrollbar flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === activeImage}
                  className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === activeImage ? "border-brand-red" : "border-transparent hover:border-black/15"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-sm text-brand-black/55">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                {pg.locality}, {cityName}
              </p>
              <p className="mt-1 text-xs text-brand-black/45">{pg.address}</p>
            </div>
            <Badge variant="neutral" className="shrink-0 capitalize">
              {pg.gender}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-surface-muted p-4">
            <p className="flex items-center font-display text-xl font-semibold text-brand-black">
              <IndianRupee className="h-4 w-4" aria-hidden="true" />
              {pg.price_monthly.toLocaleString("en-IN")}
              <span className="ml-1 text-sm font-normal text-brand-black/50">/mo</span>
            </p>
            {pg.security_deposit != null && (
              <p className="text-sm text-brand-black/60">
                Deposit: <span className="font-semibold text-brand-black">₹{pg.security_deposit.toLocaleString("en-IN")}</span>
              </p>
            )}
            {pg.sharing_types.length > 0 && (
              <span className="flex items-center gap-1.5 text-sm text-brand-black/60">
                <Users className="h-4 w-4" aria-hidden="true" />
                {pg.sharing_types.join(" / ")}
              </span>
            )}
          </div>

          {pg.amenities.length > 0 && (
            <div>
              <p className="text-label mb-2 font-semibold uppercase tracking-wide text-brand-black/50">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {pg.amenities.map((a) => (
                  <Badge key={a} variant="brand">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {pg.description && (
            <div>
              <p className="text-label mb-1.5 font-semibold uppercase tracking-wide text-brand-black/50">About this PG</p>
              <p className="text-sm leading-relaxed text-brand-black/70">{pg.description}</p>
            </div>
          )}

          {pg.owner_public_phone ? (
            <div className="flex items-center gap-3 border-t border-border pt-4">
              <a
                href={`tel:${pg.owner_public_phone}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-ember py-3 text-sm font-semibold text-white shadow-glow-red transition-[filter] hover:brightness-110"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call Owner
              </a>
              <a
                href={whatsappHref(pg.owner_whatsapp_phone ?? pg.owner_public_phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-success/25 bg-success/8 py-3 text-sm font-semibold text-success-dark transition-colors hover:bg-success/15"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          ) : (
            <p className="rounded-full bg-black/5 py-3 text-center text-sm font-medium text-brand-black/40">
              Contact info coming soon
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
