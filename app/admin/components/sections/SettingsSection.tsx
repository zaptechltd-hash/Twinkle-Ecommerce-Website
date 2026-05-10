"use client";

import { useState, useEffect } from "react";
import useSettingsService from "../../../services/settings/index";
import type { UpdateSettingsPayload } from "../../../services/settings/types";

const DEFAULT_DYNAMIC = {
  codEnabled: true,
  flatFee: 200,
  freeThreshold: 3000,
  deliveryLabel: "Same Day Delivery",
  minOrder: 500,
  guestCheckout: true,
  // new
  storeName: "My Store",
  contactNumber: "",
  priceFilters: [
    { label: "Under PKR 4,500",   min: 0,    max: 4500 },
    { label: "PKR 4,500 – 6,000", min: 4500, max: 6000 },
    { label: "PKR 6,000 – 8,000", min: 6000, max: 8000 },
    { label: "PKR 8,000+",        min: 8000, max: null  },
  ],
};

type DynamicSettings = typeof DEFAULT_DYNAMIC;

const NAV_ITEMS = [
  { key: "payment", label: "Payments" },
  { key: "shipping", label: "Shipping" },
  { key: "general", label: "General" },
];

const DELIVERY_OPTIONS = [
  "Same Day Delivery",
  "Next Day Delivery",
  "30–45 minutes",
  "1–2 Business Days",
  "2–3 Business Days",
  "3–5 Business Days",
];

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#e8e5df] rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-medium text-[#1a1916] mb-4">{children}</p>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-1.5">
        {label}
      </p>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-[#f9f8f5] border border-[#e8e5df] rounded-lg px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] focus:bg-white transition-all placeholder:text-[#c9c6be] disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#f9f8f5] border border-[#e8e5df] rounded-lg px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] focus:bg-white transition-all appearance-none cursor-pointer"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#b4b2a9] text-[10px]">
        ▼
      </span>
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-[#1a1916]">{label}</p>
        {description && (
          <p className="text-[11px] text-[#b4b2a9] mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`relative flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          enabled ? "bg-[#1a1916]" : "bg-[#e8e5df]"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function PkrInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#b4b2a9] font-medium">
        PKR
      </span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-[#f9f8f5] border border-[#e8e5df] rounded-lg pl-12 pr-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] focus:bg-white transition-all"
      />
    </div>
  );
}

// ─── Section: Payment ─────────────────────────────────────────────────────────

function PaymentSettings({
  data,
  onChange,
  disabled,
}: {
  data: DynamicSettings;
  onChange: (key: keyof DynamicSettings, val: DynamicSettings[keyof DynamicSettings]) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle>Payment methods</CardTitle>
        <div className="divide-y divide-[#f1efe8]">
          <Toggle
            enabled={data.codEnabled}
            onChange={(v) => onChange("codEnabled", v)}
            label="Cash on Delivery"
            description="Customers pay when the order is received"
            disabled={disabled}
          />
        </div>
      </Card>
    </div>
  );
}

// ─── Section: Shipping ────────────────────────────────────────────────────────

function ShippingSettings({
  data,
  onChange,
  disabled,
}: {
  data: DynamicSettings;
  onChange: (key: keyof DynamicSettings, val: DynamicSettings[keyof DynamicSettings]) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle>Delivery fees</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Flat delivery fee">
            <PkrInput value={data.flatFee} onChange={(v) => onChange("flatFee", v)} />
          </Field>
          <Field label="Free delivery above">
            <PkrInput value={data.freeThreshold} onChange={(v) => onChange("freeThreshold", v)} />
          </Field>
        </div>
        <div className="mt-4 bg-[#f9f8f5] border border-[#e8e5df] rounded-xl p-4">
          <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">
            Customer sees
          </p>
          <div className="flex items-center gap-2 flex-wrap text-[12px] text-[#5f5e5a]">
            <span>
              Under{" "}
              <span className="font-medium text-[#1a1916]">
                PKR {data.freeThreshold.toLocaleString()}
              </span>
              {" → "}
              <span className="font-medium text-[#1a1916]">
                PKR {data.flatFee.toLocaleString()} delivery
              </span>
            </span>
            <span className="text-[#b4b2a9]">·</span>
            <span>
              Above{" "}
              <span className="font-medium text-[#1a1916]">
                PKR {data.freeThreshold.toLocaleString()}
              </span>
              {" → "}
              <span className="font-medium text-[#3b6d11]">Free delivery</span>
            </span>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>Delivery time</CardTitle>
        <p className="text-[11px] text-[#b4b2a9] mb-4 -mt-2">
          Shown to customers at checkout and on order confirmations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Preset label">
            <Select
              value={
                DELIVERY_OPTIONS.includes(data.deliveryLabel)
                  ? data.deliveryLabel
                  : DELIVERY_OPTIONS[0]
              }
              onChange={(v) => onChange("deliveryLabel", v)}
              options={DELIVERY_OPTIONS}
            />
          </Field>
          <Field label="Custom override">
            <Input
              value={data.deliveryLabel}
              onChange={(v) => onChange("deliveryLabel", v)}
              placeholder="e.g. 45–60 minutes"
              disabled={disabled}
            />
          </Field>
        </div>
        <div className="mt-4 bg-[#eaf3de] border border-[#c0dd97] rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#639922] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-[12px] font-medium text-[#3b6d11]">Estimated delivery</p>
            <p className="text-[11px] text-[#639922]">{data.deliveryLabel}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Section: General ─────────────────────────────────────────────────────────

// function GeneralSettings({
//   data,
//   onChange,
//   disabled,
// }: {
//   data: DynamicSettings;
//   onChange: (key: keyof DynamicSettings, val: DynamicSettings[keyof DynamicSettings]) => void;
//   disabled: boolean;
// }) {
//   return (
//     <div className="flex flex-col gap-4">
//       <Card>
//         <CardTitle>Order rules</CardTitle>
//         <div className="max-w-xs">
//           <Field label="Minimum order amount">
//             <PkrInput value={data.minOrder} onChange={(v) => onChange("minOrder", v)} />
//           </Field>
//         </div>
//         <p className="text-[11px] text-[#b4b2a9] mt-2">
//           Set to 0 to disable the minimum order requirement.
//         </p>
//       </Card>

//       <Card>
//         <CardTitle>Checkout</CardTitle>
//         <div className="divide-y divide-[#f1efe8]">
//           <Toggle
//             enabled={data.guestCheckout}
//             onChange={(v) => onChange("guestCheckout", v)}
//             label="Allow guest checkout"
//             description="Customers can order without creating an account"
//             disabled={disabled}
//           />
//         </div>
//       </Card>
//     </div>
//   );
// }

function GeneralSettings({ data, onChange, disabled }: {
  data: DynamicSettings;
  onChange: (key: keyof DynamicSettings, val: DynamicSettings[keyof DynamicSettings]) => void;
  disabled: boolean;
}) {
  function updateFilter(index, field, value) {
    const updated = data.priceFilters.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    onChange("priceFilters", updated);
  }

  function addFilter() {
    onChange("priceFilters", [
      ...data.priceFilters,
      { label: "New Range", min: 0, max: null },
    ]);
  }

  function removeFilter(index:any) {
    onChange("priceFilters", data.priceFilters.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Store info ── */}
      <Card>
        <CardTitle>Store information</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Store name">
            <Input
              value={data.storeName}
              onChange={(v) => onChange("storeName", v)}
              placeholder="e.g. TwinkleOfficial"
              disabled={disabled}
            />
          </Field>
          <Field label="Contact number">
            <Input
              value={data.contactNumber}
              onChange={(v) => onChange("contactNumber", v)}
              placeholder="e.g. +92 300 1234567"
              disabled={disabled}
            />
          </Field>
        </div>
      </Card>

      {/* ── Price filters ── */}
      <Card>
        <CardTitle>Collection price filters</CardTitle>
        <p className="text-[11px] text-[#b4b2a9] mb-4 -mt-2">
          These ranges appear in the filter panel on your collection page.
          Leave "Max" empty for an open-ended range (e.g. PKR 8,000+).
        </p>

        <div className="flex flex-col gap-3">
          {(data.priceFilters ?? []).map((filter, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end"
            >
              <Field label={i === 0 ? "Label" : ""}>
                <Input
                  value={filter.label}
                  onChange={(v) => updateFilter(i, "label", v)}
                  placeholder="e.g. Under PKR 4,500"
                  disabled={disabled}
                />
              </Field>
              <Field label={i === 0 ? "Min (PKR)" : ""}>
                <input
                  type="number"
                  value={filter.min}
                  onChange={(e) => updateFilter(i, "min", Number(e.target.value))}
                  disabled={disabled}
                  className="w-full bg-[#f9f8f5] border border-[#e8e5df] rounded-lg px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] focus:bg-white transition-all"
                />
              </Field>
              <Field label={i === 0 ? "Max (PKR, blank = ∞)" : ""}>
                <input
                  type="number"
                  value={filter.max ?? ""}
                  onChange={(e) =>
                    updateFilter(i, "max", e.target.value === "" ? null : Number(e.target.value))
                  }
                  placeholder="∞"
                  disabled={disabled}
                  className="w-full bg-[#f9f8f5] border border-[#e8e5df] rounded-lg px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] focus:bg-white transition-all placeholder:text-[#c9c6be]"
                />
              </Field>
              <button
                onClick={() => removeFilter(i)}
                disabled={disabled}
                className="mb-0.5 w-8 h-9 flex items-center justify-center text-[#b4b2a9] hover:text-[#e05252] transition-colors disabled:opacity-40"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addFilter}
          disabled={disabled}
          className="mt-4 text-[11px] font-medium text-[#1a1916] border border-[#e8e5df] rounded-lg px-4 py-2 hover:bg-[#f5f2ed] transition-colors disabled:opacity-50"
        >
          + Add range
        </button>
      </Card>

      {/* ── existing cards ── */}
      <Card>
        <CardTitle>Order rules</CardTitle>
        <div className="max-w-xs">
          <Field label="Minimum order amount">
            <PkrInput value={data.minOrder} onChange={(v) => onChange("minOrder", v)} />
          </Field>
        </div>
        <p className="text-[11px] text-[#b4b2a9] mt-2">
          Set to 0 to disable the minimum order requirement.
        </p>
      </Card>

      <Card>
        <CardTitle>Checkout</CardTitle>
        <div className="divide-y divide-[#f1efe8]">
          <Toggle
            enabled={data.guestCheckout}
            onChange={(v) => onChange("guestCheckout", v)}
            label="Allow guest checkout"
            description="Customers can order without creating an account"
            disabled={disabled}
          />
        </div>
      </Card>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SettingsSection() {
  const { getSettings, updateSettings, loading } = useSettingsService();

  const [activeTab, setActiveTab] = useState("payment");
  const [dynamic, setDynamic] = useState<DynamicSettings>(DEFAULT_DYNAMIC);
  const [fetchError, setFetchError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getSettings();
      if (res) {
        setDynamic({
          codEnabled:     res.codEnabled,
          flatFee:        res.flatFee,
          freeThreshold:  res.freeThreshold,
          deliveryLabel:  res.deliveryLabel,
          minOrder:       res.minOrder,
          guestCheckout:  res.guestCheckout,
            storeName:      res.storeName      ?? "My Store",
  contactNumber:  res.contactNumber  ?? "",
  priceFilters:   res.priceFilters   ?? DEFAULT_DYNAMIC.priceFilters,
        });
      } else {
        setFetchError(true);
      }
    })();
  }, []);

  function updateDynamic(
    key: keyof DynamicSettings,
    val: DynamicSettings[keyof DynamicSettings],
  ) {
    setDynamic((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    setSaveError(false);

    const payload: UpdateSettingsPayload = {
      codEnabled:    dynamic.codEnabled,
      flatFee:       dynamic.flatFee,
      freeThreshold: dynamic.freeThreshold,
      deliveryLabel: dynamic.deliveryLabel,
      minOrder:      dynamic.minOrder,
      guestCheckout: dynamic.guestCheckout,
      storeName:     dynamic.storeName,
    contactNumber: dynamic.contactNumber,
    priceFilters:  dynamic.priceFilters,
    };

    const res = await updateSettings(payload);
    if (res) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3000);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="bg-[#f5f2ed] min-h-screen text-[#1a1916]">
        {/* ── Sticky header + tabs ── */}
        <div className="bg-white border-b border-[#e8e5df] sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4 px-6 md:px-8 pt-6 pb-4 flex-wrap">
            <div>
              <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">
                Configuration
              </p>
              <h1
                className="text-[22px] font-normal tracking-tight text-[#1a1916]"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Settings
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {fetchError && (
                <span className="text-[11px] font-medium text-[#854f0b] bg-[#faeeda] px-2.5 py-1 rounded-md">
                  Failed to load settings
                </span>
              )}
              {saved && (
                <span className="text-[11px] font-medium text-[#3b6d11] bg-[#eaf3de] px-2.5 py-1 rounded-md">
                  Saved successfully
                </span>
              )}
              {saveError && (
                <span className="text-[11px] font-medium text-[#854f0b] bg-[#faeeda] px-2.5 py-1 rounded-md">
                  Failed to save
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={loading || fetchError}
                className="text-[12px] font-medium text-[#f5f2ed] bg-[#1a1916] px-5 py-2.5 rounded-xl hover:bg-[#2e2d29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>

          <div className="flex overflow-x-auto scrollbar-hide px-6 md:px-8 -mb-px">
            {NAV_ITEMS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-shrink-0 text-[13px] font-medium px-1 pb-3 mr-7 border-b-2 transition-all ${
                  activeTab === key
                    ? "border-[#1a1916] text-[#1a1916]"
                    : "border-transparent text-[#888780] hover:text-[#1a1916]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 md:px-8 py-7 max-w-3xl">
          {activeTab === "payment" && (
            <PaymentSettings data={dynamic} onChange={updateDynamic} disabled={loading} />
          )}
          {activeTab === "shipping" && (
            <ShippingSettings data={dynamic} onChange={updateDynamic} disabled={loading} />
          )}
          {activeTab === "general" && (
            <GeneralSettings data={dynamic} onChange={updateDynamic} disabled={loading} />
          )}
        </div>
      </div>
    </>
  );
}