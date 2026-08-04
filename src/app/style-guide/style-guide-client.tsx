"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  Home,
  LayoutDashboard,
  Loader2,
  MapPin,
  Search,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import { cities } from "@/lib/cities";
import { faqs } from "@/lib/faqs";
import { cn } from "@/lib/cn";
import { DURATION, EASE, staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Accordion } from "@/components/ui/Accordion";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Tabs } from "@/components/ui/Tabs";
import { Tooltip } from "@/components/ui/Tooltip";
import { Table, type Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Sidebar, type SidebarItem } from "@/components/ui/Sidebar";
import { FilterBar, type FilterGroup } from "@/components/ui/FilterBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeImage } from "@/components/ui/FadeImage";

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-b border-border py-12 first:pt-0 last:border-0">
      <h2 className="text-h3 font-extrabold tracking-tight text-brand-black">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm text-brand-black/60">{description}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

const colorSwatches: { name: string; className: string }[] = [
  { name: "brand-red", className: "bg-brand-red" },
  { name: "brand-red-dark", className: "bg-brand-red-dark" },
  { name: "brand-black", className: "bg-brand-black" },
  { name: "success", className: "bg-success" },
  { name: "warning", className: "bg-warning" },
  { name: "error", className: "bg-error" },
  { name: "border", className: "border border-border bg-white" },
  { name: "surface-muted", className: "bg-surface-muted" },
];

interface BookingRow {
  id: number;
  guest: string;
  city: string;
  status: "confirmed" | "pending" | "cancelled";
  rent: string;
}

const bookingRows: BookingRow[] = [
  { id: 1, guest: "Ananya Rao", city: "Bangalore", status: "confirmed", rent: "₹9,500" },
  { id: 2, guest: "Karthik Iyer", city: "Hyderabad", status: "pending", rent: "₹8,200" },
  { id: 3, guest: "Meera Nair", city: "Pune", status: "confirmed", rent: "₹10,000" },
  { id: 4, guest: "Rohan Gupta", city: "Chennai", status: "cancelled", rent: "₹7,800" },
  { id: 5, guest: "Sanya Kapoor", city: "Mumbai", status: "confirmed", rent: "₹12,500" },
  { id: 6, guest: "Vikram Singh", city: "Delhi NCR", status: "pending", rent: "₹9,900" },
  { id: 7, guest: "Ishita Sharma", city: "Bangalore", status: "confirmed", rent: "₹8,700" },
];

const statusVariant: Record<BookingRow["status"], BadgeVariant> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "error",
};

const bookingColumns: Column<BookingRow>[] = [
  { key: "guest", header: "Guest", render: (row) => <span className="font-medium text-brand-black">{row.guest}</span> },
  { key: "city", header: "City", render: (row) => row.city },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={statusVariant[row.status]} className="capitalize">
        {row.status}
      </Badge>
    ),
  },
  { key: "rent", header: "Monthly Rent", render: (row) => row.rent },
];

const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tenants", label: "Tenants", icon: Users },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "settings", label: "Settings", icon: Settings },
];

const filterGroups: FilterGroup[] = [
  {
    id: "city",
    label: "City",
    options: cities.map((c) => ({ value: c.slug, label: c.name })),
  },
  {
    id: "roomType",
    label: "Room Type",
    options: [
      { value: "single", label: "Single Sharing" },
      { value: "double", label: "Double Sharing" },
      { value: "triple", label: "Triple Sharing" },
    ],
  },
  {
    id: "budget",
    label: "Budget",
    options: [
      { value: "under-8k", label: "Under ₹8,000" },
      { value: "8k-12k", label: "₹8,000 – ₹12,000" },
      { value: "12k-plus", label: "₹12,000+" },
    ],
  },
];

