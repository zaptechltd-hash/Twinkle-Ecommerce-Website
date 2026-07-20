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

const exchangeEligibility = [
  "The item(s) must be unused, unworn, and unwashed",
  "All original tags must be attached",
  "The item(s) must be returned in their original packaging and condition",
  "Proof of purchase must be provided (such as order confirmation email or order number)",
];

const exchangeNotes = [
  "Items purchased on sale, discount, or promotional offers are not eligible for exchange",
  "Exchange requests are subject to stock availability",
];

const exchangeProof = [
  "The item received is damaged or defective",
  "The wrong item was delivered",
  "The wrong size was received",
];

const returnEligibility = [
  "The item(s) must be unused, unworn, and unwashed",
  "All original tags must be attached",
  "The item(s) must be returned in their original packaging and condition",
  "Proof of purchase must be provided",
];

const returnAccepted = [
  "An incorrect item was delivered",
  "The item received is damaged or defective",
];

const returnNotes = [
  "Items purchased on sale, discount, or promotional offers are not eligible for return",
  "TWINKLE reserves the right to reject returns that do not meet eligibility criteria",
];

const nonReturnableItems = [
   "Items showing signs of use or wear",
  "Products without original tags or packaging",
  "Personal care and hygiene-sensitive items",
  // "Items returned outside the eligible return window",
];
const refundItems = [
  "Refunds will be processed according to the original payment method",
  "Processing times may vary depending on the payment provider or bank",
  "Shipping charges are generally non-refundable unless the error was caused by TWINKLE",
];

const importantNotes = [
  "Items sent back without prior approval may not be accepted",
  "Customers are responsible for ensuring returned items are securely packaged",
  "TWINKLE is not responsible for items damaged during return transit due to improper packaging",
];

const processSteps = [
  {
    step: "01",
    title: "Contact Support",
    desc: "Reach out to our customer support team at info@twinkleofficial.com within 28 days of receiving your order.",
  },
  {
    step: "02",
    title: "Share Details",
    desc: "Provide your order number, reason for exchange or return, and supporting images or videos if applicable.",
  },
  {
    step: "03",
    title: "Await Review",
    desc: "Our team will review your request and guide you through the next steps after inspection and verification.",
  },
];

