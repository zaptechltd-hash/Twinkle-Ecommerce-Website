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
    title: "Information We Collect",
    subsections: [
      {
        label: "Personal Information",
        items: [
          "Full name",
          "Email address",
          "Phone number",
          "Shipping and billing address",
          "Order details",
          "Payment-related information",
        ],
      },
      {
        label: "Technical Information",
        items: [
          "IP address",
          "Browser type",
          "Device information",
          "Website usage data",
          "Cookies and tracking information",
        ],
      },
      {
        label: "Marketing Information",
        items: [
          "Email preferences",
          "Purchase behaviour",
          "Engagement with advertisements and campaigns",
        ],
      },
    ],
  },
  {
    num: "02",
    title: "How We Use Your Information",
    items: [
      "Process and deliver your orders",
      "Provide customer support",
      "Send order confirmations and updates",
      "Improve our website and customer experience",
      "Prevent fraud and unauthorized transactions",
      "Send promotional emails, SMS, and marketing offers",
      "Analyze website traffic and advertising performance",
    ],
  },
  {
    num: "03",
    title: "Payment Information",
    body: "We offer Cash on Delivery (COD) and secure local payment gateway options. We do not store your complete debit or credit card information on our servers. Payments are processed securely through trusted third-party payment providers.",
  },
  {
    num: "04",
    title: "Marketing Communications",
    body: "By providing your email address or phone number, you consent to receive promotional emails, SMS marketing messages, product updates, sale announcements, and special offers. You may unsubscribe from marketing communications at any time by clicking the unsubscribe link in emails or contacting us directly. Please note that transactional messages related to your orders may still be sent.",
  },
  {
    num: "05",
    title: "Cookies & Tracking Technologies",
    body: "Our website uses cookies and similar technologies to improve website functionality, remember your preferences, analyze traffic and shopping behavior, and deliver personalized advertisements. We may use services such as Google Analytics, Google Ads, and Meta advertising tools and pixels. You can disable cookies through your browser settings, although some features of the website may not function properly.",
  },
  {
    num: "06",
    title: "Third-Party Services",
    body: "We may share limited information with trusted third parties including delivery and courier partners, payment gateway providers, marketing and advertising platforms, and analytics providers. These third parties only receive information necessary to perform their services and are expected to protect your data.",
  },
  {
    num: "07",
    title: "Data Security",
    body: "We take reasonable technical and organizational measures to protect your personal information against unauthorized access, misuse, loss, disclosure, and alteration. Our website uses secure technologies and encrypted connections where applicable.",
  },
  {
    num: "08",
    title: "Data Retention",
    body: "We retain your personal information only for as long as necessary to fulfill orders, provide customer support, meet legal and accounting requirements, resolve disputes, and enforce our policies. When information is no longer required, it will be securely deleted or anonymized.",
  },
  {
    num: "09",
    title: "Your Rights",
    items: [
      "Request access to your personal information",
      "Correct inaccurate information",
      "Request deletion of your data",
      "Opt out of marketing communications",
    ],
    body: "To make a request, please contact us using the details below.",
  },
  {
    num: "10",
    title: "Children's Privacy",
    body: "Our website and services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children.",
  },
  {
    num: "11",
    title: "Third-Party Links",
    body: "Our website may contain links to third-party websites or platforms. Twinkle is not responsible for the privacy practices or content of external websites.",
  },
  {
    num: "12",
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our website after changes are posted constitutes acceptance of the revised policy.",
  },
];

export default function PrivacyPolicyPage() {
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
        .policy-section:last-child {
          border-bottom: none;
        }

        .policy-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding: 0.65rem 0;
          border-bottom: 0.5px solid rgba(180,165,145,0.12);
        }
        .policy-item:last-child { border-bottom: none; }

        .subsection-label {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #b4a58f;
          margin-bottom: 0.75rem;
          margin-top: 1.5rem;
        }
        .subsection-label:first-child { margin-top: 0; }

        .toc-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 0;
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
      `}</style>

      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
        onUserClick={() => setAuthOpen(true)}
        currentPage="privacy-policy"
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
          Legal · Last Updated May 2026
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
          Privacy
          <br />
          Policy.
        </h1>
        <div className="f3" style={{ maxWidth: "480px" }}>
          <p style={{ fontSize: "14px", color: "#6b5c50", lineHeight: "1.9" }}>
            At Twinkle, we value your privacy and are committed to protecting
            your personal information. This policy explains how we collect, use,
            store, and protect your data.
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
            By using our website, you agree to the terms outlined below.
          </p>
        </div>
      </section>

      {/* ── RULE ───────────────────────────────────────────── */}
      <div className="px-8 md:px-24 max-w-5xl mx-auto pb-16">
        <div className="rule" />
      </div>

      {/* ── TABLE OF CONTENTS ──────────────────────────────── */}
      <section className="px-8 md:px-24 pb-20 max-w-7xl mx-auto">
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
              <a key={s.num} href={`#section-${s.num}`} className="toc-item">
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
            id={`section-${s.num}`}
            className="policy-section grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start"
          >
            {/* Left — sticky label */}
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

            {/* Right — content */}
            <div>
              {/* Body paragraph */}
              {s.body && (
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.9",
                    color: "#4a3f35",
                    marginBottom: s.items || s.subsections ? "1.5rem" : "0",
                  }}
                >
                  {s.body}
                </p>
              )}

              {/* Flat items list */}
              {s.items && (
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
              )}

              {/* Subsections */}
              {s.subsections &&
                s.subsections.map((sub) => (
                  <div key={sub.label}>
                    <p className="subsection-label">{sub.label}</p>
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
              13 / Contact
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
              If you have any questions about this Privacy Policy or your
              personal data, please reach out to our customer support team.
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
          Get in Touch
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
          Your privacy
          <br />
          <em>matters to us.</em>
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
          Have questions about this policy or how we handle your data? Reach us
          directly at
        </p>
        <div className="flex items-center justify-center gap-12 flex-wrap pb-10">
          <p
            style={{
              padding: "16px 52px",
              backgroundColor: "#2c2520",
              border: "0.5px solid rgba(180,165,145,0.3)",
              color: "#e8dfd4",
              fontSize: "11px",
              letterSpacing: "0.24em",
              display: "inline-block",
            }}
          >
            info@twinkleofficial.com
          </p>
          <a href="/collection" className="cta-link">
            BACK TO SHOP
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