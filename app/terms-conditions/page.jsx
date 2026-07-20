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
    title: "General",
    body: "TWINKLE is an online fashion brand specialising in nightwear products in Pakistan. Continued use of the website after updates means you accept the revised terms.",
    items: [
      "Update or modify these Terms & Conditions at any time",
      "Refuse service to any customer for valid reasons",
      "Cancel orders in case of pricing errors, fraud suspicion, or stock unavailability",
    ],
    itemsLabel: "We reserve the right to:",
  },
  {
    num: "02",
    title: "Products & Availability",
    body: "We aim to ensure all product details are accurate. All products are subject to availability.",
    items: [
      "Colors may slightly vary due to screen settings",
      "Product availability may change without notice",
      "We may discontinue any product at any time",
    ],
  },
  {
    num: "03",
    title: "Pricing",
    body: "All prices are listed in Pakistani Rupees (PKR). Customers will be informed before processing if any issue occurs.",
    items: [
      "Change prices without prior notice",
      "Correct pricing errors",
      "Cancel orders placed with incorrect pricing",
    ],
    itemsLabel: "TWINKLE reserves the right to:",
  },
  {
    num: "04",
    title: "Orders",
    body: "After placing an order you will receive confirmation via SMS, email, or WhatsApp. Orders are processed after verification.",
    items: [
      "Incorrect details",
      "Fraud suspicion",
      "Stock unavailability",
      "Failed verification",
    ],
    itemsLabel: "TWINKLE may cancel or refuse orders due to:",
  },
  {
    num: "05",
    title: "Payment Methods",
    body: "All payments are processed through secure systems. TWINKLE does not store full card details.",
    items: [
      "Cash on Delivery (COD)",
      "JazzCash",
      "Easypaisa",
      "Visa",
      "Mastercard",
    ],
    itemsLabel: "We accept:",
  },
  {
    num: "06",
    title: "Order Cancellation",
    body: "Customers may cancel their order within 8 hours of placing it by contacting customer support. After 8 hours, orders may already be processed or shipped and cancellation requests may not be accepted. Refunds (if applicable) will be processed according to the original payment method.",
    items: [
      "Stock issues",
      "Fraud detection",
      "Incorrect information",
      "Verification failure",
    ],
    itemsLabel: "TWINKLE may cancel orders due to:",
  },
  {
    num: "07",
    title: "Shipping Policy",
    body: "Please refer to our full Shipping Policy for complete details.",
    items: [
      "Delivery across Pakistan",
      "3–5 business days standard delivery",
      "Remote areas may take longer",
    ],
    itemsLabel: "Summary:",
  },
  {
    num: "08",
    title: "Exchange & Return",
    body: "Please refer to our full Exchange & Return Policy for complete details.",
    items: [
      "Exchanges and returns accepted within 28 days",
      "Items must be unused with original tags",
      "Sale items are not eligible for return or exchange",
      "Damaged or wrong items must be reported with proof",
    ],
    itemsLabel: "Summary:",
  },
  {
    num: "09",
    title: "Promotions & Discounts",
    items: [
      "Offers are time-limited",
      "Cannot be combined unless stated",
      "TWINKLE may modify or cancel promotions at any time",
      "Misuse of discount codes may result in order cancellation",
    ],
  },
  {
    num: "10",
    title: "Intellectual Property",
    body: "All content on the website — including logos, images, designs, text, and graphics — is the property of TWINKLE and cannot be copied or reused without written permission.",
  },
  {
    num: "11",
    title: "User Conduct",
    body: "Violations may result in order cancellation or account restrictions.",
    items: [
      "Provide false information",
      "Misuse the website",
      "Attempt unauthorized access",
      "Interfere with website functionality",
    ],
    itemsLabel: "Users agree not to:",
  },
  {
    num: "12",
    title: "WhatsApp, SMS & Email Consent",
    body: "By providing your contact details, you consent that TWINKLE may contact you via WhatsApp, SMS, and email for order confirmations, delivery updates, promotional campaigns, and new arrivals. You may opt out of marketing messages anytime by replying STOP or contacting support. Transactional messages will still be sent.",
  },
  {
    num: "13",
    title: "Third-Party Services",
    body: "TWINKLE is not responsible for the policies or performance of third-party services.",
    items: [
      "Payment gateways",
      "Courier companies",
      "Advertising platforms (Google & Meta)",
    ],
    itemsLabel: "We use third-party services such as:",
  },
  {
    num: "14",
    title: "Limitation of Liability",
    body: "Our liability is limited to the value of the purchased product.",
    items: [
      "Courier delays",
      "Technical issues",
      "Indirect damages",
      "Losses beyond our control",
    ],
    itemsLabel: "TWINKLE is not liable for:",
  },
  {
    num: "15",
    title: "Privacy Policy",
    body: "Your use of our website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal data.",
  },
  {
    num: "16",
    title: "Governing Law",
    body: "These Terms & Conditions are governed by the laws of Pakistan. Any disputes will fall under Pakistani jurisdiction.",
  },
];

