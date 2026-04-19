"use client";

import { useState, useRef } from "react";

// ─── Default Settings State ───────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  store: {
    name: "Twinkle Official",
    email: "info@twinkleofficial.com",
    phone: "+92 300 1234567",
    address: "14-B, Clifton Block 5, Karachi, Pakistan",
    currency: "PKR",
    timezone: "Asia/Karachi",
    logo: null,
  },
  payment: {
    cod: true,
    bank_transfer: false,
    online: false,
    stripe_key: "",
    stripe_secret: "",
    bank_name: "",
    bank_iban: "",
  },
  shipping: {
    flat_fee: 200,
    free_threshold: 3000,
    delivery_time: "Same Day Delivery",
  },
  general: {
    min_order: 500,
    guest_checkout: true,
  },
};

const NAV_ITEMS = [
  { key: "store",    label: "Store" },
  { key: "payment",  label: "Payments" },
  { key: "shipping", label: "Shipping" },
  { key: "general",  label: "General" },
];

const CURRENCIES       = ["PKR", "USD", "GBP", "EUR", "AED", "SAR"];
const TIMEZONES        = ["Asia/Karachi", "Asia/Dubai", "Europe/London", "America/New_York", "UTC"];
const DELIVERY_OPTIONS = [
  "Same Day Delivery",
  "Next Day Delivery",
  "30–45 minutes",
  "1–2 Business Days",
  "2–3 Business Days",
  "3–5 Business Days",
];

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-[#e8e5df] rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <p className="text-[13px] font-medium text-[#1a1916] mb-4">{children}</p>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-1.5">
        {label}
      </p>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#f9f8f5] border border-[#e8e5df] rounded-lg px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] focus:bg-white transition-all placeholder:text-[#c9c6be]"
    />
  );
}

function SecretInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#f9f8f5] border border-[#e8e5df] rounded-lg px-3 py-2.5 pr-14 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] focus:bg-white transition-all placeholder:text-[#c9c6be] font-mono"
      />
      <button
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-[#b4b2a9] hover:text-[#1a1916] transition-colors"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#f9f8f5] border border-[#e8e5df] rounded-lg px-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] focus:bg-white transition-all appearance-none cursor-pointer"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#b4b2a9] text-[10px]">▼</span>
    </div>
  );
}

