"use client";
import { useState, useEffect } from "react";
import Navbar from "./components/Header";
import ProductModal from "./components/ProductModal";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import AuthModal from "./components/AuthModal";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  addToCart,
  removeFromCart,
  toggleWishlist,
  removeFromWishlist,
  login,
  logout,
} from "./store/index";
import useAuthService from "./services/auth/index";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useProductService from "./services/product/index";
import CartSidebar from "./components/CartSidebar";
import WishlistSidebar from "./components/WishlistSidebar";
import { setAccessToken, setRefreshToken, getRefreshToken, clearTokens } from "./utils/token";
import useSettingsService from "./services/settings/index";
import { setSettings } from "./store/index";

function Hero() {
  const currentYear = new Date().getFullYear();

  return (
    <section className="relative w-full h-[92vh] overflow-hidden">
      <img
        src="/background4.jpeg"
        alt="Night Elegance Campaign"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-stone-900/20" />
      <div className="absolute bottom-12 left-8 md:left-14">
        <p className="text-[10px] tracking-[0.35em] text-stone-200 uppercase mb-2">
          New Collection {currentYear}
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
          SS {currentYear}
        </p>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "New Collection",
    "Night Elegance",
    "Premium Nightwear",
    "Soft Nights",
    "Crafted for You",
  ];
  const repeated = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-stone-100 py-4 bg-white">
      <div className="flex gap-32 animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="text-[10px] tracking-[0.35em] text-stone-400 uppercase flex-shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProductGrid({ products, onProductClick, wishlist, onWishlistToggle }) {
  return (
    <section id="collection" className="px-6 md:px-12 lg:px-24 xl:px-60 pt-20 pb-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mb-2">
            Shop
          </p>
          <h2 className="text-2xl md:text-3xl font-light tracking-widest text-stone-800 uppercase">
            The Collection
          </h2>
        </div>
        <a
          href="/collection"
          className="hidden md:block text-[10px] tracking-[0.25em] text-stone-400 uppercase border-b border-stone-300 pb-0.5 hover:text-stone-700 hover:border-stone-600 transition-colors"
        >
          View All
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-14">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            wishlisted={wishlist.some((w) => w.id === product.id)}
            onWishlistToggle={onWishlistToggle}
            onClick={onProductClick}
          />
        ))}
      </div>

      <div className="mt-14 text-center md:hidden">
        <a
          href="/collection"
          className="text-[10px] tracking-[0.3em] text-stone-500 uppercase border-b border-stone-300 pb-0.5"
        >
          View All
        </a>
      </div>
    </section>
  );
}


function CollectionBanner() {
  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      <img
        src="/bg3.jpeg"
        alt="Soft Nights Collection"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-stone-900/30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <p className="text-[10px] tracking-[0.4em] text-stone-200 uppercase mb-4">
          The Soft Nights Edit
        </p>
        <h2 className="text-5xl md:text-7xl font-light tracking-widest text-white uppercase leading-none mb-10">
          Soft Nights
        </h2>
        <a
          href="/collection"
          className="text-[10px] tracking-[0.3em] text-stone-200 uppercase border-b border-stone-300 pb-0.5 hover:text-white transition-colors"
        >
          Explore Collection
        </a>
      </div>
    </section>
  );
}

