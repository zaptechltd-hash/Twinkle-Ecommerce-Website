"use client";
import { useState } from "react";
import Navbar from "./components/Header";
import Image from "next/image";
import { products } from "./lib/products";
import ProductModal from "./components/ProductModal";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";

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
          New Collection 2026
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
          SS 2026
        </p>
      </div>
    </section>
  );
}


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
      <div className="flex gap-32 animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="text-[10px] tracking-[0.35em] text-stone-400 uppercase flex-shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

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
  <ProductCard
    key={product.id}
    product={product}
    wishlisted={wishlist.some((w) => w.id === product.id)}
    onWishlistToggle={onWishlistToggle}
    onClick={onProductClick}     
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

      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToCart={(item) => {
            handleAddToCart(item);
            setActiveProduct(null);
            setCartOpen(true);
          }}
          onWishlistToggle={handleWishlistToggle}
          wishlisted={wishlist.some((w) => w.id === activeProduct.id)}
        />
      )}

      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={handleRemoveFromCart}
        />
      )}

      {authOpen && (
        <AuthModal
          user={user}
          onClose={() => setAuthOpen(false)}
          onLogin={(userData) => setUser(userData)}
          onLogout={() => setUser(null)}
        />
      )}

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