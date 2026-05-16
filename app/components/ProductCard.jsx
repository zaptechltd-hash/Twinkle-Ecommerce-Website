
"use client";
import { useState } from "react";

export default function ProductCard({ product, onWishlistToggle, wishlisted, onClick }) {
  const [hovered, setHovered] = useState(false);

 const sortedImages = [...(product.images ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
const firstImage = sortedImages[0]?.url ?? "/placeholder.jpg";
const secondImage = sortedImages[1]?.url ?? firstImage;

  const effectivePrice = product.discountPrice ?? product.price ?? 0;

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(product)}
    >
      <div className="relative overflow-hidden bg-stone-50 aspect-[2/3]">
        <img
          src={firstImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {product.tag && (
          <span className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase bg-white text-stone-700 px-2.5 py-1 z-10">
            {product.tag}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white transition-all ${
            wishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#1c1917" : "none"}
            stroke="#1c1917"
            strokeWidth="1.6"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <div
          className={`absolute bottom-0 left-0 right-0 z-10 bg-white/95 py-3 px-4 flex items-center justify-center transition-all duration-300 ${
            hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <span className="text-[10px] tracking-[0.25em] text-stone-600 uppercase">
            Quick View
          </span>
        </div>
      </div>

      <div className="pt-3 pb-1">
        <p className="text-[11px] tracking-[0.2em] text-stone-800 uppercase leading-snug">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[12px] tracking-wide text-stone-700">
            PKR {effectivePrice.toLocaleString()}
          </p>
          {product.discountPrice != null && (
            <p className="text-[10px] text-stone-300 line-through">
              PKR {product.price.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}