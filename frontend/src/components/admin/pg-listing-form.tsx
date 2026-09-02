"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { cities, getCityBySlug } from "@/lib/cities";
import { ApiError } from "@/lib/api";
import { createAmenity } from "@/lib/pg-api";
import { useAmenities } from "@/lib/use-amenities";
import { listOwners } from "@/lib/owner-api";
import type { Gender, Owner, PGListingInput } from "@/lib/types";

const NO_OWNER = "";

const cityOptions = cities.map((c) => ({ value: c.slug, label: c.name }));
const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unisex", label: "Unisex" },
];

function toCsv(values: string[]): string {
  return values.join(", ");
}

function fromCsv(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function PgListingForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Partial<PGListingInput>;
  onSubmit: (payload: PGListingInput) => Promise<unknown>;
  submitLabel: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState(initial?.name ?? "");
  const [city, setCity] = useState(initial?.city ?? cityOptions[0]?.value ?? "");
  const [locality, setLocality] = useState(initial?.locality ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [gender, setGender] = useState<Gender>(initial?.gender ?? "unisex");
  const [priceMonthly, setPriceMonthly] = useState(String(initial?.price_monthly ?? ""));
  const [securityDeposit, setSecurityDeposit] = useState(
    initial?.security_deposit != null ? String(initial.security_deposit) : "",
  );
  const [sharingTypes, setSharingTypes] = useState(toCsv(initial?.sharing_types ?? []));
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? []);
  const [images, setImages] = useState(toCsv(initial?.images ?? []));

  const { amenities: amenityOptions, loading: amenitiesLoading } = useAmenities();
  const [newAmenity, setNewAmenity] = useState("");
  const [addingAmenity, setAddingAmenity] = useState(false);
  const [localAmenityOptions, setLocalAmenityOptions] = useState<string[]>([]);

  const allAmenityNames = useMemo(() => {
    const fromApi = amenityOptions.map((a) => a.name);
    // Selected amenities from `initial` (edit mode) or just-created ones that
    // aren't in the fetched list yet stay selectable/visible too.
    const extra = [...amenities, ...localAmenityOptions].filter((name) => !fromApi.includes(name));
    return [...fromApi, ...extra];
  }, [amenityOptions, amenities, localAmenityOptions]);

  function toggleAmenity(name: string) {
    setAmenities((prev) => (prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]));
  }

  async function handleAddAmenity() {
    const name = newAmenity.trim();
    if (!name) return;
    setAddingAmenity(true);
    try {
      const created = await createAmenity(name);
      setLocalAmenityOptions((prev) => [...prev, created.name]);
      setAmenities((prev) => (prev.includes(created.name) ? prev : [...prev, created.name]));
      setNewAmenity("");
    } catch (err) {
      toast({
        title: "Couldn't add amenity",
        description: err instanceof ApiError ? err.message : undefined,
        variant: "error",
      });
    } finally {
      setAddingAmenity(false);
    }
  }
  const [contactPhone, setContactPhone] = useState(initial?.contact_phone ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [ownerId, setOwnerId] = useState(initial?.owner_id ?? NO_OWNER);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  const [owners, setOwners] = useState<Owner[]>([]);
  useEffect(() => {
    listOwners().then(setOwners).catch(() => {
      // Silent — the owner field just falls back to "No owner assigned".
    });
  }, []);
  const ownerOptions = useMemo(
    () => [{ value: NO_OWNER, label: "No owner assigned" }, ...owners.map((o) => ({ value: o.id, label: `${o.name} (${o.phone})` }))],
    [owners],
  );

  const localityOptions = useMemo(() => {
    const areas = getCityBySlug(city)?.localities ?? [];
    const options = areas.map((area) => ({ value: area, label: area }));
    if (locality && !areas.includes(locality)) {
      options.push({ value: locality, label: `${locality} (custom)` });
    }
    return options;
  }, [city, locality]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        name,
        city,
        locality,
        address,
        gender,
        price_monthly: Number(priceMonthly),
        security_deposit: securityDeposit ? Number(securityDeposit) : null,
        sharing_types: fromCsv(sharingTypes),
        amenities,
        images: fromCsv(images),
        contact_phone: contactPhone,
        description,
        owner_id: ownerId || null,
        is_active: isActive,
      });
      router.push("/admin/listings");
    } catch (err) {
      toast({
        title: "Couldn't save listing",
        description: err instanceof ApiError ? err.message : undefined,
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-8">
      <div className="space-y-4">
        <FormSectionLabel>Basic details</FormSectionLabel>
        <Input label="PG name" required value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="City" options={cityOptions} value={city} onChange={setCity} />
          <Select
            label="Locality"
            searchable
            options={localityOptions}
            value={locality}
            onChange={setLocality}
            placeholder="Select an area"
            emptyMessage="No areas for this city yet"
          />
        </div>
        <Input label="Address" required value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="space-y-4">
        <FormSectionLabel>Pricing & occupancy</FormSectionLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Gender"
            options={genderOptions}
            value={gender}
            onChange={(v) => setGender(v as Gender)}
          />
          <Input
            label="Rent / month (₹)"
            type="number"
            min={1}
            required
            value={priceMonthly}
            onChange={(e) => setPriceMonthly(e.target.value)}
          />
          <Input
            label="Security deposit (₹)"
            type="number"
            min={0}
            value={securityDeposit}
            onChange={(e) => setSecurityDeposit(e.target.value)}
          />
        </div>
        <Input
          label="Sharing types"
          helperText="Comma-separated, e.g. Single, Double, Triple"
          value={sharingTypes}
          onChange={(e) => setSharingTypes(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <FormSectionLabel>Amenities & photos</FormSectionLabel>
        <div>
          <label className="text-label mb-1.5 block font-medium text-brand-black/80">Amenities</label>
          {amenitiesLoading ? (
            <p className="text-sm text-brand-black/45">Loading amenities…</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allAmenityNames.map((name) => {
                const active = amenities.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleAmenity(name)}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                      active
                        ? "border-brand-red bg-brand-red/8 text-brand-red"
                        : "border-border bg-paper text-brand-black/75 hover:border-brand-red/40 hover:text-brand-red",
                    )}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-2.5 flex items-center gap-2">
            <input
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddAmenity();
                }
              }}
              placeholder="Add a new amenity…"
              className="h-9 w-full max-w-56 rounded-lg border border-border bg-paper px-3 text-sm text-brand-black outline-none transition-colors placeholder:text-brand-black/40 focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus className="h-4 w-4" aria-hidden="true" />}
              loading={addingAmenity}
              disabled={!newAmenity.trim()}
              onClick={handleAddAmenity}
            >
              Add
            </Button>
          </div>
        </div>
        <Input
          label="Image URLs"
          helperText="Comma-separated URLs"
          value={images}
          onChange={(e) => setImages(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <FormSectionLabel>Contact & visibility</FormSectionLabel>
        <Input
          label="Contact phone"
          type="tel"
          required
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
        <Select label="Owner" searchable options={ownerOptions} value={ownerId} onChange={setOwnerId} />
        <div className="w-full">
          <label className="text-label mb-1.5 block font-medium text-brand-black/80">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-border bg-paper px-3.5 py-3 text-sm text-brand-black outline-none transition-colors placeholder:text-brand-black/40 focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-brand-black/80">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-brand-red"
          />
          Visible in public search
        </label>
      </div>

      <div className="border-border flex gap-3 border-t pt-6">
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/listings")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function FormSectionLabel({ children }: { children: string }) {
  return (
    <h2 className="text-label border-border border-b pb-2 font-semibold uppercase tracking-wide text-brand-black/40">
      {children}
    </h2>
  );
}
