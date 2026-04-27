"use client";

import { useState, useMemo, useRef, useEffect } from "react";

// ─── Constants ──────────────────────────────────────────────────────────────
const CATEGORIES_OPTS = ["Nightwear", "Robes", "Loungewear", "Sets"];
const SIZE_OPTS       = ["XS", "S", "M", "L", "XL", "Free Size"];
const TAG_OPTS        = ["New In", "Best Seller", "Limited", "Sale"];
const LOCATION_OPTS   = ["Home", "Collection", "Both"];
const PER_PAGE        = 7;

// ─── Initial Products ────────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Silk Night Slip",
    category: "Nightwear",
    status: "Active",
    tag: "New In",
    price: 4900,
    sales: 241,
    location: "Home",
    sizeGuide: null,
    variants: [
      {
        id: "v1-1",
        color: "Blush",
        colorHex: "#e8c4b8",
        sku: "SNS-BL",
        image: "/product1.jpg",
        sizes: [
          { size: "XS", stock: 15 },
          { size: "S",  stock: 22 },
          { size: "M",  stock: 18 },
          { size: "L",  stock: 7  },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Velvet Robe",
    category: "Robes",
    status: "Active",
    tag: "Best Seller",
    price: 6200,
    sales: 188,
    location: "Both",
    sizeGuide: null,
    variants: [
      {
        id: "v2-1",
        color: "Noir",
        colorHex: "#2a2a2a",
        sku: "VR-NO",
        image: "/product3.jpg",
        sizes: [
          { size: "S", stock: 11 },
          { size: "M", stock: 14 },
          { size: "L", stock: 6  },
        ],
      },
      {
        id: "v2-2",
        color: "Stone",
        colorHex: "#b5a99a",
        sku: "VR-ST",
        image: "/product4.jpg",
        sizes: [
          { size: "S", stock: 9 },
          { size: "M", stock: 0 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Lace Trim Set",
    category: "Sets",
    status: "Active",
    tag: "New In",
    price: 5500,
    sales: 144,
    location: "Collection",
    sizeGuide: null,
    variants: [
      {
        id: "v3-1",
        color: "Blush",
        colorHex: "#e8c4b8",
        sku: "LTS-BL",
        image: "/product5.jpg",
        sizes: [
          { size: "S", stock: 20 },
          { size: "M", stock: 17 },
          { size: "L", stock: 8  },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Satin Pyjama",
    category: "Nightwear",
    status: "Active",
    tag: null,
    price: 5100,
    sales: 103,
    location: "Home",
    sizeGuide: null,
    variants: [
      {
        id: "v4-1",
        color: "Ivory",
        colorHex: "#f5f0e8",
        sku: "SP-IV",
        image: "/product7.jpg",
        sizes: [
          { size: "S", stock: 13 },
          { size: "M", stock: 19 },
          { size: "L", stock: 5  },
        ],
      },
      {
        id: "v4-2",
        color: "Blush",
        colorHex: "#e8c4b8",
        sku: "SP-BL",
        image: "/product8.jpg",
        sizes: [
          { size: "S", stock: 0 },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Modal Lounge Set",
    category: "Loungewear",
    status: "Active",
    tag: null,
    price: 4600,
    sales: 69,
    location: "Both",
    sizeGuide: null,
    variants: [
      {
        id: "v5-1",
        color: "Stone",
        colorHex: "#b5a99a",
        sku: "MLS-ST",
        image: "/product9.jpg",
        sizes: [
          { size: "S", stock: 25 },
          { size: "M", stock: 30 },
          { size: "L", stock: 12 },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Gauze Nightdress",
    category: "Nightwear",
    status: "Active",
    tag: "Best Seller",
    price: 3900,
    sales: 56,
    location: "Collection",
    sizeGuide: null,
    variants: [
      {
        id: "v6-1",
        color: "Ivory",
        colorHex: "#f5f0e8",
        sku: "GN-IV",
        image: "/product11.jpg",
        sizes: [
          { size: "Free Size", stock: 3 },
        ],
      },
    ],
  },
  {
    id: 7,
    name: "Silk Kimono Robe",
    category: "Robes",
    status: "Active",
    tag: "Limited",
    price: 7200,
    sales: 38,
    location: "Home",
    sizeGuide: null,
    variants: [
      {
        id: "v7-1",
        color: "Noir",
        colorHex: "#2a2a2a",
        sku: "SKR-NO",
        image: "/product1.jpg",
        sizes: [
          { size: "S", stock: 4 },
          { size: "M", stock: 2 },
          { size: "L", stock: 0 },
        ],
      },
    ],
  },
  {
    id: 8,
    name: "Cashmere Lounge Top",
    category: "Loungewear",
    status: "Draft",
    tag: "New In",
    price: 8100,
    sales: 22,
    location: "Collection",
    sizeGuide: null,
    variants: [
      {
        id: "v8-1",
        color: "Stone",
        colorHex: "#b5a99a",
        sku: "CLT-ST",
        image: "/product5.jpg",
        sizes: [
          { size: "S", stock: 8  },
          { size: "M", stock: 10 },
        ],
      },
    ],
  },
  {
    id: 9,
    name: "Linen Sleep Shirt",
    category: "Nightwear",
    status: "Archived",
    tag: null,
    price: 3200,
    sales: 88,
    location: "Home",
    sizeGuide: null,
    variants: [
      {
        id: "v9-1",
        color: "Ivory",
        colorHex: "#f5f0e8",
        sku: "LSS-IV",
        image: "/product11.jpg",
        sizes: [
          { size: "S", stock: 0 },
          { size: "M", stock: 0 },
        ],
      },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const getTotalStock = (variants) =>
  variants.reduce((s, v) => s + (v.sizes ?? []).reduce((a, sz) => a + sz.stock, 0), 0);

const getColors = (variants) => [...new Set(variants.map((v) => v.colorHex))];

const newVid = () => `v-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

const STATUS_STYLES = {
  Active:   { pill: "bg-[#eaf3de] text-[#3b6d11]", dot: "bg-[#639922]" },
  Draft:    { pill: "bg-[#faeeda] text-[#854f0b]", dot: "bg-[#ef9f27]" },
  Archived: { pill: "bg-[#f1efe8] text-[#5f5e5a]", dot: "bg-[#b4b2a9]" },
};
const STATUS_CYCLE = { Active: "Draft", Draft: "Archived", Archived: "Active" };

const LOCATION_STYLES = {
  Home:       "bg-[#e6f1fb] text-[#185fa5]",
  Collection: "bg-[#eeedfe] text-[#534ab7]",
  Both:       "bg-[#e1f5ee] text-[#0f6e56]",
};

// ─── Image helpers ───────────────────────────────────────────────────────────
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

// ─── Shared UI Primitives ────────────────────────────────────────────────────
function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Draft;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function LocationBadge({ location }) {
  if (!location) return null;
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${LOCATION_STYLES[location] || "bg-[#f1efe8] text-[#5f5e5a]"}`}>
      {location}
    </span>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1916] text-[#f5f2ed] text-[12px] font-medium px-5 py-2.5 rounded-xl z-[200] shadow-lg pointer-events-none">
      {message}
    </div>
  );
}

function IndeterminateCheckbox({ checked, indeterminate, onChange, className }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input ref={ref} type="checkbox" checked={checked} onChange={onChange} className={className} />
  );
}

// ─── Bulk Action Bar ─────────────────────────────────────────────────────────
function BulkBar({ count, onAction, onClear }) {
  return (
    <div className="bg-[#1a1916] rounded-xl px-4 py-3 flex items-center gap-2 flex-wrap mb-3">
      <span className="text-[12px] font-medium text-[#f5f2ed] mr-1">
        {count} product{count !== 1 ? "s" : ""} selected
      </span>
      {[
        { label: "Set Active",  key: "Active"   },
        { label: "Set Draft",   key: "Draft"    },
        { label: "Archive",     key: "Archived" },
      ].map((a) => (
        <button
          key={a.key}
          onClick={() => onAction(a.key)}
          className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-white/20 text-[#f5f2ed] bg-white/10 hover:bg-white/20 transition-all"
        >
          {a.label}
        </button>
      ))}
      <button
        onClick={() => onAction("delete")}
        className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[#f09595]/50 text-[#f09595] bg-white/5 hover:bg-[#e24b4a]/20 transition-all"
      >
        Delete Selected
      </button>
      <button onClick={onClear} className="ml-auto text-white/40 hover:text-white/70 text-xl leading-none transition-colors">
        ×
      </button>
    </div>
  );
}

// ─── Image Upload Button ─────────────────────────────────────────────────────
function ImageUploadButton({ value, onChange, size = "md", label = "Upload" }) {
  const fileRef = useRef(null);
  const sizeClass = size === "sm"
    ? "w-11 h-11 rounded-lg"
    : "w-14 h-14 rounded-xl";

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await readFileAsBase64(file);
    onChange(base64);
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-3">
      <div
        onClick={() => fileRef.current?.click()}
        className={`${sizeClass} flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0 border border-[#e8e5df] transition-all hover:border-[#1a1916]`}
        style={{ background: value ? "transparent" : "#f5f2ed" }}
      >
        {value ? (
          <img src={value} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[#b4b2a9] text-xl leading-none">+</span>
        )}
      </div>
      {size !== "sm" && (
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] hover:bg-[#1a1916] hover:text-[#f5f2ed] hover:border-[#1a1916] transition-all"
          >
            {value ? "Change" : label}
          </button>
          <p className="text-[10px] text-[#b4b2a9] mt-1">PNG or JPG recommended</p>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}

// ─── Variant Row ─────────────────────────────────────────────────────────────
function VariantRow({ variant: v, onChange, onDelete }) {
  const upd = (field, value) => onChange({ ...v, [field]: value });
  const ic = "text-[11px] px-2 py-1.5 border border-[#e8e5df] rounded-lg bg-white text-[#1a1916] outline-none focus:border-[#1a1916] transition-colors w-full";
  const imgFileRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await readFileAsBase64(file);
    upd("image", base64);
    e.target.value = "";
  };

  const addSize = () =>
    upd("sizes", [...(v.sizes ?? []), { size: "S", stock: 0 }]);

  const updateSize = (i, field, value) =>
    upd("sizes", v.sizes.map((s, idx) => idx === i ? { ...s, [field]: value } : s));

  const removeSize = (i) =>
    upd("sizes", v.sizes.filter((_, idx) => idx !== i));

  return (
    <div className="bg-[#fafaf8] border border-[#e8e5df] rounded-xl p-3 flex flex-col gap-2">

      {/* Top row: image / colour / sku / delete */}
      <div className="grid gap-2 items-center" style={{ gridTemplateColumns: "52px 1fr 112px 28px" }}>

        {/* Variant image — required */}
        <div
          onClick={() => imgFileRef.current?.click()}
          title="Upload variant image (required)"
          className={`w-11 h-11 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0 border transition-all hover:border-[#1a1916] relative ${
            v.image ? "border-[#e8e5df]" : "border-dashed border-[#e24b4a] bg-[#fafaf8]"
          }`}
        >
          {v.image ? (
            <img src={v.image} alt="variant" className="w-full h-full object-cover" />
          ) : (
            <>
              <span className="text-[#e24b4a] text-xl leading-none">+</span>
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#e24b4a]" />
            </>
          )}
          <input ref={imgFileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>

        {/* Colour */}
        <div className="flex items-center gap-1.5">
          <input
            type="color"
            value={v.colorHex}
            onChange={(e) => upd("colorHex", e.target.value)}
            className="w-8 h-8 rounded-lg border border-[#e8e5df] cursor-pointer flex-shrink-0 p-0.5"
          />
          <input
            value={v.color}
            onChange={(e) => upd("color", e.target.value)}
            placeholder="Colour name"
            className={`flex-1 min-w-0 ${ic}`}
          />
        </div>

        {/* SKU */}
        <input
          value={v.sku}
          onChange={(e) => upd("sku", e.target.value.toUpperCase())}
          placeholder="SKU-XX"
          className={`${ic} font-mono`}
        />

        {/* Delete variant */}
        <button
          onClick={onDelete}
          className="w-7 h-7 rounded-lg bg-[#fcebeb] text-[#e24b4a] flex items-center justify-center text-base hover:bg-[#e24b4a] hover:text-white transition-all leading-none"
        >
          ×
        </button>
      </div>

      {/* Sizes sub-rows */}
      <div className="ml-2 pl-3 border-l-2 border-[#e8e5df] flex flex-col gap-1.5">
        <div className="grid gap-2 mb-1" style={{ gridTemplateColumns: "1fr 80px 24px" }}>
          <p className="text-[9px] font-medium tracking-[0.15em] uppercase text-[#b4b2a9]">Size</p>
          <p className="text-[9px] font-medium tracking-[0.15em] uppercase text-[#b4b2a9]">Stock</p>
          <span />
        </div>

        {(v.sizes ?? []).map((sz, i) => (
          <div key={i} className="grid gap-2 items-center" style={{ gridTemplateColumns: "1fr 80px 24px" }}>
            <select
              value={sz.size}
              onChange={(e) => updateSize(i, "size", e.target.value)}
              className={ic}
            >
              {SIZE_OPTS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <input
              type="number"
              value={sz.stock}
              min={0}
              onChange={(e) => updateSize(i, "stock", +e.target.value)}
              className={ic}
            />
            <button
              onClick={() => removeSize(i)}
              className="w-6 h-6 rounded-md bg-[#f1efe8] text-[#b4b2a9] flex items-center justify-center text-sm hover:bg-[#fcebeb] hover:text-[#e24b4a] transition-all leading-none"
            >
              ×
            </button>
          </div>
        ))}

        <button
          onClick={addSize}
          className="self-start text-[10px] font-medium px-2.5 py-1 rounded-lg border border-dashed border-[#c8c5be] text-[#888780] hover:border-[#1a1916] hover:text-[#1a1916] transition-all mt-0.5"
        >
          + Add Size
        </button>
      </div>
    </div>
  );
}

// ─── Product Modal ────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSave }) {
  const isNew = !product.id;

  const [form, setForm] = useState({
    name:      product.name      ?? "",
    category:  product.category  ?? "Nightwear",
    status:    product.status    ?? "Active",
    tag:       product.tag       ?? "",
    location:  product.location  ?? "Home",
    price:     product.price     ?? 0,
    sizeGuide: product.sizeGuide ?? null,
  });

  const [variants, setVariants] = useState(
    (product.variants ?? []).map((v) => ({ ...v, sizes: v.sizes ? [...v.sizes] : [] }))
  );
  const [error, setError] = useState("");

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const addVariant = () =>
    setVariants((vs) => [
      ...vs,
      { id: newVid(), sizes: [{ size: "S", stock: 0 }], color: "Blush", colorHex: "#e8c4b8", sku: "", image: null },
    ]);

  const updateVariant = (id, updated) =>
    setVariants((vs) => vs.map((v) => (v.id === id ? updated : v)));

  const removeVariant = (id) => setVariants((vs) => vs.filter((v) => v.id !== id));

  const handleSave = () => {
    if (!form.name.trim())                    { setError("Product name is required."); return; }
    if (form.price <= 0)                      { setError("Please set a valid price."); return; }
    if (variants.length === 0)                { setError("Add at least one variant."); return; }
    if (variants.some((v) => !v.image))       { setError("Every variant requires an image."); return; }
    if (variants.some((v) => !v.sku.trim()))  { setError("All variants need a SKU."); return; }
    const skus = variants.map((v) => v.sku.trim());
    if (new Set(skus).size !== skus.length)   { setError("Each variant must have a unique SKU."); return; }
    if (variants.some((v) => !v.sizes || v.sizes.length === 0)) {
      setError("Each variant needs at least one size.");
      return;
    }
    setError("");
    onSave({
      ...product,
      ...form,
      tag:      form.tag || null,
      variants,
      id:       product.id || Date.now(),
      sales:    product.sales ?? 0,
    });
  };

  const fieldLabel  = "text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-1 block";
  const fieldInput  = "w-full text-[12px] px-3 py-2 border border-[#e8e5df] rounded-xl bg-white text-[#1a1916] placeholder-[#b4b2a9] outline-none focus:border-[#1a1916] transition-colors";
  const fieldSelect = "w-full text-[12px] px-3 py-2 border border-[#e8e5df] rounded-xl bg-white text-[#5f5e5a] outline-none focus:border-[#1a1916] transition-colors";

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
        <div className="p-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">
                {isNew ? "New Product" : "Edit Product"}
              </p>
              <h2 className="text-xl font-medium text-[#1a1916]">
                {isNew ? "Add Product" : (form.name || product.name)}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#f1efe8] flex items-center justify-center text-[#5f5e5a] hover:bg-[#e8e5df] transition-colors text-lg leading-none flex-shrink-0"
            >
              ×
            </button>
          </div>

          {/* ── Product Info ── */}
          <div className="mb-5 pb-5 border-b border-[#f1efe8]">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] font-medium mb-3">
              Product Info
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={fieldLabel}>Product Name *</label>
                <input
                  className={fieldInput}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Silk Night Slip"
                />
              </div>
              <div>
                <label className={fieldLabel}>Category</label>
                <select className={fieldSelect} value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {CATEGORIES_OPTS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={fieldLabel}>Price (PKR) *</label>
                <input
                  type="number"
                  min={0}
                  className={fieldInput}
                  value={form.price}
                  onChange={(e) => set("price", +e.target.value)}
                  placeholder="e.g. 4900"
                />
              </div>
              <div>
                <label className={fieldLabel}>Tag</label>
                <select className={fieldSelect} value={form.tag || ""} onChange={(e) => set("tag", e.target.value)}>
                  <option value="">No tag</option>
                  {TAG_OPTS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={fieldLabel}>Status</label>
                <select className={fieldSelect} value={form.status} onChange={(e) => set("status", e.target.value)}>
                  {["Active", "Draft", "Archived"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Location ── */}
          <div className="mb-5 pb-5 border-b border-[#f1efe8]">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] font-medium mb-1">
              Show On
            </p>
            <p className="text-[11px] text-[#888780] mb-3">
              Where should this product appear on the storefront?
            </p>
            <div className="flex gap-2 flex-wrap">
              {LOCATION_OPTS.map((loc) => {
                const isActive = form.location === loc;
                const activeStyle =
                  loc === "Home"         ? "bg-[#e6f1fb] text-[#185fa5] border-[#85b7eb]"
                  : loc === "Collection" ? "bg-[#eeedfe] text-[#534ab7] border-[#afa9ec]"
                  :                       "bg-[#e1f5ee] text-[#0f6e56] border-[#5dcaa5]";
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => set("location", loc)}
                    className={`text-[12px] font-medium px-4 py-2 rounded-xl border transition-all ${
                      isActive
                        ? activeStyle
                        : "border-[#e8e5df] text-[#888780] bg-white hover:border-[#1a1916] hover:text-[#1a1916]"
                    }`}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Size Guide ── */}
          <div className="mb-5 pb-5 border-b border-[#f1efe8]">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] font-medium mb-1">
              Size Guide
            </p>
            <p className="text-[11px] text-[#888780] mb-3">
              Upload a size chart or measurement guide shown to customers on the product page.
            </p>
            <ImageUploadButton
              value={form.sizeGuide}
              onChange={(base64) => set("sizeGuide", base64)}
              label="Upload Size Guide"
            />
          </div>

          {/* ── Variants ── */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] font-medium">
                  Variants
                  <span className="ml-2 normal-case tracking-normal font-normal text-[#b4b2a9]">
                    · {variants.length} added
                  </span>
                </p>
                <p className="text-[11px] text-[#888780] mt-0.5">
                  Each variant needs an image{" "}
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#fcebeb] text-[#a32d2d]">required</span>
                  , colour, SKU — and sizes with stock below
                </p>
              </div>
              <button
                onClick={addVariant}
                className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-[#1a1916] text-[#f5f2ed] hover:bg-[#333] transition-all flex-shrink-0"
              >
                + Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="border-2 border-dashed border-[#e8e5df] rounded-xl p-8 text-center">
                <p className="text-[13px] text-[#b4b2a9]">No variants yet</p>
                <p className="text-[11px] text-[#b4b2a9] mt-1">
                  Add colour variants — each with its own image, SKU, and sizes
                </p>
                <button
                  onClick={addVariant}
                  className="mt-3 text-[11px] font-medium px-4 py-2 rounded-lg border border-[#e8e5df] text-[#5f5e5a] hover:bg-[#1a1916] hover:text-[#f5f2ed] hover:border-[#1a1916] transition-all"
                >
                  + Add First Variant
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-hide">
                <div className="min-w-[560px]">
                  <div
                    className="grid gap-2 mb-2 px-2"
                    style={{ gridTemplateColumns: "52px 1fr 112px 28px" }}
                  >
                    {["Image *", "Colour", "SKU", ""].map((h) => (
                      <p key={h} className="text-[9px] font-medium tracking-[0.15em] uppercase text-[#b4b2a9]">
                        {h}
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    {variants.map((v) => (
                      <VariantRow
                        key={v.id}
                        variant={v}
                        onChange={(updated) => updateVariant(v.id, updated)}
                        onDelete={() => removeVariant(v.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-[#fcebeb] border border-[#f09595] rounded-xl flex items-center gap-2">
              <span className="text-[#e24b4a] font-bold leading-none">!</span>
              <p className="text-[12px] text-[#a32d2d]">{error}</p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#1a1916] text-[#f5f2ed] text-[12px] font-medium tracking-[0.15em] uppercase rounded-xl hover:bg-[#333] transition-colors"
          >
            {isNew ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Thumbnail ────────────────────────────────────────────────────────
function ProductThumb({ product }) {
  const src = product.variants?.find((v) => v.image)?.image || null;

  if (src) {
    return (
      <img
        src={src}
        alt={product.name}
        className="w-10 h-10 rounded-xl object-cover border border-[#e8e5df] flex-shrink-0"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-[#f5f2ed] flex items-center justify-center text-lg flex-shrink-0">
      🛍
    </div>
  );
}

// ─── Main Products Page ───────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch]     = useState("");
  const [catFilter, setCat]     = useState("All");
  const [locFilter, setLoc]     = useState("All");
  const [statusFilter, setStat] = useState("All");
  const [sortBy, setSort]       = useState("sales");
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [modal, setModal]       = useState(null);
  const [toast, setToast]       = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const resetPage = () => setPage(1);

  // ── Stats ──
  const stats = useMemo(() => ({
    total:      products.length,
    active:     products.filter((p) => p.status === "Active").length,
    draft:      products.filter((p) => p.status === "Draft").length,
    lowStock:   products.filter((p) => { const s = getTotalStock(p.variants); return s > 0 && s <= 10; }).length,
    outOfStock: products.filter((p) => getTotalStock(p.variants) === 0).length,
  }), [products]);

  // ── Filtered & sorted ──
  const filtered = useMemo(() => {
    let d = [...products];
    if (search)
      d = d.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.variants.some((v) => v.sku.toLowerCase().includes(search.toLowerCase()))
      );
    if (catFilter !== "All")    d = d.filter((p) => p.category === catFilter);
    if (locFilter !== "All")    d = d.filter((p) => p.location === locFilter);
    if (statusFilter !== "All") d = d.filter((p) => p.status   === statusFilter);

    if      (sortBy === "name")       d.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "sales")      d.sort((a, b) => b.sales - a.sales);
    else if (sortBy === "stock_asc")  d.sort((a, b) => getTotalStock(a.variants) - getTotalStock(b.variants));
    else if (sortBy === "stock_desc") d.sort((a, b) => getTotalStock(b.variants) - getTotalStock(a.variants));
    else if (sortBy === "price_asc")  d.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") d.sort((a, b) => b.price - a.price);
    return d;
  }, [products, search, catFilter, locFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pageSlice  = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // ── Selection ──
  const toggleRow   = (id) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll   = (chk) => setSelected((prev) => { const n = new Set(prev); pageSlice.forEach((o) => chk ? n.add(o.id) : n.delete(o.id)); return n; });
  const allChecked  = pageSlice.length > 0 && pageSlice.every((o) => selected.has(o.id));
  const someChecked = pageSlice.some((o) => selected.has(o.id));

  // ── CRUD ──
  const saveProduct = (p) => {
    if (products.find((x) => x.id === p.id)) {
      setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
      showToast(`"${p.name}" updated`);
    } else {
      setProducts((prev) => [p, ...prev]);
      showToast(`"${p.name}" added`);
    }
    setModal(null);
    resetPage();
  };

  const deleteProduct = (id) => {
    const p = products.find((x) => x.id === id);
    setProducts((prev) => prev.filter((x) => x.id !== id));
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
    showToast(`"${p?.name}" deleted`);
  };

  const cycleStatus = (id) => {
    setProducts((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: STATUS_CYCLE[p.status] || "Active" } : p)
    );
  };

  const bulkAction = (key) => {
    const ids = [...selected];
    if (key === "delete") {
      setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
      showToast(`${ids.length} product${ids.length !== 1 ? "s" : ""} deleted`);
    } else {
      setProducts((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, status: key } : p));
      showToast(`${ids.length} product${ids.length !== 1 ? "s" : ""} → ${key}`);
    }
    setSelected(new Set());
  };

  const openAdd  = () => setModal({
    name: "", category: "Nightwear", status: "Active", tag: null,
    location: "Home", price: 0, sizeGuide: null, variants: [], sales: 0,
  });
  const openEdit = (p) => setModal(p);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.35; }
        input[type=color] { padding: 2px; cursor: pointer; }
        input[type=color]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type=color]::-webkit-color-swatch { border-radius: 6px; border: none; }
      `}</style>

      <div className="bg-[#f5f2ed] min-h-screen p-6 md:p-8 text-[#1a1916]">

        {/* ── Top bar ── */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="serif text-[22px] font-normal tracking-tight text-[#1a1916]">Products</h1>
            <p className="text-[12px] text-[#b4b2a9] mt-0.5">Saturday, 18 April 2026</p>
          </div>
          <button
            onClick={openAdd}
            className="text-[12px] font-medium px-5 py-2 rounded-xl bg-[#1a1916] text-[#f5f2ed] hover:bg-[#333] transition-all"
          >
            + Add Product
          </button>
        </div>

        {/* ── Overview stats ── */}
        <div className="mb-6">
          <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">
            Overview · All Products
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Total Products", value: stats.total,      color: "text-[#1a1916]" },
              { label: "Active",         value: stats.active,     color: "text-[#3b6d11]" },
              { label: "Draft",          value: stats.draft,      color: "text-[#854f0b]" },
              { label: "Low Stock",      value: stats.lowStock,   color: "text-[#854f0b]" },
              { label: "Out of Stock",   value: stats.outOfStock, color: "text-[#a32d2d]" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[#e8e5df] rounded-xl p-4">
                <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">{s.label}</p>
                <p className={`text-xl font-medium leading-none ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="bg-white border border-[#e8e5df] rounded-xl p-5">

          {/* Search & filter row */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b4b2a9] select-none">⌕</span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search by name or SKU…"
                className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#e8e5df] rounded-xl bg-white text-[#1a1916] placeholder-[#b4b2a9] outline-none focus:border-[#1a1916] transition-colors"
              />
            </div>
            <select
              value={catFilter}
              onChange={(e) => { setCat(e.target.value); resetPage(); }}
              className="text-[12px] px-3 py-2 border border-[#e8e5df] rounded-xl bg-white text-[#5f5e5a] outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES_OPTS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select
              value={locFilter}
              onChange={(e) => { setLoc(e.target.value); resetPage(); }}
              className="text-[12px] px-3 py-2 border border-[#e8e5df] rounded-xl bg-white text-[#5f5e5a] outline-none"
            >
              <option value="All">All Locations</option>
              {LOCATION_OPTS.map((l) => <option key={l}>{l}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSort(e.target.value)}
              className="text-[12px] px-3 py-2 border border-[#e8e5df] rounded-xl bg-white text-[#5f5e5a] outline-none"
            >
              <option value="sales">Top Sales</option>
              <option value="name">Name A–Z</option>
              <option value="stock_asc">Stock: Low–High</option>
              <option value="stock_desc">Stock: High–Low</option>
              <option value="price_asc">Price: Low–High</option>
              <option value="price_desc">Price: High–Low</option>
            </select>
          </div>

          {/* Status tabs */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {["All", "Active", "Draft", "Archived"].map((s) => (
              <button
                key={s}
                onClick={() => { setStat(s); resetPage(); }}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${
                  statusFilter === s
                    ? "bg-[#1a1916] text-[#f5f2ed]"
                    : "bg-[#f5f2ed] text-[#888780] hover:text-[#1a1916]"
                }`}
              >
                {s}
                <span className={`ml-1.5 text-[10px] ${statusFilter === s ? "opacity-60" : "opacity-50"}`}>
                  {s === "All" ? products.length : products.filter((p) => p.status === s).length}
                </span>
              </button>
            ))}
          </div>

          {/* Bulk bar */}
          {selected.size > 0 && (
            <BulkBar count={selected.size} onAction={bulkAction} onClear={() => setSelected(new Set())} />
          )}

          {/* Select-all row */}
          <div className="flex items-center gap-2 mb-3">
            <label className="flex items-center gap-2 text-[11px] text-[#b4b2a9] cursor-pointer select-none">
              <IndeterminateCheckbox
                checked={allChecked}
                indeterminate={someChecked && !allChecked}
                onChange={(e) => toggleAll(e.target.checked)}
                className="accent-[#1a1916] w-3.5 h-3.5"
              />
              Select all visible
            </label>
            <span className="ml-auto text-[11px] text-[#b4b2a9]">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[880px]">
              <thead>
                <tr className="border-b border-[#e8e5df]">
                  {["", "Product", "Category", "Variants", "Colours", "Total Stock", "Price", "Location", "Sales", "Status", ""].map((h, i) => (
                    <th key={i} className="text-left text-[9px] tracking-[0.18em] uppercase text-[#b4b2a9] font-medium pb-3 pr-4 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f2ed]">
                {pageSlice.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-14 text-center text-[12px] text-[#b4b2a9]">
                      No products match your filters
                    </td>
                  </tr>
                ) : (
                  pageSlice.map((p) => {
                    const stock  = getTotalStock(p.variants);
                    const colors = getColors(p.variants);
                    const isOut  = stock === 0;
                    const isLow  = !isOut && stock <= 10;

                    return (
                      <tr
                        key={p.id}
                        className={`transition-colors ${selected.has(p.id) ? "bg-[#f5f2f0]" : "hover:bg-[#fafaf8]"}`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 pr-3 w-5">
                          <input
                            type="checkbox"
                            checked={selected.has(p.id)}
                            onChange={() => toggleRow(p.id)}
                            className="accent-[#1a1916] w-3.5 h-3.5 cursor-pointer"
                          />
                        </td>

                        {/* Product */}
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-2.5">
                            <ProductThumb product={p} />
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-[12px] font-medium text-[#1a1916]">{p.name}</p>
                                {p.tag && (
                                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#f1efe8] text-[#5f5e5a]">
                                    {p.tag}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 pr-4">
                          <span className="text-[11px] text-[#5f5e5a]">{p.category}</span>
                        </td>

                        {/* Variants count */}
                        <td className="py-3.5 pr-4">
                          <span className="text-[11px] font-medium bg-[#f1efe8] text-[#5f5e5a] px-2 py-0.5 rounded-md">
                            {p.variants.length}
                          </span>
                        </td>

                        {/* Colour swatches */}
                        <td className="py-3.5 pr-4">
                          <div className="flex gap-1 items-center">
                            {colors.slice(0, 5).map((hex, i) => (
                              <span
                                key={i}
                                className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                                style={{ background: hex }}
                              />
                            ))}
                            {colors.length > 5 && (
                              <span className="text-[9px] text-[#b4b2a9]">+{colors.length - 5}</span>
                            )}
                          </div>
                        </td>

                        {/* Total Stock */}
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[12px] font-medium ${isOut ? "text-[#a32d2d]" : isLow ? "text-[#854f0b]" : "text-[#1a1916]"}`}>
                              {stock}
                            </span>
                            {isOut && (
                              <span className="text-[9px] font-semibold bg-[#fcebeb] text-[#a32d2d] px-1.5 py-0.5 rounded">
                                OUT
                              </span>
                            )}
                            {isLow && (
                              <span className="text-[9px] font-semibold bg-[#faeeda] text-[#854f0b] px-1.5 py-0.5 rounded">
                                LOW
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Price — single price per product */}
                        <td className="py-3.5 pr-4">
                          <span className="text-[12px] font-medium text-[#1a1916]">
                            PKR {p.price.toLocaleString()}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 pr-4">
                          <LocationBadge location={p.location} />
                        </td>

                        {/* Sales */}
                        <td className="py-3.5 pr-4">
                          <span className="text-[11px] text-[#5f5e5a]">{p.sales.toLocaleString()}</span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 pr-4">
                          <button
                            onClick={() => cycleStatus(p.id)}
                            title="Click to cycle: Active → Draft → Archived"
                            className="hover:opacity-75 transition-opacity"
                          >
                            <StatusPill status={p.status} />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEdit(p)}
                              className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] hover:bg-[#1a1916] hover:text-[#f5f2ed] hover:border-[#1a1916] transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-[#fcebeb] text-[#a32d2d] hover:bg-[#e24b4a] hover:text-white transition-all"
                            >
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
            <p className="text-[11px] text-[#b4b2a9]">
              Showing{" "}
              {filtered.length === 0
                ? 0
                : `${(safePage - 1) * PER_PAGE + 1}–${Math.min(safePage * PER_PAGE, filtered.length)}`}{" "}
              of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={safePage === 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] disabled:opacity-30 disabled:cursor-not-allowed transition-all enabled:hover:bg-[#1a1916] enabled:hover:text-[#f5f2ed] enabled:hover:border-[#1a1916]"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`text-[11px] font-medium w-8 h-8 rounded-lg transition-all ${
                    n === safePage ? "bg-[#1a1916] text-[#f5f2ed]" : "text-[#5f5e5a] hover:bg-[#f1efe8]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] disabled:opacity-30 disabled:cursor-not-allowed transition-all enabled:hover:bg-[#1a1916] enabled:hover:text-[#f5f2ed] enabled:hover:border-[#1a1916]"
              >
                →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Product Modal ── */}
      {modal && (
        <ProductModal
          product={modal}
          onClose={() => setModal(null)}
          onSave={saveProduct}
        />
      )}

      {/* ── Toast ── */}
      <Toast message={toast} />
    </>
  );
}