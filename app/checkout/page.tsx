"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useOrderService from "../services/order/index";
import useCouponService from "../services/coupon/index";
import type {
  CreateOrderPayload,
  CreateOrderItemPayload,
} from "../services/order/types";
import useShippingService from "../services/shipping/index";
import type { ShippingCity } from "../services/shipping/types";
import { clearCart, updateQty } from "../store/index";

function CheckoutHeader() {
  return (
    <header className="border-b border-stone-100 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Twinkle"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (
                (e.target as HTMLImageElement).nextSibling as HTMLElement
              ).style.display = "block";
            }}
          />
          <span
            className="text-[18px] font-light tracking-[0.4em] text-stone-800 uppercase hidden"
            style={{ display: "none" }}
          >
            Twinkle
          </span>
        </Link>
        <div className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] text-stone-400 uppercase">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secure Checkout
        </div>
      </div>
    </header>
  );
}

function SelectField({
  label, value, onChange, options, required, error, className = "", loading, placeholder = "Select a city",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string; id?: number | string }[];
  required?: boolean;
  error?: string;
  className?: string;
  loading?: boolean;
  placeholder?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">
        {label}{required && <span className="text-stone-300 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        disabled={loading}
        className={`w-full border rounded-sm px-3 py-[11px] text-[13px] text-stone-700 outline-none focus:ring-2 transition-colors bg-white disabled:opacity-60 disabled:cursor-not-allowed ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
            : "border-stone-200 focus:border-stone-500 focus:ring-stone-500/10"
        }`}
      >
        <option value="">{loading ? "Loading cities…" : placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id ?? opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function SectionTitle({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
        {number}
      </span>
      <div>
        <p className="text-[12px] tracking-[0.2em] text-stone-800 uppercase font-medium">
          {title}
        </p>
        {subtitle && (
          <p className="text-[11px] text-stone-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  error,
  className = "",
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">
        {label}
        {required && <span className="text-stone-300 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-sm px-3 py-[11px] text-[13px] text-stone-700 outline-none focus:ring-2 transition-colors bg-white placeholder:text-stone-300 ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
            : "border-stone-200 focus:border-stone-500 focus:ring-stone-500/10"
        }`}
      />
      {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}


export default function CheckoutPage() {
  const cart = useAppSelector((s) => s.cart);
  const user = useAppSelector((s) => s.auth);
  const settings = useAppSelector((s) => s.settings);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { createOrder, loading } = useOrderService();
  const { validateCoupon, loading: couponLoading } = useCouponService();
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  // ── Derived settings ──────────────────────────────────────────────────────
  const flatFee = settings?.flatFee ?? 200;
  const freeThreshold = settings?.freeThreshold ?? 3000;
  const deliveryLabel = settings?.deliveryLabel ?? "2–5 Business Days";
  const codEnabled = settings?.codEnabled ?? true;
  const { getCities, loading: citiesLoading } = useShippingService();
  const [cities, setCities] = useState<ShippingCity[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getCities();
      if (data) setCities(data);
    })();
  }, []);

  const [form, setForm] = useState({
    email: user?.email ?? "",
    emailOffers: false,
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    phone: "",
    saveInfo: false,
    billingAddressSame: true,
    paymentMethod: "cod" as "card" | "cod",
    discountCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  // ── Coupon state ──────────────────────────────────────────────────────────
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  setForm((f) => ({ ...f, [key]: e.target.value }));
  if (errors[key])
    setErrors((prev) => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  if (key === "discountCode" && appliedCode) {
    setAppliedCode("");
    setDiscountAmount(0);
    setCouponSuccess("");
    setCouponError("");
  }
};

const handleQtyChange = (index: number, delta: number) => {
  const item = cart[index];
  const newQty = item.qty + delta;
  if (newQty < 1) return;
  dispatch(updateQty({ index, qty: newQty }));
};

  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal = cart.reduce((sum: number, i: any) => {
    const price = i.discountPrice ?? i.price;
    return sum + price * i.qty;
  }, 0);
  const shipping = subtotal >= freeThreshold ? 0 : flatFee;
  const tax = Math.round(subtotal * 0.15254);
  const total = Math.max(0, subtotal + shipping - discountAmount);

  // ── Payment options ───────────────────────────────────────────────────────
  const paymentOptions = [
    {
      id: "cod",
      label: "Cash on Delivery (COD)",
      description: "Pay when your order arrives at your door.",
      icons: [] as string[],
    },
  ].filter((opt) => opt.id === "cod" && codEnabled);

  // ── Apply Coupon ──────────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    const code = form.discountCode.trim().toUpperCase();
    if (!code) return;
    setCouponError("");
    setCouponSuccess("");
    const res = await validateCoupon({ code, subtotal });
    if (!res || !res.valid) {
      setCouponError(res?.message ?? "Invalid coupon code.");
      setDiscountAmount(0);
      setAppliedCode("");
      return;
    }
    setDiscountAmount(res.discountAmount);
    setAppliedCode(res.code);
    setCouponSuccess(res.message ?? "Coupon applied!");
  };

  const handleRemoveCoupon = () => {
    setAppliedCode("");
    setDiscountAmount(0);
    setCouponSuccess("");
    setCouponError("");
    setForm((f) => ({ ...f, discountCode: "" }));
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    if (!form.firstName) e.firstName = "First name is required";
    if (!form.lastName) e.lastName = "Last name is required";
    if (!form.address) e.address = "Address is required";
    if (!form.city) e.city = "City is required";
    if (!form.phone) e.phone = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitError("");
    if (!validate()) return;
    if (cart.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    const items: CreateOrderItemPayload[] = cart.map((item: any) => ({
      productId: item.id,
      productName: item.name,
      size: item.selectedSize ?? "",
      image: item.images?.[0]?.url ?? undefined,
      unitPrice: item.discountPrice ?? item.price,
      originalPrice: item.price,
      qty: item.qty,
    }));

    const payload: CreateOrderPayload = {
      ...(user?.id && { userId: user.id }),
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      address: form.address,
      ...(form.apartment && { apartment: form.apartment }),
      city: form.city,
      ...(form.postalCode && { postalCode: form.postalCode }),
      phone: form.phone,
      paymentMethod: form.paymentMethod,
      ...(appliedCode && { discountCode: appliedCode }),
      discountAmount,
      items,
      consigneeCityId: selectedCityId!,
    };

    try {
      const order = await createOrder(payload);
      if (order) {
        dispatch(clearCart());
        router.push(`/order-confirmation?id=${order.id}`);
      }
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message ??
          "Something went wrong. Please try again.",
      );
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Shipping banner */}
      <div className="w-full bg-stone-900 text-white py-2.5 text-center">
        <p className="text-[10px] tracking-[0.35em] uppercase">
          ✦ Free shipping on orders over PKR {freeThreshold.toLocaleString()} ✦
        </p>
      </div>

      <CheckoutHeader />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-8">
          {/* 1. Contact */}
          <section className="bg-white border border-stone-100 p-6 md:p-8">
            <SectionTitle number="1" title="Contact" />
            {user ? (
              <div className="flex items-center justify-between py-3 px-4 bg-stone-50 border border-stone-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-[12px] text-stone-600">
                    {user.email}
                  </span>
                </div>
                <Link
                  href="/"
                  className="text-[10px] tracking-[0.15em] text-stone-400 uppercase underline underline-offset-2 hover:text-stone-700"
                >
                  Change
                </Link>
              </div>
            ) : (
              <>
                <InputField
                  label="Email"
                  type="email"
                  placeholder="hello@example.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                  error={errors.email}
                  className="mb-4"
                />
                <p className="text-[10px] text-stone-400 mb-1">
                  Already have an account?{" "}
                  <Link
                    href="/"
                    className="underline underline-offset-2 hover:text-stone-700 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
            <label className="flex items-center gap-2.5 cursor-pointer mt-3">
              <input
                type="checkbox"
                checked={form.emailOffers}
                onChange={(e) =>
                  setForm((f) => ({ ...f, emailOffers: e.target.checked }))
                }
                className="w-3.5 h-3.5 accent-stone-800"
              />
              <span className="text-[11px] text-stone-500 tracking-wide">
                Email me with news and offers
              </span>
            </label>
          </section>

          {/* 2. Delivery */}
          <section className="bg-white border border-stone-100 p-6 md:p-8">
            <SectionTitle number="2" title="Delivery" />
            <div className="mb-4">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">
                Country
              </label>
              <div className="w-full border border-stone-200 rounded-sm px-3 py-[11px] text-[13px] text-stone-500 bg-stone-50 flex items-center gap-2">
                <span>🇵🇰</span> Pakistan
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <InputField
                label="First Name"
                placeholder="Sara"
                value={form.firstName}
                onChange={set("firstName")}
                required
                error={errors.firstName}
              />
              <InputField
                label="Last Name"
                placeholder="Noor"
                value={form.lastName}
                onChange={set("lastName")}
                required
                error={errors.lastName}
              />
            </div>
            <InputField
              label="Address"
              placeholder="Street address"
              value={form.address}
              onChange={set("address")}
              required
              error={errors.address}
              className="mb-4"
            />
            <InputField
              label="Apartment, suite, etc."
              placeholder="Optional"
              value={form.apartment}
              onChange={set("apartment")}
              className="mb-4"
            />
          <SelectField
  label="City"
  value={selectedCityId != null ? String(selectedCityId) : ""}
  onChange={(e) => {
    const id = e.target.value;
    const selected = cities.find((c) => String(c.id) === id);
    setSelectedCityId(selected ? selected.id : null);
    setForm((f) => ({ ...f, city: selected ? selected.name : "" }));
    if (errors.city) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n.city;
        return n;
      });
    }
  }}
  options={Array.from(
    new Map(cities.map((c) => [c.name, c])).values()
  ).map((c) => ({ value: String(c.id), label: c.name, id: c.id }))}
  required
  error={errors.city}
  loading={citiesLoading}
  className="mb-4"
/>
            <InputField
              label="Postal Code"
              placeholder="74400"
              value={form.postalCode}
              onChange={set("postalCode")}
              className="mb-4"
            />
            <div className="mb-5">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1.5">
                Phone <span className="text-stone-300">*</span>
              </label>
              <div className="flex">
                <div className="flex items-center gap-2 border border-stone-200 border-r-0 px-3 py-[11px] bg-stone-50 text-[13px] text-stone-500 flex-shrink-0 rounded-l-sm">
                  <span>🇵🇰</span>
                  <span className="text-stone-400">+92</span>
                </div>
                <input
                  type="tel"
                  placeholder="332 3512345"
                  value={form.phone}
                  onChange={set("phone")}
                  className={`flex-1 border rounded-r-sm px-3 py-[11px] text-[13px] text-stone-700 outline-none focus:ring-2 transition-colors placeholder:text-stone-300 ${
                    errors.phone
                      ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                      : "border-stone-200 focus:border-stone-500 focus:ring-stone-500/10"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>
              )}
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.saveInfo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, saveInfo: e.target.checked }))
                }
                className="w-3.5 h-3.5 accent-stone-800"
              />
              <span className="text-[11px] text-stone-500 tracking-wide">
                Save this information for next time
              </span>
            </label>
          </section>

          {/* 3. Shipping Method */}
          <section className="bg-white border border-stone-100 p-6 md:p-8">
            <SectionTitle number="3" title="Shipping Method" />
            <div className="border border-stone-200 rounded-sm px-4 py-4 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a8a29e"
                  strokeWidth="1.6"
                >
                  <rect x="1" y="3" width="15" height="13" rx="1" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <div>
                  <p className="text-[12px] text-stone-800 tracking-wide">
                    Standard Delivery
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    {deliveryLabel}
                  </p>
                </div>
              </div>
              {shipping === 0 ? (
                <p className="text-[11px] text-green-600 font-medium tracking-wide">
                  Free
                </p>
              ) : (
                <p className="text-[11px] text-stone-700 font-medium tracking-wide">
                  PKR {shipping.toLocaleString()}
                </p>
              )}
            </div>
          </section>

          {/* 4. Payment */}
          <section className="bg-white border border-stone-100 p-6 md:p-8">
            <SectionTitle
              number="4"
              title="Payment"
              subtitle="All transactions are secure and encrypted."
            />
            <div className="flex flex-col gap-0 border border-stone-200 rounded-sm overflow-hidden">
              {paymentOptions.map((opt, i) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors ${
                    form.paymentMethod === opt.id
                      ? "bg-stone-50"
                      : "bg-white hover:bg-stone-50/50"
                  } ${i > 0 ? "border-t border-stone-100" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={form.paymentMethod === opt.id}
                    onChange={() =>
                      setForm((f) => ({
                        ...f,
                        paymentMethod: opt.id as "card" | "cod",
                      }))
                    }
                    className="mt-0.5 accent-stone-800"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] text-stone-800 tracking-wide">
                        {opt.label}
                      </p>
                      {opt.icons.length > 0 && (
                        <div className="flex gap-1">
                          {opt.icons.map((ic) => (
                            <span
                              key={ic}
                              className="text-[8px] tracking-[0.1em] border border-stone-200 px-1.5 py-0.5 text-stone-500 font-medium"
                            >
                              {ic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {form.paymentMethod === opt.id && (
                      <p className="text-[10px] text-stone-400 mt-1.5 leading-relaxed">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Notes */}
          <div className="flex flex-col gap-2 px-1">
            {[
              "Note: For Nationwide order delivery will take 2–5 working days",
              // "For International orders, delivery will take 7–10 working days via DHL courier only",
              // "For International orders, VAT and Duties will be paid by the customer",
            ].map((note) => (
              <p
                key={note}
                className="text-[10px] text-stone-400 tracking-wide leading-relaxed flex gap-2"
              >
                <span className="text-stone-300 flex-shrink-0">—</span>
                {note}
              </p>
            ))}
            <p className="text-[10px] text-stone-400 mt-1">
              For inquiries:{" "}
              <a
                href="mailto:support@twinkleofficial.com"
                className="underline underline-offset-2 hover:text-stone-700"
              >
                support@twinkleofficial.com
              </a>
            </p>
          </div>

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-sm">
              <p className="text-[11px] text-red-500">{submitError}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || cart.length === 0}
            className="w-full py-4 bg-stone-900 text-white text-[11px] tracking-[0.35em] uppercase hover:bg-stone-700 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Placing Order…" : "Complete Order"}
          </button>
        </div>

        {/* ── RIGHT COLUMN — Order Summary ── */}
        <aside className="lg:sticky lg:top-24 flex flex-col gap-0">
          <div className="bg-white border border-stone-100">
            <div className="px-6 py-4 border-b border-stone-100">
              <p className="text-[11px] tracking-[0.25em] text-stone-800 uppercase">
                Order Summary
              </p>
            </div>

            {/* Items */}
            <div className="px-6 py-4 flex flex-col gap-5 border-b border-stone-100">
              {cart.length === 0 && (
                <p className="text-[12px] text-stone-400 text-center py-4">
                  Your bag is empty
                </p>
              )}
              {cart.map((item: any, i: number) => {
                const imageSrc = item.images?.[0]?.url ?? "/placeholder.jpg";
                const effectivePrice = item.discountPrice ?? item.price;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className="w-16 h-20 object-cover"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-stone-500 text-white text-[9px] flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                 <div className="flex flex-col justify-center flex-1 gap-1.5">
  <p className="text-[11px] tracking-[0.12em] text-stone-800 uppercase leading-snug">
    {item.name}
  </p>
  <p className="text-[10px] text-stone-400">{item.selectedSize}</p>

  <div className="flex items-center border border-stone-200 rounded-sm w-fit mt-0.5">
    <button
      onClick={() => handleQtyChange(i, -1)}
      disabled={item.qty <= 1}
      className="w-6 h-6 flex items-center justify-center text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
    <span className="w-6 text-center text-[11px] text-stone-700 tabular-nums">
      {item.qty}
    </span>
    <button
      onClick={() => handleQtyChange(i, 1)}
      className="w-6 h-6 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors"
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  </div>
</div>
                    <div className="flex flex-col items-end justify-center gap-0.5 flex-shrink-0">
                      <p className="text-[12px] text-stone-700 tracking-wide">
                        PKR {(effectivePrice * item.qty).toLocaleString()}
                      </p>
                      {item.discountPrice != null &&
                        item.discountPrice < item.price && (
                          <p className="text-[10px] text-stone-300 line-through">
                            PKR {(item.price * item.qty).toLocaleString()}
                          </p>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Discount Code */}
            <div className="px-6 py-4 border-b border-stone-100">
              <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2">
                Discount Code
              </p>
              {appliedCode ? (
                <div className="flex items-center justify-between py-2.5 px-3 bg-green-50 border border-green-200 rounded-sm">
                  <div className="flex items-center gap-2">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[11px] text-green-700 font-medium tracking-wider">
                      {appliedCode}
                    </span>
                    <span className="text-[10px] text-green-600">
                      — PKR {discountAmount.toLocaleString()} off
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-[10px] text-stone-400 hover:text-red-400 transition-colors underline underline-offset-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-0">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={form.discountCode}
                      onChange={set("discountCode")}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyCoupon()
                      }
                      className={`flex-1 border border-r-0 rounded-l-sm px-3 py-2.5 text-[12px] text-stone-700 outline-none focus:ring-2 transition-colors placeholder:text-stone-300 uppercase tracking-wider ${
                        couponError
                          ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                          : "border-stone-200 focus:border-stone-500 focus:ring-stone-500/10"
                      }`}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !form.discountCode.trim()}
                      className="px-4 py-2.5 bg-stone-900 text-white text-[10px] tracking-[0.2em] uppercase hover:bg-stone-700 transition-colors flex-shrink-0 rounded-r-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {couponLoading ? "…" : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] text-red-400 mt-1.5 flex items-center gap-1">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {couponError}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="px-6 py-5 flex flex-col gap-3">
              <div className="flex justify-between">
                <p className="text-[11px] tracking-[0.15em] text-stone-500 uppercase">
                  Subtotal
                </p>
                <p className="text-[12px] text-stone-700">
                  PKR {subtotal.toLocaleString()}
                </p>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center">
                  <p className="text-[11px] tracking-[0.15em] text-green-600 uppercase">
                    Discount ({appliedCode})
                  </p>
                  <p className="text-[12px] text-green-600 font-medium">
                    − PKR {discountAmount.toLocaleString()}
                  </p>
                </div>
              )}
              <div className="flex justify-between items-center">
                <p className="text-[11px] tracking-[0.15em] text-stone-500 uppercase">
                  Shipping
                </p>
                {shipping === 0 ? (
                  <p className="text-[11px] text-green-600 font-medium">Free</p>
                ) : (
                  <p className="text-[12px] text-stone-700">
                    PKR {shipping.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="border-t border-stone-100 pt-3 mt-1">
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="text-[12px] tracking-[0.2em] text-stone-800 uppercase font-medium">
                      Total
                    </p>
                    {/* <p className="text-[10px] text-stone-400 mt-0.5">
                      Incl. PKR {tax.toLocaleString()} in taxes
                    </p> */}
                  </div>
                  <p className="text-[16px] text-stone-900 tracking-wide">
                    PKR {total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Savings badge */}
            {shipping === 0 && subtotal > 0 && (
              <div className="mx-6 mb-5 py-2 px-3 bg-green-50 border border-green-100 flex items-center gap-2">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="text-[10px] tracking-[0.15em] text-green-700 uppercase">
                  You're saving PKR {flatFee.toLocaleString()} on shipping
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 py-3 text-center">
            <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">
              ✦ Free shipping on orders over PKR{" "}
              {freeThreshold.toLocaleString()} ✦
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
