"use client";
import Link from "next/link";

export default function CartSidebar({ cart, onClose, onRemove }) {
  const total = cart.reduce((sum, i) => {
    const effectivePrice = i.discountPrice ?? i.price;
    return sum + effectivePrice * i.qty;
  }, 0);

  return (
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
            Your Bag ({cart.length})
          </p>
          <button
            onClick={onClose}
            className="text-[10px] tracking-[0.2em] text-stone-400 uppercase hover:text-stone-700 transition-colors"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
          {cart.length === 0 && (
            <p className="text-[12px] text-stone-400 text-center mt-16 tracking-wide">
              Your bag is empty
            </p>
          )}
          {cart.map((item, i) => {
            // Flat backend: images = [{ id, url, order }, ...]
            const imageSrc = item.images?.[0]?.url ?? "/placeholder.jpg";
            const effectivePrice = item.discountPrice ?? item.price;
            const hasDiscount =
              item.discountPrice != null && item.discountPrice < item.price;

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
                    <p className="text-[10px] text-stone-400 mt-0.5 tracking-wide">
                      Size: {item.selectedSize} · Qty: {item.qty}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] text-stone-600 tracking-wide">
                        PKR {(effectivePrice * item.qty).toLocaleString()}
                      </p>
                      {hasDiscount && (
                        <p className="text-[10px] text-stone-300 line-through tracking-wide">
                          PKR {(item.price * item.qty).toLocaleString()}
                        </p>
                      )}
                    </div>
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

        {cart.length > 0 && (
          <div className="border-t border-stone-100 px-6 py-6">
            <div className="flex justify-between mb-5">
              <p className="text-[11px] tracking-[0.15em] text-stone-500 uppercase">
                Total
              </p>
              <p className="text-[13px] tracking-wide text-stone-800">
                PKR {total.toLocaleString()}
              </p>
            </div>
            <Link
              href="/checkout"
              className="block w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-[0.3em] uppercase hover:bg-stone-700 transition-colors text-center"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}