function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-[#1a1916]">{label}</p>
        {description && (
          <p className="text-[11px] text-[#b4b2a9] mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-200 ${
          enabled ? "bg-[#1a1916]" : "bg-[#e8e5df]"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

// ─── Section: Store ───────────────────────────────────────────────────────────

function StoreSettings({ data, onChange }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  function set(key) { return (val) => onChange(key, val); }

  function handleLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange("logo", file);
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle>Brand identity</CardTitle>
        <div className="flex flex-col gap-4">
          <Field label="Store logo">
            <div className="flex items-center gap-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="w-16 h-16 rounded-xl border border-[#e8e5df] bg-[#f9f8f5] flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#1a1916] transition-colors flex-shrink-0"
              >
                {preview
                  ? <img src={preview} alt="Logo" className="w-full h-full object-cover" />
                  : <span className="text-[10px] text-[#b4b2a9] text-center leading-tight px-1">Upload logo</span>
                }
              </div>
              <div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-[11px] font-medium text-[#1a1916] border border-[#e8e5df] bg-white rounded-lg px-3 py-1.5 hover:bg-[#f5f2ed] transition-colors block mb-1"
                >
                  Choose file
                </button>
                <p className="text-[10px] text-[#b4b2a9]">PNG or JPG · Recommended 200×200px</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </div>
          </Field>

          <Field label="Store name">
            <Input value={data.name} onChange={set("name")} placeholder="Your store name" />
          </Field>
        </div>
      </Card>

      <Card>
        <CardTitle>Contact details</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Contact email">
            <Input value={data.email} onChange={set("email")} placeholder="hello@yourstore.com" type="email" />
          </Field>
          <Field label="Phone number">
            <Input value={data.phone} onChange={set("phone")} placeholder="+92 300 0000000" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Address">
              <Input value={data.address} onChange={set("address")} placeholder="Full business address" />
            </Field>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>Locale</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Currency">
            <Select value={data.currency} onChange={set("currency")} options={CURRENCIES} />
          </Field>
          <Field label="Timezone">
            <Select value={data.timezone} onChange={set("timezone")} options={TIMEZONES} />
          </Field>
        </div>
      </Card>
    </div>
  );
}

// ─── Section: Payment ─────────────────────────────────────────────────────────

function PaymentSettings({ data, onChange }) {
  function set(key) { return (val) => onChange(key, val); }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle>Payment methods</CardTitle>
        <div className="divide-y divide-[#f1efe8]">
          <Toggle enabled={data.cod} onChange={set("cod")} label="Cash on Delivery" description="Customers pay when the order is received" />
          <Toggle enabled={data.bank_transfer} onChange={set("bank_transfer")} label="Bank Transfer" description="Customers transfer to your bank account manually" />
          <Toggle enabled={data.online} onChange={set("online")} label="Online Payment (Stripe)" description="Accept cards and digital wallets via Stripe" />
        </div>
      </Card>

      {data.bank_transfer && (
        <Card>
          <CardTitle>Bank account details</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Bank name">
              <Input value={data.bank_name} onChange={set("bank_name")} placeholder="e.g. HBL, Meezan Bank" />
            </Field>
            <Field label="IBAN / Account number">
              <Input value={data.bank_iban} onChange={set("bank_iban")} placeholder="PK00XXXX0000000000000000" />
            </Field>
          </div>
        </Card>
      )}

      {data.online && (
        <Card>
          <CardTitle>Stripe API keys</CardTitle>
          <p className="text-[11px] text-[#b4b2a9] mb-4 -mt-2">
            Keys are stored encrypted. Never share your secret key.
          </p>
          <div className="flex flex-col gap-4">
            <Field label="Publishable key">
              <SecretInput value={data.stripe_key} onChange={set("stripe_key")} placeholder="pk_live_..." />
            </Field>
            <Field label="Secret key">
              <SecretInput value={data.stripe_secret} onChange={set("stripe_secret")} placeholder="sk_live_..." />
            </Field>
          </div>
          <div className="mt-4 bg-[#faeeda] border border-[#fac775] rounded-xl p-3 flex gap-2.5">
            <span className="text-[#ef9f27] text-base flex-shrink-0">⚠</span>
            <p className="text-[11px] text-[#854f0b] leading-relaxed">
              Use test keys (<code className="font-mono bg-[#fac775]/30 px-1 rounded">pk_test_</code> / <code className="font-mono bg-[#fac775]/30 px-1 rounded">sk_test_</code>) during development. Switch to live keys only in production.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Section: Shipping ────────────────────────────────────────────────────────

function ShippingSettings({ data, onChange }) {
  function set(key) { return (val) => onChange(key, val); }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle>Delivery fees</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Flat delivery fee (PKR)">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#b4b2a9] font-medium">PKR</span>
              <input
                type="number"
                value={data.flat_fee}
                onChange={(e) => set("flat_fee")(e.target.value)}
                className="w-full bg-[#f9f8f5] border border-[#e8e5df] rounded-lg pl-12 pr-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] focus:bg-white transition-all"
              />
            </div>
          </Field>
          <Field label="Free delivery above (PKR)">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#b4b2a9] font-medium">PKR</span>
              <input
                type="number"
                value={data.free_threshold}
                onChange={(e) => set("free_threshold")(e.target.value)}
                className="w-full bg-[#f9f8f5] border border-[#e8e5df] rounded-lg pl-12 pr-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] focus:bg-white transition-all"
              />
            </div>
          </Field>
        </div>

        <div className="mt-4 bg-[#f9f8f5] border border-[#e8e5df] rounded-xl p-4">
          <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">Customer sees</p>
          <div className="flex items-center gap-2 flex-wrap text-[12px] text-[#5f5e5a]">
            <span>
              Under <span className="font-medium text-[#1a1916]">PKR {Number(data.free_threshold).toLocaleString()}</span>
              {" → "}
              <span className="font-medium text-[#1a1916]">PKR {Number(data.flat_fee).toLocaleString()} delivery</span>
            </span>
            <span className="text-[#b4b2a9]">·</span>
            <span>
              Above <span className="font-medium text-[#1a1916]">PKR {Number(data.free_threshold).toLocaleString()}</span>
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
            <Select value={data.delivery_time} onChange={(val) => onChange("delivery_time", val)} options={DELIVERY_OPTIONS} />
          </Field>
          <Field label="Custom override">
            <Input value={data.delivery_time} onChange={(val) => onChange("delivery_time", val)} placeholder="e.g. 45–60 minutes" />
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
            <p className="text-[11px] text-[#639922]">{data.delivery_time}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Section: General ─────────────────────────────────────────────────────────

function GeneralSettings({ data, onChange }) {
  function set(key) { return (val) => onChange(key, val); }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle>Order rules</CardTitle>
        <div className="max-w-xs">
          <Field label="Minimum order amount (PKR)">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#b4b2a9] font-medium">PKR</span>
              <input
                type="number"
                value={data.min_order}
                onChange={(e) => set("min_order")(e.target.value)}
                className="w-full bg-[#f9f8f5] border border-[#e8e5df] rounded-lg pl-12 pr-3 py-2.5 text-[13px] text-[#1a1916] outline-none focus:border-[#1a1916] focus:bg-white transition-all"
              />
            </div>
          </Field>
        </div>
        <p className="text-[11px] text-[#b4b2a9] mt-2">Set to 0 to disable the minimum order requirement.</p>
      </Card>

      <Card>
        <CardTitle>Checkout</CardTitle>
        <div className="divide-y divide-[#f1efe8]">
          <Toggle
            enabled={data.guest_checkout}
            onChange={set("guest_checkout")}
            label="Allow guest checkout"
            description="Customers can order without creating an account"
          />
        </div>
      </Card>

      <Card>
        <CardTitle>Schema preview</CardTitle>
        <p className="text-[11px] text-[#b4b2a9] mb-3">Your settings payload as stored in the database.</p>
        <pre className="bg-[#f9f8f5] border border-[#e8e5df] rounded-xl p-4 text-[11px] text-[#5f5e5a] overflow-x-auto font-mono leading-relaxed whitespace-pre">
{`{
  "general": {
    "min_order": ${data.min_order},
    "guest_checkout": ${data.guest_checkout}
  }
}`}
        </pre>
      </Card>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SettingsSection() {
  const [activeTab, setActiveTab] = useState("store");
  const [settings, setSettings]   = useState(DEFAULT_SETTINGS);
  const [saved, setSaved]         = useState(false);

  function updateSection(section) {
    return (key, val) =>
      setSettings((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: val },
      }));
  }

  function handleSave() {
    // Replace with: await fetch('/api/settings', { method: 'POST', body: JSON.stringify(settings) })
    console.log("Saving:", settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="bg-[#f5f2ed] min-h-screen text-[#1a1916]">

        {/* ── Sticky header ── */}
        <div className="bg-white border-b border-[#e8e5df] sticky top-0 z-30">

          {/* Title row */}
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
              {saved && (
                <span className="text-[11px] font-medium text-[#3b6d11] bg-[#eaf3de] px-2.5 py-1 rounded-md">
                  Saved successfully
                </span>
              )}
              <button
                onClick={handleSave}
                className="text-[12px] font-medium text-[#f5f2ed] bg-[#1a1916] px-5 py-2.5 rounded-xl hover:bg-[#2e2d29] transition-colors"
              >
                Save changes
              </button>
            </div>
          </div>

          {/* Tab row — underline style matching dashboard period tabs aesthetic */}
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

        {/* ── Content area ── */}
        <div className="px-6 md:px-8 py-7 max-w-3xl">
          {activeTab === "store"    && <StoreSettings    data={settings.store}    onChange={updateSection("store")}    />}
          {activeTab === "payment"  && <PaymentSettings  data={settings.payment}  onChange={updateSection("payment")}  />}
          {activeTab === "shipping" && <ShippingSettings data={settings.shipping} onChange={updateSection("shipping")} />}
          {activeTab === "general"  && <GeneralSettings  data={settings.general}  onChange={updateSection("general")}  />}
        </div>

      </div>
    </>
  );
}