"use client";
import { useAppSelector } from "../store/hooks";

export default function Footer() {
  const settings = useAppSelector((s) => s.settings);
  const phone = settings?.contactNumber || "+92 3098190857";
  const address = settings?.address || "Taj Complex, Saddar, Karachi";

  return (
    <footer className="bg-[#161310] px-6 md:px-12 pt-14 pb-8">

      <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.3fr] gap-x-8 gap-y-12 mb-12 pb-12 border-b border-stone-800">

        {/* Brand */}
        <div className="col-span-2 lg:col-span-1 flex flex-col">
          <div className="mb-8">
            <p className="text-2xl font-light tracking-[0.2em] text-stone-100 uppercase mb-4">
              TwinkleOfficial
            </p>
            <p className="text-[12px] text-stone-500 leading-relaxed max-w-[300px]">
              Twinkle is crafted to bring you joy in ordinary moments.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Instagram"].map((s) => (
              <a
                key={s}
                href="https://www.instagram.com/twinklebybs/"
                className="text-[9px] tracking-[0.2em] text-stone-600 uppercase border border-stone-800 px-3 py-2 hover:border-stone-500 hover:text-stone-400 transition-all"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <p className="text-[9px] tracking-[0.3em] font-semibold text-stone-500 uppercase mb-4">Shop</p>
          {[
            { label: "Home",            href: "/" },
            { label: "Our Collections", href: "/collection" },
            { label: "About Us",        href: "/about" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="block text-[12px] text-stone-500 hover:text-stone-200 transition-colors mb-2.5 tracking-wide"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Help */}
        <div>
          <p className="text-[9px] tracking-[0.3em] font-semibold text-stone-500 uppercase mb-4">Help</p>
          {[
            { label: "Size Chart", href: "/size-chart" },
            { label: "Exchange & Return Policy", href: "/exchange-return" },
            { label: "Shipping Policy",          href: "/shipping-policy" },
            { label: "Terms & Conditions",       href: "/terms-conditions" },
            { label: "Privacy Policy",           href: "/privacy-policy" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="block text-[12px] text-stone-500 hover:text-stone-200 transition-colors mb-2.5 tracking-wide"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Contact */}
        <div className="col-span-2 lg:col-span-1">
          <p className="text-[9px] tracking-[0.3em] font-semibold text-stone-500 uppercase mb-4">Contact</p>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[9px] tracking-[0.2em] text-stone-600 uppercase mb-1">Email</p>
              <a
                href="mailto:info@twinkleofficial.com"
                className="text-[12px] text-stone-500 hover:text-stone-200 transition-colors tracking-wide"
              >
                info@twinkleofficial.com
              </a>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.2em] text-stone-600 uppercase mb-1">Phone</p>
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="text-[12px] text-stone-500 hover:text-stone-200 transition-colors tracking-wide"
              >
                {phone}
              </a>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.2em] text-stone-600 uppercase mb-1">Address</p>
              <address className="not-italic text-[12px] text-stone-500 leading-relaxed tracking-wide">
                {address}
              </address>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-stone-800 pt-6 flex flex-col md:flex-row justify-between gap-3">
        <p className="text-[10px] font-semibold text-stone-500 tracking-wide">
          © 2026 TwinkleOfficial. All rights reserved.
        </p>
        <div className="flex gap-5">
          {[
            { label: "Privacy Policy",    href: "/privacy-policy" },
            { label: "Terms",             href: "/terms-conditions" },
            { label: "Exchange & Return", href: "/exchange-return" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[10px] font-semibold text-stone-500 hover:text-stone-300 transition-colors tracking-wide"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>

    </footer>
  );
}