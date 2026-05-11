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

  return (
    <div style={{ backgroundColor: "#EFEBE2" }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .f1 { animation: fadeUp 1.1s ease 0.1s both; }
        .f2 { animation: fadeUp 1.1s ease 0.3s both; }
        .f3 { animation: fadeUp 1.1s ease 0.55s both; }

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

        .email-link {
          color: #4a3f35;
          text-decoration: none;
          border-bottom: 0.5px solid rgba(74,63,53,0.3);
          padding-bottom: 1px;
          transition: border-color 0.2s, color 0.2s;
        }
        .email-link:hover {
          color: #2c2520;
          border-color: rgba(44,37,32,0.6);
        }

        .policy-section {
          padding: 2.5rem 0;
          border-bottom: 0.5px solid rgba(180,165,145,0.2);
        }
        .policy-section:last-child { border-bottom: none; }

        .policy-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding: 0.65rem 0;
          border-bottom: 0.5px solid rgba(180,165,145,0.12);
        }
        .policy-item:last-child { border-bottom: none; }

        .items-label {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #b4a58f;
          margin-bottom: 0.75rem;
          margin-top: 1.25rem;
        }

        .toc-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.7rem 0;
          border-bottom: 0.5px solid rgba(180,165,145,0.15);
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .toc-item:last-child { border-bottom: none; }
        .toc-item:hover { opacity: 0.6; }

        .section-divider {
          height: 0.5px;
          background: linear-gradient(to right, transparent, rgba(180,165,145,0.4), transparent);
        }

        .stat-card {
          border-top: 0.5px solid rgba(180,165,145,0.2);
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
      <section className="px-8 md:px-24 pt-14 pb-12 max-w-5xl mx-auto">
        <p
          className="f1 uppercase mb-6"
          style={{
            fontSize: "10px",
            letterSpacing: "0.32em",
            color: "#b4a58f",
          }}
        >
          Shipping · Last Updated May 2026
        </p>
        <h1
          className="serif f2 leading-none mb-8"
          style={{
            fontSize: "clamp(56px, 10vw, 96px)",
            color: "#2c2520",
            letterSpacing: "-0.02em",
            fontWeight: 500,
          }}
        >
          Shipping
          <br />
          Policy.
        </h1>
        <div className="f3" style={{ maxWidth: "480px" }}>
          <p style={{ fontSize: "14px", color: "#6b5c50", lineHeight: "1.9" }}>
            Thank you for shopping with TWINKLE. This policy explains how we
            process, ship, and deliver orders across Pakistan.
          </p>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "13px",
              color: "#9e8e82",
              lineHeight: "1.9",
              fontStyle: "italic",
            }}
          >
            By placing an order with TWINKLE, you agree to the terms outlined
            below.
          </p>
        </div>
      </section>

      {/* ── RULE ───────────────────────────────────────────── */}
      <div className="px-8 md:px-24 max-w-5xl mx-auto pb-14">
        <div className="rule" />
      </div>

      {/* ── AT-A-GLANCE STATS ──────────────────────────────── */}
      <section className="px-8 md:px-24 pb-20 max-w-7xl mx-auto">
        <p
          className="uppercase mb-10"
          style={{
            fontSize: "10px",
            letterSpacing: "0.32em",
            color: "#b4a58f",
          }}
        >
          At a Glance
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "1–2", unit: "business days", label: "Order processing" },
            { value: "3–5", unit: "business days", label: "Standard delivery" },
            { value: "48hrs", unit: "window", label: "Report damaged items" },
            { value: "8hrs", unit: "from order", label: "Cancellation window" },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <p
                className="serif font-light"
                style={{
                  fontSize: "clamp(32px, 4vw, 44px)",
                  color: "#2c2520",
                  letterSpacing: "-0.02em",
                  lineHeight: "1",
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  color: "#b4a58f",
                  textTransform: "uppercase",
                  margin: "0.4rem 0 0.25rem",
                }}
              >
                {stat.unit}
              </p>
              <p style={{ fontSize: "11px", color: "#9e8e82" }}>{stat.label}</p>
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
              className="uppercase mb-3"
              style={{
                fontSize: "10px",
                letterSpacing: "0.32em",
                color: "#b4a58f",
              }}
            >
              Contents
            </p>
            <h2
              className="serif leading-snug"
              style={{
                fontSize: "clamp(28px, 3vw, 38px)",
                color: "#2c2520",
                letterSpacing: "-0.015em",
                fontWeight: 500,
              }}
            >
              Quick
              <br />
              <em>Navigation.</em>
            </h2>
          </div>
          <div>
            <div style={{ height: "0.5px", backgroundColor: "#e8e0d6" }} />
            {sections.map((s) => (
              <a
                key={s.num}
                href={`#ship-section-${s.num}`}
                className="toc-item"
              >
                <span
                  className="serif font-light flex-shrink-0"
                  style={{
                    fontSize: "16px",
                    color: "rgba(180,165,145,0.5)",
                    minWidth: "28px",
                  }}
                >
                  {s.num}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    color: "#4a3f35",
                    textTransform: "uppercase",
                  }}
                >
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
              <span
                className="serif font-light"
                style={{
                  fontSize: "13px",
                  color: "rgba(180,165,145,0.5)",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                {s.num}
              </span>
              <h3
                className="serif leading-snug"
                style={{
                  fontSize: "clamp(22px, 2.5vw, 30px)",
                  color: "#2c2520",
                  letterSpacing: "-0.01em",
                  fontWeight: 500,
                }}
              >
                {s.title}
              </h3>
            </div>

            {/* Right content */}
            <div>
              {s.body && (
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.9",
                    color: "#4a3f35",
                  }}
                >
                  {s.body}
                </p>
              )}

              {/* Flat items */}
              {s.items && (
                <>
                  {s.itemsLabel && (
                    <p className="items-label">{s.itemsLabel}</p>
                  )}
                  <div>
                    {s.items.map((item, i) => (
                      <div key={i} className="policy-item">
                        <span
                          className="serif font-light flex-shrink-0"
                          style={{
                            fontSize: "15px",
                            color: "rgba(180,165,145,0.4)",
                            marginTop: "1px",
                          }}
                        >
                          —
                        </span>
                        <p
                          style={{
                            fontSize: "13px",
                            lineHeight: "1.8",
                            color: "#4a3f35",
                          }}
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Footer note */}
              {s.footer && (
                <p
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.9",
                    color: "#9e8e82",
                    fontStyle: "italic",
                    marginTop: "1rem",
                  }}
                >
                  {s.footer}
                </p>
              )}

              {/* Subsections */}
              {s.subsections &&
                s.subsections.map((sub) => (
                  <div key={sub.label}>
                    <p className="items-label">{sub.label}</p>
                    <div>
                      {sub.items.map((item, i) => (
                        <div key={i} className="policy-item">
                          <span
                            className="serif font-light flex-shrink-0"
                            style={{
                              fontSize: "15px",
                              color: "rgba(180,165,145,0.4)",
                              marginTop: "1px",
                            }}
                          >
                            —
                          </span>
                          <p
                            style={{
                              fontSize: "13px",
                              lineHeight: "1.8",
                              color: "#4a3f35",
                            }}
                          >
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
              className="uppercase mb-3"
              style={{
                fontSize: "10px",
                letterSpacing: "0.32em",
                color: "#b4a58f",
              }}
            >
              10 / Contact
            </p>
            <h3
              className="serif leading-snug"
              style={{
                fontSize: "clamp(28px, 3vw, 38px)",
                color: "#2c2520",
                letterSpacing: "-0.01em",
                fontWeight: 500,
              }}
            >
              Get in
              <br />
              <em>Touch.</em>
            </h3>
          </div>
          <div>
            <p
              style={{
                fontSize: "13px",
                lineHeight: "1.9",
                color: "#4a3f35",
                marginBottom: "1.5rem",
              }}
            >
              For any shipping-related queries, our customer support team is
              ready to help.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    color: "#b4a58f",
                    textTransform: "uppercase",
                    minWidth: "50px",
                  }}
                >
                  Email
                </span>
                <a
                  href="mailto:info@twinkleofficial.com"
                  className="email-link"
                  style={{ fontSize: "13px" }}
                >
                  info@twinkleofficial.com
                </a>
              </div>
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    color: "#b4a58f",
                    textTransform: "uppercase",
                    minWidth: "50px",
                  }}
                >
                  Phone
                </span>
                <span style={{ fontSize: "13px", color: "#4a3f35" }}>
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
        style={{
          backgroundColor: "#161310",
          borderTop: "0.5px solid rgba(180,165,145,0.12)",
        }}
      >
        <p
          className="uppercase mb-6"
          style={{
            fontSize: "10px",
            letterSpacing: "0.32em",
            color: "#b4a58f",
          }}
        >
          Ready to Order?
        </p>
        <h2
          className="serif leading-tight mb-8 mx-auto"
          style={{
            fontSize: "clamp(40px, 8vw, 80px)",
            color: "#f0e8de",
            letterSpacing: "-0.025em",
            maxWidth: "580px",
            fontWeight: 500,
          }}
        >
          Delivered with
          <br />
          <em>care, nationwide.</em>
        </h2>
        <p
          className="mx-auto mb-14"
          style={{
            fontSize: "13px",
            lineHeight: "1.9",
            color: "#7a6a5e",
            maxWidth: "360px",
          }}
        >
          From Karachi to Lahore to the Northern Areas — your TWINKLE order
          travels carefully to reach you.
        </p>
        <div className="flex items-center justify-center gap-12 flex-wrap pb-10">
          <a
            href="/collection"
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
        <div
          style={{ height: "0.5px", backgroundColor: "rgba(100,80,60,0.25)" }}
        />
      </section>

      {/* ── SIDEBARS & MODALS ──────────────────────────────── */}
      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={(idx) => dispatch(removeFromCart(idx))}
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