function EditorialStrip() {
  return (
    <section className="px-6 md:px-12 lg:px-24 xl:px-40 py-28" style={{ backgroundColor: "#fff" }}>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
  
  .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
  
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
  .animate-marquee { animation: marquee 40s linear infinite; }
`}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

        {/* Image */}
        <div className="flex justify-center md:justify-end">
          <div className="overflow-hidden">
            <img
              src="/HomeBg.jpg"
              alt="Editorial"
              className="w-full max-w-[520px] h-[650px] object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md flex flex-col gap-7 mx-auto md:mx-0 text-center md:text-left items-center md:items-start">

  <p className="sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#8a7660" }}>
    Our Philosophy
  </p>

  <h2
    className="serif font-light leading-snug"
    style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#1a1410", letterSpacing: "-0.015em" }}
  >
    We believe in softer living.
    
    Slow mornings.
  </h2>

  <div style={{ height: "0.5px", width: "3rem", backgroundColor: "rgba(154,128,96,0.22)" }} />

  <p className="sans" style={{ fontSize: "13px", lineHeight: "1.9", color: "#3a2f26" }}>
    Everything we create is designed to bring comfort and joy into everyday
    life while still feeling elevated, effortless, and beautiful.
  </p>

  <p className="sans" style={{ fontSize: "13px", lineHeight: "1.9", color: "#3a2f26" }}>
    Inspired by moments of pause and the quiet beauty of slowing down, we
    create elevated essentials that feel comforting, effortless, and timeless.
  </p>

  <p
    className="serif"
    style={{ fontSize: "15px", lineHeight: "1.9", fontStyle: "italic", color: "#3a2f26", fontWeight: 500 }}
  >
    Because you should not have to earn your rest to deserve it.
  </p>
<a
    href="/about"
    className="group mt-2 sans inline-flex items-center gap-2"
    style={{
      fontSize: "11px",
      letterSpacing: "0.35em",
      textTransform: "uppercase",
      color: "#3a2f26",
      border: "0.5px solid rgba(154,128,96,0.4)",
      padding: "12px 24px",
      textDecoration: "none",
      transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#1a1410";
      e.currentTarget.style.color = "#f0e8de";
      e.currentTarget.style.borderColor = "#1a1410";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color = "#3a2f26";
      e.currentTarget.style.borderColor = "rgba(154,128,96,0.4)";
    }}
  >
    Our Story
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
      <path
        d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </a>

</div>

        
      </div>
    </section>
  );
}


export default function TwinklePage() {
  const dispatch = useAppDispatch();
  const { customerLogin, customerRegister, customerLogout } = useAuthService();
  const { getSettings } = useSettingsService(); 
  const { getProducts } = useProductService();
  const [products, setProducts] = useState([]);

const handleLogout = async () => {
  const refreshToken = getRefreshToken();
  try {
    await customerLogout(refreshToken);
  } finally {
    clearTokens();
    dispatch(logout());
  }
};



  useEffect(() => {
  getProducts({ status: "Active", limit: 999 }).then((res) => {
    if (res)
      setProducts(
        res.data.filter(
          (p) => p.location === "Home" || p.location === "Both",
        ),
      );
  });

  getSettings().then((res) => {
    if (res) dispatch(setSettings(res));
  });
}, []);

const settings = useAppSelector((s) => s.settings);
console.log(settings)

  const cart = useAppSelector((s) => s.cart);
  const wishlist = useAppSelector((s) => s.wishlist);
  const user = useAppSelector((s) => s.auth);

  const [activeProduct, setActiveProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

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

const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>

      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
        onUserClick={() => setAuthOpen(true)}
        currentPage="home"
      />

      <Hero />
      <Marquee />
      <ProductGrid
        products={products}
        onProductClick={setActiveProduct}
        wishlist={wishlist}
        onWishlistToggle={(product) => dispatch(toggleWishlist(product))}
      />
      <CollectionBanner />
      <EditorialStrip />
      <Footer />

      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToCart={(item) => {
            dispatch(addToCart(item));
            setActiveProduct(null);
            setCartOpen(true);
          }}
          onWishlistToggle={(p) => dispatch(toggleWishlist(p))}
          wishlisted={wishlist.some((w) => w.id === activeProduct.id)}
        />
      )}

      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={(idx) => dispatch(removeFromCart(idx))}
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

      {wishlistOpen && (
        <WishlistSidebar
          wishlist={wishlist}
          onClose={() => setWishlistOpen(false)}
          onRemove={(idx) => dispatch(removeFromWishlist(idx))}
          onMoveToCart={(item, idx) => {
            dispatch(addToCart({ ...item, qty: item.qty ?? 1 }));
            dispatch(removeFromWishlist(idx));
            setWishlistOpen(false);
            setCartOpen(true);
          }}
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
    </div>
  );
}