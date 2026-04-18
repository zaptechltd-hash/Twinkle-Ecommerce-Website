export default function Footer() {
  return (
    <footer className="bg-[#1c1917] px-6 md:px-12 pt-14 pb-8">

      <div className="flex flex-col md:flex-row gap-10 mb-12 pb-12 border-b border-stone-800">

        <div className="md:w-[40%] shrink-0 flex flex-col justify-between">
          <div>
            <p className="text-3xl font-light tracking-[0.2em] text-stone-100 uppercase mb-4">
              TwinkleOfficial
            </p>
            <p className="text-[12px] text-stone-500 leading-relaxed max-w-[300px] mb-8">
              Premium nightwear crafted for elegance, softness, and quiet luxury inspired by Pakistani nights.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Instagram"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-[9px] tracking-[0.2em] text-stone-600 uppercase border border-stone-800 px-3 py-2 hover:border-stone-500 hover:text-stone-400 transition-all"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        <div className="md:w-[60%] grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { title: "Shop", links: ["New In", "Nightwear", "Loungewear", "Sets", "Robes"] },
            { title: "Help", links: ["Size Guide", "Shipping", "Returns", "Contact"] },
            { title: "Company", links: ["About", "Sustainability", "Press"] },
            { title: "Follow", links: ["Instagram", "TikTok", "Pinterest"] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-[9px] tracking-[0.3em] text-stone-600 uppercase mb-4">{col.title}</p>
              {col.links.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-[12px] text-stone-500 hover:text-stone-200 transition-colors mb-2.5 tracking-wide"
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

      </div>

      {/* Newsletter */}
      <div className="mb-10">
        <p className="text-[9px] tracking-[0.3em] text-stone-600 uppercase mb-3">Stay in the edit</p>
        <div className="flex max-w-sm">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-stone-800 border border-stone-700 text-stone-300 text-[11px] px-4 py-2.5 outline-none placeholder:text-stone-600 focus:border-stone-500 transition-colors"
          />
          <button className="bg-stone-100 text-stone-900 text-[9px] tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-white transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row justify-between gap-3">
        <p className="text-[10px] text-stone-700 tracking-wide">© 2025 TwinkleOfficial. All rights reserved.</p>
        <div className="flex gap-5">
          {["Privacy Policy", "Terms", "Cookies"].map((l) => (
            <a key={l} href="#" className="text-[10px] text-stone-700 hover:text-stone-500 transition-colors tracking-wide">
              {l}
            </a>
          ))}
        </div>
      </div>

    </footer>
  );
}