/* ── Reusable sub-label (Option D: dot marker) ── */
function SubLabel({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "0.9rem",
        marginTop: "1.5rem",
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "#6b5642",
          flexShrink: 0,
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontSize: "11px",
          letterSpacing: "0.2em",
          color: "#241c16",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* ── COD italic note (Option D: serif "Note —" lead) ── */
function CodNote({ children }) {
  return (
    <div
      style={{
        marginTop: "1rem",
        display: "flex",
        gap: "0.65rem",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "15px",
          fontStyle: "italic",
          fontWeight: 300,
          color: "#6b5642",
          flexShrink: 0,
          marginTop: "1px",
        }}
      >
       Note —
      </span>
      <p
        style={{
          fontSize: "12px",
          color: "#2e241c",
          lineHeight: "1.85",
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  );
}

export default function ExchangeReturnPolicyPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart);
  const wishlist = useAppSelector((s) => s.wishlist);
  const user = useAppSelector((s) => s.auth);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const settings = useAppSelector((s) => s.settings);
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
        .cta-link:hover { color: #fff; border-color: rgba(255,255,255,0.6); }

        .email-link {
          color: #241c16;
          text-decoration: none;
          border-bottom: 0.5px solid rgba(74,63,53,0.3);
          padding-bottom: 1px;
          transition: border-color 0.2s, color 0.2s;
        }
        .email-link:hover { color: #0d0906; border-color: rgba(44,37,32,0.6); }

        .policy-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding: 0.65rem 0;
          border-bottom: 0.5px solid rgba(180,165,145,0.12);
        }
        .policy-item:last-child { border-bottom: none; }

        .policy-block {
          padding: 2.5rem 0;
          border-bottom: 0.5px solid rgba(180,165,145,0.2);
        }
        .policy-block:last-child { border-bottom: none; }

        .section-divider {
          height: 0.5px;
          background: linear-gradient(to right, transparent, rgba(180,165,145,0.4), transparent);
        }

        .stat-card {
          border-top: 0.5px solid rgba(180,165,145,0.2);
          padding-top: 1.5rem;
        }

        .process-step {
          border-top: 0.5px solid rgba(180,165,145,0.2);
          padding-top: 1.75rem;
          padding-bottom: 1.75rem;
        }

        .warning-strip {
          border-left: 1.5px solid rgba(180,165,145,0.5);
          padding: 1rem 1.5rem;
          background: rgba(180,165,145,0.06);
        }
      `}</style>

      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
        onUserClick={() => setAuthOpen(true)}
        currentPage="exchange-return"
      />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="px-8 md:px-24 pt-14 pb-12 max-w-7xl mx-auto">
        <p
          className="f1 uppercase mb-6"
          style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#6b5642" }}
        >
          Policies · Last Updated May 2026
        </p>
        <h1
          className="serif f2 leading-none mb-8"
          style={{
            fontSize: "clamp(56px, 10vw, 96px)",
            color: "#0d0906",
            letterSpacing: "-0.02em",
            fontWeight: 500,
          }}
        >
          Exchange &amp;
          Return.
        </h1>
        <div className="f3">
          <p style={{ fontSize: "14px", color: "#2e241c", lineHeight: "1.9" }}>
            At TWINKLE, our customers are our top priority. We aim to provide a
            smooth and hassle-free shopping experience.
          </p>
          <p style={{ marginTop: "1rem", fontSize: "13px", color: "#6b5642", lineHeight: "1.9" }}>
            For any exchange or return requests, please contact us at{" "}
            <a href="mailto:info@twinkleofficial.com" className="email-link">
              info@twinkleofficial.com
            </a>
          </p>
        </div>
      </section>

      {/* ── RULE ───────────────────────────────────────────── */}
      <div className="px-8 md:px-24 max-w-5xl mx-auto pb-14">
        <div className="rule" />
      </div>

      {/* ── AT-A-GLANCE ────────────────────────────────────── */}
      <section className="px-8 md:px-24 pb-20 max-w-7xl mx-auto">
        <p
          className="uppercase mb-10"
          style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#6b5642" }}
        >
          At a Glance
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "28", unit: "days", label: "Exchange window" },
            { value: "28", unit: "days", label: "Return window" },
            { value: "COD", unit: "refunds", label: "Via bank transfer or store credit" },
            { value: "100%", unit: "unused", label: "Items must be unworn & tagged" },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <p
                className="serif font-light"
                style={{
                  fontSize: "clamp(28px, 4vw, 44px)",
                  color: "#0d0906",
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
                  color: "#6b5642",
                  textTransform: "uppercase",
                  margin: "0.4rem 0 0.25rem",
                }}
              >
                {stat.unit}
              </p>
              <p style={{ fontSize: "11px", color: "#6b5642" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ── EXCHANGE POLICY ────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
          <div className="md:sticky top-24">
            <p
              className="uppercase mb-3"
              style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#6b5642" }}
            >
              01 / Policy
            </p>
            <h2
              className="serif leading-snug"
              style={{
                fontSize: "clamp(28px, 3.5vw, 42px)",
                color: "#0d0906",
                letterSpacing: "-0.015em",
                fontWeight: 500,
              }}
            >
              Exchange
              <br />
              <em>Policy.</em>
            </h2>
          </div>
          <div>
            <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#241c16" }}>
              Exchange requests must be made within{" "}
              <strong style={{ fontWeight: "500", color: "#0d0906" }}>28 days</strong>{" "}
              of receiving your order. To qualify for an exchange, all of the
              following conditions must be met.
            </p>

            <SubLabel>Eligibility criteria</SubLabel>
            <div>
              {exchangeEligibility.map((item, i) => (
                <div key={i} className="policy-item">
                  <span
                    className="serif font-light flex-shrink-0"
                    style={{ fontSize: "15px", color: "rgba(180,165,145,0.4)", marginTop: "1px" }}
                  >
                    —
                  </span>
                  <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#241c16" }}>{item}</p>
                </div>
              ))}
            </div>

            <SubLabel>Please note</SubLabel>
            <div>
              {exchangeNotes.map((item, i) => (
                <div key={i} className="policy-item">
                  <span
                    className="serif font-light flex-shrink-0"
                    style={{ fontSize: "15px", color: "rgba(180,165,145,0.4)", marginTop: "1px" }}
                  >
                    —
                  </span>
                  <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#241c16" }}>{item}</p>
                </div>
              ))}
            </div>

            <SubLabel>Photo or video proof required if</SubLabel>
            <div>
              {exchangeProof.map((item, i) => (
                <div key={i} className="policy-item">
                  <span
                    className="serif font-light flex-shrink-0"
                    style={{ fontSize: "15px", color: "rgba(180,165,145,0.4)", marginTop: "1px" }}
                  >
                    —
                  </span>
                  <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#241c16" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── RETURN POLICY ──────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
          <div className="md:sticky top-24">
            <p
              className="uppercase mb-3"
              style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#6b5642" }}
            >
              02 / Policy
            </p>
            <h2
              className="serif leading-snug"
              style={{
                fontSize: "clamp(28px, 3.5vw, 42px)",
                color: "#0d0906",
                letterSpacing: "-0.015em",
                fontWeight: 500,
              }}
            >
              Return
              <br />
              <em>Policy.</em>
            </h2>
          </div>
          <div>
            <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#241c16" }}>
              Return requests must be made within{" "}
              <strong style={{ fontWeight: "500", color: "#0d0906" }}>28 days</strong>{" "}
              of receiving your order. Customers may be asked to provide photo
              or video proof for verification purposes.
            </p>

            <SubLabel>Eligibility criteria</SubLabel>
            <div>
              {returnEligibility.map((item, i) => (
                <div key={i} className="policy-item">
                  <span
                    className="serif font-light flex-shrink-0"
                    style={{ fontSize: "15px", color: "rgba(180,165,145,0.4)", marginTop: "1px" }}
                  >
                    —
                  </span>
                  <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#241c16" }}>{item}</p>
                </div>
              ))}
            </div>

            <SubLabel>Returns are only accepted if</SubLabel>
            <div>
              {returnAccepted.map((item, i) => (
                <div key={i} className="policy-item">
                  <span
                    className="serif font-light flex-shrink-0"
                    style={{ fontSize: "15px", color: "rgba(180,165,145,0.4)", marginTop: "1px" }}
                  >
                    —
                  </span>
                  <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#241c16" }}>{item}</p>
                </div>
              ))}
            </div>

            <SubLabel>Please note</SubLabel>
            <div>
              {returnNotes.map((item, i) => (
                <div key={i} className="policy-item">
                  <span
                    className="serif font-light flex-shrink-0"
                    style={{ fontSize: "15px", color: "rgba(180,165,145,0.4)", marginTop: "1px" }}
                  >
                    —
                  </span>
                  <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#241c16" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── NON-RETURNABLE + REFUND ────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Non-returnable */}
          {/* Non-returnable */}
<div className="flex flex-col h-full">
  <div>
    <p
      className="uppercase mb-3"
      style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#6b5642" }}
    >
      03 / Note
    </p>
    <h3
      className="serif leading-snug mb-6"
      style={{
        fontSize: "clamp(24px, 3vw, 36px)",
        color: "#0d0906",
        letterSpacing: "-0.01em",
        fontWeight: 500,
      }}
    >
      Non-Returnable
      <br />
      <em>Items.</em>
    </h3>

    <div>
      {nonReturnableItems.map((item, i) => (
        <div key={i} className="policy-item">
          <span
            className="serif font-light flex-shrink-0"
            style={{ fontSize: "15px", color: "rgba(180,165,145,0.4)", marginTop: "1px" }}
          >
            —
          </span>
          <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#241c16" }}>{item}</p>
        </div>
      ))}
    </div>
  </div>

  <div className="warning-strip mt-auto">
    <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#241c16" }}>
      For hygiene and safety reasons, certain personal wear items may
      not be eligible for return or exchange unless they arrive
      damaged or defective.
    </p>
  </div>
</div>

          {/* Refund process */}
          <div>
            <p
              className="uppercase mb-3"
              style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#6b5642" }}
            >
              04 / Refunds
            </p>
            <h3
              className="serif leading-snug mb-6"
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                color: "#0d0906",
                letterSpacing: "-0.01em",
                fontWeight: 500,
              }}
            >
              Refund
              <br />
              <em>Process.</em>
            </h3>
            <div>
              {refundItems.map((item, i) => (
                <div key={i} className="policy-item">
                  <span
                    className="serif font-light flex-shrink-0"
                    style={{ fontSize: "15px", color: "rgba(180,165,145,0.4)", marginTop: "1px" }}
                  >
                    —
                  </span>
                  <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#241c16" }}>{item}</p>
                </div>
              ))}
            </div>
        
       <div className="warning-strip mt-auto">
    <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#241c16" }}>
       Please Note — For Cash on Delivery (COD) orders, refunds may be processed via
              bank transfer or store credit where applicable.
    </p>
  </div>
          
          </div>
        </div>
      </section>

   

      <div className="section-divider" />

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20" style={{ backgroundColor: "#1a1410" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 items-start mb-14">
            <div>
              <p
                className="uppercase mb-3"
                style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
              >
                05 / Process
              </p>
              <h2
                className="serif leading-snug"
                style={{
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  color: "#f0e8de",
                  letterSpacing: "-0.015em",
                  fontWeight: 500,
                }}
              >
                How it
                <br />
                <em>works.</em>
              </h2>
            </div>
            <p
              style={{
                fontSize: "13px",
                lineHeight: "1.9",
                color: "#7a6a5e",
                maxWidth: "420px",
                alignSelf: "flex-end",
              }}
            >
              TWINKLE reserves the right to approve or reject requests after
              inspection and verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12">
            {processSteps.map((s) => (
              <div key={s.step} className="process-step">
                <p
                  className="serif font-light mb-5"
                  style={{ fontSize: "32px", color: "rgba(180,165,145,0.25)" }}
                >
                  {s.step}
                </p>
                <p
                  className="uppercase mb-3"
                  style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#e8dfd4" }}
                >
                  {s.title}
                </p>
                <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#7a6a5e" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPORTANT NOTES ────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
          <div className="md:sticky top-24">
            <p
              className="uppercase mb-3"
              style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#6b5642" }}
            >
              06 / Important
            </p>
            <h3
              className="serif leading-snug"
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                color: "#0d0906",
                letterSpacing: "-0.01em",
                fontWeight: 500,
              }}
            >
              Important
              <br />
              <em>Notes.</em>
            </h3>
          </div>
          <div>
            {importantNotes.map((item, i) => (
              <div key={i} className="policy-item">
                <span
                  className="serif font-light flex-shrink-0"
                  style={{ fontSize: "15px", color: "rgba(180,165,145,0.4)", marginTop: "1px" }}
                >
                  —
                </span>
                <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#241c16" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── CONTACT ────────────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <p
              className="uppercase mb-3"
              style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#6b5642" }}
            >
              07 / Contact
            </p>
            <h3
              className="serif leading-snug"
              style={{
                fontSize: "clamp(28px, 3vw, 38px)",
                color: "#0d0906",
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
            <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#241c16", marginBottom: "1.5rem" }}>
              For any questions regarding exchanges or returns, our customer
              support team is here to help every step of the way.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    color: "#6b5642",
                    textTransform: "uppercase",
                    minWidth: "50px",
                  }}
                >
                  Email
                </span>
                <a href="mailto:info@twinkleofficial.com" className="email-link" style={{ fontSize: "13px" }}>
                  info@twinkleofficial.com
                </a>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    color: "#6b5642",
                    textTransform: "uppercase",
                    minWidth: "50px",
                  }}
                >
                  Phone
                </span>
                <span style={{ fontSize: "13px", color: "#241c16" }}>
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
          style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#b4a58f" }}
        >
          Shop with Confidence
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
          Every purchase,
          <br />
          <em>protected.</em>
        </h2>
        <p
          className="mx-auto mb-14"
          style={{ fontSize: "13px", lineHeight: "1.9", color: "#7a6a5e", maxWidth: "360px" }}
        >
          We stand behind every piece we make. If something isn&apos;t right,
          we&apos;re here to make it right.
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
        <div style={{ height: "0.5px", backgroundColor: "rgba(100,80,60,0.25)" }} />
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