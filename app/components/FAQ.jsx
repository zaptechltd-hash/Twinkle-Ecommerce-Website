"use client";
import { useState } from "react";
import { faqs } from "../data/faqs";

export default function FAQ() {
  const [active, setActive] = useState(faqs[0].category);
  const [open, setOpen] = useState(0);

  const current = faqs.find((f) => f.category === active);

  const changeCategory = (category) => {
    setActive(category);
    setOpen(null);
  };

  return (
    <section
      id="faq"
      className="px-6 md:px-12 lg:px-24 xl:px-60 py-24 md:py-28 bg-[#f7f2ec]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
        {/* Left: heading + categories */}
        <div className="lg:col-span-4">
          <p
            className="text-[11px] tracking-[0.32em] uppercase mb-4"
            style={{ color: "#8a7660" }}
          >
            Help & Support
          </p>
          <h2
            className="font-light leading-[1.05]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(40px, 6vw, 60px)",
              color: "#1a1410",
              letterSpacing: "-0.015em",
            }}
          >
            Frequently
            <br />
            Asked Questions
          </h2>
          <div className="mt-6 h-px w-12 bg-[#8a7660]/50" />
          <p
            className="mt-6 text-[14px] leading-[1.9] max-w-xs"
            style={{ color: "#3a2f26" }}
          >
            Everything you need to know about orders, sizing, delivery and more.
          </p>

          <nav className="mt-10 flex lg:flex-wrap gap-2.5 overflow-x-auto lg:overflow-visible pb-2 -mx-6 px-6 lg:mx-0 lg:px-0">
            {faqs.map(({ category }) => (
              <button
                key={category}
                onClick={() => changeCategory(category)}
                className={`flex-shrink-0 whitespace-nowrap text-[11px] tracking-[0.22em] uppercase px-4 py-2.5 border transition-all duration-300 ${
                  active === category
                    ? "bg-[#1a1410] text-[#f0e8de] border-[#1a1410]"
                    : "bg-transparent text-[#3a2f26] border-[#8a7660]/40 hover:border-[#1a1410]"
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: accordion */}
        <div className="lg:col-span-8">
          <ul className="flex flex-col gap-3">
            {current.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={item.q}
                  className={`bg-white border transition-all duration-300 ${
                    isOpen
                      ? "border-[#1a1410] shadow-[0_10px_30px_-12px_rgba(26,20,16,0.18)]"
                      : "border-[#8a7660]/25 hover:border-[#8a7660]/60"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-5 px-5 md:px-7 py-5 md:py-6 text-left"
                  >
                    <span
                      className="text-[11px] tracking-[0.2em] flex-shrink-0"
                      style={{ color: "#8a7660" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="flex-1 text-[13px] md:text-[14px] tracking-[0.1em] uppercase"
                      style={{ color: "#1a1410" }}
                    >
                      {item.q}
                    </span>
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? "bg-[#1a1410] border-[#1a1410] text-white rotate-45"
                          : "border-[#8a7660]/50 text-[#1a1410]"
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M7 1V13M1 7H13"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="px-5 md:px-7 pb-7 pl-[52px] md:pl-[68px] pr-8 text-[14px] leading-[1.9]"
                        style={{ color: "#3a2f26" }}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}