"use client";

import { useState, useEffect } from "react";
import useCouponService from "../../../services/coupon/index";
import type { Coupon, CreateCouponPayload } from "../../../services/coupon//types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveStatus(coupon: Coupon): "Active" | "Expired" | "Paused" {
  if (!coupon.isActive) return "Paused";
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return "Expired";
  return "Active";
}

function formatValue(coupon: Coupon): string {
  const val = coupon.value ?? 0;
  return coupon.type === "percentage"
    ? `${val}%`
    : `PKR ${val.toLocaleString()}`;
}

function formatExpiry(expiresAt?: string): string {
  if (!expiresAt) return "∞ No limit";
  return new Date(expiresAt).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTERS = ["All", "Active", "Expired", "Paused", "Percentage", "Fixed"];

const STATUS_STYLES = {
  Active:  { pill: "bg-[#eaf3de] text-[#3b6d11]", dot: "bg-[#639922]" },
  Expired: { pill: "bg-[#fcebeb] text-[#a32d2d]", dot: "bg-[#e24b4a]" },
  Paused:  { pill: "bg-[#faeeda] text-[#854f0b]", dot: "bg-[#ef9f27]" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">
      {children}
    </p>
  );
}

function StatusPill({ status }: { status: "Active" | "Expired" | "Paused" }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: "percentage" | "fixed" }) {
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
      type === "percentage" ? "bg-[#e6f1fb] text-[#185fa5]" : "bg-[#f1efe8] text-[#5f5e5a]"
    }`}>
      {type === "percentage" ? "Percentage" : "Fixed"}
    </span>
  );
}

function UsageBar({ uses, limit }: { uses: number; limit?: number }) {
  if (!limit) {
    return (
      <div className="h-[3px] bg-[#f1efe8] rounded-full w-full">
        <div className="h-[3px] bg-[#1a1916] rounded-full w-[40%]" />
      </div>
    );
  }
  const pct = Math.min(Math.round((uses / limit) * 100), 100);
  const barColor =
    pct >= 90 ? "bg-[#e24b4a]" : pct >= 70 ? "bg-[#ef9f27]" : "bg-[#1a1916]";
  return (
    <div className="h-[3px] bg-[#f1efe8] rounded-full w-full">
      <div
        className={`h-[3px] rounded-full transition-all duration-300 ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function MetricCard({
  label, value, badge, badgeStyle,
}: {
  label: string;
  value: string | number;
  badge: string;
  badgeStyle: string;
}) {
  return (
    <div className="bg-white border border-[#e8e5df] rounded-xl p-4 flex-1 min-w-[120px]">
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">{label}</p>
      <p className="text-xl font-medium text-[#1a1916] leading-none">{value}</p>
      <span className={`inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-md ${badgeStyle}`}>
        {badge}
      </span>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#e8e5df] rounded-[14px] p-5 flex flex-col gap-3.5 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-[#f1efe8] rounded" />
          <div className="h-3 w-20 bg-[#f1efe8] rounded" />
        </div>
        <div className="h-5 w-20 bg-[#f1efe8] rounded" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="h-14 bg-[#f9f8f5] rounded-[10px]" />
        <div className="h-14 bg-[#f9f8f5] rounded-[10px]" />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <div className="h-2.5 w-24 bg-[#f1efe8] rounded" />
          <div className="h-2.5 w-16 bg-[#f1efe8] rounded" />
        </div>
        <div className="h-[3px] bg-[#f1efe8] rounded-full" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-8 bg-[#f1efe8] rounded-[9px]" />
        <div className="flex-1 h-8 bg-[#f1efe8] rounded-[9px]" />
      </div>
    </div>
  );
}

// ─── Create Modal ─────────────────────────────────────────────────────────────

function CreateModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (payload: CreateCouponPayload) => Promise<void>;
}) {
  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    usageLimit: "",
    expiresAt: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!form.code.trim() || !form.value) return;
    setSubmitting(true);
    await onAdd({
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      ...(form.usageLimit && { usageLimit: parseInt(form.usageLimit) }),
      ...(form.expiresAt && { expiresAt: form.expiresAt }),
      // ...(form.minOrderValue && { minOrderValue: Number(form.minOrderValue) }),
    });
    setSubmitting(false);
    onClose();
  }

  const inputCls =
    "w-full bg-white border border-[#e8e5df] rounded-[10px] px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] transition-colors";
  const labelCls = "text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1916]/45 p-4">
      <div className="bg-[#f5f2ed] rounded-2xl p-7 w-full max-w-[420px]">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[18px] font-normal text-[#1a1916]" style={{ fontFamily: "'DM Serif Display', serif" }}>
            New Coupon
          </p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-[#e8e5df] bg-white text-[#888780] flex items-center justify-center text-base hover:bg-[#f1efe8] transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* Code */}
          <div>
            <p className={labelCls}>Coupon Code</p>
            <input
              type="text"
              placeholder="e.g. SUMMER20"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className={`${inputCls} font-medium tracking-wider`}
            />
          </div>

          {/* Type + Value */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <p className={labelCls}>Type</p>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })}
                className={`${inputCls} appearance-none`}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div>
              <p className={labelCls}>Value</p>
              <input
                type="number"
                placeholder={form.type === "percentage" ? "e.g. 20" : "e.g. 500"}
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          {/* Limit + Expiry */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <p className={labelCls}>Usage Limit</p>
              <input
                type="number"
                placeholder="100 (or blank)"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <p className={labelCls}>Expiry Date</p>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          {/* Min Order */}
          {/* <div>
            <p className={labelCls}>
              Min. Order Value{" "}
              <span className="normal-case tracking-normal opacity-60">(optional)</span>
            </p>
            <input
              type="number"
              placeholder="e.g. 1000"
              value={form.minOrderValue}
              onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
              className={inputCls}
            />
          </div> */}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 bg-[#1a1916] text-[#f5f2ed] text-[12px] font-medium rounded-[10px] hover:bg-[#2e2d29] transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating…" : "Create Coupon"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Coupon Card ──────────────────────────────────────────────────────────────

function CouponCard({
  coupon,
  onToggle,
  onRemove,
}: {
  coupon: Coupon;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const status = deriveStatus(coupon);

  const pct = coupon.usageLimit
    ? Math.min(Math.round((coupon.usageCount / coupon.usageLimit) * 100), 100)
    : null;

  const usesDisplay = coupon.usageLimit
    ? `${coupon.usageCount} / ${coupon.usageLimit}`
    : `${coupon.usageCount} / ∞`;

  function handleCopy() {
    navigator.clipboard?.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="bg-white border border-[#e8e5df] rounded-[14px] p-5 flex flex-col gap-3.5 hover:border-[#c9c6be] transition-colors">

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[15px] font-medium tracking-[0.14em] text-[#1a1916]">{coupon.code}</p>
          <p className="text-[11px] text-[#b4b2a9] mt-1">
            Created {new Date(coupon.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <TypeBadge type={coupon.type} />
          <StatusPill status={status} />
        </div>
      </div>

      {/* Value + Expiry */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#f9f8f5] rounded-[10px] px-3 py-2.5">
          <p className="text-[9px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">Discount</p>
          <p className="text-[17px] font-medium text-[#1a1916]">{formatValue(coupon)}</p>
        </div>
        <div className="bg-[#f9f8f5] rounded-[10px] px-3 py-2.5">
          <p className="text-[9px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">Expires</p>
          <p className="text-[13px] font-medium text-[#1a1916]">{formatExpiry(coupon.expiresAt)}</p>
        </div>
      </div>

      {/* Min order */}
      {/* {coupon.minOrderValue != null && (
        <div className="bg-[#f9f8f5] rounded-[10px] px-3 py-2 text-[11px] text-[#888780]">
          Min. order:{" "}
          <span className="text-[#1a1916] font-medium">
            PKR {coupon.minOrderValue.toLocaleString()}
          </span>
        </div>
      )} */}

      {/* Usage */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9]">
            Redemptions
          </p>
          <p className="text-[11px] font-medium text-[#1a1916]">
            {usesDisplay}
            {pct !== null && <span className="text-[#b4b2a9] ml-1.5">· {pct}%</span>}
          </p>
        </div>
        <UsageBar uses={coupon.usageCount} limit={coupon.usageLimit} />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-0.5">
        <button
          onClick={handleCopy}
          className={`flex-1 text-[11px] font-medium py-2 rounded-[9px] border border-[#e8e5df] bg-white transition-colors ${
            copied ? "text-[#3b6d11]" : "text-[#1a1916] hover:bg-[#f5f2ed]"
          }`}
        >
          {copied ? "Copied!" : "Copy code"}
        </button>
        <button
          onClick={onToggle}
          disabled={status === "Expired"}
          className={`flex-1 text-[11px] font-medium py-2 rounded-[9px] border border-[#e8e5df] bg-white transition-colors hover:bg-[#f5f2ed] disabled:opacity-40 disabled:cursor-not-allowed ${
            coupon.isActive ? "text-[#a32d2d]" : "text-[#3b6d11]"
          }`}
        >
          {coupon.isActive ? "Pause" : "Reactivate"}
        </button>
        <button
          onClick={onRemove}
          className="px-3 text-[11px] font-medium py-2 rounded-[9px] border border-[#e8e5df] bg-white text-[#b4b2a9] hover:text-[#a32d2d] hover:bg-[#fcebeb] hover:border-[#f5c5c5] transition-colors"
          title="Delete coupon"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CouponsSection() {
  const { findAllCoupons, createCoupon, toggleCoupon, removeCoupon, loading } =
    useCouponService();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    findAllCoupons().then((res) => {
      if (res) setCoupons(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd(payload: CreateCouponPayload) {
    const created = await createCoupon(payload);
    if (created) setCoupons((prev) => [created, ...prev]);
  }

  async function handleToggle(id: string) {
    const updated = await toggleCoupon(id);
    if (updated) setCoupons((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }

  async function handleRemove(id: string) {
    await removeCoupon(id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  // ── Derived metrics ──
  const totalUses = coupons.reduce((sum, c) => sum + (c.usageCount ?? 0), 0);
  const activeCount = coupons.filter((c) => deriveStatus(c) === "Active").length;
  const expiringSoon = coupons.filter((c) => {
    if (!c.expiresAt) return false;
    const diff = (new Date(c.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;

  // ── Filter ──
  const filtered = coupons.filter((c) => {
    const status = deriveStatus(c);
    if (activeFilter === "All") return true;
    if (activeFilter === "Active") return status === "Active";
    if (activeFilter === "Expired") return status === "Expired";
    if (activeFilter === "Paused") return status === "Paused";
    if (activeFilter === "Percentage") return c.type === "percentage";
    if (activeFilter === "Fixed") return c.type === "fixed";
    return true;
  });

  function countFor(f: string) {
    if (f === "All") return coupons.length;
    if (f === "Active") return coupons.filter((c) => deriveStatus(c) === "Active").length;
    if (f === "Expired") return coupons.filter((c) => deriveStatus(c) === "Expired").length;
    if (f === "Paused") return coupons.filter((c) => deriveStatus(c) === "Paused").length;
    if (f === "Percentage") return coupons.filter((c) => c.type === "percentage").length;
    if (f === "Fixed") return coupons.filter((c) => c.type === "fixed").length;
    return 0;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif; }
      `}</style>

      <div className="bg-[#f5f2ed] min-h-screen p-6 md:p-8 text-[#1a1916]">

        {/* Top bar */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <SectionLabel>Promotions</SectionLabel>
            <h1
              className="text-[22px] font-normal tracking-tight text-[#1a1916] serif"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Coupons
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#f5f2ed] bg-[#1a1916] rounded-xl px-4 py-2.5 hover:bg-[#2e2d29] transition-colors"
          >
            <span className="text-base leading-none -mt-px">+</span> New Coupon
          </button>
        </div>

        {/* Metrics */}
        <div className="mb-6">
          <SectionLabel>Overview</SectionLabel>
          <div className="flex flex-wrap gap-3">
            <MetricCard
              label="Total coupons"
              value={coupons.length}
              badge={`${activeCount} active`}
              badgeStyle="bg-[#eaf3de] text-[#3b6d11]"
            />
            <MetricCard
              label="Total redemptions"
              value={totalUses.toLocaleString()}
              badge="all time"
              badgeStyle="bg-[#e6f1fb] text-[#185fa5]"
            />
            <MetricCard
              label="Expiring soon"
              value={expiringSoon}
              badge="within 7 days"
              badgeStyle={
                expiringSoon > 0
                  ? "bg-[#fcebeb] text-[#a32d2d]"
                  : "bg-[#f1efe8] text-[#5f5e5a]"
              }
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${
                activeFilter === f
                  ? "bg-[#1a1916] text-[#f5f2ed]"
                  : "bg-[#f5f2ed] text-[#888780] hover:bg-[#ede9e3] hover:text-[#1a1916]"
              }`}
            >
              {f}
              <span className={`ml-1.5 text-[10px] ${activeFilter === f ? "opacity-60" : "opacity-50"}`}>
                {countFor(f)}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#e8e5df] rounded-xl p-10 text-center text-[13px] text-[#b4b2a9]">
            No coupons match this filter
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onToggle={() => handleToggle(coupon.id)}
                onRemove={() => handleRemove(coupon.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </>
  );
}