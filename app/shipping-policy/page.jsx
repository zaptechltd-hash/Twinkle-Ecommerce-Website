"use client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Navbar from "../components/Header";
import { useState } from "react";
import { removeFromCart, login, logout } from "../store/index";
import Footer from "../components/Footer";
import CartSidebar from "../components/CartSidebar";
import WishlistSidebar from "../components/WishlistSidebar";
import AuthModal from "../components/AuthModal";
import { removeFromWishlist, addToCart } from "../store/index";
import useAuthService from "../services/auth/index";
import { toast, ToastContainer } from "react-toastify";
import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
} from "../utils/token";
import "react-toastify/dist/ReactToastify.css";

const sections = [
  {
    num: "01",
    title: "Delivery Areas",
    body: "TWINKLE delivers nationwide across Pakistan. Some remote or less accessible areas may experience slightly longer delivery times.",
  },
  {
    num: "02",
    title: "Order Processing",
    body: "Orders are usually processed within 1–2 business days after confirmation. Processing may take longer during the following periods.",
    items: [
      "Sales or promotional periods",
      "Public holidays",
      "High order volume periods",
      "Verification or payment confirmation delays",
    ],
  },
  {
    num: "03",
    title: "Delivery Timeframe",
    subsections: [
      {
        label: "Estimated delivery times",
        items: [
          "Across Pakistan: 3–5 business days",
          "Remote areas: Delivery may take longer than usual",
        ],
      },
      {
        label: "Please note",
        items: [
          "Delivery times are estimates only",
          "Delays may occur due to courier issues, weather conditions, or unforeseen circumstances",
          "TWINKLE is not responsible for courier-related delays once the order has been dispatched",
        ],
      },
    ],
  },
  {
    num: "04",
    title: "Shipping Charges",
    body: "Shipping charges (if applicable) will be clearly displayed at checkout before order confirmation.",
    items: ["Free shipping promotions", "Discounted shipping campaigns"],
    itemsLabel: "TWINKLE may offer:",
    footer: "These offers may be limited-time and subject to conditions.",
  },
  {
    num: "05",
    title: "Order Tracking",
    body: "Once your order is shipped, tracking details will be shared when your order is dispatched. You may receive updates via:",
    items: ["SMS", "Email", "WhatsApp", "Courier tracking systems"],
  },
  {
    num: "06",
    title: "Failed Delivery Attempts",
    body: "Customers are responsible for providing accurate delivery details.",
    subsections: [
      {
        label: "Delivery may fail due to",
        items: [
          "Incorrect address",
          "Unreachable phone number",
          "Customer unavailability",
          "Refusal to accept delivery",
        ],
      },
      {
        label: "TWINKLE reserves the right to",
        items: [
          "Cancel the order",
          "Charge additional delivery fees for re-shipment",
          "Restrict future Cash on Delivery (COD) orders",
        ],
      },
    ],
  },
  {
    num: "07",
    title: "Order Cancellation",
    body: "Orders can be cancelled within 8 hours of placement by contacting TWINKLE customer support. After 8 hours, orders may already be processed or shipped and cancellation may not be possible.",
  },
  {
    num: "08",
    title: "Damaged or Missing Items",
    body: "If your order arrives damaged, defective, or incomplete, please contact us within 48 hours of delivery. TWINKLE will review and verify claims before offering replacement or resolution.",
    items: ["Order number", "Photos or videos of the issue", "Packaging proof"],
    itemsLabel: "You may be required to provide:",
  },
  {
    num: "09",
    title: "Delivery Acceptance",
    body: "Customers are advised to check their parcel before accepting delivery.",
    items: [
      "Claims for damage or missing items may not be entertained after delay",
      "Responsibility transfers to the customer after acceptance",
    ],
    itemsLabel: "Once the parcel is accepted:",
  },
];

