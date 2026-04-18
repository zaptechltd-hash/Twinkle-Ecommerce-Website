"use client";
import { useState, useRef, useEffect } from "react";
import { SectionHeader } from "../layout/SectionHeader";
import { FormField } from "../ui/FormField";
import { Badge } from '../ui/Badge'


export default function SettingsSection() {
  const [profile, setProfile] = useState({ name: "Admin User", email: "admin@twinkleofficial.com", role: "Super Admin" });
  const [saved, setSaved] = useState(false);

  const ROLES = [
    { role: "Super Admin", permissions: ["All access", "Manage roles", "Delete data"], active: true },
    { role: "Manager", permissions: ["Orders", "Products", "Customers"], active: false },
    { role: "Support", permissions: ["Orders (read)", "Customers (read)"], active: false },
  ];

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <SectionHeader title="Settings" subtitle="Admin" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="border border-stone-100 p-6">
          <p className="text-[10px] tracking-[0.25em] text-stone-400 uppercase mb-5">Profile</p>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center text-[14px] font-light tracking-wide">
              AU
            </div>
            <div>
              <p className="text-[12px] text-stone-700 font-medium">{profile.name}</p>
              <p className="text-[10px] tracking-[0.15em] text-stone-400 uppercase mt-0.5">{profile.role}</p>
            </div>
          </div>
          <FormField label="Full Name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
          <FormField label="Email" type="email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} />
          <button
            onClick={handleSave}
            className={`w-full py-3 text-[11px] tracking-[0.3em] uppercase transition-all ${saved ? "bg-emerald-600 text-white" : "bg-stone-900 text-white hover:bg-stone-700"}`}
          >
            {saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>

        {/* Roles */}
        <div className="border border-stone-100 p-6">
          <p className="text-[10px] tracking-[0.25em] text-stone-400 uppercase mb-5">Role-Based Access</p>
          <div className="flex flex-col gap-4">
            {ROLES.map((r) => (
              <div key={r.role} className={`p-4 border transition-colors ${r.active ? "border-stone-800 bg-stone-50" : "border-stone-100"}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] tracking-[0.15em] text-stone-800 uppercase">{r.role}</p>
                  {r.active && <Badge status="Active" />}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.permissions.map((p) => (
                    <span key={p} className="text-[9px] tracking-[0.1em] text-stone-500 bg-stone-100 px-2 py-1">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Settings */}
        <div className="border border-stone-100 p-6 lg:col-span-2">
          <p className="text-[10px] tracking-[0.25em] text-stone-400 uppercase mb-5">Store Settings</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Store Name" value="TwinkleOfficial" onChange={() => {}} />
            <FormField label="Currency" value="PKR" onChange={() => {}} options={["PKR", "USD", "AED"]} />
            <FormField label="Free Shipping Threshold" value="5000" onChange={() => {}} />
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {["Enable order SMS notifications", "Auto-cancel unpaid orders after 48h", "Show out-of-stock products"].map((setting) => (
              <label key={setting} className="flex items-center gap-3 cursor-pointer group">
                <div className="w-9 h-5 bg-stone-800 relative flex-shrink-0">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white" />
                </div>
                <span className="text-[11px] tracking-wide text-stone-600 group-hover:text-stone-800 transition-colors">{setting}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
