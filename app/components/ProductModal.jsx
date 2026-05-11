
"use client";
import { useState, useRef, useCallback } from "react";

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ImageGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [animating, setAnimating] = useState(false);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isDragging = useRef(false);
  const SWIPE_THRESHOLD = 42;
  const VERTICAL_TOLERANCE = 60;

  const total = images.length;

  const navigate = useCallback(
    (dir) => {
      if (animating || total <= 1) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) =>
          dir === "right" ? (prev + 1) % total : (prev - 1 + total) % total
        );
        setAnimating(false);
        setDirection(null);
      }, 310);
    },
    [animating, total]
  );

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };
  const onTouchMove = (e) => {
    if (!touchStartX.current) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > 8 && dx > dy) {
      isDragging.current = true;
      e.preventDefault();
    }
  };
  const onTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (isDragging.current && Math.abs(dx) > SWIPE_THRESHOLD && dy < VERTICAL_TOLERANCE) {
      navigate(dx < 0 ? "right" : "left");
    }
    touchStartX.current = null;
    touchStartY.current = null;
    isDragging.current = false;
  };

  const activeImage = images[activeIndex]?.url ?? "/placeholder.jpg";

  const slideStyle = animating
    ? {
        animation: `gallerySlide${direction === "right" ? "OutLeft" : "OutRight"} 0.31s cubic-bezier(0.4,0,0.2,1) forwards`,
      }
    : {};

  return (
    <div className="w-full md:w-1/2 relative flex-shrink-0 overflow-hidden select-none bg-stone-50">
      <style>{`
        @keyframes gallerySlideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to   { transform: translateX(-6%); opacity: 0; }
        }
        @keyframes gallerySlideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to   { transform: translateX(6%); opacity: 0; }
        }
        @keyframes gallerySlideInRight {
          from { transform: translateX(6%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes gallerySlideInLeft {
          from { transform: translateX(-6%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        .gallery-enter-right {
          animation: gallerySlideInRight 0.31s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .gallery-enter-left {
          animation: gallerySlideInLeft 0.31s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .gallery-arrow {
          opacity: 0;
          transition: opacity 0.2s ease, background 0.2s ease;
        }
        .gallery-root:hover .gallery-arrow {
          opacity: 1;
        }
        .gallery-arrow:hover {
          background: rgba(255,255,255,0.95) !important;
        }
      `}</style>

      <div
        className="gallery-root w-full relative"
        style={{ aspectRatio: "2/3", touchAction: "pan-y" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={activeIndex}
          src={activeImage}
          alt={`${productName} — ${activeIndex + 1}`}
          className={`absolute inset-0 w-full h-full object-cover ${
            !animating
              ? direction === "right"
                ? "gallery-enter-right"
                : direction === "left"
                ? "gallery-enter-left"
                : ""
              : ""
          }`}
          style={animating ? slideStyle : {}}
          draggable={false}
        />

        {total > 1 && (
          <>
            <button
              onClick={() => navigate("left")}
              aria-label="Previous image"
              className="gallery-arrow hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10
                         w-9 h-9 items-center justify-center
                         bg-white/80 backdrop-blur-sm text-stone-700
                         border border-stone-100 shadow-sm
                         transition-all hover:scale-105 active:scale-95"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => navigate("right")}
              aria-label="Next image"
              className="gallery-arrow hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10
                         w-9 h-9 items-center justify-center
                         bg-white/80 backdrop-blur-sm text-stone-700
                         border border-stone-100 shadow-sm
                         transition-all hover:scale-105 active:scale-95"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {total > 1 && (
          <div
            className="absolute top-3 right-3 z-10 bg-stone-900/40 backdrop-blur-sm px-2.5 py-1 text-white"
            style={{ fontSize: "9px", letterSpacing: "0.2em" }}
          >
            {activeIndex + 1} / {total}
          </div>
        )}

        {total > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (i === activeIndex || animating) return;
                  navigate(i > activeIndex ? "right" : "left");
                }}
                aria-label={`Go to image ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width: i === activeIndex ? "20px" : "6px",
                  height: "6px",
                  borderRadius: i === activeIndex ? "3px" : "50%",
                  background: i === activeIndex ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}

        {total > 1 && (
          <div
            className="md:hidden absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-none"
            style={{ fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.55)" }}
          >
            <span>←</span>
            <span className="uppercase tracking-[0.2em]">Swipe</span>
            <span>→</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  onWishlistToggle,
  wishlisted,
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  // const images = [...(product.images ?? [])].sort((a, b) => a.order - b.order);
  const images = product.images ?? [];
  const sizes = product.sizes ?? [];

  const selectedEntry = sizes.find((s) => s.size === selectedSize);
  const stockCount = selectedEntry?.stock ?? null;
  const isOut = stockCount === 0;
  const isLow = stockCount != null && stockCount > 0 && stockCount <= 5;

  const effectivePrice = product.discountPrice ?? product.price ?? 0;

  function handleAdd() {
    if (!selectedSize || isOut) return;
    onAddToCart({ ...product, selectedSize, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-3xl md:rounded-none max-h-[92vh] overflow-y-auto flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <ImageGallery images={images} productName={product.name} />

        <div className="w-full md:w-1/2 p-8 flex flex-col gap-5">
          <button
            onClick={onClose}
            className="self-end text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors"
          >
            Close
          </button>

          <div>
            <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mb-1">
              TwinkleOfficial
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-light tracking-[0.15em] text-stone-800 uppercase">
                {product.name}
              </h2>
              {product.tag && (
                <span className="text-[9px] tracking-[0.15em] px-2 py-1 bg-stone-100 text-stone-500 uppercase">
                  {product.tag}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[13px] text-stone-500 tracking-wide">
                PKR {effectivePrice.toLocaleString()}
              </p>
              {product.discountPrice != null && (
                <p className="text-[11px] text-stone-300 line-through">
                  PKR {product.price.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {product.description && (
            <p className="text-[12px] text-stone-500 leading-relaxed">
              {product.description}
            </p>
          )}

          <div>
            <p className="text-[10px] tracking-[0.25em] text-stone-500 uppercase mb-2">
              Select Size
            </p>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((s) => {
                const out = s.stock === 0;
                const low = !out && s.stock <= 5;
                return (
                  <button
                    key={s.size}
                    onClick={() => !out && setSelectedSize(s.size)}
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
                    {low && !out && (
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
              <p className="text-[10px] text-stone-300 mt-1.5 tracking-wide">
                Please select a size
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <p className="text-[10px] tracking-[0.25em] text-stone-500 uppercase">Qty</p>
            <div className="flex items-center border border-stone-200">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 text-stone-500 hover:bg-stone-50 transition-colors text-sm"
              >
                −
              </button>
              <span className="w-8 text-center text-[12px] text-stone-700">{qty}</span>
             <button
  onClick={() => setQty(stockCount != null ? Math.min(stockCount, qty + 1) : qty + 1)}
  disabled={stockCount != null && qty >= stockCount}
  className="w-8 h-8 text-stone-500 hover:bg-stone-50 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
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
            onClick={() => onWishlistToggle(product)}
            className={`w-full py-3.5 text-[11px] tracking-[0.3em] uppercase border transition-all flex items-center justify-center gap-2 ${
              wishlisted
                ? "border-stone-800 text-stone-800 bg-stone-50"
                : "border-stone-200 text-stone-500 hover:border-stone-600 hover:text-stone-700"
            }`}
          >
            <svg
              width="13" height="13" viewBox="0 0 24 24"
              fill={wishlisted ? "#1c1917" : "none"}
              stroke="#1c1917" strokeWidth="1.6"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}