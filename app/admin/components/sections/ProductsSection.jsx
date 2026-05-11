"use client";

import { useState, useEffect, useRef } from "react";
import useProductService from "../../../services/product/index";
// import { getAccessToken } from "../../../utils/token";
import useUploadService from "../../../services/upload/index";

const CATEGORIES_OPTS = ["Nightwear", "Robes", "Loungewear", "Sets"];
const SIZE_OPTS       = ["S", "M", "L", "XL"];
const TAG_OPTS        = ["New In", "Best Seller", "Limited", "Sale"];
const LOCATION_OPTS   = ["Home", "Collection", "Both"];
const PER_PAGE        = 7;

const getTotalStock = (sizes) =>
  (sizes ?? []).reduce((sum, s) => sum + s.stock, 0);

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

// ─── Bulk Action Bar ──────────────────────────────────────────────────────────
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

// ─── Image Compression ────────────────────────────────────────────────────────
// Resizes + compresses image in the browser before S3 upload
// Targets ~800KB max, resizes to max 1400px on longest side
async function compressImage(file, { maxWidth = 1400, maxHeight = 1400, quality = 0.82 } = {}) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url); // free memory

      // ── Calculate new dimensions keeping aspect ratio ──
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width  = Math.round(width  * ratio);
        height = Math.round(height * ratio);
      }

      // ── Draw onto canvas at new size ──
      const canvas = document.createElement("canvas");
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // ── Export as JPEG (much smaller than PNG for photos) ──
      canvas.toBlob(
        (blob) => {
          // Keep original filename but signal it's now a jpeg
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          console.log(
            `Compressed: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(compressed.size / 1024 / 1024).toFixed(1)}MB`
          );
          resolve(compressed);
        },
        "image/jpeg",
        quality,
      );
    };

    img.src = url;
  });
}