export function StyleGuideClient() {
  const { toast } = useToast();

  const [citySelectValue, setCitySelectValue] = useState(cities[0].slug);
  const [prioritySelectValue, setPrioritySelectValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [showEmptyTable, setShowEmptyTable] = useState(false);
  const [page, setPage] = useState(1);
  const [sidebarActive, setSidebarActive] = useState("dashboard");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const pageSize = 3;
  const pageCount = Math.ceil(bookingRows.length / pageSize);
  const pagedRows = bookingRows.slice((page - 1) * pageSize, page * pageSize);

  function simulateLoading() {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 1500);
  }

  function simulateTableLoading() {
    setTableLoading(true);
    setTimeout(() => setTableLoading(false), 1500);
  }

  const faqItems = faqs.slice(0, 4).map((f) => ({ id: f.question, question: f.question, answer: f.answer }));

  const tabItems = [
    { id: "overview", label: "Overview", content: <p className="text-sm text-brand-black/65">High-level summary content lives here.</p> },
    { id: "activity", label: "Activity", content: <p className="text-sm text-brand-black/65">Recent activity content lives here.</p> },
    { id: "settings", label: "Settings", content: <p className="text-sm text-brand-black/65">Settings content lives here.</p> },
  ];

  return (
    <div className="bg-white">
      <div className="border-b border-border bg-surface-muted py-14">
        <div className="container-page">
          <Badge variant="neutral">Internal — not indexed</Badge>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-black sm:text-h1">
            SR Stays Design System
          </h1>
          <p className="text-body mt-3 max-w-2xl text-brand-black/65">
            Living reference for every token and component used across the app — colors, typography, radius,
            elevation, and the full UI component library.
          </p>
        </div>
      </div>

      <div className="container-page">
        <Section id="colors" title="Colors" description="Primary brand palette plus semantic success / warning / error tokens.">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {colorSwatches.map((c) => (
              <div key={c.name}>
                <div className={cn("h-16 rounded-xl", c.className)} />
                <p className="mt-2 text-xs font-medium text-brand-black/70">{c.name}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="typography" title="Typography" description="H1–H4, body, caption, and label scale.">
          <div className="space-y-4">
            <p className="text-4xl font-extrabold text-brand-black sm:text-h1">H1 — Find the Best PG</p>
            <p className="text-3xl font-extrabold text-brand-black sm:text-h2">H2 — Search, Compare & Move In</p>
            <p className="text-h3 font-bold text-brand-black">H3 — Popular Localities</p>
            <p className="text-h4 font-bold text-brand-black">H4 — Verified Listings</p>
            <p className="text-body text-brand-black/80">
              Body — Search verified Paying Guest (PG) accommodations, compare prices, and book your stay.
            </p>
            <p className="text-label font-medium text-brand-black/80">Label — City / Locality</p>
            <p className="text-caption text-brand-black/55">Caption — 10,000+ verified PGs across India</p>
          </div>
        </Section>

        <Section
          id="motion"
          title="Motion"
          description="Every animation in the app shares this timing and easing — fade, slide, and slight-scale only. Motion's reducedMotion=&quot;user&quot; (set app-wide in the root layout) automatically disables transform-based motion for anyone with prefers-reduced-motion enabled, and page transitions/list reveals below only fire on real navigation and scroll, not in this static preview."
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-label mb-3 font-semibold text-brand-black/70">Duration &amp; easing tokens</p>
              <div className="space-y-1.5 rounded-2xl border border-border bg-surface-muted p-4 font-mono text-xs text-brand-black/70">
                <p>fast · {DURATION.fast * 1000}ms</p>
                <p>base · {DURATION.base * 1000}ms</p>
                <p>slow · {DURATION.slow * 1000}ms</p>
                <p>ease · cubic-bezier({EASE.join(", ")})</p>
              </div>
            </div>
            <div>
              <p className="text-label mb-3 font-semibold text-brand-black/70">Fade-in image loading</p>
              <FadeImage
                src="/logo-icon.png"
                alt=""
                width={96}
                height={96}
                className="rounded-2xl border border-border"
                wrapperClassName="block w-fit"
              />
            </div>
          </div>

          <p className="text-label mt-8 mb-3 font-semibold text-brand-black/70">
            Scroll-reveal stagger — scroll this into view to trigger it
          </p>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
            className="grid gap-4 sm:grid-cols-4"
          >
            {[1, 2, 3, 4].map((i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card padding="sm" className="text-center">
                  <p className="text-sm font-semibold text-brand-black">Item {i}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        <Section id="buttons" title="Buttons" description="Six variants × three sizes, with loading and disabled states.">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-brand-black p-4">
              <Button variant="outline-inverse">Outline Inverse</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button loading={buttonLoading} onClick={simulateLoading}>
                {buttonLoading ? "Loading…" : "Click to load"}
              </Button>
              <Button disabled>Disabled</Button>
              <Button href="/#hero" icon={<Search className="h-4 w-4" />}>
                As a Link
              </Button>
            </div>
          </div>
        </Section>

        <Section id="badges" title="Badges">
          <div className="flex flex-wrap gap-3">
            <Badge variant="brand">Brand</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </Section>

        <Section id="cards" title="Cards" description="One radius/padding/shadow definition, with an optional hover lift.">
          <div className="grid gap-5 sm:grid-cols-3">
            <Card hover>
              <p className="font-bold text-brand-black">Static Card</p>
              <p className="mt-1.5 text-sm text-brand-black/60">Hover to see the elevation change.</p>
            </Card>
            <Card hover padding="lg">
              <p className="font-bold text-brand-black">Larger Padding</p>
              <p className="mt-1.5 text-sm text-brand-black/60">padding=&quot;lg&quot;</p>
            </Card>
            <Card tone="dark" className="bg-brand-black text-white">
              <p className="font-bold">Dark Tone</p>
              <p className="mt-1.5 text-sm text-white/60">tone=&quot;dark&quot;</p>
            </Card>
          </div>
        </Section>

        <Section id="inputs" title="Inputs" description="Text, email, password, search, number, and date variants.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Full Name" placeholder="Ananya Rao" required />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <Input label="Search" type="search" icon={<Search className="h-4 w-4" />} placeholder="Search PGs…" />
            <Input label="Budget (₹)" type="number" placeholder="9000" />
            <Input label="Move-in Date" type="date" />
            <Input label="With Error" defaultValue="invalid@" error="Please enter a valid email address" />
            <Input label="Disabled" disabled placeholder="Not editable" />
          </div>
        </Section>

        <Section id="select" title="Select / Dropdown" description="Replaces the native browser select — keyboard nav, search, floating panel.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="City (searchable)"
              searchable
              leadingIcon={<MapPin className="h-4 w-4" />}
              options={cities.map((c) => ({ value: c.slug, label: c.name }))}
              value={citySelectValue}
              onChange={setCitySelectValue}
            />
            <Select
              label="Priority"
              placeholder="Choose priority"
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
              value={prioritySelectValue}
              onChange={setPrioritySelectValue}
            />
          </div>
        </Section>

        <Section id="accordion" title="Accordion" description="Animated open/close, replaces the native <details> FAQ markup.">
          <Accordion items={faqItems} defaultOpenId={faqItems[0]?.id} className="max-w-2xl" />
        </Section>

        <Section id="tabs" title="Tabs" description="Roving-tabindex keyboard navigation with arrow keys.">
          <Tabs items={tabItems} className="max-w-md" />
        </Section>

        <Section id="tooltip" title="Tooltip" description="Hover or focus triggered, with a short show delay.">
          <Tooltip content="Zero brokerage, always">
            <Button variant="outline">Hover or focus me</Button>
          </Tooltip>
        </Section>

        <Section id="modal" title="Modal" description="Focus-trapped dialog with enter/exit animation and Escape-to-close.">
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="List Your PG"
            description="Tell us a bit about your property and we'll get back within 24 hours."
          >
            <div className="space-y-4">
              <Input label="Property Name" placeholder="Sunrise PG" />
              <Input label="Contact Number" type="tel" placeholder="+91 98765 43210" />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setModalOpen(false);
                    toast({ title: "Submitted", description: "We'll be in touch shortly.", variant: "success" });
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Modal>
        </Section>

        <Section id="toast" title="Toast Notifications">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="success"
              onClick={() => toast({ title: "Booking confirmed", variant: "success" })}
            >
              Success
            </Button>
            <Button
              variant="outline"
              onClick={() => toast({ title: "Payment pending", description: "Complete payment within 24 hours.", variant: "warning" })}
            >
              Warning
            </Button>
            <Button
              variant="danger"
              onClick={() => toast({ title: "Booking failed", description: "Please try again.", variant: "error" })}
            >
              Error
            </Button>
            <Button
              variant="secondary"
              onClick={() => toast({ title: "New enquiry received", variant: "info" })}
            >
              Info
            </Button>
          </div>
        </Section>

        <Section id="table" title="Table & Pagination" description="Sticky header, hover rows, skeleton loading, and empty state.">
          <div className="mb-4 flex flex-wrap gap-3">
            <Button size="sm" variant="outline" onClick={simulateTableLoading} icon={<Loader2 className="h-4 w-4" />}>
              Simulate Loading
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowEmptyTable((v) => !v)}>
              {showEmptyTable ? "Show Sample Data" : "Show Empty State"}
            </Button>
          </div>
          <Table
            columns={bookingColumns}
            data={showEmptyTable ? [] : pagedRows}
            loading={tableLoading}
            emptyTitle="No bookings yet"
            emptyDescription="New bookings will show up here as soon as they come in."
          />
          {!showEmptyTable && (
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} className="mt-4" />
          )}
        </Section>

        <Section id="sidebar" title="Sidebar" description="Active indicator, collapse animation, and a mobile drawer.">
          <div className="flex h-96 overflow-hidden rounded-2xl border border-border">
            <Sidebar
              items={sidebarItems}
              activeId={sidebarActive}
              onSelect={setSidebarActive}
              header={
                <span className="flex items-center gap-2 font-bold text-brand-black">
                  <Home className="h-4 w-4 text-brand-red" aria-hidden="true" />
                  Owner Panel
                </span>
              }
            />
            <div className="flex-1 bg-surface-muted p-6">
              <p className="text-sm text-brand-black/60">
                Active section: <span className="font-semibold text-brand-black">{sidebarActive}</span>
              </p>
              <p className="mt-2 text-xs text-brand-black/45">
                Resize below the lg breakpoint, or use the menu button, to see the mobile drawer.
              </p>
            </div>
          </div>
        </Section>

        <Section id="filters" title="Filter Bar" description="Filter chips with active-filter badges and a mobile filter sheet.">
          <FilterBar groups={filterGroups} values={filterValues} onChange={(id, v) => setFilterValues((prev) => ({ ...prev, [id]: v }))} />
        </Section>

        <Section id="loading-empty" title="Loading & Empty States" description="Shimmer skeletons and a consistent empty-state pattern.">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
            <div className="rounded-2xl border border-border">
              <EmptyState
                title="No PGs found"
                description="Try adjusting your filters or search a different locality."
                action={{ label: "Clear Filters", onClick: () => setFilterValues({}) }}
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
