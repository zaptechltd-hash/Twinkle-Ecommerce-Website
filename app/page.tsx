"use client";
import { useState } from "react";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "SILK NIGHT SLIP",
    price: 4900,
    images: ["/product1.jpg", "/product2.jpg"],
    description:
      "A whisper-light slip crafted from pure mulberry silk. Falls effortlessly at mid-thigh with delicate adjustable straps and a barely-there lace trim at the hem.",
    details: [
      "100% Mulberry Silk",
      "Adjustable spaghetti straps",
      "Lace trim hem",
      "Hand wash cold",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "VELVET ROBE",
    price: 6200,
    images: ["/product3.jpg", "/product4.jpg"],
    description:
      "Envelop yourself in the soft weight of crushed velvet. A generous tie-waist and wide lapels make this robe as elegant as it is comfortable.",
    details: [
      "95% Viscose, 5% Elastane",
      "Tie waist belt",
      "Two side pockets",
      "Dry clean only",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "LACE TRIM SET",
    price: 5500,
    images: ["/product5.jpg", "/product6.jpg"],
    description:
      "A matched camisole and short set trimmed in Chantilly lace. The blush-toned fabric drapes softly and moves with you through the night.",
    details: [
      "Modal & Lace blend",
      "Matching cami + shorts",
      "Elasticated waist",
      "Machine wash gentle",
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 4,
    name: "SATIN PYJAMA",
    price: 5100,
    images: ["/product7.jpg", "/product8.jpg"],
    description:
      "Classic pyjama tailoring reimagined in liquid satin. Notch collar, mother-of-pearl buttons, and a relaxed trouser with contrast piping.",
    details: [
      "100% Satin Polyester",
      "Button front top",
      "Wide-leg trousers",
      "Machine wash cold",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 5,
    name: "MODAL LOUNGE SET",
    price: 4600,
    images: ["/product9.jpg", "/product10.jpg"],
    description:
      "Second-skin softness in the finest micro-modal. A relaxed long-sleeve top pairs with tapered lounge trousers — perfect for slow mornings.",
    details: [
      "96% MicroModal, 4% Elastane",
      "Relaxed crop top",
      "Tapered trousers",
      "Machine wash cold",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 6,
    name: "GAUZE NIGHTDRESS",
    price: 3900,
    images: ["/product11.jpg", "/product12.jpg"],
    description:
      "A free-flowing nightdress in double-layered cotton gauze. Smocked at the yoke, tied at the back — effortlessly romantic for warm nights.",
    details: [
      "100% Cotton Gauze",
      "Smocked yoke detail",
      "Back tie closure",
      "Machine wash warm",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({
  cartCount,
  onCartOpen,
  wishlistCount,
  onWishlistOpen,
  user,
  onUserClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuCols = [
    {
      title: "Shop",
      links: ["New In", "Nightwear", "Loungewear", "Sets", "Robes"],
    },
    {
      title: "Discover",
      links: ["The Edit", "Campaign", "About Us", "Sustainability"],
    },
    { title: "Help", links: ["Size Guide", "Shipping", "Returns", "Contact"] },
  ];

  const userInitials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <>
      <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between bg-white z-50 relative border-b border-stone-100">
        {/* Left */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[11px] tracking-[0.25em] text-stone-700 uppercase hover:text-stone-900 transition-colors"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          <nav className="hidden md:flex items-center gap-7">
            {["Collection", "About"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[11px] tracking-[0.2em] text-stone-500 uppercase hover:text-stone-800 transition-colors"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>

        {/* Logo */}
        <Image src="/logo.png" alt="TwinkleOfficial" width={80} height={40} />

        {/* Right icons */}
        <div className="flex items-center gap-5">
          {/* Wishlist */}
          <button
            className="hover:opacity-60 transition-opacity relative"
            onClick={onWishlistOpen}
            aria-label="Wishlist"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              className="text-stone-700"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-800 text-white text-[9px] flex items-center justify-center font-medium">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            className="hover:opacity-60 transition-opacity relative"
            onClick={onCartOpen}
            aria-label="Bag"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              className="text-stone-700"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-800 text-white text-[9px] flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </button>

          {/* User */}
          <button
            className="hover:opacity-60 transition-opacity relative"
            onClick={onUserClick}
            aria-label="Account"
          >
            {user ? (
              <div className="w-7 h-7 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-medium tracking-wide">
                {userInitials}
              </div>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                className="text-stone-700"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Dropdown mega-menu */}
      {menuOpen && (
  <div
    className="fixed inset-0 z-[100] bg-[#1c1917] flex flex-col px-8 pt-24 pb-10"
    style={{ animation: 'slideDown 0.5s cubic-bezier(0.76,0,0.24,1) forwards' }}
  >
    <button
      onClick={() => setMenuOpen(false)}
      className="absolute top-6 right-8 text-[9px] tracking-[0.3em] text-stone-500 uppercase"
    >
      Close ✕
    </button>

    <nav className="flex-1 flex flex-col justify-center">
      {["Collection", "New In", "Loungewear", "Sets", "Robes"].map((item) => (
         <a
          key={item}
          href="#"
          onClick={() => setMenuOpen(false)}
          className="text-[28px] md:text-[40px] font-light text-stone-300 tracking-widest uppercase
                     border-b border-stone-800 py-4 flex justify-between items-center
                     hover:text-white transition-colors"
        >
          {item}
          <span className="text-sm text-stone-600">↗</span>
        </a>
      ))}
    </nav>

    <div className="flex gap-8 pt-6 border-t border-stone-800">
      {["About", "Sustainability", "Contact"].map((l) => (
        <a key={l} href="#" className="text-[9px] tracking-[0.25em] text-stone-600 uppercase hover:text-stone-400 transition-colors">
          {l}
        </a>
      ))}
    </div>
  </div>
)}
    </>
  );
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────

function AuthModal({ onClose, onLogin, onLogout, user }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (mode === "signup" && !form.name) {
      setError("Please enter your name.");
      return;
    }
    onLogin({ name: form.name || form.email.split("@")[0], email: form.email });
    onClose();
  }

  const userInitials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.25)", paddingTop: "73px" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xs mr-6 md:mr-12 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {user ? (
          /* Logged-in profile dropdown */
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-stone-100">
              <div className="w-10 h-10 rounded-full bg-stone-900 text-white text-[12px] flex items-center justify-center font-medium flex-shrink-0">
                {userInitials}
              </div>
              <div className="overflow-hidden">
                <p className="text-[12px] font-medium text-stone-800 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-stone-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            {["My Orders", "My Wishlist", "Account Settings"].map((item) => (
              <button
                key={item}
                className="block w-full text-left py-3 text-[11px] tracking-[0.15em] uppercase text-stone-600 border-b border-stone-100 hover:text-stone-900 transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="block w-full text-left py-3 text-[11px] tracking-[0.15em] uppercase text-red-400 hover:text-red-600 transition-colors mt-1"
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* Login / signup form */
          <div className="p-8">
            {/* Tabs */}
            <div className="flex gap-0 mb-7 border-b border-stone-100">
              {[
                { key: "login", label: "Sign In" },
                { key: "signup", label: "Register" },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => {
                    setMode(m.key);
                    setError("");
                  }}
                  className={`flex-1 pb-3 text-[10px] tracking-[0.25em] uppercase transition-colors ${
                    mode === m.key
                      ? "text-stone-900 border-b-2 border-stone-900 -mb-px"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {mode === "signup" && (
              <>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Sara Noor"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full border border-stone-200 px-3 py-2.5 text-[12px] text-stone-700 mb-4 outline-none focus:border-stone-500 transition-colors"
                />
              </>
            )}

            <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="hello@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-stone-200 px-3 py-2.5 text-[12px] text-stone-700 mb-4 outline-none focus:border-stone-500 transition-colors"
            />

            <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full border border-stone-200 px-3 py-2.5 text-[12px] text-stone-700 mb-5 outline-none focus:border-stone-500 transition-colors"
            />

            {error && (
              <p className="text-[10px] text-red-400 tracking-wide mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-[0.3em] uppercase hover:bg-stone-700 transition-colors"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>

            {mode === "login" && (
              <p className="text-[10px] text-stone-400 text-center mt-4 tracking-wide">
                Forgot password?{" "}
                <span className="underline cursor-pointer hover:text-stone-700 transition-colors">
                  Reset
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Wishlist Sidebar ─────────────────────────────────────────────────────────

function WishlistSidebar({ wishlist, onClose, onRemove, onMoveToCart }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <p className="text-[11px] tracking-[0.25em] text-stone-800 uppercase">
            Wishlist ({wishlist.length})
          </p>
          <button
            onClick={onClose}
            className="text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
          {wishlist.length === 0 && (
            <p className="text-[12px] text-stone-400 text-center mt-16 tracking-wide">
              No saved items yet
            </p>
          )}
          {wishlist.map((item, i) => (
            <div key={i} className="flex gap-4">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-20 h-24 object-cover flex-shrink-0"
              />
              <div className="flex flex-col justify-between flex-1 py-0.5">
                <div>
                  <p className="text-[11px] tracking-[0.15em] text-stone-800 uppercase">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    PKR {item.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onMoveToCart(item, i)}
                    className="text-[10px] tracking-wide text-stone-600 hover:text-stone-900 uppercase underline underline-offset-2 transition-colors"
                  >
                    Move to Bag
                  </button>
                  <button
                    onClick={() => onRemove(i)}
                    className="text-[10px] text-stone-300 hover:text-stone-500 tracking-wide transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Product Modal ────────────────────────────────────────────────────────────

function ProductModal({ product, onClose, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  function handleAdd() {
    if (!selectedSize) return;
    onAddToCart({ ...product, selectedSize, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-3xl md:rounded-none max-h-[92vh] overflow-y-auto flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image pane */}
        <div className="w-full md:w-1/2 relative flex-shrink-0">
          <img
            src={product.images[activeIndex]}
            alt={product.name}
            className="w-full h-[340px] md:h-full object-cover"
            style={{ minHeight: 340 }}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeIndex === i ? "bg-white scale-125" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Info pane */}
        <div className="w-full md:w-1/2 p-8 flex flex-col gap-5">
          <button
            onClick={onClose}
            className="self-end text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors"
          >
            Close
          </button>
          <div>
            <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mb-1">
              TwinkleOfficial
            </p>
            <h2 className="text-xl font-light tracking-[0.15em] text-stone-800 uppercase">
              {product.name}
            </h2>
            <p className="text-[13px] text-stone-500 mt-1 tracking-wide">
              PKR {product.price.toLocaleString()}
            </p>
          </div>

          <p className="text-[12px] text-stone-500 leading-relaxed">
            {product.description}
          </p>

          <ul className="flex flex-col gap-1">
            {product.details.map((d) => (
              <li
                key={d}
                className="text-[11px] text-stone-400 tracking-wide flex gap-2 items-start"
              >
                <span className="text-stone-200 mt-0.5">—</span> {d}
              </li>
            ))}
          </ul>

          {/* Size */}
          <div>
            <p className="text-[10px] tracking-[0.25em] text-stone-500 uppercase mb-2">
              Select Size
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-10 h-10 text-[11px] tracking-wide border transition-all ${
                    selectedSize === s
                      ? "border-stone-800 bg-stone-800 text-white"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-[10px] text-stone-300 mt-1.5 tracking-wide">
                Please select a size
              </p>
            )}
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3">
            <p className="text-[10px] tracking-[0.25em] text-stone-500 uppercase">
              Qty
            </p>
            <div className="flex items-center border border-stone-200">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 text-stone-500 hover:bg-stone-50 transition-colors text-sm"
              >
                −
              </button>
              <span className="w-8 text-center text-[12px] text-stone-700">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 text-stone-500 hover:bg-stone-50 transition-colors text-sm"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!selectedSize}
            className={`w-full py-3.5 text-[11px] tracking-[0.3em] uppercase transition-all ${
              added
                ? "bg-stone-200 text-stone-500"
                : selectedSize
                ? "bg-stone-900 text-white hover:bg-stone-700"
                : "bg-stone-100 text-stone-300 cursor-not-allowed"
            }`}
          >
            {added ? "Added to Bag ✓" : "Add to Bag"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Sidebar ─────────────────────────────────────────────────────────────

function CartSidebar({ cart, onClose, onRemove }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <p className="text-[11px] tracking-[0.25em] text-stone-800 uppercase">
            Your Bag ({cart.length})
          </p>
          <button
            onClick={onClose}
            className="text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
          {cart.length === 0 && (
            <p className="text-[12px] text-stone-400 text-center mt-16 tracking-wide">
              Your bag is empty
            </p>
          )}
          {cart.map((item, i) => (
            <div key={i} className="flex gap-4">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-20 h-24 object-cover flex-shrink-0"
              />
              <div className="flex flex-col justify-between flex-1 py-0.5">
                <div>
                  <p className="text-[11px] tracking-[0.15em] text-stone-800 uppercase">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5 tracking-wide">
                    Size: {item.selectedSize} · Qty: {item.qty}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-stone-600 tracking-wide">
                    PKR {(item.price * item.qty).toLocaleString()}
                  </p>
                  <button
                    onClick={() => onRemove(i)}
                    className="text-[10px] text-stone-300 hover:text-stone-500 tracking-wide transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-stone-100 px-6 py-6">
            <div className="flex justify-between mb-5">
              <p className="text-[11px] tracking-[0.15em] text-stone-500 uppercase">
                Total
              </p>
              <p className="text-[13px] tracking-wide text-stone-800">
                PKR {total.toLocaleString()}
              </p>
            </div>
            <button className="w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-[0.3em] uppercase hover:bg-stone-700 transition-colors">
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Product Item (with wishlist heart) ───────────────────────────────────────

function ProductItem({ product, onClick, wishlisted, onWishlistToggle }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-[420px] object-cover transition-opacity duration-500 absolute inset-0 ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={product.images[1]}
          alt={product.name + " back"}
          className={`w-full h-[420px] object-cover transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Wishlist heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product);
          }}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white transition-all ${
            wishlisted
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#1c1917" : "none"}
            stroke="#1c1917"
            strokeWidth="1.6"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="pt-3 pb-1">
        <p className="text-[11px] tracking-[0.2em] text-stone-800 uppercase">
          {product.name}
        </p>
        <p className="text-[11px] tracking-[0.1em] text-stone-400 mt-0.5">
          PKR {product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative w-full h-[92vh] overflow-hidden">
      <img
        src="/background.jpg"
        alt="Night Elegance Campaign"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-stone-900/20" />
      <div className="absolute bottom-12 left-8 md:left-14">
        <p className="text-[10px] tracking-[0.35em] text-stone-200 uppercase mb-2">
          New Collection — 2025
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wide text-white leading-none">
          Night
          <br />
          Elegance
        </h1>
        <a
          href="#collection"
          className="inline-block mt-8 text-[10px] tracking-[0.3em] text-stone-200 uppercase border-b border-stone-300 pb-0.5 hover:text-white hover:border-white transition-colors"
        >
          Discover
        </a>
      </div>
      <div className="absolute top-6 right-8 md:right-14">
        <p className="text-[10px] tracking-[0.25em] text-stone-300 uppercase">
          SS 2025
        </p>
      </div>
    </section>
  );
}

// ─── Marquee ──────────────────────────────────────────────────────────────────

function Marquee() {
  const items = [
    "New Collection",
    "Night Elegance",
    "Premium Nightwear",
    "Soft Nights",
    "Crafted for You",
  ];
  const repeated = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden border-y border-stone-100 py-4 bg-white">
      <div className="flex gap-16 animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="text-[10px] tracking-[0.35em] text-stone-400 uppercase flex-shrink-0"
          >
            {item}
            <span className="mx-8 text-stone-200">—</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Product Grid ─────────────────────────────────────────────────────────────

function ProductGrid({ onProductClick, wishlist, onWishlistToggle }) {
  return (
    <section id="collection" className="px-6 md:px-12 pt-20 pb-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mb-2">
            Shop
          </p>
          <h2 className="text-2xl md:text-3xl font-light tracking-widest text-stone-800 uppercase">
            The Collection
          </h2>
        </div>
        <a
          href="#"
          className="hidden md:block text-[10px] tracking-[0.25em] text-stone-400 uppercase border-b border-stone-300 pb-0.5 hover:text-stone-700 hover:border-stone-600 transition-colors"
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-14">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onClick={onProductClick}
            wishlisted={wishlist.some((w) => w.id === product.id)}
            onWishlistToggle={onWishlistToggle}
          />
        ))}
      </div>
      <div className="mt-14 text-center md:hidden">
        <a
          href="#"
          className="text-[10px] tracking-[0.3em] text-stone-500 uppercase border-b border-stone-300 pb-0.5"
        >
          View All
        </a>
      </div>
    </section>
  );
}

// ─── Collection Banner ────────────────────────────────────────────────────────

function CollectionBanner() {
  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      <img
        src="/bg1.jpg"
        alt="Soft Nights Collection"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-stone-900/30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <p className="text-[10px] tracking-[0.4em] text-stone-200 uppercase mb-4">
          The Soft Nights Edit
        </p>
        <h2 className="text-5xl md:text-7xl font-light tracking-widest text-white uppercase leading-none mb-10">
          Soft Nights
        </h2>
        <a
          href="#"
          className="text-[10px] tracking-[0.3em] text-stone-200 uppercase border-b border-stone-300 pb-0.5 hover:text-white transition-colors"
        >
          Explore Collection
        </a>
      </div>
    </section>
  );
}

// ─── Editorial Strip ──────────────────────────────────────────────────────────

function EditorialStrip() {
  return (
    <section className="px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <img
        src="/bg2.jpg"
        alt="Editorial"
        className="h-[500px] md:h-[680px] w-full object-cover"
      />
      <div className="flex flex-col gap-6 md:pr-16">
        <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase">
          The Philosophy
        </p>
        <h2 className="text-3xl md:text-4xl font-light tracking-wide text-stone-800 leading-snug">
          From late-night chai
          <br /> to slow, peaceful mornings
        </h2>
        <p className="text-[13px] text-stone-400 leading-relaxed max-w-xs">
          Our pieces are made for the rhythm of your everyday life. Inspired by
          the softness of Pakistani nights, each design brings together
          breathable fabrics, effortless silhouettes, and a touch of quiet
          luxury.
        </p>
        <a
          href="#"
          className="inline-block mt-4 text-[10px] tracking-[0.3em] text-stone-600 uppercase border-b border-stone-400 pb-0.5 w-fit hover:text-stone-900 hover:border-stone-900 transition-colors"
        >
          Our Story
        </a>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#1c1917] px-6 md:px-12 pt-14 pb-8">
      {/* Brand */}
      <div className="mb-12">
        <p className="text-2xl font-light tracking-[0.2em] text-stone-100 uppercase mb-3">
          TwinkleOfficial
        </p>
        <p className="text-[12px] text-stone-600 leading-relaxed max-w-[260px]">
          Premium nightwear crafted for elegance, softness, and quiet luxury — inspired by Pakistani nights.
        </p>
      </div>

      {/* Links grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12 pb-12 border-b border-stone-800">
        {[
          { title: "Shop", links: ["New In", "Nightwear", "Loungewear", "Sets", "Robes"] },
          { title: "Help", links: ["Size Guide", "Shipping", "Returns", "Contact"] },
          { title: "Company", links: ["About", "Sustainability", "Press"] },
          { title: "Follow", links: ["Instagram", "TikTok", "Pinterest"] },
        ].map((col) => (
          <div key={col.title}>
            <p className="text-[9px] tracking-[0.3em] text-stone-600 uppercase mb-4">{col.title}</p>
            {col.links.map((l) => (
              <a key={l} href="#" className="block text-[12px] text-stone-500 hover:text-stone-200 transition-colors mb-2.5 tracking-wide">
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mb-10">
        <p className="text-[9px] tracking-[0.3em] text-stone-600 uppercase mb-3">Stay in the edit</p>
        <div className="flex max-w-sm">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-stone-800 border border-stone-700 text-stone-300 text-[11px] px-4 py-2.5 outline-none placeholder:text-stone-600 focus:border-stone-500 transition-colors"
          />
          <button className="bg-stone-100 text-stone-900 text-[9px] tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-white transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      {/* Social pills */}
      <div className="flex gap-3 mb-10">
        {["Instagram", "TikTok", "Pinterest"].map((s) => (
          <a key={s} href="#" className="text-[9px] tracking-[0.2em] text-stone-600 uppercase border border-stone-800 px-3 py-2 hover:border-stone-500 hover:text-stone-400 transition-all">
            {s}
          </a>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row justify-between gap-3">
        <p className="text-[10px] text-stone-700 tracking-wide">© 2025 TwinkleOfficial. All rights reserved.</p>
        <div className="flex gap-5">
          {["Privacy Policy", "Terms", "Cookies"].map((l) => (
            <a key={l} href="#" className="text-[10px] text-stone-700 hover:text-stone-500 transition-colors tracking-wide">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TwinklePage() {
  const [activeProduct, setActiveProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // Auth state
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  function handleAddToCart(item) {
    setCart((prev) => {
      const idx = prev.findIndex(
        (c) => c.id === item.id && c.selectedSize === item.selectedSize
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + item.qty };
        return updated;
      }
      return [...prev, item];
    });
  }

  function handleRemoveFromCart(idx) {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleWishlistToggle(product) {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      return exists
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product];
    });
  }

  function handleRemoveFromWishlist(idx) {
    setWishlist((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleMoveToCart(item, idx) {
    handleAddToCart({ ...item, selectedSize: item.sizes[0], qty: 1 });
    setWishlist((prev) => prev.filter((_, i) => i !== idx));
    setWishlistOpen(false);
    setCartOpen(true);
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const wishlistCount = wishlist.length;

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>

      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlistCount}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
        onUserClick={() => setAuthOpen(true)}
      />

      <Hero />
      <Marquee />

      <ProductGrid
        onProductClick={setActiveProduct}
        wishlist={wishlist}
        onWishlistToggle={handleWishlistToggle}
      />

      <CollectionBanner />
      <EditorialStrip />
      <Footer />

      {/* Product modal */}
      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToCart={(item) => {
            handleAddToCart(item);
            setActiveProduct(null);
            setCartOpen(true);
          }}
        />
      )}

      {/* Cart sidebar */}
      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={handleRemoveFromCart}
        />
      )}

      {/* Auth modal */}
      {authOpen && (
        <AuthModal
          user={user}
          onClose={() => setAuthOpen(false)}
          onLogin={(userData) => setUser(userData)}
          onLogout={() => setUser(null)}
        />
      )}

      {/* Wishlist sidebar */}
      {wishlistOpen && (
        <WishlistSidebar
          wishlist={wishlist}
          onClose={() => setWishlistOpen(false)}
          onRemove={handleRemoveFromWishlist}
          onMoveToCart={handleMoveToCart}
        />
      )}
    </div>
  );
}