"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Building2, MessageCircle, Pencil, Phone, PlusCircle, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table, type Column } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { createOwner, deleteOwner, listOwners, updateOwner } from "@/lib/owner-api";
import { ApiError } from "@/lib/api";
import type { Owner, OwnerPhoneNumberInput } from "@/lib/types";

const PHONE_PATTERN = /^\d{10}$/;

const EMPTY_FORM = { name: "", email: "", notes: "", publicPhone: "", whatsappPhone: "", privatePhone: "" };
type FormState = typeof EMPTY_FORM;
type FormErrors = Partial<Record<keyof FormState, string>>;

function ownerPhone(owner: Owner, type: "public" | "whatsapp" | "private"): string | undefined {
  return owner.phone_numbers.find((p) => p.type === type)?.number;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.publicPhone.trim()) {
    errors.publicPhone = "Public phone is required";
  } else if (!PHONE_PATTERN.test(form.publicPhone.trim())) {
    errors.publicPhone = "Enter a valid 10-digit number";
  }
  if (form.whatsappPhone.trim() && !PHONE_PATTERN.test(form.whatsappPhone.trim())) {
    errors.whatsappPhone = "Enter a valid 10-digit number";
  }
  if (form.privatePhone.trim() && !PHONE_PATTERN.test(form.privatePhone.trim())) {
    errors.privatePhone = "Enter a valid 10-digit number";
  }
  if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  return errors;
}

