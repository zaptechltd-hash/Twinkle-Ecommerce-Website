"use client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Navbar from "../components/Header";
import { useState } from "react";
import { removeFromCart } from "../store/index";
import Footer from "../components/Footer";

function CartSidebar({ cart, onClose, onRemove }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      style={{ backgroundColor: "rgba(28,20,16,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm h-full flex flex-col"
        style={{ boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "0.5px solid #e8e0d6" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#2c2520" }} className="uppercase font-medium">
            Your Bag {cart.length > 0 && <span style={{ color: "#b4a58f" }}>({cart.length})</span>}
          </p>
          <button
            onClick={onClose}
            style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#9e8e82", padding: "4px 0" }}
            className="uppercase hover:text-stone-700 transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 gap-4">
              <div style={{ width: "40px", height: "40px", border: "0.5px solid #e0d6cc", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "16px", color: "#c8b8a8" }}>◡</span>
              </div>
              <p className="text-stone-400 text-center" style={{ fontSize: "12px", letterSpacing: "0.06em" }}>
                Your bag is empty
              </p>
            </div>
          )}
          {cart.map((item, i) => (
            <div key={i} className="flex gap-4" style={{ paddingBottom: "1.5rem", borderBottom: "0.5px solid #f0ece6" }}>
              <div style={{ width: "80px", height: "96px", flexShrink: 0, overflow: "hidden" }}>
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-between flex-1 py-0.5">
                <div>
                  <p style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#2c2520" }} className="uppercase font-medium">
                    {item.name}
                  </p>
                  <p className="mt-1" style={{ fontSize: "10px", letterSpacing: "0.05em", color: "#b4a58f" }}>
                    Size: {item.selectedSize} · Qty: {item.qty}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p style={{ fontSize: "12px", color: "#4a3f35", fontWeight: 500 }}>
                    PKR {(item.price * item.qty).toLocaleString()}
                  </p>
                  <button
                    onClick={() => onRemove(i)}
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      color: "#c4b0a0",
                      textTransform: "uppercase",
                      border: "0.5px solid #e0d6cc",
                      padding: "4px 10px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.target.style.color = "#2c2520"; e.target.style.borderColor = "#2c2520"; }}
                    onMouseLeave={e => { e.target.style.color = "#c4b0a0"; e.target.style.borderColor = "#e0d6cc"; }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ borderTop: "0.5px solid #e8e0d6", padding: "1.5rem" }}>
            <div className="flex justify-between mb-1">
              <p style={{ fontSize: "10px", letterSpacing: "0.14em", color: "#9e8e82", textTransform: "uppercase" }}>Subtotal</p>
              <p style={{ fontSize: "13px", color: "#2c2520", fontWeight: 500 }}>PKR {total.toLocaleString()}</p>
            </div>
            <p style={{ fontSize: "10px", color: "#c4b0a0", marginBottom: "1.25rem", textAlign: "right" }}>
              Shipping calculated at checkout
            </p>
            <button
              className="w-full py-4 text-white transition-colors"
              style={{ backgroundColor: "#2c2520", fontSize: "11px", letterSpacing: "0.25em" }}
              onMouseEnter={e => e.target.style.backgroundColor = "#3d352c"}
              onMouseLeave={e => e.target.style.backgroundColor = "#2c2520"}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AboutPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart);
  const wishlist = useAppSelector((s) => s.wishlist);
  const user = useAppSelector((s) => s.auth);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div style={{ backgroundColor: "#EFEBE2" }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .f1 { animation: fadeUp 1.1s ease 0.1s both; }
        .f2 { animation: fadeUp 1.1s ease 0.3s both; }
        .f3 { animation: fadeUp 1.1s ease 0.55s both; }
        .f4 { animation: fadeUp 1.1s ease 0.7s both; }

        .img-zoom { overflow: hidden; }
        .img-zoom img { transition: transform 0.9s ease; }
        .img-zoom:hover img { transform: scale(1.04); }

        .rule { height: 0.5px; width: 100%; background-color: rgba(180,165,145,0.35); }

        .cta-link {
          color: #c8b8a8;
          text-decoration: none;
          border-bottom: 0.5px solid rgba(200,184,168,0.4);
          padding-bottom: 2px;
          font-size: 11px;
          letter-spacing: 0.18em;
          transition: color 0.2s, border-color 0.2s;
        }
        .cta-link:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.6);
        }

        .belief-card {
          border-top: 0.5px solid rgba(255,255,255,0.08);
          padding-top: 1.75rem;
          padding-bottom: 1.75rem;
        }

        .who-item {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          padding-bottom: 1.5rem;
          border-bottom: 0.5px solid rgba(180,165,145,0.2);
        }
        .who-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .section-card {
          background: #fff;
          border-top: 0.5px solid #e8e0d6;
          border-bottom: 0.5px solid #e8e0d6;
        }
      `}</style>

      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
        onUserClick={() => setAuthOpen(true)}
        currentPage="about"
      />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="px-8 md:px-24 pt-14 pb-12 max-w-5xl mx-auto">
        <p className="f1 uppercase mb-6" style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}>
          The Brand · SS 2026
        </p>
        <h1
          className="serif f2 font-light leading-none mb-8"
          style={{ fontSize: "clamp(56px, 10vw, 96px)", color: "#2c2520", letterSpacing: "-0.02em" }}
        >
          About<br />Twinkle.
        </h1>
        <div className="f3" style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}>
          <p style={{ fontSize: "14px", color: "#6b5c50", lineHeight: "1.9", maxWidth: "340px" }}>
            We help women across Pakistan feel effortlessly beautiful through premium nightwear
            crafted for rest and quiet confidence.
          </p>
        </div>
      </section>

      {/* ── FULL-WIDTH IMAGE ───────────────────────────────── */}
      <section className="px-8 md:px-24 pb-20 max-w-5xl mx-auto">
        <div className="img-zoom w-full" style={{ height: "62vh" }}>
          <img
            src="/background.jpg"
            alt="Night Elegance Campaign"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="rule" style={{ maxWidth: "60px" }} />
          <p className="uppercase" style={{ fontSize: "10px", letterSpacing: "0.25em", color: "#b4a58f" }}>
            Night Elegance · 2026
          </p>
        </div>
      </section>

      {/* ── OUR STORY ─────────────────────────────────────── */}
      <section>
        <div className="px-8 md:px-24 py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="img-zoom w-full" style={{ height: "540px" }}>
            <img src="/product5.jpg" alt="Editorial" className="w-full h-full object-cover object-center" />
          </div>
          <div className="md:pt-6">
            <p className="uppercase mb-4" style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}>
              Our Story
            </p>
            <h2
              className="serif font-light leading-snug mb-8"
              style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#2c2520", letterSpacing: "-0.015em" }}
            >
              From a restless search,<br />
              <em>a brand was born.</em>
            </h2>
            <div style={{ height: "0.5px", backgroundColor: "#e8e0d6", marginBottom: "2rem" }} />
            <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "1.25rem", color: "#4a3f35" }}>
              I started this brand because I saw too many women settling for uncomfortable,
              uninspired sleepwear and knew there had to be a better way.
            </p>
            <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "1.25rem", color: "#4a3f35" }}>
              After years of searching for nightwear that felt both luxurious and true to our
              culture, I decided to create something that truly helps women rest well and feel seen.
            </p>
            <p style={{ fontSize: "13px", lineHeight: "1.9", fontStyle: "italic", color: "#9e8e82" }}>
              This journey is personal to me, and everything we do today is shaped by that original &ldquo;why.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT WE BELIEVE ───────────────────────────────── */}
      <section className="px-8 md:px-24 py-20" style={{ backgroundColor: "#1a1410" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 items-start mb-14">
            <p className="uppercase md:pt-2" style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}>
              What We Believe In
            </p>
            <h2
              className="serif font-light leading-snug"
              style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#f0e8de", letterSpacing: "-0.015em" }}
            >
              Three things we will<br />
              <em>never compromise on.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-0">
            {[
              {
                num: "I",
                title: "Quality over shortcuts",
                desc: "We focus on doing things right, not fast. Every stitch, every fabric choice, every finish is deliberate.",
              },
              {
                num: "II",
                title: "People First",
                desc: "Our customers are at the heart of every decision. Their comfort and confidence guide everything we make.",
              },
              {
                num: "III",
                title: "Purpose-Driven Work",
                desc: "We believe business should make life better one soft, well-made piece at a time.",
              },
            ].map((b) => (
              <div key={b.title} className="belief-card">
                <p className="serif font-light mb-5" style={{ fontSize: "32px", color: "rgba(180,165,145,0.3)" }}>
                  {b.num}
                </p>
                <p className="uppercase mb-3" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#e8dfd4" }}>
                  {b.title}
                </p>
                <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#7a6a5e" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="px-8 md:px-24 py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="img-zoom w-full" style={{ height: "500px" }}>
            <img src="/bg2.jpg" alt="Editorial" className="w-full h-full object-cover object-center" />
          </div>
          <div className="md:pt-6">
            <p className="uppercase mb-4" style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}>
              Who This Is For
            </p>
            <h2
              className="serif font-light leading-snug mb-10"
              style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#2c2520", letterSpacing: "-0.015em" }}
            >
              Made for the woman<br />
              <em>who knows what she wants.</em>
            </h2>
            <div className="flex flex-col" style={{ gap: "0" }}>
              {[
                "Women who are done with scratchy, cheaply made sleepwear that doesn't last.",
                "The woman who wants to feel elevated even at home in her quiet, private moments.",
                "Anyone who values comfort, craftsmanship, and a touch of quiet luxury.",
              ].map((item, i) => (
                <div key={i} className="who-item">
                  <span
                    className="serif font-light flex-shrink-0"
                    style={{ fontSize: "20px", color: "rgba(180,165,145,0.5)", marginTop: "2px" }}
                  >
                    0{i + 1}
                  </span>
                  <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#4a3f35" }}>{item}</p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "2rem", fontSize: "12px", fontStyle: "italic", color: "#9e8e82" }}>
              If that sounds like you, you&apos;re in the right place.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOUNDER ───────────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 bg-[#e2d1a9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-14 items-start">
          <div>
            <div className="img-zoom w-full mb-4" style={{ height: "500px" }}>
              <img
                src="/bharti.jpg"
                alt="Bharti Manghwani — Founder"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#7a6a5e" }} className="uppercase">
              Bharti Manghwani · Founder
            </p>
          </div>

          <div className="md:pt-6">
            <p className="uppercase mb-4" style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#8a6a4a" }}>
              Meet the Founder
            </p>
            {/* FIX: Changed heading color from #f0e8de (invisible on beige) to #2c2520 (dark) */}
            <h2
              className="serif font-light leading-snug mb-8"
              style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#2c2520", letterSpacing: "-0.015em" }}
            >
              Hi, I&apos;m<br />
              <em>Bharti Manghwani</em>
            </h2>
            <div style={{ height: "0.5px", backgroundColor: "rgba(100,80,60,0.25)", marginBottom: "2rem" }} />
            {/* FIX: Changed body text from #c8b8a8 (invisible on beige) to #4a3f35 (readable dark) */}
            <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "1.25rem", color: "#4a3f35" }}>
              Founder of Twinkle. With a background in fashion and textile design, I&apos;m passionate
              about helping women feel more at home in their own skin especially during the quiet
              hours of the night.
            </p>
            <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "1.25rem", color: "#4a3f35" }}>
              Twinkle was born from my own restless search for sleepwear that felt both beautiful
              and deeply comfortable. I couldn&apos;t find it so I made it.
            </p>
            <p style={{ fontSize: "13px", lineHeight: "1.9", fontStyle: "italic", color: "#6b5c50" }}>
              This journey is personal, and every piece we create carries that original intention forward.
            </p>
            
           
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section
        className="px-8 md:px-24 py-24 text-center bg-[#161310]"
        style={{ borderTop: "0.5px solid rgba(180,165,145,0.12)" }}
      >
        <p className="uppercase mb-6" style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}>
          Ready to Begin
        </p>
        <h2
          className="serif font-light leading-tight mb-8 mx-auto"
          style={{
            fontSize: "clamp(44px, 9vw, 88px)",
            color: "#f0e8de",
            letterSpacing: "-0.025em",
            maxWidth: "640px",
          }}
        >
          Explore the<br />
          <em>Collection.</em>
        </h2>
        <p
          className="mx-auto mb-14"
          style={{ fontSize: "13px", lineHeight: "1.9", color: "#7a6a5e", maxWidth: "340px" }}
        >
          Discover nightwear crafted for the rhythm of your everyday life from late-night chai
          to slow, peaceful mornings.
        </p>
        <div className="flex items-center justify-center gap-12 flex-wrap pb-10">
          <a
            href="/#collection"
            className="inline-block"
            style={{
              padding: "16px 52px",
              backgroundColor: "#2c2520",
              border: "0.5px solid rgba(180,165,145,0.3)",
              color: "#e8dfd4",
              textDecoration: "none",
              fontSize: "11px",
              letterSpacing: "0.24em",
              transition: "background-color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#3d352c"; e.currentTarget.style.borderColor = "rgba(180,165,145,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#2c2520"; e.currentTarget.style.borderColor = "rgba(180,165,145,0.3)"; }}
          >
            SHOP NOW
          </a>
          <a href="mailto:hello@twinkle.pk" className="cta-link">
            GET IN TOUCH
          </a>
        </div>
        <div style={{ height: "0.5px", backgroundColor: "rgba(100,80,60,0.25)"}} />
      </section>


      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={(idx) => dispatch(removeFromCart(idx))}
        />
      )}

      <Footer />
    </div>
  );
}