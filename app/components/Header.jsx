"use client";
import { useState } from "react";
import Image from "next/image";

export default function Navbar({
  cartCount,
  onCartOpen,
  wishlistCount,
  onWishlistOpen,
  user,
  onUserClick,
  currentPage
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const allLinks = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/collection" },
  { label: "About", href: "/about" },
];

// inside the component, after userInitials:
const navLinks = allLinks.filter((l) => l.label.toLowerCase() !== currentPage);

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
      <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between bg-white z-50 sticky top-0 border-b border-stone-100">
        {/* Left */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[11px] tracking-[0.25em] text-stone-700 uppercase hover:text-stone-900 transition-colors"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          <nav className="hidden md:flex items-center gap-7">
  {navLinks.map((l) => (
    <a key={l.href} href={l.href}
      className="text-[11px] tracking-[0.2em] text-stone-500 uppercase hover:text-stone-800 transition-colors">
      {l.label}
    </a>
  ))}
</nav>
        </div>

        {/* Logo */}
        <Image src="/logo.png" alt="TwinkleOfficial" width={80} height={40} />

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <button
            className="hover:opacity-60 transition-opacity relative"
            onClick={onWishlistOpen}
            aria-label="Wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-stone-700">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-800 text-white text-[9px] flex items-center justify-center font-medium">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            className="hover:opacity-60 transition-opacity relative"
            onClick={onCartOpen}
            aria-label="Bag"
          >
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-stone-700">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Mega Menu ── */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            style={{ top: "73px" }}
            onClick={() => setMenuOpen(false)}
          />

          {/* Dropdown panel */}
          <div
            className="fixed left-0 right-0 z-50 bg-white border-b border-stone-100 shadow-sm"
            style={{
              top: "73px",
              animation: "menuSlide 0.22s cubic-bezier(0.4,0,0.2,1) forwards",
            }}
          >
            <div className="px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-10">
              {menuCols.map((col) => (
                <div key={col.title}>
                  <p className="text-[9px] tracking-[0.35em] text-stone-400 uppercase mb-4">
                    {col.title}
                  </p>
                  <div className="flex flex-col gap-1">
                    {col.links.map((link) => (
                         <a
                        key={link}
                        href="#"
                        onClick={() => setMenuOpen(false)}
                        className="text-[13px] text-stone-600 tracking-wide hover:text-stone-900 transition-colors py-1"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              {/* Featured column */}
              <div>
                <p className="text-[9px] tracking-[0.35em] text-stone-400 uppercase mb-4">
                  Featured
                </p>
                <div className="relative overflow-hidden group cursor-pointer">
                  <img
                    src="/background.jpg"
                    alt="New Collection"
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-900/30 flex flex-col justify-end p-3">
                    <p className="text-[9px] tracking-[0.25em] text-stone-200 uppercase">
                      Now Live
                    </p>
                    <p className="text-[12px] tracking-[0.15em] text-white uppercase font-light">
                      Night Elegance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="border-t border-stone-100 px-6 md:px-12 py-3 flex items-center justify-between">
              <div className="flex gap-6">
                {["Free shipping over PKR 5,000", "Easy returns"].map((note) => (
                  <span key={note} className="text-[10px] tracking-wide text-stone-400">
                    {note}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors"
              >
                Close ✕
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes menuSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}