// ─── ImageGalleryUpload — receives getPresignedUrl as a prop ─────────────────
function ImageGalleryUpload({ images, onChange, getPresignedUrl }) {
  const fileRef = useRef(null);
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState("");

  const uploadFileToS3 = async (file) => {
    const fileToUpload = file.type.startsWith("image/")
      ? await compressImage(file)
      : file;

    const { uploadUrl, publicUrl } = await getPresignedUrl({
      filename:    fileToUpload.name,
      contentType: fileToUpload.type,
    });

    const s3Res = await fetch(uploadUrl, {
      method:  "PUT",
      headers: { "Content-Type": fileToUpload.type },
      body:    fileToUpload,
    });

    if (!s3Res.ok) throw new Error("S3 upload failed");

    return publicUrl;
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setUploadError("");

    try {
      const urls = await Promise.all(files.map((file) => uploadFileToS3(file)));
      const next = [
        ...images,
        ...urls.map((url, i) => ({ url, order: images.length + i })),
      ];
      onChange(next);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const remove = (i) => {
    onChange(images.filter((_, idx) => idx !== i).map((img, idx) => ({ ...img, order: idx })));
  };

  const moveLeft = (i) => {
    if (i === 0) return;
    const next = [...images];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next.map((img, idx) => ({ ...img, order: idx })));
  };

  const moveRight = (i) => {
    if (i === images.length - 1) return;
    const next = [...images];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next.map((img, idx) => ({ ...img, order: idx })));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((img, i) => (
          <div key={i} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[#e8e5df] flex-shrink-0">
            <img src={img.url} alt={`img-${i}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button type="button" onClick={() => moveLeft(i)} disabled={i === 0}
                className="w-5 h-5 rounded bg-white/80 text-[#1a1916] text-[10px] flex items-center justify-center disabled:opacity-30">←</button>
              <button type="button" onClick={() => remove(i)}
                className="w-5 h-5 rounded bg-[#e24b4a] text-white text-[10px] flex items-center justify-center">×</button>
              <button type="button" onClick={() => moveRight(i)} disabled={i === images.length - 1}
                className="w-5 h-5 rounded bg-white/80 text-[#1a1916] text-[10px] flex items-center justify-center disabled:opacity-30">→</button>
            </div>
            {i === 0 && (
              <span className="absolute top-1 left-1 text-[8px] font-semibold bg-[#1a1916] text-white px-1 rounded">MAIN</span>
            )}
          </div>
        ))}

        <div
          onClick={() => !uploading && fileRef.current?.click()}
          className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors ${
            uploading
              ? "border-[#1a1916] bg-[#f5f2ed] cursor-wait"
              : "border-[#c8c5be] cursor-pointer hover:border-[#1a1916]"
          }`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin text-[#b4b2a9]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span className="text-[9px] text-[#b4b2a9]">Uploading…</span>
            </>
          ) : (
            <>
              <span className="text-[#b4b2a9] text-2xl leading-none">+</span>
              <span className="text-[9px] text-[#b4b2a9]">Add</span>
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <p className="text-[11px] text-[#a32d2d] mt-1">{uploadError}</p>
      )}

      <p className="text-[10px] text-[#b4b2a9] mt-1">
        First image is the main display image. Hover to reorder or remove.
      </p>

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
    </div>
  );
}


// ─── Size Stock Editor ────────────────────────────────────────────────────────
function SizeStockEditor({ sizes, onChange }) {
  const getStock = (sz) => sizes.find((s) => s.size === sz)?.stock ?? 0;

  const setStock = (sz, value) => {
    const stock = Math.max(0, parseInt(value) || 0);
    const existing = sizes.find((s) => s.size === sz);
    if (existing) {
      onChange(sizes.map((s) => (s.size === sz ? { ...s, stock } : s)));
    } else {
      onChange([...sizes, { size: sz, stock }]);
    }
  };

  const isActive = (sz) => sizes.some((s) => s.size === sz);
  const toggle   = (sz) => {
    if (isActive(sz)) {
      onChange(sizes.filter((s) => s.size !== sz));
    } else {
      onChange([...sizes, { size: sz, stock: 0 }]);
    }
  };

  const ic = "text-[11px] px-2 py-1.5 border border-[#e8e5df] rounded-lg bg-white text-[#1a1916] outline-none focus:border-[#1a1916] transition-colors w-full";

  return (
    <div className="grid grid-cols-4 gap-2">
      {SIZE_OPTS.map((sz) => {
        const active = isActive(sz);
        return (
          <div
            key={sz}
            className={`rounded-xl border p-2.5 transition-all ${active ? "border-[#1a1916] bg-white" : "border-[#e8e5df] bg-[#fafaf8]"}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[11px] font-semibold ${active ? "text-[#1a1916]" : "text-[#b4b2a9]"}`}>
                {sz}
              </span>
              <button
                type="button"
                onClick={() => toggle(sz)}
                className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                  active ? "bg-[#1a1916] border-[#1a1916]" : "border-[#c8c5be] bg-white"
                }`}
              >
                {active && <span className="text-white text-[8px] font-bold leading-none">✓</span>}
              </button>
            </div>
            <input
              type="number"
              min={0}
              disabled={!active}
              value={active ? getStock(sz) : ""}
              onChange={(e) => setStock(sz, e.target.value)}
              placeholder="qty"
              className={`${ic} text-center ${!active ? "opacity-30 cursor-not-allowed" : ""}`}
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── Product Modal ────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSave, saving }) {
   const { getPresignedUrl } = useUploadService(); 
  const isNew = !product.id;

  const [form, setForm] = useState({
    name:          product.name          ?? "",
    description:   product.description   ?? "",
    category:      product.category      ?? "Nightwear",
    status:        product.status        ?? "Active",
    tag:           product.tag           ?? "",
    location:      product.location      ?? "Home",
    price:         product.price         ?? 0,
    discountPrice: product.discountPrice ?? null,
  });

  const [images, setImages] = useState(
    (product.images ?? [])
      .map((img) => ({ url: img.url, order: img.order ?? 0 }))
      .sort((a, b) => a.order - b.order)
  );

  const [sizes, setSizes] = useState(
    (product.sizes ?? []).map((s) => ({ size: s.size, stock: s.stock }))
  );

  const [error, setError] = useState("");
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = () => {
    if (!form.name.trim()) {
      setError("Product name is required."); return;
    }
    if (form.price <= 0) {
      setError("Please set a valid price."); return;
    }
    if (form.discountPrice !== null && form.discountPrice >= form.price) {
      setError("Discount price must be less than the original price."); return;
    }
    if (images.length === 0) {
      setError("Add at least one product image."); return;
    }
    if (sizes.length === 0) {
      setError("Select at least one size."); return;
    }
    setError("");

    onSave({
      ...(product.id ? { id: product.id } : {}),
      ...form,
      description:   form.description.trim() || null,
      tag:           form.tag || null,
      images:        images.map((img, i) => ({ url: img.url, order: i })),
      sizes,
      sales:         product.sales ?? 0,
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
                {isNew ? "Add Product" : form.name || product.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#f1efe8] flex items-center justify-center text-[#5f5e5a] hover:bg-[#e8e5df] transition-colors text-lg leading-none flex-shrink-0"
            >×</button>
          </div>

          {/* ── Product Info ── */}
          <div className="mb-5 pb-5 border-b border-[#f1efe8]">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] font-medium mb-3">Product Info</p>
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

              <div className="col-span-2">
                <label className={fieldLabel}>
                  Short Description
                  <span className="ml-1.5 normal-case tracking-normal font-normal text-[#b4b2a9]">optional · max 500 chars</span>
                </label>
                <textarea
                  className={`${fieldInput} resize-none h-20`}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="e.g. Luxuriously soft slip crafted from pure mulberry silk…"
                  maxLength={500}
                />
                <p className="text-[10px] text-[#b4b2a9] mt-1 text-right">
                  {form.description.length}/500
                </p>
              </div>

              <div>
                <label className={fieldLabel}>Category</label>
                <select className={fieldSelect} value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {CATEGORIES_OPTS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className={fieldLabel}>Tag</label>
                <select className={fieldSelect} value={form.tag || ""} onChange={(e) => set("tag", e.target.value)}>
                  <option value="">No tag</option>
                  {TAG_OPTS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className={fieldLabel}>Price (PKR) *</label>
                <input
                  type="number" min={0} className={fieldInput}
                  value={form.price}
                  onChange={(e) => set("price", +e.target.value)}
                  placeholder="e.g. 4900"
                />
              </div>

              <div>
                <label className={fieldLabel}>
                  Discount Price (PKR)
                  <span className="ml-1.5 normal-case tracking-normal font-normal text-[#b4b2a9]">optional</span>
                </label>
                <input
                  type="number" min={0} className={fieldInput}
                  value={form.discountPrice ?? ""}
                  onChange={(e) => set("discountPrice", e.target.value ? +e.target.value : null)}
                  placeholder="e.g. 4000"
                />
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
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] font-medium mb-1">Show On</p>
            <p className="text-[11px] text-[#888780] mb-3">Where should this product appear on the storefront?</p>
            <div className="flex gap-2 flex-wrap">
              {LOCATION_OPTS.map((loc) => {
                const isActive = form.location === loc;
                const activeStyle =
                  loc === "Home"       ? "bg-[#e6f1fb] text-[#185fa5] border-[#85b7eb]" :
                  loc === "Collection" ? "bg-[#eeedfe] text-[#534ab7] border-[#afa9ec]" :
                                        "bg-[#e1f5ee] text-[#0f6e56] border-[#5dcaa5]";
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => set("location", loc)}
                    className={`text-[12px] font-medium px-4 py-2 rounded-xl border transition-all ${
                      isActive ? activeStyle : "border-[#e8e5df] text-[#888780] bg-white hover:border-[#1a1916] hover:text-[#1a1916]"
                    }`}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Product Images ── */}
          <div className="mb-5 pb-5 border-b border-[#f1efe8]">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] font-medium mb-1">Product Images *</p>
            <p className="text-[11px] text-[#888780] mb-3">
              Upload multiple images. The first image is the main display image.
            </p>
            {/* ✅ No authToken prop — reads from localStorage internally */}
            <ImageGalleryUpload images={images} onChange={setImages} getPresignedUrl={getPresignedUrl} />
          </div>

          {/* ── Sizes & Stock ── */}
          <div className="mb-5">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] font-medium mb-1">Sizes & Stock *</p>
            <p className="text-[11px] text-[#888780] mb-3">
              Toggle the sizes you carry and set stock for each.
            </p>
            <SizeStockEditor sizes={sizes} onChange={setSizes} />
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
            disabled={saving}
            className="w-full py-3 bg-[#1a1916] text-[#f5f2ed] text-[12px] font-medium tracking-[0.15em] uppercase rounded-xl hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : isNew ? "Add Product" : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
}

// ─── Product Thumbnail ────────────────────────────────────────────────────────
function ProductThumb({ product }) {
    const sorted = [...(product.images ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const src = sorted[0]?.url ?? null;
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

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[44, 200, 80, 60, 60, 80, 80, 50, 80, 60].map((w, i) => (
        <td key={i} className="py-4 pr-4">
          <div className="h-3 rounded bg-[#f1efe8]" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Main Products Page ───────────────────────────────────────────────────────
export default function ProductsPage() {
  const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct: apiDeleteProduct,
  } = useProductService();

  // ── Table data ──
  const [products, setProducts]         = useState([]);
  const [meta, setMeta]                 = useState({ total: 0, page: 1, limit: PER_PAGE, totalPages: 1 });
  const [tableLoading, setTableLoading] = useState(false);

  // ── Stats ──
  const [stats, setStats]               = useState({ total: 0, active: 0, draft: 0, lowStock: 0, outOfStock: 0 });
  const [statusCounts, setStatusCounts] = useState({ All: 0, Active: 0, Draft: 0, Archived: 0 });

  // ── Refresh triggers ──
  const [tableTick, setTableTick]       = useState(0);
  const [statsTick, setStatsTick]       = useState(0);

  // ── Filters ──
  const [search, setSearch]             = useState("");
  const [debouncedSearch, setDebounced] = useState("");
  const [catFilter, setCat]             = useState("All");
  const [locFilter, setLoc]             = useState("All");
  const [statusFilter, setStat]         = useState("All");
  const [sortBy, setSort]               = useState("sales");
  const [page, setPage]                 = useState(1);

  // ── UI ──
  const [selected, setSelected]         = useState(new Set());
  const [modal, setModal]               = useState(null);
  const [saving, setSaving]             = useState(false);
  const [toast, setToast]               = useState("");

  const showToast    = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const resetPage    = ()    => setPage(1);
  const refreshTable = ()    => setTableTick((t) => t + 1);
  const refreshStats = ()    => setStatsTick((t) => t + 1);
  const refreshAll   = ()    => { refreshTable(); refreshStats(); };

  // ── Debounce search ──
  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); resetPage(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // ── Fetch table ──
  useEffect(() => {
    let cancelled = false;
    const fetchTable = async () => {
      setTableLoading(true);
      const params = { page, limit: PER_PAGE, sortBy };
      if (debouncedSearch)       params.search   = debouncedSearch;
      if (catFilter    !== "All") params.category = catFilter;
      if (locFilter    !== "All") params.location = locFilter;
      if (statusFilter !== "All") params.status   = statusFilter;
      const res = await getProducts(params);
      if (!cancelled && res) { setProducts(res.data); setMeta(res.meta); }
      if (!cancelled) setTableLoading(false);
    };
    fetchTable();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, catFilter, locFilter, statusFilter, sortBy, page, tableTick]);

  // ── Fetch stats ──
  useEffect(() => {
    const fetchStats = async () => {
      const res = await getProducts({ limit: 999 });
      if (!res) return;
      const all   = res.data;
      const total = res.meta.total;
      setStats({
        total,
        active:     all.filter((p) => p.status === "Active").length,
        draft:      all.filter((p) => p.status === "Draft").length,
        lowStock:   all.filter((p) => { const s = getTotalStock(p.sizes); return s > 0 && s <= 10; }).length,
        outOfStock: all.filter((p) => getTotalStock(p.sizes) === 0).length,
      });
      setStatusCounts({
        All:      total,
        Active:   all.filter((p) => p.status === "Active").length,
        Draft:    all.filter((p) => p.status === "Draft").length,
        Archived: all.filter((p) => p.status === "Archived").length,
      });
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statsTick]);

  // ── Derived ──
  const totalPages = meta.totalPages || 1;
  const safePage   = Math.min(page, totalPages);

  // ── Selection ──
  const toggleRow = (id) =>
    setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = (chk) =>
    setSelected((prev) => { const n = new Set(prev); products.forEach((o) => (chk ? n.add(o.id) : n.delete(o.id))); return n; });
  const allChecked  = products.length > 0 && products.every((o) => selected.has(o.id));
  const someChecked = products.some((o) => selected.has(o.id));

  // ── CRUD ──
  const saveProduct = async (formData) => {
    setSaving(true);
    try {
      if (formData.id) {
        const { id, sales, ...payload } = formData;
        const res = await updateProduct(id, payload);
        if (res) showToast(`"${res.name}" updated`);
      } else {
        const { sales, ...payload } = formData;
        const res = await createProduct(payload);
        if (res) showToast(`"${res.name}" added`);
      }
      setModal(null);
      refreshAll();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const p = products.find((x) => x.id === id);
    await apiDeleteProduct(id);
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
    showToast(`"${p?.name}" deleted`);
    refreshAll();
  };

  const cycleStatus = async (id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    await updateProduct(id, { status: STATUS_CYCLE[p.status] || "Active" });
    refreshAll();
  };

  const bulkAction = async (key) => {
    const ids = [...selected];
    if (key === "delete") {
      await Promise.all(ids.map((id) => apiDeleteProduct(id)));
      showToast(`${ids.length} product${ids.length !== 1 ? "s" : ""} deleted`);
    } else {
      await Promise.all(ids.map((id) => updateProduct(id, { status: key })));
      showToast(`${ids.length} product${ids.length !== 1 ? "s" : ""} → ${key}`);
    }
    setSelected(new Set());
    refreshAll();
  };

  const openAdd = () =>
    setModal({
      name: "", description: "", category: "Nightwear", status: "Active",
      tag: null, location: "Home", price: 0, discountPrice: null,
      images: [], sizes: [], sales: 0,
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
      `}</style>

      <div className="bg-[#f5f2ed] min-h-screen p-6 md:p-8 text-[#1a1916]">

        {/* ── Top bar ── */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="serif text-[22px] font-normal tracking-tight text-[#1a1916]">Products</h1>
            <p className="text-[12px] text-[#b4b2a9] mt-0.5">
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
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
          <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">Overview · All Products</p>
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name…"
                className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#e8e5df] rounded-xl bg-white text-[#1a1916] placeholder-[#b4b2a9] outline-none focus:border-[#1a1916] transition-colors"
              />
            </div>
            <select value={catFilter} onChange={(e) => { setCat(e.target.value); resetPage(); }} className="text-[12px] px-3 py-2 border border-[#e8e5df] rounded-xl bg-white text-[#5f5e5a] outline-none">
              <option value="All">All Categories</option>
              {CATEGORIES_OPTS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={locFilter} onChange={(e) => { setLoc(e.target.value); resetPage(); }} className="text-[12px] px-3 py-2 border border-[#e8e5df] rounded-xl bg-white text-[#5f5e5a] outline-none">
              <option value="All">All Locations</option>
              {LOCATION_OPTS.map((l) => <option key={l}>{l}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSort(e.target.value)} className="text-[12px] px-3 py-2 border border-[#e8e5df] rounded-xl bg-white text-[#5f5e5a] outline-none">
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
                  statusFilter === s ? "bg-[#1a1916] text-[#f5f2ed]" : "bg-[#f5f2ed] text-[#888780] hover:text-[#1a1916]"
                }`}
              >
                {s}
                <span className={`ml-1.5 text-[10px] ${statusFilter === s ? "opacity-60" : "opacity-50"}`}>
                  {statusCounts[s] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* Bulk bar */}
          {selected.size > 0 && (
            <BulkBar count={selected.size} onAction={bulkAction} onClear={() => setSelected(new Set())} />
          )}

          {/* Select-all */}
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
              {meta.total} product{meta.total !== 1 ? "s" : ""} found
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-[#e8e5df]">
                  {["", "Product", "Category", "Images", "Sizes", "Total Stock", "Price", "Location", "Sales", "Status", ""].map((h, i) => (
                    <th key={i} className="text-left text-[9px] tracking-[0.18em] uppercase text-[#b4b2a9] font-medium pb-3 pr-4 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f2ed]">

                {tableLoading && products.length === 0 &&
                  Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonRow key={i} />)
                }

                {!tableLoading && products.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-14 text-center text-[12px] text-[#b4b2a9]">
                      No products match your filters
                    </td>
                  </tr>
                )}

                {products.map((p) => {
                  const stock    = getTotalStock(p.sizes);
                  const isOut    = stock === 0;
                  const isLow    = !isOut && stock <= 10;
                  const imgCount = (p.images ?? []).length;

                  return (
                    <tr
                      key={p.id}
                      className={`transition-all ${selected.has(p.id) ? "bg-[#f5f2f0]" : "hover:bg-[#fafaf8]"} ${tableLoading ? "opacity-50" : ""}`}
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
                            {p.description && (
                              <p className="text-[10px] text-[#b4b2a9] mt-0.5 max-w-[200px] truncate">{p.description}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 pr-4">
                        <span className="text-[11px] text-[#5f5e5a]">{p.category}</span>
                      </td>

                      {/* Images count */}
                      <td className="py-3.5 pr-4">
                        <span className="text-[11px] font-medium bg-[#f1efe8] text-[#5f5e5a] px-2 py-0.5 rounded-md">
                          {imgCount}
                        </span>
                      </td>

                      {/* Sizes */}
                      <td className="py-3.5 pr-4">
                        <div className="flex gap-1 flex-wrap">
                          {(p.sizes ?? []).map((s) => (
                            <span key={s.id ?? s.size} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#f1efe8] text-[#5f5e5a]">
                              {s.size}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Total Stock */}
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[12px] font-medium ${isOut ? "text-[#a32d2d]" : isLow ? "text-[#854f0b]" : "text-[#1a1916]"}`}>
                            {stock}
                          </span>
                          {isOut && <span className="text-[9px] font-semibold bg-[#fcebeb] text-[#a32d2d] px-1.5 py-0.5 rounded">OUT</span>}
                          {isLow && <span className="text-[9px] font-semibold bg-[#faeeda] text-[#854f0b] px-1.5 py-0.5 rounded">LOW</span>}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 pr-4">
                        <div className="flex flex-col gap-0.5">
                          {p.discountPrice ? (
                            <>
                              <span className="text-[12px] font-medium text-[#1a1916]">PKR {p.discountPrice.toLocaleString()}</span>
                              <span className="text-[10px] text-[#b4b2a9] line-through">PKR {p.price.toLocaleString()}</span>
                            </>
                          ) : (
                            <span className="text-[12px] font-medium text-[#1a1916]">PKR {p.price.toLocaleString()}</span>
                          )}
                        </div>
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
                        <button onClick={() => cycleStatus(p.id)} title="Click to cycle status" className="hover:opacity-75 transition-opacity">
                          <StatusPill status={p.status} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(p)} className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] hover:bg-[#1a1916] hover:text-[#f5f2ed] hover:border-[#1a1916] transition-all">Edit</button>
                          <button onClick={() => handleDelete(p.id)} className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-[#fcebeb] text-[#a32d2d] hover:bg-[#e24b4a] hover:text-white transition-all">Del</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
            <p className="text-[11px] text-[#b4b2a9]">
              Showing{" "}
              {meta.total === 0 ? 0 : `${(safePage - 1) * PER_PAGE + 1}–${Math.min(safePage * PER_PAGE, meta.total)}`}{" "}
              of {meta.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={safePage === 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] disabled:opacity-30 disabled:cursor-not-allowed transition-all enabled:hover:bg-[#1a1916] enabled:hover:text-[#f5f2ed] enabled:hover:border-[#1a1916]"
              >←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`text-[11px] font-medium w-8 h-8 rounded-lg transition-all ${
                    n === safePage ? "bg-[#1a1916] text-[#f5f2ed]" : "text-[#5f5e5a] hover:bg-[#f1efe8]"
                  }`}
                >{n}</button>
              ))}
              <button
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] disabled:opacity-30 disabled:cursor-not-allowed transition-all enabled:hover:bg-[#1a1916] enabled:hover:text-[#f5f2ed] enabled:hover:border-[#1a1916]"
              >→</button>
            </div>
          </div>

        </div>
      </div>

      {/* ✅ No authToken prop needed */}
      {modal && (
        <ProductModal
          product={modal}
          onClose={() => setModal(null)}
          onSave={saveProduct}
          saving={saving}
        />
      )}
      <Toast message={toast} />
    </>
  );
}