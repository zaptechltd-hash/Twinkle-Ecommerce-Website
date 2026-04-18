"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductModal({ product, onClose, onAddToCart, onWishlistToggle, wishlisted }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  function handleAdd() {
    if (!selectedSize) return;
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
        {/* Image pane */}
        <div className="w-full md:w-1/2 relative flex-shrink-0">
          <img
            src={product.images[activeIndex]}
            alt={product.name}
            className="w-full h-[340px] md:h-full object-cover"
            style={{ minHeight: 340 }}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeIndex === i ? "bg-white scale-125" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Info pane */}
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
            <h2 className="text-xl font-light tracking-[0.15em] text-stone-800 uppercase">
              {product.name}
            </h2>
            <p className="text-[13px] text-stone-500 mt-1 tracking-wide">
              PKR {product.price.toLocaleString()}
            </p>
          </div>

          <p className="text-[12px] text-stone-500 leading-relaxed">
            {product.description}
          </p>

          <ul className="flex flex-col gap-1">
            {product.details.map((d) => (
              <li
                key={d}
                className="text-[11px] text-stone-400 tracking-wide flex gap-2 items-start"
              >
                {d}
              </li>
            ))}
          </ul>

          {/* Size */}
          <div>
            <p className="text-[10px] tracking-[0.25em] text-stone-500 uppercase mb-2">
              Select Size
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-10 h-10 text-[11px] tracking-wide border transition-all ${
                    selectedSize === s
                      ? "border-stone-800 bg-stone-800 text-white"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-[10px] text-stone-300 mt-1.5 tracking-wide">
                Please select a size
              </p>
            )}
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3">
            <p className="text-[10px] tracking-[0.25em] text-stone-500 uppercase">
              Qty
            </p>
            <div className="flex items-center border border-stone-200">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 text-stone-500 hover:bg-stone-50 transition-colors text-sm"
              >
                −
              </button>
              <span className="w-8 text-center text-[12px] text-stone-700">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 text-stone-500 hover:bg-stone-50 transition-colors text-sm"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!selectedSize}
            className={`w-full py-3.5 text-[11px] tracking-[0.3em] uppercase transition-all ${
              added
                ? "bg-stone-200 text-stone-500"
                : selectedSize
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
            <svg width="13" height="13" viewBox="0 0 24 24"
              fill={wishlisted ? "#1c1917" : "none"}
              stroke="#1c1917" strokeWidth="1.6">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}