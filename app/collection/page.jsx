"use client";
import { useState, useMemo, useEffect } from "react";
import Navbar from "../components/Header";
import ProductModal from "../components/ProductModal";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import AuthModal from "../components/AuthModal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addToCart,
  removeFromCart,
  toggleWishlist,
  removeFromWishlist,
  login,
  logout,
} from "../store/index";
import useProductService from "../services/product/index";
import useAuthService from "../services/auth/index";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartSidebar from "../components/CartSidebar";
import WishlistSidebar from "../components/WishlistSidebar";
import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
} from "../utils/token";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const SIZES_ALL = ["S", "M", "L", "XL"];



function FilterAccordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stone-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-[10px] tracking-[0.28em] text-stone-600 uppercase">
          {title}
        </span>
        <span className="text-stone-300 text-[14px] leading-none">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

function FilterPanel({ filters, onChange, onClear, priceRanges }) {
  const activeCount =
    filters.sizes.length + (filters.priceRange !== null ? 1 : 0);

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.28em] text-stone-700 uppercase">
            Filters
          </span>
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-stone-800 text-white text-[8px] flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="text-[9px] tracking-[0.2em] text-stone-400 uppercase underline underline-offset-2 hover:text-stone-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterAccordion title="Price" defaultOpen={true}>
        <div className="flex flex-col gap-1">
          {priceRanges.map((range, i) => {
            const active = filters.priceRange === i;
            return (
              <button
                key={i}
                onClick={() =>
                  onChange({ ...filters, priceRange: active ? null : i })
                }
                className={`text-left text-[11px] tracking-wide py-1.5 flex items-center gap-2 transition-colors ${
                  active
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-all ${
                    active
                      ? "border-stone-800 bg-stone-800"
                      : "border-stone-200"
                  }`}
                >
                  {active && (
                    <svg width="7" height="7" viewBox="0 0 10 10">
                      <polyline
                        points="1,5 4,8 9,2"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  )}
                </span>
                {range.label}
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
              <button
                key={sz}
                onClick={() =>
                  onChange({
                    ...filters,
                    sizes: active
                      ? filters.sizes.filter((s) => s !== sz)
                      : [...filters.sizes, sz],
                  })
                }
                className={`w-10 h-10 text-[11px] tracking-wide border transition-all ${
                  active
                    ? "border-stone-800 bg-stone-800 text-white"
                    : "border-stone-200 text-stone-500 hover:border-stone-400"
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </FilterAccordion>
    </aside>
  );
}

function MobileFilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  onClear,
  totalResults,
  priceRanges
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[300] flex"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-4/5 max-w-xs h-full flex flex-col ml-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <p className="text-[11px] tracking-[0.25em] text-stone-800 uppercase">
            Filters
          </p>
          <button
            onClick={onClose}
            className="text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors"
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <FilterPanel
            filters={filters}
            onChange={onChange}
            onClear={onClear}
             priceRanges={priceRanges}
          />
        </div>
        <div className="border-t border-stone-100 px-6 py-5">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-[0.3em] uppercase hover:bg-stone-700 transition-colors"
          >
            View {totalResults} Results
          </button>
        </div>
      </div>
    </div>
  );
}

function ActiveFilters({ filters, onChange, onClear, priceRanges }) {
  const pills = [];

  filters.sizes.forEach((s) =>
    pills.push({
      label: s,
      clear: () =>
        onChange({ ...filters, sizes: filters.sizes.filter((x) => x !== s) }),
    }),
  );

  if (filters.priceRange !== null)
    pills.push({
    label: priceRanges[filters.priceRange].label,
      clear: () => onChange({ ...filters, priceRange: null }),
    });

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {pills.map((pill, i) => (
        <button
          key={i}
          onClick={pill.clear}
          className="flex items-center gap-1.5 border border-stone-200 px-3 py-1.5 text-[10px] tracking-[0.15em] text-stone-600 uppercase hover:border-stone-400 transition-colors group"
        >
          {pill.label}
          <span className="text-stone-300 group-hover:text-stone-600 transition-colors">
            ✕
          </span>
        </button>
      ))}
      <button
        onClick={onClear}
        className="px-3 py-1.5 text-[10px] tracking-[0.15em] text-stone-400 uppercase underline underline-offset-2 hover:text-stone-700 transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}

export default function CollectionPage() {
  const dispatch = useAppDispatch();

  const cart = useAppSelector((s) => s.cart);
  const wishlist = useAppSelector((s) => s.wishlist);
  const user = useAppSelector((s) => s.auth);
  const settings = useAppSelector((s) => s.settings);
  const { customerLogin, customerRegister, customerLogout } = useAuthService();

  const PRICE_RANGES = useMemo(() => {
  if (settings?.priceFilters?.length) {
    return settings.priceFilters.map((f) => ({
      label: f.label,
      min:   f.min,
      max:   f.max ?? Infinity, 
    }));
  }
  return [
    { label: "Under PKR 4,500",   min: 0,    max: 4500     },
    { label: "PKR 4,500 – 6,000", min: 4500, max: 6000     },
    { label: "PKR 6,000 – 8,000", min: 6000, max: 8000     },
    { label: "PKR 8,000+",        min: 8000, max: Infinity  },
  ];
}, [settings?.priceFilters]);

  const [filters, setFilters] = useState({ sizes: [], priceRange: null });
  const [sort, setSort] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { getProducts } = useProductService();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    getProducts({ status: "Active", limit: 999 }).then((res) => {
      if (res)
        setProducts(
          res.data.filter(
            (p) => p.location === "Collection" || p.location === "Both",
          ),
        );
      setProductsLoading(false);
    });
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters, sort]);

  const handleLogin = async (email, password) => {
    const data = await customerLogin({ email, password });
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    toast.success("Welcome back!");
    return {
      id: data.user.id,
      email: data.user.email,
      name: email.split("@")[0],
    };
  };

  const handleRegister = async (name, email, password, phoneNumber) => {
    const data = await customerRegister({
      name,
      email,
      password,
      phone: phoneNumber,
    });
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    toast.success("Account created successfully!");
    return { id: data.user.id, email: data.user.email, name };
  };

  const handleLogout = async () => {
    const refreshToken = getRefreshToken();
    try {
      await customerLogout(refreshToken);
    } finally {
      clearTokens();
      dispatch(logout());
    }
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (filters.sizes.length)
      list = list.filter((p) =>
        filters.sizes.some((s) => p.sizes.some((ps) => ps.size === s)),
      );
    if (filters.priceRange !== null) {
      const range = PRICE_RANGES[filters.priceRange];
      list = list.filter(
        (p) => p.discountPrice >= range.min && p.discountPrice < range.max,
      );
    }
    if (sort === "price-asc")
      list.sort((a, b) => a.discountPrice - b.discountPrice);
    else if (sort === "price-desc")
      list.sort((a, b) => b.discountPrice - a.discountPrice);
    return list;
  }, [filters, sort, products]);

  function clearFilters() {
    setFilters({ sizes: [], priceRange: null });
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
        onUserClick={() => setAuthOpen(true)}
        currentPage="collection"
      />

      {/* Page header */}
      <div className="px-6 md:px-12 lg:px-24 xl:px-36 pt-10 pb-0">
        <div className="border-b border-stone-100 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-2">
              TwinkleOfficial
            </p>
            <h1 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-stone-800 uppercase">
              Nightwear
            </h1>
          </div>
          <p className="text-[11px] tracking-wide text-stone-400">
            {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-24 xl:px-36 sticky top-0 bg-white z-20">
        <div className="py-4 flex items-center justify-between border-b border-stone-100">
          {/* Mobile: filter button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 text-[10px] tracking-[0.25em] text-stone-600 uppercase"
          >
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <line x1="0" y1="1" x2="14" y2="1" />
              <line x1="3" y1="5" x2="14" y2="5" />
              <line x1="6" y1="9" x2="14" y2="9" />
            </svg>
            Filter
          </button>
          <div className="hidden md:block" />
          <div className="relative">
            <button
              onClick={() => setSortDropdown(!sortDropdown)}
              className="flex items-center gap-2 text-[10px] tracking-[0.22em] text-stone-500 uppercase hover:text-stone-800 transition-colors"
            >
              Sort: {SORT_OPTIONS.find((s) => s.value === sort)?.label}
              <svg
                width="8"
                height="5"
                viewBox="0 0 8 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <polyline points="1,1 4,4 7,1" />
              </svg>
            </button>
            {sortDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSortDropdown(false)}
                />
                <div className="absolute right-0 top-8 z-20 bg-white border border-stone-100 shadow-sm w-48 py-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSort(opt.value);
                        setSortDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-[11px] tracking-wide transition-colors ${
                        sort === opt.value
                          ? "text-stone-900 bg-stone-50"
                          : "text-stone-400 hover:text-stone-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="px-6 md:px-12 lg:px-24 xl:px-36 pt-8 pb-24 flex gap-10">
        {/* Sidebar — desktop only */}
        <aside className="hidden md:block w-44 flex-shrink-0 pt-1">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            priceRanges={PRICE_RANGES} 
          />
        </aside>

        {/* Product grid */}
        <main className="flex-1 min-w-0">
          <ActiveFilters
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
           priceRanges={PRICE_RANGES} 
          />

          {productsLoading ? (
            <div className="py-32 text-center">
              <p className="text-[11px] tracking-[0.25em] text-stone-300 uppercase animate-pulse">
                Loading collection…
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-[13px] text-stone-400 tracking-wide mb-4">
                No pieces match your filters.
              </p>
              <button
                onClick={clearFilters}
                className="text-[10px] tracking-[0.25em] text-stone-600 uppercase underline underline-offset-2 hover:text-stone-900 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12">
              {visibleProducts.map((product) => (
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

          {hasMore && (
            <div className="mt-16 text-center">
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="text-[10px] tracking-[0.3em] text-stone-500 uppercase border border-stone-200 px-10 py-3.5 hover:border-stone-500 hover:text-stone-800 transition-all"
              >
                Load More
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onChange={setFilters}
        onClear={clearFilters}
        totalResults={filtered.length}
         priceRanges={PRICE_RANGES} 
      />

      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={(idx) => dispatch(removeFromCart(idx))}
        />
      )}

      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToCart={(item) => {
            dispatch(addToCart(item));
            setActiveProduct(null);
            setCartOpen(true);
          }}
          onWishlistToggle={(p) => dispatch(toggleWishlist(p))}
          wishlisted={wishlist.some((w) => w.id === activeProduct.id)}
        />
      )}

      {authOpen && (
        <AuthModal
          user={user}
          onClose={() => setAuthOpen(false)}
          onLogin={(userData) => dispatch(login(userData))}
          onSubmitLogin={handleLogin}
          onSubmitRegister={handleRegister}
          onError={(msg) => toast.error(msg)}
          onSubmitLogout={handleLogout}
        />
      )}

      {wishlistOpen && (
        <WishlistSidebar
          wishlist={wishlist}
          onClose={() => setWishlistOpen(false)}
          onRemove={(idx) => dispatch(removeFromWishlist(idx))}
          onMoveToCart={(item, idx) => {
            dispatch(addToCart({ ...item, qty: item.qty ?? 1 }));
            dispatch(removeFromWishlist(idx));
            setWishlistOpen(false);
            setCartOpen(true);
          }}
        />
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover={false}
        toastClassName="text-[11px] tracking-[0.15em] uppercase"
      />
    </div>
  );
}
