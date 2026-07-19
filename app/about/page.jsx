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
import { setAccessToken, setRefreshToken, getRefreshToken, clearTokens } from "../utils/token";
import "react-toastify/dist/ReactToastify.css";

export default function AboutPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart);
  const wishlist = useAppSelector((s) => s.wishlist);
  const user = useAppSelector((s) => s.auth);
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

      <section className="px-8 md:px-24 pt-14 pb-12 max-w-5xl mx-auto">
        <p
          className="f1 uppercase mb-6"
          style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#8a7660" }}
        >
          The Brand · SS 2026
        </p>
        <h1
          className="serif f2 font-light leading-none mb-8"
          style={{ fontSize: "clamp(56px, 10vw, 96px)", color: "#1a1410", letterSpacing: "-0.02em" }}
        >
          About
          <br />
          Twinkle.
        </h1>
        <div className="f3" style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}>
          <p style={{ fontSize: "14px", color: "#4a3f35", lineHeight: "1.9", maxWidth: "340px" }}>
           This brand is an ode to women who have been carrying too much for too long. To the ones who give endlessly, strive endlessly, and are learning that they, too, deserve gentleness unconditionally.
          </p>
        </div>
      </section>

      {/* ── FULL-WIDTH IMAGE ───────────────────────────────── */}
      

      {/* ── OUR STORY ─────────────────────────────────────── */}
     <section>
  <div className="px-8 md:px-24 py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
    <div className="img-zoom w-full" style={{ height: "540px" }}>
      <img src="/About1.jpg" alt="Editorial" className="w-full h-full" />
    </div>
    <div className="md:pt-6">
      <p className="uppercase mb-4" style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#8a7660" }}>
        Our Story
      </p>
      <h2
        className="serif font-light leading-snug mb-8"
        style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#1a1410", letterSpacing: "-0.015em" }}
      >
        We grow up believing rest
        <br />
        <em>is something we earn.</em>
      </h2>
      <div style={{ height: "0.5px", backgroundColor: "#e8e0d6", marginBottom: "2rem" }} />
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "1.25rem", color: "#362b23" }}>
        That softness comes after the hard work. That we deserve comfort only once we&rsquo;ve proven ourselves worthy of it.
      </p>
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "1.25rem", color: "#362b23" }}>
        This brand was born from unlearning that. It is for the women who keep showing up for everyone else, for their goals, for their responsibilities often forgetting themselves in the process.
      </p>
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "2rem", color: "#362b23" }}>
        The women who carry ambition beautifully but quietly crave space to breathe.
      </p>
      <div style={{ height: "0.5px", backgroundColor: "#e8e0d6", marginBottom: "2rem" }} />
      <p className="serif" style={{ fontSize: "18px", lineHeight: "1.9", marginBottom: "0.05rem", fontStyle: "italic", color: "#1a1410", fontWeight: 500 }}>
        We believe comfort should not be conditional.
      </p>
      <p className="serif" style={{ fontSize: "18px", lineHeight: "1.9", marginBottom: "0.05rem", fontStyle: "italic", color: "#1a1410", fontWeight: 500 }}>
        Rest is not a reward.
      </p>
      <p className="serif" style={{ fontSize: "18px", lineHeight: "1.9", fontStyle: "italic", color: "#1a1410", fontWeight: 500 }}>
        Joy is not something you postpone.
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
              Three things we will
              <br />
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
                desc: "We believe in adding value and making lives better.",
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
      <img src="/About2.jpg" alt="Editorial" className="w-full h-full" />
    </div>
    <div className="md:pt-6">
      <p className="uppercase mb-4" style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#8a7660" }}>
        Our Philosophy
      </p>
      <h2
        className="serif font-light leading-snug mb-8"
        style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#1a1410", letterSpacing: "-0.015em" }}
      >
        We believe in softer living.
        <br />
        <em>Slow mornings.</em>
      </h2>
      <div style={{ height: "0.5px", backgroundColor: "#e8e0d6", marginBottom: "2rem" }} />
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "1.25rem", color: "#362b23" }}>
         Quiet rituals. Everything we create is designed to bring comfort and joy into everyday life while still feeling elevated, effortless, and beautiful.
      </p>
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "2rem", color: "#362b23" }}>
        Inspired by moments of pause and the quiet beauty of slowing down, we create elevated essentials that feel comforting, effortless, and timeless.
      </p>
      <div style={{ height: "0.5px", backgroundColor: "#e8e0d6", marginBottom: "2rem" }} />
      <p className="serif" style={{ fontSize: "15px", lineHeight: "1.9", fontStyle: "italic", color: "#1a1410", fontWeight: 500 }}>
        Because you should not have to earn your rest to deserve it.
      </p>
    </div>
  </div>
</section>

      {/* ── FOUNDER ───────────────────────────────────────── */}
      {/* <section className="px-8 md:px-24 py-20 bg-[#e2d1a9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-14 items-start">
          <div>
            <div className="img-zoom w-full mb-4" style={{ height: "500px" }}>
              <img src="/bharti.jpg" alt="Bharti Manghwani — Founder" className="w-full h-full object-cover object-top" />
            </div>
            <p style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#7a6a5e" }} className="uppercase">
              Bharti Manghwani · Founder
            </p>
          </div>
          <div className="md:pt-6">
            <p className="uppercase mb-4" style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#8a6a4a" }}>
              Meet the Founder
            </p>
            <h2
              className="serif font-light leading-snug mb-8"
              style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#2c2520", letterSpacing: "-0.015em" }}
            >
              Hi, I&apos;m
              <br />
              <em>Bharti Manghwani</em>
            </h2>
            <div style={{ height: "0.5px", backgroundColor: "rgba(100,80,60,0.25)", marginBottom: "2rem" }} />
            <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "1.25rem", color: "#4a3f35" }}>
              Founder of Twinkle. With a background in fashion and textile
              design, I&apos;m passionate about helping women feel more at home
              in their own skin especially during the quiet hours of the night.
            </p>
            <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "1.25rem", color: "#4a3f35" }}>
              Twinkle was born from my own restless search for sleepwear that
              felt both beautiful and deeply comfortable. I couldn&apos;t find
              it so I made it.
            </p>
            <p style={{ fontSize: "13px", lineHeight: "1.9", fontStyle: "italic", color: "#6b5c50" }}>
              This journey is personal, and every piece we create carries that
              original intention forward.
            </p>
          </div>
        </div>
      </section> */}

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
          style={{ fontSize: "clamp(44px, 9vw, 88px)", color: "#f0e8de", letterSpacing: "-0.025em", maxWidth: "640px" }}
        >
          Explore the
          <br />
          <em>Collection.</em>
        </h2>
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
          {/* <a href="mailto:hello@twinkle.pk" className="cta-link">
            GET IN TOUCH
          </a> */}
        </div>
        <div style={{ height: "0.5px", backgroundColor: "rgba(100,80,60,0.25)" }} />
      </section>

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
          // onLogout={() => dispatch(logout())}
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