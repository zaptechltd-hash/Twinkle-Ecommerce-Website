"use client";
import { useState } from "react";

export default function AuthModal({
  onClose,
  onLogin,
  onLogout,
  user,
  onSubmitLogin,
  onSubmitRegister,
  onError,
  onSubmitLogout,
}) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (mode === "signup" && !form.name) {
      setError("Please enter your name.");
      return;
    }

    try {
      if (mode === "login") {
        await onSubmitLogin(form.email, form.password);
        onLogin({
          name: form.name || form.email.split("@")[0],
          email: form.email,
        });
      } else {
        await onSubmitRegister(
          form.name,
          form.email,
          form.password,
          form.phoneNumber,
        );
        onLogin({ name: form.name, email: form.email });
      }
      onClose();
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong.";
      onError(message);
    }
  }

  const userInitials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.25)", paddingTop: "73px" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xs mr-6 md:mr-12 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {user ? (
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-stone-100">
              <div className="w-10 h-10 rounded-full bg-stone-900 text-white text-[12px] flex items-center justify-center font-medium flex-shrink-0">
                {userInitials}
              </div>
              <div className="overflow-hidden">
                <p className="text-[12px] font-medium text-stone-800 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-stone-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            {["My Orders", "My Wishlist", "Account Settings"].map((item) => (
              <button
                key={item}
                className="block w-full text-left py-3 text-[11px] tracking-[0.15em] uppercase text-stone-600 border-b border-stone-100 hover:text-stone-900 transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              onClick={async () => {
                try {
                  await onSubmitLogout();
                } catch (err) {}
                // onLogout();
                onClose();
              }}
              className="block w-full text-left py-3 text-[11px] tracking-[0.15em] uppercase text-red-400 hover:text-red-600 transition-colors mt-1"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex gap-0 mb-7 border-b border-stone-100">
              {[
                { key: "login", label: "Sign In" },
                { key: "signup", label: "Register" },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => {
                    setMode(m.key);
                    setError("");
                  }}
                  className={`flex-1 pb-3 text-[10px] tracking-[0.25em] uppercase transition-colors ${
                    mode === m.key
                      ? "text-stone-900 border-b-2 border-stone-900 -mb-px"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {mode === "signup" && (
              <>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Sara Noor"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-stone-200 px-3 py-2.5 text-[12px] text-stone-700 mb-4 outline-none focus:border-stone-500 transition-colors"
                />
                <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+92 300 0000000"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm({ ...form, phoneNumber: e.target.value })
                  }
                  className="w-full border border-stone-200 px-3 py-2.5 text-[12px] text-stone-700 mb-4 outline-none focus:border-stone-500 transition-colors"
                />
              </>
            )}

            <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="hello@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-stone-200 px-3 py-2.5 text-[12px] text-stone-700 mb-4 outline-none focus:border-stone-500 transition-colors"
            />

            <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-stone-200 px-3 py-2.5 text-[12px] text-stone-700 mb-5 outline-none focus:border-stone-500 transition-colors"
            />

            {error && (
              <p className="text-[10px] text-red-400 tracking-wide mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-[0.3em] uppercase hover:bg-stone-700 transition-colors"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>

            {mode === "login" && (
              <p className="text-[10px] text-stone-400 text-center mt-4 tracking-wide">
                Forgot password?{" "}
                <span className="underline cursor-pointer hover:text-stone-700 transition-colors">
                  Reset
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