export default function TermsConditionsPage() {
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
  // Same source of truth used on the About page. Nothing below
  // is hand-picked per section — it all pulls from here.
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
    h2Size: "clamp(32px, 5vw, 48px)",
    h3Size: "clamp(22px, 2.5vw, 30px)",
    bodySize: "13px",
    bodyLineHeight: "1.85",
    quoteSize: "17px",
    space: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2.5rem",
    },
  };

  function SubLabel({ children }) {
    return (
      <div
        className="sans uppercase"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: T.space.sm,
          marginTop: T.space.md,
          fontSize: "11px",
          letterSpacing: "0.2em",
          color: T.light.heading,
        }}
      >
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: T.light.eyebrow,
            flexShrink: 0,
            display: "inline-block",
          }}
        />
        <span>{children}</span>
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
      `}</style>

      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
        onUserClick={() => setAuthOpen(true)}
        currentPage="terms-conditions"
      />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="px-8 md:px-24 pt-20 pb-16 max-w-7xl mx-auto">
        <p
          className="sans f1 uppercase"
          style={{ fontSize: T.eyebrowSize, letterSpacing: T.eyebrowTracking, color: T.light.eyebrow, marginBottom: T.space.md }}
        >
          Legal · Last Updated May 2026
        </p>
        <h1
          className="serif f2 font-light leading-none"
          style={{ fontSize: T.h1Size, color: T.light.heading, letterSpacing: "-0.02em", marginBottom: T.space.lg }}
        >
          Terms &amp; Conditions.
        </h1>
        <div className="f3" style={{ maxWidth: "700px" }}>
          <p className="sans" style={{ fontSize: T.bodySize, color: T.light.body, lineHeight: T.bodyLineHeight }}>
            Welcome to TWINKLE. These Terms &amp; Conditions govern your use of
            our website and services. By accessing our website or placing an
            order, you agree to be bound by these terms.
          </p>
          <p
            className="serif"
            style={{
              marginTop: T.space.sm,
              fontSize: T.quoteSize,
              color: T.light.eyebrow,
              lineHeight: T.bodyLineHeight,
              fontStyle: "italic",
            }}
          >
            If you do not agree with any part of these terms, please do not use our website.
          </p>
        </div>
      </section>

      {/* ── RULE ───────────────────────────────────────────── */}
      <div className="px-8 md:px-24 max-w-7xl mx-auto pb-16">
        <div className="rule" />
      </div>

      {/* ── TABLE OF CONTENTS ──────────────────────────────── */}
      <section className="px-8 md:px-24 pb-20 max-w-7xl mx-auto">
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
              <a key={s.num} href={`#tc-section-${s.num}`} className="toc-item">
                <span
                  className="serif font-light flex-shrink-0"
                  style={{ fontSize: "16px", color: T.light.eyebrow, minWidth: "28px" }}
                >
                  {s.num}
                </span>
                <span
                  className="sans"
                  style={{ fontSize: "12px", letterSpacing: "0.12em", color: T.light.heading, textTransform: "uppercase" }}
                >
                  {s.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SECTIONS ───────────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        {sections.map((s) => (
          <div
            key={s.num}
            id={`tc-section-${s.num}`}
            className="policy-section grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start"
          >
            {/* Left sticky label */}
            <div className="md:sticky top-24">
              <span
                className="serif font-light"
                style={{ fontSize: "13px", color: T.light.eyebrow, display: "block", marginBottom: T.space.xs }}
              >
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
                        <span
                          className="serif font-light flex-shrink-0"
                          style={{ fontSize: "15px", color: "rgba(154,128,96,0.5)", marginTop: "1px" }}
                        >
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
              17 / Contact
            </p>
            <h3
              className="serif font-light leading-snug"
              style={{ fontSize: T.h2Size, color: T.light.heading, letterSpacing: "-0.01em" }}
            >
              Get in
              <br />
              <em>Touch.</em>
            </h3>
          </div>
          <div>
            <p className="sans" style={{ fontSize: T.bodySize, lineHeight: T.bodyLineHeight, color: T.light.body, marginBottom: T.space.lg }}>
              For any queries regarding these Terms &amp; Conditions, please
              reach out to our customer support team.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: T.space.xs }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span
                  className="sans uppercase"
                  style={{ fontSize: "10px", letterSpacing: "0.22em", color: T.light.eyebrow, minWidth: "50px" }}
                >
                  Email
                </span>
                <a href="mailto:info@twinkleofficial.com" className="email-link sans" style={{ fontSize: T.bodySize }}>
                  info@twinkleofficial.com
                </a>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span
                  className="sans uppercase"
                  style={{ fontSize: "10px", letterSpacing: "0.22em", color: T.light.eyebrow, minWidth: "50px" }}
                >
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
          Shop with Confidence
        </p>
        <h2
          className="serif font-light leading-tight mx-auto"
          style={{ fontSize: "clamp(40px, 8vw, 80px)", color: T.dark.heading, letterSpacing: "-0.025em", maxWidth: "580px", marginBottom: T.space.md }}
        >
          Crafted with care,
          <br />
          <em>delivered with trust.</em>
        </h2>
        <p
          className="sans mx-auto"
          style={{ fontSize: T.bodySize, lineHeight: T.bodyLineHeight, color: T.dark.body, maxWidth: "360px", marginBottom: "3.5rem" }}
        >
          Every order is handled with the same attention and intention that goes
          into every stitch of our nightwear.
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