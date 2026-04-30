"use client";
import { useState } from "react";

function QuickAddModal({ item, onClose, onConfirm }) {
  const variant = item.variants?.[0];
  const sizes = variant?.sizes ?? [];
  const [selectedSize, setSelectedSize] = useState("");

  const effectivePrice = item.discountPrice ?? item.price;
  const hasDiscount = item.discountPrice && item.discountPrice < item.price;
  const imageSrc = variant?.image ?? item.images?.[0] ?? item.image ?? "/placeholder.jpg";

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end md:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-sm flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Product row */}
        <div className="flex gap-4 p-6 border-b border-stone-100">
          <img
            src={imageSrc}
            alt={item.name}
            className="w-16 h-20 object-cover flex-shrink-0"
          />
          <div className="flex flex-col justify-center gap-1">
            <p className="text-[11px] tracking-[0.15em] text-stone-800 uppercase">
              {item.name}
            </p>
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] text-stone-600 tracking-wide">
                PKR {effectivePrice.toLocaleString()}
              </p>
              {hasDiscount && (
                <p className="text-[10px] text-stone-300 line-through">
                  PKR {item.price.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Size picker */}
        <div className="px-6 py-5">
          <p className="text-[10px] tracking-[0.25em] text-stone-500 uppercase mb-3">
            Select Size
          </p>
          <div className="flex gap-2 flex-wrap mb-5">
            {sizes.length === 0 && (
              <p className="text-[11px] text-stone-400">No sizes available</p>
            )}
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

          <button
            onClick={() => selectedSize && onConfirm(selectedSize)}
            disabled={!selectedSize}
            className={`w-full py-3.5 text-[11px] tracking-[0.3em] uppercase transition-all ${
              selectedSize
                ? "bg-stone-900 text-white hover:bg-stone-700"
                : "bg-stone-100 text-stone-300 cursor-not-allowed"
            }`}
          >
            Move to Bag
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 mt-2 text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistSidebar({ wishlist, onClose, onRemove, onMoveToCart }) {
  const [quickAddItem, setQuickAddItem] = useState(null);
  const [quickAddIndex, setQuickAddIndex] = useState(null);

  function handleMoveToCartClick(item, i) {
    setQuickAddItem(item);
    setQuickAddIndex(i);
  }

  function handleQuickAddConfirm(selectedSize) {
    onMoveToCart({ ...quickAddItem, selectedSize, qty: 1 }, quickAddIndex);
    setQuickAddItem(null);
    setQuickAddIndex(null);
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[200] flex justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-sm h-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
            <p className="text-[11px] tracking-[0.25em] text-stone-800 uppercase">
              Wishlist ({wishlist.length})
            </p>
            <button
              onClick={onClose}
              className="text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
            {wishlist.length === 0 && (
              <p className="text-[12px] text-stone-400 text-center mt-16 tracking-wide">
                No saved items yet
              </p>
            )}
            {wishlist.map((item, i) => {
              const variant = item.variants?.[0];
              const imageSrc = variant?.image ?? item.images?.[0] ?? item.image ?? "/placeholder.jpg";
              const effectivePrice = item.discountPrice ?? item.price;
              const hasDiscount = item.discountPrice && item.discountPrice < item.price;

              return (
                <div key={i} className="flex gap-4">
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className="w-20 h-24 object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col justify-between flex-1 py-0.5">
                    <div>
                      <p className="text-[11px] tracking-[0.15em] text-stone-800 uppercase">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-[10px] text-stone-600">
                          PKR {effectivePrice.toLocaleString()}
                        </p>
                        {hasDiscount && (
                          <p className="text-[10px] text-stone-300 line-through">
                            PKR {item.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleMoveToCartClick(item, i)}
                        className="text-[10px] tracking-wide text-stone-600 hover:text-stone-900 uppercase underline underline-offset-2 transition-colors"
                      >
                        Move to Bag
                      </button>
                      <button
                        onClick={() => onRemove(i)}
                        className="text-[10px] text-stone-300 hover:text-stone-500 tracking-wide transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {quickAddItem && (
        <QuickAddModal
          item={quickAddItem}
          onClose={() => setQuickAddItem(null)}
          onConfirm={handleQuickAddConfirm}
        />
      )}
    </>
  );
}