"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthService from "../../services/auth/index";
import { setAccessToken, setRefreshToken } from "../../utils/token";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, loading } = useAuthService();

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const data = await adminLogin({ email: form.email, password: form.password });
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      localStorage.setItem("adminUser", JSON.stringify({ email: form.email }));
      router.push("/admin");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Invalid credentials.");
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Jost', sans-serif" }}>

      {/* ── Left panel – stone-900, 50% ── */}
      <div className="hidden md:flex flex-col justify-between md:w-1/2 bg-stone-900 p-12 relative overflow-hidden">
        {/* subtle diagonal grid texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
          
            <span
              className="text-white/90 text-lg font-light tracking-[0.25em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Twinkle Official
            </span>
          </div>

          <h1
            className="text-white font-light leading-none"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(40px, 5vw, 56px)",
            }}
          >
            Admin
            <br />
            <span className="text-white/35" style={{ fontSize: "0.7em" }}>
              Console
            </span>
          </h1>

          <div className="w-10 h-px bg-white/15 mt-8" />
        </div>

        <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 relative z-10">
          SS 2026 · Nightwear Collection
        </p>
      </div>

      {/* ── Right panel – white, 50% ── */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-10 py-16 bg-white">

        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-12 md:hidden">
          <div className="relative w-7 h-7 rounded-full border border-stone-800 overflow-hidden">
            <div className="absolute -top-1 -right-2 w-6 h-6 rounded-full bg-white" />
          </div>
          <span
            className="text-stone-800 text-base font-light tracking-[0.25em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Twinkle
          </span>
        </div>

        {/* Heading */}
        <div className="mb-10 w-full max-w-sm">
          <h2
            className="text-stone-900 font-normal tracking-wide mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px" }}
          >
            Welcome back
          </h2>
          <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400">
            Admin access only
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="text-[11px] tracking-wide text-red-600 bg-red-50 border-l-2 border-red-500 px-3 py-2.5 mb-5 max-w-xs">
            {error}
          </div>
        )}

        {/* ── Form fields constrained to max-w-xs ── */}
        <div className="w-full max-w-sm ">

          <label className="block text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-2">
            Email address
          </label>
          <input
            type="email"
            placeholder="admin@twinkle.pk"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border-0 border-b border-stone-200 py-2.5 text-[13px] text-stone-800 bg-transparent outline-none focus:border-stone-800 transition-colors mb-7 placeholder:text-stone-300"
          />

          <label className="block text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full border-0 border-b border-stone-200 py-2.5 text-[13px] text-stone-800 bg-transparent outline-none focus:border-stone-800 transition-colors mb-7 placeholder:text-stone-300"
          />

          {/* <div className="flex items-center justify-between mb-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                className="w-3.5 h-3.5 border border-stone-300 accent-stone-900"
              />
              <span className="text-[11px] tracking-wide text-stone-500">Remember me</span>
            </label>
            <button className="text-[11px] tracking-wide text-stone-400 hover:text-stone-700 border-b border-transparent hover:border-stone-700 transition-all">
              Forgot password?
            </button>
          </div> */}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-[0.35em] uppercase hover:bg-stone-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                Signing in
              </>
            ) : (
              "Sign In"
            )}
          </button>

        </div>
        {/* ── end constrained fields ── */}

        <hr className="my-6 border-stone-100 max-w-xs" />
        <p className="text-[10px] tracking-[0.15em] uppercase text-stone-300 max-w-xs text-center">
          Twinkle Admin · Secure Access
        </p>

      </div>
    </div>
  );
}