export default function ShippingPolicyPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart);
  const wishlist = useAppSelector((s) => s.wishlist);
  const user = useAppSelector((s) => s.auth);
  const settings = useAppSelector((s) => s.settings);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const { customerLogin, customerRegister, customerLogout } = useAuthService();

  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

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

  // ── Design tokens ─────────────────────────────────────────
  // Same source of truth used across the site.
  const T = {
    light: {
      heading: "#1a1410",
      body: "#3a2f26",
      eyebrow: "#8a7660",
      divider: "rgba(154,128,96,0.22)",
    },
    dark: {
      heading: "#f0e8de",
      body: "#a89584",
      eyebrow: "#b4a58f",
      divider: "rgba(180,165,145,0.15)",
    },
    eyebrowSize: "10px",
    eyebrowTracking: "0.32em",
    h1Size: "clamp(56px, 10vw, 96px)",
    h2Size: "clamp(28px, 3vw, 38px)",
    h3Size: "clamp(22px, 2.5vw, 30px)",
    bodySize: "13px",
    bodyLineHeight: "1.85",
    space: { xs: "0.5rem", sm: "1rem", md: "1.5rem", lg: "2.5rem" },
  };

  function SubLabel({ children }) {
    return (
      <div
        className="sans uppercase"
        style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: T.space.sm, marginTop: T.space.md, fontSize: "11px", letterSpacing: "0.2em", color: T.light.heading }}
      >
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.light.eyebrow, flexShrink: 0, display: "inline-block" }} />
        <span>{children}</span>
      </div>
    );
  }

  function FooterNote({ children }) {
    return (
      <div style={{ marginTop: T.space.sm, display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
        <span className="serif" style={{ fontSize: "15px", fontStyle: "italic", fontWeight: 300, color: T.light.eyebrow, flexShrink: 0, marginTop: "1px" }}>
          Note —
        </span>
        <p className="sans" style={{ fontSize: "12px", color: T.light.body, lineHeight: T.bodyLineHeight, margin: 0 }}>
          {children}
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#EFEBE2" }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sans { font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .f1 { animation: fadeUp 1.1s ease 0.1s both; }
        .f2 { animation: fadeUp 1.1s ease 0.3s both; }
        .f3 { animation: fadeUp 1.1s ease 0.55s both; }

        .rule { height: 0.5px; width: 100%; background-color: ${T.light.divider}; }

        .cta-link {
          color: ${T.dark.eyebrow};
          text-decoration: none;
          border-bottom: 0.5px solid rgba(180,165,145,0.4);
          padding-bottom: 2px;
          font-size: 11px;
          letter-spacing: 0.18em;
          transition: color 0.2s, border-color 0.2s;
        }
        .cta-link:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.6);
        }

        .email-link {
          color: ${T.light.heading};
          text-decoration: none;
          border-bottom: 0.5px solid ${T.light.divider};
          padding-bottom: 1px;
          transition: border-color 0.2s, color 0.2s;
        }
        .email-link:hover {
          color: ${T.light.eyebrow};
          border-color: ${T.light.eyebrow};
        }

        .policy-section {
          padding: 2.5rem 0;
          border-bottom: 0.5px solid ${T.light.divider};
        }
        .policy-section:last-child { border-bottom: none; }

        .policy-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding: 0.65rem 0;
          border-bottom: 0.5px solid rgba(154,128,96,0.12);
        }
        .policy-item:last-child { border-bottom: none; }

        .toc-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.7rem 0;
          border-bottom: 0.5px solid ${T.light.divider};
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .toc-item:last-child { border-bottom: none; }
        .toc-item:hover { opacity: 0.6; }

        .section-divider {
          height: 0.5px;
          background: linear-gradient(to right, transparent, rgba(154,128,96,0.4), transparent);
        }

        .stat-card {
          border-top: 0.5px solid ${T.light.divider};
          padding-top: 1.5rem;
        }
      `}</style>

      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
        onUserClick={() => setAuthOpen(true)}
        currentPage="shipping-policy"
      />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="px-8 md:px-24 pt-20 pb-16 max-w-7xl mx-auto">
        <p
          className="sans f1 uppercase"
          style={{ fontSize: T.eyebrowSize, letterSpacing: T.eyebrowTracking, color: T.light.eyebrow, marginBottom: T.space.md }}
        >
          Shipping · Last Updated May 2026
        </p>
        <h1
          className="serif f2 font-light leading-none"
          style={{ fontSize: T.h1Size, color: T.light.heading, letterSpacing: "-0.02em", marginBottom: T.space.lg }}
        >
          Shipping Policy.
        </h1>
        <div className="f3" style={{ maxWidth: "700px" }}>
          <p className="sans" style={{ fontSize: T.bodySize, color: T.light.body, lineHeight: T.bodyLineHeight }}>
            Thank you for shopping with TWINKLE. This policy explains how we
            process, ship, and deliver orders across Pakistan.
          </p>
          <p
            className="serif"
            style={{ marginTop: T.space.sm, fontSize: "17px", color: T.light.eyebrow, lineHeight: T.bodyLineHeight, fontStyle: "italic" }}
          >
            By placing an order with TWINKLE, you agree to the terms outlined below.
          </p>
        </div>
      </section>

      {/* ── RULE ───────────────────────────────────────────── */}
      <div className="px-8 md:px-24 max-w-7xl mx-auto pb-14">
        <div className="rule" />
      </div>

      {/* ── AT-A-GLANCE STATS ──────────────────────────────── */}
      <section className="px-8 md:px-24 pb-20 max-w-7xl mx-auto">
        <p
          className="sans uppercase"
          style={{ fontSize: T.eyebrowSize, letterSpacing: T.eyebrowTracking, color: T.light.eyebrow, marginBottom: "2.5rem" }}
        >
          At a Glance
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "1–2", unit: "business days", label: "Order processing" },
            { value: "3–5", unit: "business days", label: "Standard delivery" },
            { value: "48 hrs", unit: "window", label: "Report damaged items" },
            { value: "8 hrs", unit: "from order", label: "Cancellation window" },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <p
                className="serif font-light"
                style={{ fontSize: "clamp(32px, 4vw, 44px)", color: T.light.heading, letterSpacing: "-0.02em", lineHeight: "1", fontVariantNumeric: "lining-nums tabular-nums" }}
              >
                {stat.value}
              </p>
              <p className="sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: T.light.eyebrow, margin: "0.4rem 0 0.25rem" }}>
                {stat.unit}
              </p>
              <p className="sans" style={{ fontSize: "11px", color: T.light.eyebrow }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ── TABLE OF CONTENTS ──────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <p
              className="sans uppercase"
              style={{ fontSize: T.eyebrowSize, letterSpacing: T.eyebrowTracking, color: T.light.eyebrow, marginBottom: T.space.md }}
            >
              Contents
            </p>
            <h2
              className="serif font-light leading-snug"
              style={{ fontSize: T.h2Size, color: T.light.heading, letterSpacing: "-0.015em" }}
            >
              Quick
              <br />
              Navigation.
            </h2>
          </div>
          <div>
            <div style={{ height: "0.5px", backgroundColor: "#e8e0d6" }} />
            {sections.map((s) => (
              <a key={s.num} href={`#ship-section-${s.num}`} className="toc-item">
                <span className="serif font-light" style={{ fontSize: "13px", color: T.light.eyebrow, display: "block", marginBottom: T.space.xs }}>
                  {s.num}
                </span>
                <span className="sans" style={{ fontSize: "12px", letterSpacing: "0.12em", color: T.light.heading, textTransform: "uppercase" }}>
                  {s.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── POLICY SECTIONS ────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        {sections.map((s) => (
          <div
            key={s.num}
            id={`ship-section-${s.num}`}
            className="policy-section grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start"
          >
            {/* Left sticky label */}
            <div className="md:sticky top-24">
              <span className="serif font-light" style={{ fontSize: "13px", color: T.light.eyebrow, display: "block", marginBottom: T.space.xs }}>
                {s.num}
              </span>
              <h3
                className="serif font-light leading-snug"
                style={{ fontSize: T.h3Size, color: T.light.heading, letterSpacing: "-0.01em" }}
              >
                {s.title}
              </h3>
            </div>

            {/* Right content */}
            <div>
              {s.body && (
                <p className="sans" style={{ fontSize: T.bodySize, lineHeight: T.bodyLineHeight, color: T.light.body }}>
                  {s.body}
                </p>
              )}

              {s.items && (
                <>
                  {s.itemsLabel && <SubLabel>{s.itemsLabel}</SubLabel>}
                  <div>
                    {s.items.map((item, i) => (
                      <div key={i} className="policy-item">
                        <span className="serif font-light flex-shrink-0" style={{ fontSize: "15px", color: "rgba(154,128,96,0.5)", marginTop: "1px" }}>
                          —
                        </span>
                        <p className="sans" style={{ fontSize: T.bodySize, lineHeight: "1.8", color: T.light.body }}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {s.footer && <FooterNote>{s.footer}</FooterNote>}

              {s.subsections &&
                s.subsections.map((sub) => (
                  <div key={sub.label}>
                    <SubLabel>{sub.label}</SubLabel>
                    <div>
                      {sub.items.map((item, i) => (
                        <div key={i} className="policy-item">
                          <span className="serif font-light flex-shrink-0" style={{ fontSize: "15px", color: "rgba(154,128,96,0.5)", marginTop: "1px" }}>
                            —
                          </span>
                          <p className="sans" style={{ fontSize: T.bodySize, lineHeight: "1.8", color: T.light.body }}>
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </section>

      <div className="section-divider" />

      {/* ── CONTACT ────────────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <p
              className="sans uppercase"
              style={{ fontSize: T.eyebrowSize, letterSpacing: T.eyebrowTracking, color: T.light.eyebrow, marginBottom: T.space.md }}
            >
              10 / Contact
            </p>
            <h3
              className="serif font-light leading-snug"
              style={{ fontSize: T.h2Size, color: T.light.heading, letterSpacing: "-0.01em" }}
            >
              Get in
              <br />
              Touch.
            </h3>
          </div>
          <div>
            <p className="sans" style={{ fontSize: T.bodySize, lineHeight: T.bodyLineHeight, color: T.light.body, marginBottom: T.space.lg }}>
              For any shipping-related queries, our customer support team is ready to help.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: T.space.xs }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span className="sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.22em", color: T.light.eyebrow, minWidth: "50px" }}>
                  Email
                </span>
                <a href="mailto:info@twinkleofficial.com" className="email-link sans" style={{ fontSize: T.bodySize }}>
                  info@twinkleofficial.com
                </a>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span className="sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.22em", color: T.light.eyebrow, minWidth: "50px" }}>
                  Phone
                </span>
                <span className="sans" style={{ fontSize: T.bodySize, color: T.light.body }}>
                  {settings?.contactNumber || "+92 304 3369149"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DARK CTA ───────────────────────────────────────── */}
      <section
        className="px-8 md:px-24 py-24 text-center"
        style={{ backgroundColor: "#1a1410", borderTop: "0.5px solid rgba(180,165,145,0.12)" }}
      >
        <p
          className="sans uppercase"
          style={{ fontSize: T.eyebrowSize, letterSpacing: T.eyebrowTracking, color: T.dark.eyebrow, marginBottom: T.space.md }}
        >
          Ready to Order?
        </p>
        <h2
          className="serif font-light leading-tight mx-auto"
          style={{ fontSize: "clamp(40px, 8vw, 80px)", color: T.dark.heading, letterSpacing: "-0.025em", maxWidth: "580px", marginBottom: T.space.md }}
        >
          Delivered with
          <br />
          <em>care, nationwide.</em>
        </h2>
        <p
          className="sans mx-auto"
          style={{ fontSize: T.bodySize, lineHeight: T.bodyLineHeight, color: T.dark.body, maxWidth: "360px", marginBottom: "3.5rem" }}
        >
          From Karachi to Lahore to the Northern Areas — your TWINKLE order travels carefully to reach you.
        </p>
        <div className="flex items-center justify-center gap-12 flex-wrap pb-10">
          <a
            href="/collection"
            className="sans inline-block"
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
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#3d352c";
              e.currentTarget.style.borderColor = "rgba(180,165,145,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2c2520";
              e.currentTarget.style.borderColor = "rgba(180,165,145,0.3)";
            }}
          >
            SHOP NOW
          </a>
        </div>
        <div style={{ height: "0.5px", backgroundColor: "rgba(100,80,60,0.25)" }} />
      </section>

      {/* ── SIDEBARS & MODALS ──────────────────────────────── */}
      {cartOpen && (
        <CartSidebar cart={cart} onClose={() => setCartOpen(false)} onRemove={(idx) => dispatch(removeFromCart(idx))} />
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
          }}
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

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover={false}
        toastClassName="text-[11px] tracking-[0.15em] uppercase"
      />

      <Footer />
    </div>
  );
}