export default function AdminOwnersPage() {
  const { toast } = useToast();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editing, setEditing] = useState<Owner | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Owner | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function refresh() {
    setLoading(true);
    setLoadError(false);
    try {
      setOwners(await listOwners());
    } catch (err) {
      setLoadError(true);
      toast({ title: "Couldn't load owners", description: err instanceof ApiError ? err.message : undefined, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setFormOpen(true);
  }

  function openEdit(owner: Owner) {
    setEditing(owner);
    setForm({
      name: owner.name,
      email: owner.email ?? "",
      notes: owner.notes,
      publicPhone: ownerPhone(owner, "public") ?? "",
      whatsappPhone: ownerPhone(owner, "whatsapp") ?? "",
      privatePhone: ownerPhone(owner, "private") ?? "",
    });
    setErrors({});
    setFormOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const phone_numbers: OwnerPhoneNumberInput[] = [{ type: "public", number: form.publicPhone.trim() }];
    if (form.whatsappPhone.trim()) phone_numbers.push({ type: "whatsapp", number: form.whatsappPhone.trim() });
    if (form.privatePhone.trim()) phone_numbers.push({ type: "private", number: form.privatePhone.trim() });

    const payload = { name: form.name.trim(), email: form.email.trim() || null, notes: form.notes.trim(), phone_numbers };

    setSubmitting(true);
    try {
      if (editing) {
        const updated = await updateOwner(editing.id, payload);
        setOwners((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        toast({ title: "Owner updated", variant: "success" });
      } else {
        const created = await createOwner(payload);
        setOwners((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
        toast({ title: "Owner added", variant: "success" });
      }
      setFormOpen(false);
    } catch (err) {
      toast({
        title: editing ? "Couldn't update owner" : "Couldn't add owner",
        description: err instanceof ApiError ? err.message : undefined,
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteOwner(pendingDelete.id);
      setOwners((prev) => prev.filter((o) => o.id !== pendingDelete.id));
      toast({ title: "Owner deleted", variant: "success" });
      setPendingDelete(null);
    } catch (err) {
      toast({ title: "Delete failed", description: err instanceof ApiError ? err.message : undefined, variant: "error" });
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Owner>[] = [
    { key: "name", header: "Name", render: (o) => <span className="font-semibold text-brand-black">{o.name}</span> },
    { key: "phone", header: "Public phone", render: (o) => ownerPhone(o, "public") ?? <span className="text-brand-black/35">—</span> },
    {
      key: "whatsapp",
      header: "WhatsApp",
      render: (o) =>
        ownerPhone(o, "whatsapp") ? (
          <span className="inline-flex items-center gap-1.5 text-brand-black/70">
            <MessageCircle className="h-3.5 w-3.5 text-success-dark" aria-hidden="true" />
            {ownerPhone(o, "whatsapp")}
          </span>
        ) : (
          <span className="text-brand-black/35">—</span>
        ),
    },
    { key: "email", header: "Email", render: (o) => o.email ?? <span className="text-brand-black/35">—</span> },
    {
      key: "pgs",
      header: "PGs",
      render: (o) => (
        <span className="inline-flex items-center gap-1.5 text-brand-black/70">
          <Building2 className="h-3.5 w-3.5 text-brand-black/35" aria-hidden="true" />
          {o.pg_count}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (o) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(o)} icon={<Pencil className="h-3.5 w-3.5" aria-hidden="true" />}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPendingDelete(o)}
            icon={<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
            className="text-error hover:bg-error/8"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-brand-black">Owners</h1>
        <Button onClick={openCreate} icon={<PlusCircle className="h-4 w-4" aria-hidden="true" />}>
          Add Owner
        </Button>
      </div>

      {loadError && !loading ? (
        <Card padding="lg" className="mt-6">
          <EmptyState
            title="Couldn't load owners"
            description="We're having trouble reaching our servers. Please check your connection and try again."
            action={{ label: "Try again", onClick: refresh }}
          />
        </Card>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="mt-6 space-y-3 sm:hidden">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} padding="md">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="mt-2.5 h-3.5 w-1/2" />
                </Card>
              ))
            ) : owners.length === 0 ? (
              <Card padding="lg">
                <EmptyState title="No owners yet" description="Add a PG owner to start linking listings to them." />
              </Card>
            ) : (
              owners.map((o) => (
                <Card key={o.id} padding="md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-brand-black">{o.name}</p>
                      <p className="mt-0.5 truncate text-sm text-brand-black/55">{ownerPhone(o, "public") ?? "No phone yet"}</p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-brand-black/50">
                      {o.pg_count} PG{o.pg_count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="border-border mt-3 flex gap-2 border-t pt-3">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(o)} icon={<Pencil className="h-3.5 w-3.5" aria-hidden="true" />}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-error hover:bg-error/8"
                      onClick={() => setPendingDelete(o)}
                      icon={<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Desktop: table */}
          <div className="mt-6 hidden sm:block">
            <Table columns={columns} data={owners} loading={loading} emptyTitle="No owners yet" emptyDescription="Add a PG owner to start linking listings to them." />
          </div>
        </>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit owner" : "Add owner"} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input label="Name" required value={form.name} error={errors.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />

          <div className="space-y-3 rounded-2xl border border-border bg-surface-muted p-3.5">
            <p className="text-label font-semibold uppercase tracking-wide text-brand-black/50">Phone numbers</p>
            <Input
              label="Public phone"
              helperText="Shown on the PG's page and used for WhatsApp contact by default"
              type="tel"
              required
              icon={<Phone className="h-4 w-4" aria-hidden="true" />}
              value={form.publicPhone}
              error={errors.publicPhone}
              onChange={(e) => setForm((f) => ({ ...f, publicPhone: e.target.value }))}
            />
            <Input
              label="WhatsApp phone"
              helperText="Optional — only if different from the public number"
              type="tel"
              icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}
              value={form.whatsappPhone}
              error={errors.whatsappPhone}
              onChange={(e) => setForm((f) => ({ ...f, whatsappPhone: e.target.value }))}
            />
            <Input
              label="Private phone"
              helperText="Never shown publicly — for internal/future use only"
              type="tel"
              icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
              value={form.privatePhone}
              error={errors.privatePhone}
              onChange={(e) => setForm((f) => ({ ...f, privatePhone: e.target.value }))}
            />
          </div>

          <div className="w-full">
            <label className="text-label mb-1.5 block font-medium text-brand-black/80">Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="w-full rounded-xl border border-border bg-paper px-3.5 py-3 text-sm text-brand-black outline-none transition-colors placeholder:text-brand-black/40 focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editing ? "Save changes" : "Add owner"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!pendingDelete}
        onClose={() => (deleting ? null : setPendingDelete(null))}
        title="Delete this owner?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" will be removed. ${pendingDelete.pg_count > 0 ? `Their ${pendingDelete.pg_count} linked PG listing${pendingDelete.pg_count === 1 ? "" : "s"} will become unassigned, not deleted.` : ""}`
            : undefined
        }
      >
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setPendingDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
