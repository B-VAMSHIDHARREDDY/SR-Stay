"use client";

import { useEffect, useState } from "react";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { deletePg, listAdminPgs, updatePg } from "@/lib/pg-api";
import { ApiError } from "@/lib/api";
import type { PGListing } from "@/lib/types";

export default function AdminListingsPage() {
  const { toast } = useToast();
  const [pgs, setPgs] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<PGListing | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setPgs(await listAdminPgs());
    } catch (err) {
      toast({ title: "Couldn't load listings", description: err instanceof ApiError ? err.message : undefined, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggleActive(pg: PGListing) {
    try {
      const updated = await updatePg(pg.id, { is_active: !pg.is_active });
      setPgs((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      toast({ title: "Update failed", description: err instanceof ApiError ? err.message : undefined, variant: "error" });
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deletePg(pendingDelete.id);
      setPgs((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      toast({ title: "Listing deleted", variant: "success" });
    } catch (err) {
      toast({ title: "Delete failed", description: err instanceof ApiError ? err.message : undefined, variant: "error" });
    } finally {
      setPendingDelete(null);
    }
  }

  const columns: Column<PGListing>[] = [
    { key: "name", header: "Name", render: (pg) => <span className="font-semibold text-brand-black">{pg.name}</span> },
    { key: "location", header: "Location", render: (pg) => `${pg.locality}, ${pg.city}` },
    { key: "price", header: "Rent / mo", render: (pg) => `₹${pg.price_monthly.toLocaleString("en-IN")}` },
    { key: "gender", header: "Gender", render: (pg) => <Badge variant="neutral">{pg.gender}</Badge> },
    {
      key: "status",
      header: "Status",
      render: (pg) => (
        <button onClick={() => handleToggleActive(pg)}>
          <Badge variant={pg.is_active ? "success" : "neutral"}>{pg.is_active ? "Active" : "Hidden"}</Badge>
        </button>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (pg) => (
        <div className="flex items-center gap-2">
          <Button href={`/admin/listings/${pg.id}/edit`} variant="ghost" size="sm" icon={<Pencil className="h-3.5 w-3.5" aria-hidden="true" />}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPendingDelete(pg)}
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
        <h1 className="font-display text-2xl font-semibold tracking-tight text-brand-black">PG Listings</h1>
        <Button href="/admin/listings/new" icon={<PlusCircle className="h-4 w-4" aria-hidden="true" />}>
          Add PG Listing
        </Button>
      </div>

      {/* Mobile: card list — a 6-column table doesn't fit a phone viewport */}
      <div className="mt-6 space-y-3 sm:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="md">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-2.5 h-3.5 w-1/2" />
            </Card>
          ))
        ) : pgs.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              title="No PG listings yet"
              description="Add your first listing to have it show up in search."
            />
          </Card>
        ) : (
          pgs.map((pg) => (
            <Card key={pg.id} padding="md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-brand-black">{pg.name}</p>
                  <p className="mt-0.5 truncate text-sm text-brand-black/55">
                    {pg.locality}, {pg.city}
                  </p>
                </div>
                <button type="button" onClick={() => handleToggleActive(pg)} className="shrink-0">
                  <Badge variant={pg.is_active ? "success" : "neutral"}>{pg.is_active ? "Active" : "Hidden"}</Badge>
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="neutral">{pg.gender}</Badge>
                <span className="text-sm font-semibold text-brand-black">
                  ₹{pg.price_monthly.toLocaleString("en-IN")}/mo
                </span>
              </div>
              <div className="border-border mt-3 flex gap-2 border-t pt-3">
                <Button
                  href={`/admin/listings/${pg.id}/edit`}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  icon={<Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-error hover:bg-error/8"
                  onClick={() => setPendingDelete(pg)}
                  icon={<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Desktop / tablet: data table */}
      <div className="mt-6 hidden sm:block">
        <Table
          columns={columns}
          data={pgs}
          loading={loading}
          emptyTitle="No PG listings yet"
          emptyDescription="Add your first listing to have it show up in search."
        />
      </div>

      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete this listing?"
        description={pendingDelete ? `"${pendingDelete.name}" will be permanently removed.` : undefined}
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
