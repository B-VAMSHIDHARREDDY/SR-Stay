"use client";

import { useEffect, useState } from "react";
import { Briefcase, Building2, CheckCircle2, PlusCircle, Users as UsersIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { listAdminPgs } from "@/lib/pg-api";
import { listOwners } from "@/lib/owner-api";
import { listUsers } from "@/lib/users-api";
import type { PGListing } from "@/lib/types";

export default function AdminDashboardPage() {
  const [pgs, setPgs] = useState<PGListing[] | null>(null);
  const [ownerCount, setOwnerCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    listAdminPgs().then(setPgs);
    listOwners().then((owners) => setOwnerCount(owners.length));
    listUsers().then((users) => setUserCount(users.length));
  }, []);

  const total = pgs?.length ?? null;
  const active = pgs?.filter((p) => p.is_active).length ?? null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-brand-black">Dashboard</h1>
        <Button href="/admin/listings/new" icon={<PlusCircle className="h-4 w-4" aria-hidden="true" />}>
          Add PG Listing
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-ember-soft text-brand-red">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-brand-black/55">Total listings</p>
              {total === null ? (
                <Skeleton className="mt-1 h-7 w-12" />
              ) : (
                <p className="font-display text-2xl font-semibold text-brand-black">{total}</p>
              )}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success-dark">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-brand-black/55">Active listings</p>
              {active === null ? (
                <Skeleton className="mt-1 h-7 w-12" />
              ) : (
                <p className="font-display text-2xl font-semibold text-brand-black">{active}</p>
              )}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-ember-soft text-brand-red">
              <Briefcase className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-brand-black/55">Owners</p>
              {ownerCount === null ? (
                <Skeleton className="mt-1 h-7 w-12" />
              ) : (
                <p className="font-display text-2xl font-semibold text-brand-black">{ownerCount}</p>
              )}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success-dark">
              <UsersIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-brand-black/55">Users</p>
              {userCount === null ? (
                <Skeleton className="mt-1 h-7 w-12" />
              ) : (
                <p className="font-display text-2xl font-semibold text-brand-black">{userCount}</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
