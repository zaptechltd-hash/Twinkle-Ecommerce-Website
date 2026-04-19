

"use client";
import { useState, useMemo } from "react";
import Navbar from "../components/Header";
import { products } from "../lib/products";
import ProductModal from "../components/ProductModal";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToCart, removeFromCart, toggleWishlist } from "../store/index";

// ── Constants ──────────────────────────────────────────
const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];
const FABRICS = ["Silk", "Velvet", "Modal", "Satin", "Cotton", "Cashmere"];
const COLORS = [
  { name: "Blush", hex: "#e8c4b8" },
  { name: "Noir", hex: "#2a2a2a" },
  { name: "Ivory", hex: "#f5f0e8" },
  { name: "Stone", hex: "#b5a99a" },
];
const SIZES_ALL = ["XS", "S", "M", "L", "XL"];
const PRICE_RANGES = [
  { label: "Under PKR 4,500", min: 0, max: 4500 },
  { label: "PKR 4,500 – 6,000", min: 4500, max: 6000 },
  { label: "PKR 6,000 – 8,000", min: 6000, max: 8000 },
  { label: "PKR 8,000+", min: 8000, max: Infinity },
];

// ── Filter Components (unchanged) ──────────────────────
function FilterAccordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stone-100">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left">
        <span className="text-[10px] tracking-[0.28em] text-stone-600 uppercase">{title}</span>
        <span className="text-stone-300 text-[14px] leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

