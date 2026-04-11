"use client";
import { useState } from "react";
import Image from "next/image";
// ─── Product Data ────────────────────────────────────────────────────────────

const products = [
  {
    id: 1,
    name: "SILK NIGHT SLIP",
    price: 4900,
    images: [
      "/product1.jpg",
      "/product2.jpg",
    ],
    description: "A whisper-light slip crafted from pure mulberry silk. Falls effortlessly at mid-thigh with delicate adjustable straps and a barely-there lace trim at the hem.",
    details: ["100% Mulberry Silk", "Adjustable spaghetti straps", "Lace trim hem", "Hand wash cold"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "VELVET ROBE",
    price: 6200,
    images: [
       "/product3.jpg",
      "/product4.jpg",
    ],
    description: "Envelop yourself in the soft weight of crushed velvet. A generous tie-waist and wide lapels make this robe as elegant as it is comfortable.",
    details: ["95% Viscose, 5% Elastane", "Tie waist belt", "Two side pockets", "Dry clean only"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "LACE TRIM SET",
    price: 5500,
    images: [
    "/product5.jpg",
      "/product6.jpg",
    ],
    description: "A matched camisole and short set trimmed in Chantilly lace. The blush-toned fabric drapes softly and moves with you through the night.",
    details: ["Modal & Lace blend", "Matching cami + shorts", "Elasticated waist", "Machine wash gentle"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 4,
    name: "SATIN PYJAMA",
    price: 5100,
    images: [
      "/product7.jpg",
      "/product8.jpg",
    ],
    description: "Classic pyjama tailoring reimagined in liquid satin. Notch collar, mother-of-pearl buttons, and a relaxed trouser with contrast piping.",
    details: ["100% Satin Polyester", "Button front top", "Wide-leg trousers", "Machine wash cold"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 5,
    name: "MODAL LOUNGE SET",
    price: 4600,
    images: [
      "/product9.jpg",
      "/product10.jpg",
    ],
    description: "Second-skin softness in the finest micro-modal. A relaxed long-sleeve top pairs with tapered lounge trousers — perfect for slow mornings.",
    details: ["96% MicroModal, 4% Elastane", "Relaxed crop top", "Tapered trousers", "Machine wash cold"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 6,
    name: "GAUZE NIGHTDRESS",
    price: 3900,
    images: [
      "/product11.jpg",
      "/product12.jpg",
    ],
    description: "A free-flowing nightdress in double-layered cotton gauze. Smocked at the yoke, tied at the back — effortlessly romantic for warm nights.",
    details: ["100% Cotton Gauze", "Smocked yoke detail", "Back tie closure", "Machine wash warm"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
];

// ─── Product Image ────────────────────────────────────────────────────────────

function ProductImage({ src, alt, tall = false, className = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full object-cover ${tall ? "h-[520px]" : "h-[420px]"} ${className}`}
    />
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
{/* Dot indicators */}
<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
  {product.images.map((img, i) => (
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

          {/* Details */}
          <ul className="flex flex-col gap-1">
            {product.details.map((d) => (
              <li key={d} className="text-[11px] text-stone-400 tracking-wide flex gap-2 items-start">
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

          {/* Add to cart */}
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

// ─── ProductItem ──────────────────────────────────────────────────────────────

function ProductItem({ product, onClick }) {
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

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ cartCount, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between bg-white z-50 relative">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-[11px] tracking-[0.25em] text-stone-700 uppercase hover:text-stone-900 transition-colors"
          >
            Menu
          </button>
          <nav className="hidden md:flex items-center gap-7">
            {["New In", "Collection", "About"].map((l) => (
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


           <Image 
        src="/logo.png"
        alt="Logo"
        width={80}
        height={40}
      />

        <div className="flex items-center gap-5">
          <button className="hover:opacity-60 transition-opacity">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-stone-700">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </button>
          <button className="hover:opacity-60 transition-opacity relative" onClick={onCartOpen}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-stone-700">
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
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col">
          <div className="px-6 md:px-12 py-5 flex items-center justify-between">
            <span className="text-[13px] md:text-[15px] tracking-[0.35em] font-medium text-stone-900 uppercase">
              TwinkleOfficial
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-[11px] tracking-[0.2em] text-stone-500 uppercase hover:text-stone-800 transition-colors"
            >
              Close
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center px-10 md:px-20 gap-8">
            {["New In", "Collection", "Nightwear", "Loungewear", "About", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="text-3xl md:text-5xl font-light tracking-wide text-stone-800 hover:text-stone-400 transition-colors"
              >
                {l}
              </a>
            ))}
          </nav>
          <div className="px-10 md:px-20 py-10 flex gap-8">
            {["Instagram", "TikTok", "Pinterest"].map((s) => (
              <a key={s} href="#" className="text-[11px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors">{s}</a>
            ))}
          </div>
        </div>
      )}
    </>
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
  const items = ["New Collection", "Night Elegance", "Premium Nightwear", "Soft Nights", "Crafted for You"];
  const repeated = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden border-y border-stone-100 py-4 bg-white">
      <div className="flex gap-16 animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="text-[10px] tracking-[0.35em] text-stone-400 uppercase flex-shrink-0">
            {item}<span className="mx-8 text-stone-200">—</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Product Grid ─────────────────────────────────────────────────────────────

function ProductGrid({ onProductClick }) {
  return (
    <section id="collection" className="px-6 md:px-12 pt-20 pb-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mb-2">Shop</p>
          <h2 className="text-2xl md:text-3xl font-light tracking-widest text-stone-800 uppercase">
            The Collection
          </h2>
        </div>
        <a href="#" className="hidden md:block text-[10px] tracking-[0.25em] text-stone-400 uppercase border-b border-stone-300 pb-0.5 hover:text-stone-700 hover:border-stone-600 transition-colors">
          View All
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-14">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} onClick={onProductClick} />
        ))}
      </div>
      <div className="mt-14 text-center md:hidden">
        <a href="#" className="text-[10px] tracking-[0.3em] text-stone-500 uppercase border-b border-stone-300 pb-0.5">
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
        <p className="text-[10px] tracking-[0.4em] text-stone-200 uppercase mb-4">The Soft Nights Edit</p>
        <h2 className="text-5xl md:text-7xl font-light tracking-widest text-white uppercase leading-none mb-10">
          Soft Nights
        </h2>
        <a href="#" className="text-[10px] tracking-[0.3em] text-stone-200 uppercase border-b border-stone-300 pb-0.5 hover:text-white transition-colors">
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
        <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase">The Philosophy</p>
        <h2 className="text-3xl md:text-4xl font-light tracking-wide text-stone-800 leading-snug">
          From late-night chai<br /> to slow, peaceful mornings
        </h2>
        <p className="text-[13px] text-stone-400 leading-relaxed max-w-xs">
         our pieces are made for the rhythm of your everyday life.
         Inspired by the softness of Pakistani nights,
each design brings together breathable fabrics,
effortless silhouettes,
and a touch of quiet luxury.
        </p>
        <a href="#" className="inline-block mt-4 text-[10px] tracking-[0.3em] text-stone-600 uppercase border-b border-stone-400 pb-0.5 w-fit hover:text-stone-900 hover:border-stone-900 transition-colors">
          Our Story
        </a>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    { title: "Shop", links: ["New In", "Nightwear", "Loungewear", "Sets", "Robes"] },
    { title: "Help", links: ["Size Guide", "Shipping", "Returns", "Contact", "FAQs"] },
    { title: "Company", links: ["About", "Careers", "Press", "Sustainability"] },
    { title: "Follow", links: ["Instagram", "TikTok", "Pinterest", "Newsletter"] },
  ];

  return (
    <footer className="border-t border-stone-100 px-6 md:px-12 pt-16 pb-10 bg-white">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
        <div className="col-span-2 md:col-span-1">
          <p className="text-[12px] tracking-[0.3em] font-medium text-stone-800 uppercase mb-4">TwinkleOfficial</p>
          <p className="text-[11px] text-stone-400 leading-relaxed max-w-[180px]">
            Premium nightwear. Crafted for elegance and comfort.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="text-[10px] tracking-[0.25em] text-stone-500 uppercase mb-4">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[11px] text-stone-400 hover:text-stone-700 transition-colors tracking-wide">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-stone-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-[10px] text-stone-300 tracking-wide">© 2025 TwinkleOfficial. All rights reserved.</p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms", "Cookies"].map((l) => (
            <a key={l} href="#" className="text-[10px] text-stone-300 hover:text-stone-500 transition-colors tracking-wide">{l}</a>
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

  function handleRemove(idx) {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>

      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <Hero />
      <Marquee />
      <ProductGrid onProductClick={setActiveProduct} />
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
        />
      )}

      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}
