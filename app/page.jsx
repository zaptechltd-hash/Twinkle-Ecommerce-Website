"use client";
import { useState, useEffect } from "react";
import Navbar from "./components/Header";
import ProductModal from "./components/ProductModal";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import AuthModal from "./components/AuthModal"; // ← standalone component
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

function Hero() {
  return (
    <section className="relative w-full h-[92vh] overflow-hidden">
      <img
        src="/background.jpg"
        alt="Night Elegance Campaign"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-stone-900/20" />
      <div className="absolute bottom-12 left-8 md:left-14">
        <p className="text-[10px] tracking-[0.35em] text-stone-200 uppercase mb-2">
          New Collection 2026
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
          SS 2026
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
    <section id="collection" className="px-6 md:px-12 pt-20 pb-24">
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-14">
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
        src="/bg1.jpg"
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
          href="#"
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
    <section className="px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <img
        src="/bg2.jpg"
        alt="Editorial"
        className="h-[500px] md:h-[680px] w-full object-cover"
      />
      <div className="flex flex-col gap-6 md:pr-16">
        <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase">
          The Philosophy
        </p>
        <h2 className="text-3xl md:text-4xl font-light tracking-wide text-stone-800 leading-snug">
          From late-night chai
          <br /> to slow, peaceful mornings
        </h2>
        <p className="text-[13px] text-stone-400 leading-relaxed max-w-xs">
          Our pieces are made for the rhythm of your everyday life. Inspired by
          the softness of Pakistani nights, each design brings together
          breathable fabrics, effortless silhouettes, and a touch of quiet
          luxury.
        </p>
        <a
          href="#"
          className="inline-block mt-4 text-[10px] tracking-[0.3em] text-stone-600 uppercase border-b border-stone-400 pb-0.5 w-fit hover:text-stone-900 hover:border-stone-900 transition-colors"
        >
          Our Story
        </a>
      </div>
    </section>
  );
}

export default function TwinklePage() {
  const dispatch = useAppDispatch();

  const { customerLogin, customerRegister, customerLogout } = useAuthService();

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
  }, []);

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