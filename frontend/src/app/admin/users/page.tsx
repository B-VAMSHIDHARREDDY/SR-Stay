"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, type Column } from "@/components/ui/Table";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { listUsers } from "@/lib/users-api";
import { ApiError } from "@/lib/api";
import type { UserProfile } from "@/lib/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((err) => {
        toast({ title: "Couldn't load users", description: err instanceof ApiError ? err.message : undefined, variant: "error" });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: Column<UserProfile>[] = [
    { key: "phone", header: "Phone", render: (u) => <span className="font-semibold text-brand-black">{u.phone}</span> },
    { key: "name", header: "Name", render: (u) => u.name ?? <span className="text-brand-black/35">—</span> },
    { key: "email", header: "Email", render: (u) => u.email ?? <span className="text-brand-black/35">—</span> },
    { key: "gender", header: "Gender", render: (u) => (u.gender ? <Badge variant="neutral">{u.gender}</Badge> : <span className="text-brand-black/35">—</span>) },
    { key: "joined", header: "Joined", render: (u) => formatDate(u.created_at) },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-brand-black">Users</h1>
      <p className="mt-1 text-sm text-brand-black/55">People who&apos;ve signed in on the app — read-only for now.</p>

      {/* Mobile: card list */}
      <div className="mt-6 space-y-3 sm:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="md">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-2.5 h-3.5 w-1/2" />
            </Card>
          ))
        ) : users.length === 0 ? (
          <Card padding="lg">
            <EmptyState title="No users yet" description="Registered app users will show up here." />
          </Card>
        ) : (
          users.map((u) => (
            <Card key={u.id} padding="md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-brand-black">{u.phone}</p>
                  <p className="mt-0.5 truncate text-sm text-brand-black/55">{u.name ?? "No name yet"}</p>
                </div>
                {u.gender && <Badge variant="neutral">{u.gender}</Badge>}
              </div>
              <p className="mt-3 text-xs text-brand-black/45">Joined {formatDate(u.created_at)}</p>
            </Card>
          ))
        )}
      </div>

      {/* Desktop: table */}
      <div className="mt-6 hidden sm:block">
        <Table columns={columns} data={users} loading={loading} emptyTitle="No users yet" emptyDescription="Registered app users will show up here." />
      </div>
    </div>
  );
}
