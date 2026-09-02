"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Building2, Pencil, PlusCircle, Trash2 } from "lucide-react";
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
import type { Owner } from "@/lib/types";

const EMPTY_FORM = { name: "", phone: "", email: "", notes: "" };

export default function AdminOwnersPage() {
  const { toast } = useToast();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Owner | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Owner | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setOwners(await listOwners());
    } catch (err) {
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
    setFormOpen(true);
  }

  function openEdit(owner: Owner) {
    setEditing(owner);
    setForm({ name: owner.name, phone: owner.phone, email: owner.email ?? "", notes: owner.notes });
    setFormOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const payload = { name: form.name, phone: form.phone, email: form.email || null, notes: form.notes };
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
    try {
      await deleteOwner(pendingDelete.id);
      setOwners((prev) => prev.filter((o) => o.id !== pendingDelete.id));
      toast({ title: "Owner deleted", variant: "success" });
    } catch (err) {
      toast({ title: "Delete failed", description: err instanceof ApiError ? err.message : undefined, variant: "error" });
    } finally {
      setPendingDelete(null);
    }
  }

  const columns: Column<Owner>[] = [
    { key: "name", header: "Name", render: (o) => <span className="font-semibold text-brand-black">{o.name}</span> },
    { key: "phone", header: "Phone", render: (o) => o.phone },
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
                  <p className="mt-0.5 truncate text-sm text-brand-black/55">{o.phone}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-brand-black/50">{o.pg_count} PG{o.pg_count === 1 ? "" : "s"}</span>
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

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit owner" : "Add owner"} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input label="Phone" type="tel" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
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
        onClose={() => setPendingDelete(null)}
        title="Delete this owner?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" will be removed. ${pendingDelete.pg_count > 0 ? `Their ${pendingDelete.pg_count} linked PG listing${pendingDelete.pg_count === 1 ? "" : "s"} will become unassigned, not deleted.` : ""}`
            : undefined
        }
      >
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
