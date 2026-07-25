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

const tips = [
  {
    num: "01",
    title: "How to Measure",
    body: "Use a soft measuring tape and measure over light clothing or directly on the body for the most accurate fit. Keep the tape parallel to the floor.",
  },
  {
    num: "02",
    title: "Between Sizes?",
    body: "If you fall between two sizes, we recommend sizing up for a relaxed, comfortable fit — especially for nightwear and loungewear.",
  },
  {
    num: "03",
    title: "Fabric & Fit",
    body: "Our nightwear is designed with ease of movement in mind. Measurements refer to garment dimensions, not body measurements.",
  },
];

export default function SizeChartPage() {
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
    return { id: data.user.id, email: data.user.email, name: email.split("@")[0] };
  };

  const handleRegister = async (name, email, password, phoneNumber) => {
    const data = await customerRegister({ name, email, password, phone: phoneNumber });
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

        .section-divider {
          height: 0.5px;
          background: linear-gradient(to right, transparent, rgba(154,128,96,0.4), transparent);
        }

        .chart-image {
          width: 100%;
          display: block;
          border: 0.5px solid rgba(154,128,96,0.25);
        }

        .tip-section {
          padding: 2rem 0;
          border-bottom: 0.5px solid rgba(154,128,96,0.18);
        }
        .tip-section:last-child { border-bottom: none; }

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
        currentPage="size-chart"
      />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="px-8 md:px-24 pt-20 pb-16 max-w-7xl mx-auto">
        <p
          className="sans f1 uppercase"
          style={{ fontSize: T.eyebrowSize, letterSpacing: T.eyebrowTracking, color: T.light.eyebrow, marginBottom: T.space.md }}
        >
          Sizing Guide · All measurements in inches
        </p>
        <h1
          className="serif f2 font-light leading-none"
          style={{ fontSize: T.h1Size, color: T.light.heading, letterSpacing: "-0.02em", marginBottom: T.space.lg }}
        >
          Size Chart.
        </h1>
        <div className="f3" style={{ maxWidth: "700px" }}>
          <p className="sans" style={{ fontSize: T.bodySize, color: T.light.body, lineHeight: T.bodyLineHeight }}>
            Find your perfect fit with TWINKLE. Our nightwear is designed for
            comfort and ease — use the charts below to choose the right size
            for you.
          </p>
          <p
            className="serif"
            style={{ marginTop: T.space.sm, fontSize: "17px", color: T.light.eyebrow, lineHeight: T.bodyLineHeight, fontStyle: "italic" }}
          >
            All measurements are of the garment, not the body. When in doubt, size up.
          </p>
        </div>
      </section>

      {/* ── RULE ───────────────────────────────────────────── */}
      <div className="px-8 md:px-24 max-w-7xl mx-auto pb-14">
        <div className="rule" />
      </div>

      {/* ── AT-A-GLANCE ────────────────────────────────────── */}
      <section className="px-8 md:px-24 pb-20 max-w-7xl mx-auto">
        <p
          className="sans uppercase"
          style={{ fontSize: T.eyebrowSize, letterSpacing: T.eyebrowTracking, color: T.light.eyebrow, marginBottom: "2.5rem" }}
        >
          At a Glance
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "S", unit: "small" },
            { value: "M", unit: "medium" },
            { value: "L", unit: "large" },
            { value: "3", unit: "sizes available" },
          ].map((stat) => (
            <div key={stat.unit} className="stat-card">
              <p
                className="serif font-light"
                style={{ fontSize: "clamp(32px, 4vw, 44px)", color: T.light.heading, letterSpacing: "-0.02em", lineHeight: "1" }}
              >
                {stat.value}
              </p>
              <p
                className="sans uppercase"
                style={{ fontSize: "10px", letterSpacing: "0.18em", color: T.light.eyebrow, margin: "0.4rem 0 0.25rem" }}
              >
                {stat.unit}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ── SIZE CHART IMAGES ──────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
      

        {/* <div className="grid grid-cols-1 ">
       
          <div>
            <div className="mb-5 flex items-end justify-between">
              <p className="serif" style={{ fontSize: "22px", color: T.light.heading, fontWeight: 500, letterSpacing: "-0.01em" }}>
                Shirt and Trouser
              </p>
              <p className="sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.2em", color: T.light.eyebrow, paddingBottom: "3px" }}>
                inches
              </p>
            </div>
            <img
              src="/size.png"
              alt="Top size chart — S, M, L measurements for length, width and sleeve"
              className="chart-image"
            />
          </div>

        </div> */}
        <div className="grid grid-cols-1">
  {/* Top chart */}
  <div>
    <div className="mb-5  flex items-end justify-between" style={{ width: "50%", display: "block", margin: "0 auto" }}>
        <p
          className="sans uppercase"
          style={{ fontSize: T.eyebrowSize, letterSpacing: T.eyebrowTracking, color: T.light.eyebrow, marginBottom: T.space.md }}
        >
          Measurements
        </p>
        <h2
          className="serif font-light leading-snug"
          style={{ fontSize: T.h2Size, color: T.light.heading, letterSpacing: "-0.015em" }}
        >
          Size Charts.
        </h2>
      <p className="serif" style={{ fontSize: "22px", color: T.light.heading, fontWeight: 500, letterSpacing: "-0.01em" ,  marginBottom: T.space.md}}>
        Shirt and Trouser
      </p>
    </div>
    <img
      src="/size.png"
      alt="Top size chart — S, M, L measurements for length, width and sleeve"
      className="chart-image"
      style={{ width: "50%", display: "block", margin: "0 auto" }}
    />
  </div>
</div>
      </section>

      <div className="section-divider" />

      {/* ── SIZING TIPS ────────────────────────────────────── */}
      <section className="px-8 md:px-24 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <p
              className="sans uppercase"
              style={{ fontSize: T.eyebrowSize, letterSpacing: T.eyebrowTracking, color: T.light.eyebrow, marginBottom: T.space.md }}
            >
              Fit Guide
            </p>
            <h2
              className="serif font-light leading-snug"
              style={{ fontSize: T.h2Size, color: T.light.heading, letterSpacing: "-0.015em" }}
            >
              Sizing
              <br />
              Tips.
            </h2>
          </div>

          <div>
            {tips.map((tip) => (
              <div key={tip.num} className="tip-section grid grid-cols-[40px_1fr] gap-6 items-start">
                <span className="serif font-light" style={{ fontSize: "13px", color: T.light.eyebrow, paddingTop: "2px" }}>
                  {tip.num}
                </span>
                <div>
                  <h3
                    className="serif"
                    style={{ fontSize: "18px", color: T.light.heading, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: T.space.xs }}
                  >
                    {tip.title}
                  </h3>
                  <p className="sans" style={{ fontSize: T.bodySize, lineHeight: T.bodyLineHeight, color: T.light.body }}>
                    {tip.body}
                  </p>
                </div>
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
              className="sans uppercase"
              style={{ fontSize: T.eyebrowSize, letterSpacing: T.eyebrowTracking, color: T.light.eyebrow, marginBottom: T.space.md }}
            >
              Need Help?
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
              Still unsure about your size? Our team is happy to help you find the perfect fit.
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
          Ready to Shop?
        </p>
        <h2
          className="serif font-light leading-tight mx-auto"
          style={{ fontSize: "clamp(40px, 8vw, 80px)", color: T.dark.heading, letterSpacing: "-0.025em", maxWidth: "580px", marginBottom: T.space.md }}
        >
          Dressed for rest,
          <br />
          fitted for you.
        </h2>
        <p
          className="sans mx-auto"
          style={{ fontSize: T.bodySize, lineHeight: T.bodyLineHeight, color: T.dark.body, maxWidth: "360px", marginBottom: "3.5rem" }}
        >
          Now that you know your size, explore our collection of luxurious nightwear crafted for effortless comfort.
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