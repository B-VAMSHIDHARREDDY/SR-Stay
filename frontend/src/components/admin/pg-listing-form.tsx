"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cities, getCityBySlug } from "@/lib/cities";
import { ApiError } from "@/lib/api";
import type { Gender, PGListingInput } from "@/lib/types";

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
  const [amenities, setAmenities] = useState(toCsv(initial?.amenities ?? []));
  const [images, setImages] = useState(toCsv(initial?.images ?? []));
  const [contactPhone, setContactPhone] = useState(initial?.contact_phone ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

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
        amenities: fromCsv(amenities),
        images: fromCsv(images),
        contact_phone: contactPhone,
        description,
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
        <Input
          label="Amenities"
          helperText="Comma-separated, e.g. WiFi, Food, Laundry, AC"
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
        />
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
