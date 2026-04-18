"use client";
import { useState, useRef, useEffect } from "react";
import { COUPONS } from '../data/data'
import { SectionHeader } from "../layout/SectionHeader";
import { Badge } from '../ui/Badge'
import { Modal } from "../ui/Modal";
import { FormField } from "../ui/FormField";

export default function CouponsSection() {
  const [showAdd, setShowAdd] = useState(false);
  const [coupons, setCoupons] = useState(COUPONS);
  const [newCoupon, setNewCoupon] = useState({ code: "", type: "Percentage", value: "", limit: "", expiry: "", status: "Active" });

  function handleAdd() {
    setCoupons((prev) => [{ ...newCoupon, uses: 0 }, ...prev]);
    setShowAdd(false);
    setNewCoupon({ code: "", type: "Percentage", value: "", limit: "", expiry: "", status: "Active" });
  }

  return (
    <div>
      <SectionHeader title="Coupons" subtitle="Discounts" action="+ New Coupon" onAction={() => setShowAdd(true)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((c, i) => (
          <div key={i} className="border border-stone-100 p-5 hover:border-stone-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <p className="font-mono text-[15px] tracking-[0.2em] text-stone-800">{c.code}</p>
              <Badge status={c.status} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Type", c.type],
                ["Value", c.value],
                ["Used / Limit", `${c.uses} / ${c.limit}`],
                ["Expires", c.expiry],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[9px] tracking-[0.2em] text-stone-400 uppercase mb-0.5">{k}</p>
                  <p className="text-[11px] text-stone-600">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-stone-50">
              <div className="w-full bg-stone-100 h-1">
                <div className="bg-stone-800 h-1 transition-all" style={{ width: `${Math.min((c.uses / c.limit) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title="Create Coupon" onClose={() => setShowAdd(false)}>
          <FormField label="Coupon Code" value={newCoupon.code} onChange={(v) => setNewCoupon({ ...newCoupon, code: v.toUpperCase() })} />
          <FormField label="Discount Type" value={newCoupon.type} onChange={(v) => setNewCoupon({ ...newCoupon, type: v })} options={["Percentage", "Fixed"]} />
          <FormField label="Value (% or PKR)" value={newCoupon.value} onChange={(v) => setNewCoupon({ ...newCoupon, value: v })} />
          <FormField label="Usage Limit" type="number" value={newCoupon.limit} onChange={(v) => setNewCoupon({ ...newCoupon, limit: v })} />
          <FormField label="Expiry Date" type="date" value={newCoupon.expiry} onChange={(v) => setNewCoupon({ ...newCoupon, expiry: v })} />
          <button
            onClick={handleAdd}
            className="w-full py-3 bg-stone-900 text-white text-[11px] tracking-[0.3em] uppercase hover:bg-stone-700 transition-colors mt-2"
          >
            Create Coupon
          </button>
        </Modal>
      )}
    </div>
  );
}