"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Header";
import Footer from "../../components/Footer";
import AuthModal from "../../components/AuthModal";
import CartSidebar from "../../components/CartSidebar";
import WishlistSidebar from "../../components/WishlistSidebar";
import { ImageGallery } from "../../components/ProductModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addToCart, removeFromCart, toggleWishlist,
  removeFromWishlist, login, logout,
} from "../../store/index";
import useProductService from "../../services/product/index";
import useAuthService from "../../services/auth/index";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  setAccessToken, setRefreshToken, getRefreshToken, clearTokens,
} from "../../utils/token";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const cart = useAppSelector((s) => s.cart);
  const wishlist = useAppSelector((s) => s.wishlist);
  const user = useAppSelector((s) => s.auth);
  const { customerLogin, customerRegister, customerLogout } = useAuthService();
  const { getProducts } = useProductService();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  useEffect(() => {
    getProducts({ status: "Active", limit: 999 }).then((res) => {
      if (res) setProduct(res.data.find((p) => String(p.id) === String(id)) ?? null);
      setLoading(false);
    });
  }, [id]);

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

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const images = product?.images ?? [];
  const sizes = product?.sizes ?? [];
  const selectedEntry = sizes.find((s) => s.size === selectedSize);
  const stockCount = selectedEntry?.stock ?? null;
  const isOut = stockCount === 0;
  const isLow = stockCount != null && stockCount > 0 && stockCount <= 5;
  const effectivePrice = product?.discountPrice ?? product?.price ?? 0;
  const wishlisted = product ? wishlist.some((w) => w.id === product.id) : false;

  function handleAdd() {
    if (!selectedSize || isOut) return;
    dispatch(addToCart({ ...product, selectedSize, qty }));
    setAdded(true);
    setCartOpen(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
        onUserClick={() => setAuthOpen(true)}
        currentPage="collection"
      />

      <div className="px-6 md:px-12 lg:px-24 xl:px-36 pt-8 pb-24">
        <button
          onClick={() => router.back()}
          className="mb-8 text-[10px] tracking-[0.25em] text-stone-400 uppercase hover:text-stone-700 transition-colors"
        >
          ← Back
        </button>

        {loading ? (
          <p className="py-32 text-center text-[11px] tracking-[0.25em] text-stone-300 uppercase animate-pulse">
            Loading…
          </p>
        ) : !product ? (
          <div className="py-32 text-center">
            <p className="text-[13px] text-stone-400 tracking-wide mb-4">Product not found.</p>
            <a href="/collection" className="text-[10px] tracking-[0.25em] text-stone-600 uppercase underline underline-offset-2">
              Back to Collection
            </a>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16 max-w-6xl mx-auto">
            <ImageGallery images={images} productName={product.name} />

            <div className="w-full md:w-1/2 flex flex-col gap-5 md:py-4">
              <div>
                <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-2">
                  TwinkleOfficial
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-light tracking-[0.15em] text-stone-800 uppercase">
                    {product.name}
                  </h1>
                  {product.tag && (
                    <span className="text-[9px] tracking-[0.15em] px-2 py-1 bg-stone-100 text-stone-500 uppercase">
                      {product.tag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-[14px] text-stone-500 tracking-wide">
                    PKR {effectivePrice.toLocaleString()}
                  </p>
                  {product.discountPrice != null && (
                    <p className="text-[12px] text-stone-300 line-through">
                      PKR {product.price.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="text-[12px] text-stone-500 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              )}

              <div>
                <p className="text-[10px] tracking-[0.25em] text-stone-500 uppercase mb-2">Select Size</p>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((s) => {
                    const out = s.stock === 0;
                    const low = !out && s.stock <= 5;
                    return (
                      <button
                        key={s.size}
                        onClick={() => { if (!out) { setSelectedSize(s.size); setQty(1); } }}
                        disabled={out}
                        title={out ? "Out of stock" : low ? `Only ${s.stock} left` : ""}
                        className={`w-10 h-10 text-[11px] tracking-wide border transition-all relative ${
                          selectedSize === s.size
                            ? "border-stone-800 bg-stone-800 text-white"
                            : out
                            ? "border-stone-100 text-stone-300 line-through cursor-not-allowed"
                            : "border-stone-200 text-stone-600 hover:border-stone-400"
                        }`}
                      >
                        {s.size}
                        {low && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedSize ? (
                  <p className={`text-[10px] mt-1.5 tracking-wide ${
                    isOut ? "text-red-400" : isLow ? "text-amber-500" : "text-green-600"
                  }`}>
                    {isOut ? "Out of stock" : isLow ? `Only ${stockCount} left` : "In stock"}
                  </p>
                ) : (
                  <p className="text-[10px] text-stone-300 mt-1.5 tracking-wide">Please select a size</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <p className="text-[10px] tracking-[0.25em] text-stone-500 uppercase">Qty</p>
                <div className="flex items-center border border-stone-200">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 text-stone-500 hover:bg-stone-50 text-sm">−</button>
                  <span className="w-8 text-center text-[12px] text-stone-700">{qty}</span>
                  <button
                    onClick={() => setQty(stockCount != null ? Math.min(stockCount, qty + 1) : qty + 1)}
                    disabled={stockCount != null && qty >= stockCount}
                    className="w-8 h-8 text-stone-500 hover:bg-stone-50 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={!selectedSize || isOut}
                className={`w-full py-3.5 text-[11px] tracking-[0.3em] uppercase transition-all ${
                  added
                    ? "bg-stone-200 text-stone-500"
                    : selectedSize && !isOut
                    ? "bg-stone-900 text-white hover:bg-stone-700"
                    : "bg-stone-100 text-stone-300 cursor-not-allowed"
                }`}
              >
                {added ? "Added to Bag ✓" : "Add to Bag"}
              </button>

              <button
                onClick={() => dispatch(toggleWishlist(product))}
                className={`w-full py-3.5 text-[11px] tracking-[0.3em] uppercase border transition-all flex items-center justify-center gap-2 ${
                  wishlisted
                    ? "border-stone-800 text-stone-800 bg-stone-50"
                    : "border-stone-200 text-stone-500 hover:border-stone-600 hover:text-stone-700"
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill={wishlisted ? "#1c1917" : "none"} stroke="#1c1917" strokeWidth="1.6">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {cartOpen && (
        <CartSidebar cart={cart} onClose={() => setCartOpen(false)} onRemove={(idx) => dispatch(removeFromCart(idx))} />
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