function FilterPanel({ filters, onChange, onClear }) {
  const activeCount =
    filters.fabrics.length + filters.colors.length + filters.sizes.length + (filters.priceRange !== null ? 1 : 0);

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.28em] text-stone-700 uppercase">Filters</span>
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-stone-800 text-white text-[8px] flex items-center justify-center">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-[9px] tracking-[0.2em] text-stone-400 uppercase underline underline-offset-2 hover:text-stone-700 transition-colors">Clear all</button>
        )}
      </div>

      <FilterAccordion title="Price" defaultOpen={true}>
        <div className="flex flex-col gap-1">
          {PRICE_RANGES.map((range, i) => {
            const active = filters.priceRange === i;
            return (
              <button key={i} onClick={() => onChange({ ...filters, priceRange: active ? null : i })}
                className={`text-left text-[11px] tracking-wide py-1.5 flex items-center gap-2 transition-colors ${active ? "text-stone-900" : "text-stone-400 hover:text-stone-700"}`}>
                <span className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-all ${active ? "border-stone-800 bg-stone-800" : "border-stone-200"}`}>
                  {active && <svg width="7" height="7" viewBox="0 0 10 10"><polyline points="1,5 4,8 9,2" stroke="white" strokeWidth="1.5" fill="none" /></svg>}
                </span>
                {range.label}
              </button>
            );
          })}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Fabric">
        <div className="flex flex-col gap-1">
          {FABRICS.map((fab) => {
            const active = filters.fabrics.includes(fab);
            return (
              <button key={fab} onClick={() => onChange({ ...filters, fabrics: active ? filters.fabrics.filter((f) => f !== fab) : [...filters.fabrics, fab] })}
                className={`text-left text-[11px] tracking-wide py-1.5 flex items-center gap-2 transition-colors ${active ? "text-stone-900" : "text-stone-400 hover:text-stone-700"}`}>
                <span className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-all ${active ? "border-stone-800 bg-stone-800" : "border-stone-200"}`}>
                  {active && <svg width="7" height="7" viewBox="0 0 10 10"><polyline points="1,5 4,8 9,2" stroke="white" strokeWidth="1.5" fill="none" /></svg>}
                </span>
                {fab}
              </button>
            );
          })}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Colour">
        <div className="flex flex-col gap-2.5">
          {COLORS.map((col) => {
            const active = filters.colors.includes(col.name);
            return (
              <button key={col.name} onClick={() => onChange({ ...filters, colors: active ? filters.colors.filter((c) => c !== col.name) : [...filters.colors, col.name] })} className="flex items-center gap-3 group">
                <span className={`w-5 h-5 rounded-full border-2 transition-all flex-shrink-0 ${active ? "border-stone-700 scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: col.hex, boxShadow: active ? "0 0 0 1px #79716b" : "0 0 0 1px #e7e5e4" }} />
                <span className={`text-[11px] tracking-wide transition-colors ${active ? "text-stone-900" : "text-stone-400 group-hover:text-stone-700"}`}>{col.name}</span>
              </button>
            );
          })}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES_ALL.map((sz) => {
            const active = filters.sizes.includes(sz);
            return (
              <button key={sz} onClick={() => onChange({ ...filters, sizes: active ? filters.sizes.filter((s) => s !== sz) : [...filters.sizes, sz] })}
                className={`w-10 h-10 text-[11px] tracking-wide border transition-all ${active ? "border-stone-800 bg-stone-800 text-white" : "border-stone-200 text-stone-500 hover:border-stone-400"}`}>
                {sz}
              </button>
            );
          })}
        </div>
      </FilterAccordion>
    </aside>
  );
}

function MobileFilterDrawer({ open, onClose, filters, onChange, onClear, totalResults }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex" style={{ backgroundColor: "rgba(0,0,0,0.3)" }} onClick={onClose}>
      <div className="bg-white w-4/5 max-w-xs h-full flex flex-col ml-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <p className="text-[11px] tracking-[0.25em] text-stone-800 uppercase">Filters</p>
          <button onClick={onClose} className="text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <FilterPanel filters={filters} onChange={onChange} onClear={onClear} />
        </div>
        <div className="border-t border-stone-100 px-6 py-5">
          <button onClick={onClose} className="w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-[0.3em] uppercase hover:bg-stone-700 transition-colors">
            View {totalResults} Results
          </button>
        </div>
      </div>
    </div>
  );
}

function ActiveFilters({ filters, onChange, onClear }) {
  const pills = [];
  filters.fabrics.forEach((f) => pills.push({ label: f, clear: () => onChange({ ...filters, fabrics: filters.fabrics.filter((x) => x !== f) }) }));
  filters.colors.forEach((c) => pills.push({ label: c, clear: () => onChange({ ...filters, colors: filters.colors.filter((x) => x !== c) }) }));
  filters.sizes.forEach((s) => pills.push({ label: s, clear: () => onChange({ ...filters, sizes: filters.sizes.filter((x) => x !== s) }) }));
  if (filters.priceRange !== null) pills.push({ label: PRICE_RANGES[filters.priceRange].label, clear: () => onChange({ ...filters, priceRange: null }) });
  if (pills.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {pills.map((pill, i) => (
        <button key={i} onClick={pill.clear} className="flex items-center gap-1.5 border border-stone-200 px-3 py-1.5 text-[10px] tracking-[0.15em] text-stone-600 uppercase hover:border-stone-400 transition-colors group">
          {pill.label}
          <span className="text-stone-300 group-hover:text-stone-600 transition-colors">✕</span>
        </button>
      ))}
      <button onClick={onClear} className="px-3 py-1.5 text-[10px] tracking-[0.15em] text-stone-400 uppercase underline underline-offset-2 hover:text-stone-700 transition-colors">Clear all</button>
    </div>
  );
}

// ── Cart Sidebar (for collection page) ────────────────
function CartSidebar({ cart, onClose, onRemove }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  return (
    <div className="fixed inset-0 z-[200] flex justify-end" style={{ backgroundColor: "rgba(0,0,0,0.3)" }} onClick={onClose}>
      <div className="bg-white w-full max-w-sm h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <p className="text-[11px] tracking-[0.25em] text-stone-800 uppercase">Your Bag ({cart.length})</p>
          <button onClick={onClose} className="text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
          {cart.length === 0 && <p className="text-[12px] text-stone-400 text-center mt-16 tracking-wide">Your bag is empty</p>}
          {cart.map((item, i) => (
            <div key={i} className="flex gap-4">
              <img src={item.images[0]} alt={item.name} className="w-20 h-24 object-cover flex-shrink-0" />
              <div className="flex flex-col justify-between flex-1 py-0.5">
                <div>
                  <p className="text-[11px] tracking-[0.15em] text-stone-800 uppercase">{item.name}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5 tracking-wide">Size: {item.selectedSize} · Qty: {item.qty}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-stone-600 tracking-wide">PKR {(item.price * item.qty).toLocaleString()}</p>
                  <button onClick={() => onRemove(i)} className="text-[10px] text-stone-300 hover:text-stone-500 tracking-wide transition-colors">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-stone-100 px-6 py-6">
            <div className="flex justify-between mb-5">
              <p className="text-[11px] tracking-[0.15em] text-stone-500 uppercase">Total</p>
              <p className="text-[13px] tracking-wide text-stone-800">PKR {total.toLocaleString()}</p>
            </div>
            <button className="w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-[0.3em] uppercase hover:bg-stone-700 transition-colors">Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────
export default function CollectionPage() {
  const dispatch = useAppDispatch();

  // Redux state
  const cart = useAppSelector((s) => s.cart);
  const wishlist = useAppSelector((s) => s.wishlist);
  const user = useAppSelector((s) => s.auth);
  const [authOpen, setAuthOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  // Local UI state
  const [filters, setFilters] = useState({ fabrics: [], colors: [], sizes: [], priceRange: null });
  const [sort, setSort] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (filters.fabrics.length) list = list.filter((p) => filters.fabrics.includes(p.fabric));
    if (filters.colors.length) list = list.filter((p) => filters.colors.includes(p.color));
    if (filters.sizes.length) list = list.filter((p) => filters.sizes.some((s) => p.sizes.includes(s)));
    if (filters.priceRange !== null) {
      const range = PRICE_RANGES[filters.priceRange];
      list = list.filter((p) => p.price >= range.min && p.price < range.max);
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [filters, sort]);

  function clearFilters() {
    setFilters({ fabrics: [], colors: [], sizes: [], priceRange: null });
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  console.log("cartCount", cartCount)
  return (
    <div className="min-h-screen bg-white">
   
      <Navbar
  cartCount={cartCount}
  onCartOpen={() => setCartOpen(true)}
  wishlistCount={wishlist.length}
  onWishlistOpen={() => setWishlistOpen(true)}  // add wishlist open state too
  user={user}
  onUserClick={() => setAuthOpen(true)}     
  currentPage="collection"
/>

      <div className="px-6 md:px-12 pt-10 pb-0">
        <div className="border-b border-stone-100 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-2">TwinkleOfficial</p>
            <h1 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-stone-800 uppercase">Nightwear</h1>
          </div>
          <p className="text-[11px] tracking-wide text-stone-400">{filtered.length} piece{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 md:px-12 py-4 flex items-center justify-between border-b border-stone-100 sticky top-0 bg-white z-20">
        <button onClick={() => setMobileFiltersOpen(true)} className="md:hidden flex items-center gap-2 text-[10px] tracking-[0.25em] text-stone-600 uppercase">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.2">
            <line x1="0" y1="1" x2="14" y2="1" /><line x1="3" y1="5" x2="14" y2="5" /><line x1="6" y1="9" x2="14" y2="9" />
          </svg>
          Filter
        </button>
        <div className="hidden md:block" />
        <div className="relative">
          <button onClick={() => setSortDropdown(!sortDropdown)} className="flex items-center gap-2 text-[10px] tracking-[0.22em] text-stone-500 uppercase hover:text-stone-800 transition-colors">
            Sort: {SORT_OPTIONS.find((s) => s.value === sort)?.label}
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" stroke="currentColor" strokeWidth="1.2"><polyline points="1,1 4,4 7,1" /></svg>
          </button>
          {sortDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSortDropdown(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white border border-stone-100 shadow-sm w-48 py-2">
                {SORT_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => { setSort(opt.value); setSortDropdown(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-[11px] tracking-wide transition-colors ${sort === opt.value ? "text-stone-900 bg-stone-50" : "text-stone-400 hover:text-stone-700"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="px-6 md:px-12 pt-8 pb-24 flex gap-12">
        <aside className="hidden md:block w-52 flex-shrink-0 pt-1">
          <FilterPanel filters={filters} onChange={setFilters} onClear={clearFilters} />
        </aside>
        <main className="flex-1 min-w-0">
          <ActiveFilters filters={filters} onChange={setFilters} onClear={clearFilters} />
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-[13px] text-stone-400 tracking-wide mb-4">No pieces match your filters.</p>
              <button onClick={clearFilters} className="text-[10px] tracking-[0.25em] text-stone-600 uppercase underline underline-offset-2 hover:text-stone-900 transition-colors">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  wishlisted={wishlist.some((w) => w.id === product.id)}
                  onWishlistToggle={(p) => dispatch(toggleWishlist(p))}
                  onClick={setActiveProduct}
                />
              ))}
            </div>
          )}
          {filtered.length > 0 && (
            <div className="mt-16 text-center">
              <button className="text-[10px] tracking-[0.3em] text-stone-500 uppercase border border-stone-200 px-10 py-3.5 hover:border-stone-500 hover:text-stone-800 transition-all">Load More</button>
            </div>
          )}
        </main>
      </div>

      <Footer />

      <MobileFilterDrawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} filters={filters} onChange={setFilters} onClear={clearFilters} totalResults={filtered.length} />

      {cartOpen && (
        <CartSidebar cart={cart} onClose={() => setCartOpen(false)} onRemove={(idx) => dispatch(removeFromCart(idx))} />
      )}

      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToCart={(item) => { dispatch(addToCart(item)); setActiveProduct(null); setCartOpen(true); }}
          onWishlistToggle={(p) => dispatch(toggleWishlist(p))}
          wishlisted={wishlist.some((w) => w.id === activeProduct.id)}
        />
      )}
    </div>
  );
}
