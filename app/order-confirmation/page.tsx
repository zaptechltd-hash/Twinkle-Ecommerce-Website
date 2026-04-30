"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const params  = useSearchParams();
  const id      = params.get("id");
  const success = params.get("success");

  useEffect(() => {
    if (success === "true") {
      toast.success("Order placed successfully!");
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="bg-white border border-stone-100 p-10 max-w-md w-full text-center">

        {/* Checkmark */}
        <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase mb-2">
          Thank You
        </p>
        <h1 className="text-2xl font-light tracking-wide text-stone-800 mb-3">
          Order Confirmed
        </h1>
        <p className="text-[12px] text-stone-400 leading-relaxed mb-6">
          Your order has been placed successfully. We'll send you a confirmation
          email shortly.
        </p>

        {/* Order ID */}
        {id && (
          <div className="bg-stone-50 border border-stone-100 rounded-sm px-4 py-3 mb-8">
            <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-1">
              Order ID
            </p>
            <p className="text-[13px] font-mono font-medium text-stone-700">
              {id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        )}

        <Link
          href="/"
          className="inline-block w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-[0.3em] uppercase hover:bg-stone-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        toastClassName="text-[11px] tracking-[0.15em] uppercase"
      />
    </div>
  );
}