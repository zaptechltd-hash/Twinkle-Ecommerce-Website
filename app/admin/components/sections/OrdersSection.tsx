"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useOrderService from "../../../services/order/index";
import type {
  Order,
  OrderStatus,
  OrderQueryParams,
} from "../../../services/order/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const PER_PAGE = 10;

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  Delivered: { pill: "bg-[#eaf3de] text-[#3b6d11]", dot: "bg-[#639922]" },
  Processing: { pill: "bg-[#e6f1fb] text-[#185fa5]", dot: "bg-[#378add]" },
  Pending: { pill: "bg-[#faeeda] text-[#854f0b]", dot: "bg-[#ef9f27]" },
  Cancelled: { pill: "bg-[#fcebeb] text-[#a32d2d]", dot: "bg-[#e24b4a]" },
  Shipped: { pill: "bg-[#ede9f7] text-[#4a3b9c]", dot: "bg-[#7c6fd4]" },
};

const PAYMENT_STYLES: Record<string, string> = {
  Paid: "bg-[#eaf3de] text-[#3b6d11]",
  Unpaid: "bg-[#faeeda] text-[#854f0b]",
  Failed: "bg-[#fcebeb] text-[#a32d2d]",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fullName(order: Order) {
  return `${order.firstName} ${order.lastName}`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function revenueStr(n: number) {
  return n >= 1_000_000
    ? `PKR ${(n / 1_000_000).toFixed(1)}M`
    : `PKR ${n.toLocaleString()}`;
}

// ─── PDF Download ─────────────────────────────────────────────────────────────

async function downloadDeliveryPDF(order: Order) {
  // Dynamically import jsPDF so it doesn't bloat the initial bundle
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "mm", format: "a5" });
  const name = fullName(order);
  const W = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 14;

  const lineH = 6;
  const col2 = 70; // x for right column values

  // ── helpers ──
  const text = (
    str: string,
    x: number,
    yy: number,
    opts?: Parameters<typeof doc.text>[3],
  ) => doc.text(str, x, yy, opts);

  const hRule = (yy: number) => {
    doc.setDrawColor(220, 218, 213);
    doc.setLineWidth(0.3);
    doc.line(margin, yy, W - margin, yy);
  };

  // ── Header band ──
  doc.setFillColor(26, 25, 22); // #1a1916
  doc.rect(0, 0, W, 22, "F");

  doc.setTextColor(245, 242, 237); // #f5f2ed
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  text("DELIVERY SLIP", margin, 10);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  text(`Order #${order.id}`, margin, 16);
  text(formatDate(order.createdAt), W - margin, 16, { align: "right" });

  y = 30;
  doc.setTextColor(26, 25, 22);

  // ── Customer & Delivery ──
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 178, 169); // muted label
  text("SHIP TO", margin, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(26, 25, 22);
  text(name, margin, y);
  y += lineH;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(95, 94, 90);

  const addressLine = `${order.address}${order.apartment ? `, ${order.apartment}` : ""}`;
  const cityLine = `${order.city}${order.postalCode ? ` ${order.postalCode}` : ""}, ${order.country}`;
  text(addressLine, margin, y);
  y += lineH;
  text(cityLine, margin, y);
  y += lineH;
  text(`Phone: ${order.phone}`, margin, y);
  y += lineH;
  text(`Email: ${order.email}`, margin, y);
  y += lineH + 2;

  hRule(y);
  y += 5;

  // ── Order meta ──
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 178, 169);
  text("ORDER DETAILS", margin, y);
  y += 5;

  const metaRows: [string, string][] = [
    ["Payment Method", order.paymentMethod.toUpperCase()],
    ["Payment Status", order.paymentStatus],
    ["Order Status", order.status],
  ];

  doc.setFontSize(9);
  for (const [label, value] of metaRows) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(95, 94, 90);
    text(label, margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 25, 22);
    text(value, col2, y);
    y += lineH;
  }

  y += 2;
  hRule(y);
  y += 5;

  // ── Items table ──
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 178, 169);
  text("ITEMS", margin, y);
  y += 5;

  // Table header
  doc.setFillColor(245, 242, 237);
  doc.rect(margin, y - 4, W - margin * 2, 6, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(95, 94, 90);
  text("Product", margin + 1, y);
  text("Size", col2, y);
  text("Qty", col2 + 22, y);
  text("Amount", W - margin - 1, y, { align: "right" });
  y += 5;

  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  for (const item of order.items) {
    doc.setTextColor(26, 25, 22);
    // Truncate long product names
    const productName = doc.splitTextToSize(
      item.productName,
      col2 - margin - 2,
    )[0];
    text(productName, margin + 1, y);
    doc.setTextColor(95, 94, 90);
    text(item.size, col2, y);
    text(String(item.qty), col2 + 22, y);
    doc.setTextColor(26, 25, 22);
    text(`PKR ${item.lineTotal.toLocaleString()}`, W - margin - 1, y, {
      align: "right",
    });
    y += lineH;
  }

  y += 1;
  hRule(y);
  y += 5;

  // ── Totals ──
  const totalsX = W - margin - 60;

  if ((order.discountAmount ?? 0) > 0) {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(95, 94, 90);
    text("Subtotal", totalsX, y);
    text(
      `PKR ${(order.totalAmount + (order.discountAmount ?? 0)).toLocaleString()}`,
      W - margin - 1,
      y,
      { align: "right" },
    );
    y += lineH;

    doc.setTextColor(59, 109, 17); // green
    text(
      `Discount${order.discountCode ? ` (${order.discountCode})` : ""}`,
      totalsX,
      y,
    );
    text(
      `- PKR ${(order.discountAmount ?? 0).toLocaleString()}`,
      W - margin - 1,
      y,
      { align: "right" },
    );
    y += lineH;
  }

  // Total box
  doc.setFillColor(26, 25, 22);
  doc.roundedRect(
    totalsX - 2,
    y - 4,
    W - margin - totalsX + 4,
    10,
    1.5,
    1.5,
    "F",
  );
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(245, 242, 237);
  text("TOTAL", totalsX + 1, y + 2);
  text(`PKR ${order.totalAmount.toLocaleString()}`, W - margin - 2, y + 2, {
    align: "right",
  });

  y += 14;
  hRule(y);
  y += 6;

  // ── Footer note ──
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(180, 178, 169);
  text(
    "Thank you for your order. Please keep this slip for your records.",
    W / 2,
    y,
    { align: "center" },
  );

  doc.save(`order-${order.id}.pdf`);
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">
      {children}
    </p>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md ${s.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded ${PAYMENT_STYLES[status] ?? ""}`}
    >
      {status}
    </span>
  );
}

function Initials({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#f1efe8] flex items-center justify-center text-[10px] font-medium text-[#888780] flex-shrink-0">
      {initials(name)}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-[#e8e5df] rounded ${className}`} />;
}

// ─── Order Item Row inside modal ──────────────────────────────────────────────

function OrderItemRow({ item }: { item: Order["items"][number] }) {
  return (
    <div className="flex items-center gap-3 bg-[#f9f8f6] border border-[#e8e5df] rounded-xl px-3 py-2.5">
      {item.image ? (
        <img
          src={item.image}
          alt={item.productName}
          className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-black/5"
        />
      ) : (
        <div className="w-11 h-11 rounded-lg flex items-center justify-center text-lg flex-shrink-0 border border-black/5 bg-[#f1efe8]">
          🛍
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1a1916] truncate">
          {item.productName}
        </p>
        <p className="text-[11px] text-[#b4b2a9]">Size: {item.size}</p>
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-[11px] font-medium bg-[#f1efe8] text-[#5f5e5a] px-2 py-0.5 rounded-md">
          Qty: {item.qty}
        </span>
        <span className="text-[11px] font-medium text-[#1a1916]">
          PKR {item.lineTotal.toLocaleString()}
        </span>
        {item.originalPrice > item.unitPrice && (
          <span className="text-[10px] text-[#b4b2a9] line-through">
            PKR {(item.originalPrice * item.qty).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

function OrderModal({
  order,
  onClose,
  onStatusChange,
  onPaymentStatusChange,
  onBookShipment,
  onCancelShipment,
  shippingAction,
  updating,
  initialEditing = false,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: number, status: OrderStatus) => void;
  onPaymentStatusChange: (id: number, paymentStatus: string) => void;
  onBookShipment: (id: number) => void;
  onCancelShipment: (id: number) => void;
  shippingAction: boolean;
  updating: boolean;
  initialEditing?: boolean;
}) {
  const [editing, setEditing] = useState(initialEditing);
  const [downloading, setDownloading] = useState(false);
  const name = fullName(order);
  const totalItems = order.items.reduce((s, i) => s + i.qty, 0);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadDeliveryPDF(order);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">
                {editing ? "Edit Order" : "Order Details"}
              </p>
              <h2 className="text-xl font-medium text-[#1a1916] font-mono">
                {order.id}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {/* ── Download PDF button (view mode only) ── */}
              {!editing && (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-[#e8e5df] text-[#888780] hover:bg-[#1a1916] hover:text-[#f5f2ed] hover:border-[#1a1916] transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {downloading ? (
                    <>
                      <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      {/* Download icon */}
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 1v6M3.5 5L6 7.5 8.5 5M2 9.5h8"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Delivery PDF
                    </>
                  )}
                </button>
              )}
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-[#e8e5df] text-[#888780] hover:bg-[#1a1916] hover:text-[#f5f2ed] hover:border-[#1a1916] transition-all"
                >
                  Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-[#f1efe8] flex items-center justify-center text-[#5f5e5a] hover:bg-[#e8e5df] transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            {[
              ["Customer", <span className="font-medium">{name}</span>],
              [
                "Email",
                <span className="text-[#185fa5] break-all">{order.email}</span>,
              ],
              ["Phone", order.phone],
              ["Date", formatDate(order.createdAt)],
              ["Payment", <PaymentBadge status={order.paymentStatus} />],
              [
                "Method",
                <span className="uppercase text-[11px] font-medium">
                  {order.paymentMethod}
                </span>,
              ],
              [
                "Order Total",
                <span className="font-medium">
                  PKR {order.totalAmount.toLocaleString()}
                </span>,
              ],
              ["Items", `${totalItems} item${totalItems !== 1 ? "s" : ""}`],
              [
                "Shipping Cost",
                <span className="font-medium">
                  PKR {order.shippingCost.toLocaleString()}
                </span>,
              ],
              [
                "Shipment Booked",
                order.isShipmentBooked ? (
                  <span className="text-[#3b6d11] font-medium">Yes</span>
                ) : (
                  <span className="text-[#b4b2a9]">No</span>
                ),
              ],
              [
                "Tracking Number",
                order.trackingNumber ?? (
                  <span className="text-[#b4b2a9]">—</span>
                ),
              ],
              [
                "Shipment Status",
                order.shipmentStatus ?? (
                  <span className="text-[#b4b2a9]">—</span>
                ),
              ],
            ].map(([label, val]) => (
              <div key={String(label)}>
                <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">
                  {label}
                </p>
                <div className="text-[13px] text-[#1a1916]">{val}</div>
              </div>
            ))}
          </div>

          {/* Delivery address */}
          <div className="mb-5 bg-[#f9f8f6] border border-[#e8e5df] rounded-xl px-4 py-3">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-1.5">
              Delivery Address
            </p>
            <p className="text-[12px] text-[#1a1916] leading-relaxed">
              {order.address}
              {order.apartment ? `, ${order.apartment}` : ""}
              <br />
              {order.city}
              {order.postalCode ? ` ${order.postalCode}` : ""} · {order.country}
            </p>
          </div>

          {/* Shipment action */}
          <div className="mb-5 flex items-center justify-between bg-[#f9f8f6] border border-[#e8e5df] rounded-xl px-4 py-3">
            <div>
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">
                Courier Shipment
              </p>
              <p className="text-[12px] text-[#1a1916]">
                {order.isShipmentBooked
                  ? `Booked — ${order.trackingNumber}`
                  : "Not booked yet"}
              </p>
            </div>
            {order.isShipmentBooked ? (
              <button
                onClick={() => onCancelShipment(order.id)}
                disabled={shippingAction}
                className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-[#f09595]/50 text-[#a32d2d] hover:bg-[#e24b4a] hover:text-white hover:border-[#e24b4a] transition-all disabled:opacity-50"
              >
                {shippingAction ? "Cancelling…" : "Cancel Shipment"}
              </button>
            ) : (
              <button
                onClick={() => onBookShipment(order.id)}
                disabled={shippingAction}
                className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-[#1a1916] text-[#f5f2ed] hover:bg-[#333] transition-all disabled:opacity-50"
              >
                {shippingAction ? "Booking…" : "Book Shipment"}
              </button>
            )}
          </div>

          {/* Items */}
          <div className="mb-5">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-3">
              Products Ordered
            </p>
            <div className="flex flex-col gap-2">
              {order.items.map((item) => (
                <OrderItemRow key={item.id} item={item} />
              ))}
            </div>
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[#e8e5df]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#5f5e5a]">Subtotal</p>
                <p className="text-[12px] text-[#1a1916]">
                  PKR{" "}
                  {(
                    order.totalAmount + (order.discountAmount ?? 0)
                  ).toLocaleString()}
                </p>
              </div>
              {(order.discountAmount ?? 0) > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-green-700">
                    Discount{" "}
                    {order.discountCode && (
                      <span className="font-mono bg-[#eaf3de] px-1.5 py-0.5 rounded text-[10px]">
                        {order.discountCode}
                      </span>
                    )}
                  </p>
                  <p className="text-[12px] font-medium text-green-700">
                    − PKR {(order.discountAmount ?? 0).toLocaleString()}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-[#1a1916]">
                  Order Total
                </p>
                <p className="text-[13px] font-medium text-[#1a1916]">
                  PKR {order.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Discount code */}
          {order.discountCode && (
            <div className="mb-5">
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-1">
                Discount Code
              </p>
              <span className="text-[12px] font-mono font-medium text-[#3b6d11] bg-[#eaf3de] px-2 py-0.5 rounded">
                {order.discountCode}
              </span>
            </div>
          )}

          {/* ── Status ── */}
          <div className="border-t border-[#f1efe8] pt-4">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-2">
              Order Status
            </p>
            <div className="mb-3">
              <StatusPill status={order.status} />
            </div>
            {editing && (
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "Pending",
                    "Processing",
                    "Shipped",
                    "Delivered",
                    "Cancelled",
                  ] as OrderStatus[]
                ).map((s) => (
                  <button
                    key={s}
                    disabled={updating}
                    onClick={() => onStatusChange(order.id, s)}
                    className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                      s === order.status
                        ? "bg-[#1a1916] text-[#f5f2ed] border-[#1a1916]"
                        : "border-[#e8e5df] text-[#5f5e5a] hover:bg-[#1a1916] hover:text-[#f5f2ed] hover:border-[#1a1916]"
                    }`}
                  >
                    {updating && s === order.status ? "Saving…" : s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Payment Status (edit mode only) ── */}
          {editing && (
            <div className="border-t border-[#f1efe8] pt-4 mt-4">
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#b4b2a9] mb-2">
                Payment Status
              </p>
              <div className="mb-3">
                <PaymentBadge status={order.paymentStatus} />
              </div>
              <div className="flex flex-wrap gap-2">
                {(["Paid", "Unpaid", "Failed"] as const).map((ps) => (
                  <button
                    key={ps}
                    disabled={updating}
                    onClick={() => onPaymentStatusChange(order.id, ps)}
                    className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                      ps === order.paymentStatus
                        ? "bg-[#1a1916] text-[#f5f2ed] border-[#1a1916]"
                        : "border-[#e8e5df] text-[#5f5e5a] hover:bg-[#1a1916] hover:text-[#f5f2ed] hover:border-[#1a1916]"
                    }`}
                  >
                    {updating && ps === order.paymentStatus ? "Saving…" : ps}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Bulk Action Bar ──────────────────────────────────────────────────────────

function BulkBar({
  count,
  onAction,
  onClear,
  disabled,
}: {
  count: number;
  onAction: (key: string) => void;
  onClear: () => void;
  disabled: boolean;
}) {
  return (
    <div className="bg-[#1a1916] rounded-xl px-4 py-3 flex items-center gap-2 flex-wrap mb-3">
      <span className="text-[12px] font-medium text-[#f5f2ed] mr-1">
        {count} order{count !== 1 ? "s" : ""} selected
      </span>
      {[
        { label: "Mark Shipped", key: "Shipped" },
        { label: "Mark Processing", key: "Processing" },
        { label: "Mark Delivered", key: "Delivered" },
      ].map((a) => (
        <button
          key={a.key}
          disabled={disabled}
          onClick={() => onAction(a.key)}
          className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-white/20 text-[#f5f2ed] bg-white/10 hover:bg-white/20 transition-all disabled:opacity-40"
        >
          {a.label}
        </button>
      ))}
      <button
        disabled={disabled}
        onClick={() => onAction("Cancelled")}
        className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[#f09595]/50 text-[#f09595] bg-white/5 hover:bg-[#e24b4a]/20 transition-all disabled:opacity-40"
      >
        Cancel Orders
      </button>
      <button
        onClick={onClear}
        className="ml-auto text-white/40 hover:text-white/70 text-xl leading-none transition-colors"
      >
        ×
      </button>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1916] text-[#f5f2ed] text-[12px] font-medium px-5 py-2.5 rounded-xl z-[200] shadow-lg pointer-events-none">
      {message}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderManagement() {
  const { getOrders, updateOrder, bookShipment, cancelShipment } =
    useOrderService();

  // ── Server state ──
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: PER_PAGE,
    totalPages: 1,
  });
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [shippingAction, setShippingAction] = useState(false);

  // ── Filter / UI state ──
  const [activeStatus, setActiveStatus] = useState("All");
  const [payFilter, setPayFilter] = useState("All");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set<number>());
  const [modalOrder, setModalOrder] = useState<Order | null>(null);
  const [modalEditing, setModalEditing] = useState(false);
  const [toast, setToast] = useState("");

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Stats ──
  const stats = {
    total: meta.total,
    pending: orders.filter((o) => o.status === "Pending").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    revenue: orders.reduce((a, o) => a + o.totalAmount, 0),
  };

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchOrders = useCallback(async (params: OrderQueryParams) => {
    setFetching(true);
    try {
      const res = await getOrders(params);
      if (res) {
        setOrders(res.data);
        setMeta(res.meta);
      }
    } finally {
      setFetching(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const params: OrderQueryParams = {
      page,
      limit: PER_PAGE,
      sort,
      ...(activeStatus !== "All" && { status: activeStatus as OrderStatus }),
      ...(payFilter !== "All" && { paymentStatus: payFilter as any }),
      ...(search && { search }),
    };
    fetchOrders(params);
  }, [page, sort, activeStatus, payFilter, search]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ────────────────────────────────────────────────────────────────

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const resetPage = () => setPage(1);

  const handleSearch = (val: string) => {
    setSearch(val);
    resetPage();
  };

  const handleStatusTab = (s: string) => {
    setActiveStatus(s);
    resetPage();
    setSelected(new Set());
  };

  const openModal = (order: Order, editing: boolean) => {
    setModalOrder(order);
    setModalEditing(editing);
  };

  const closeModal = () => {
    setModalOrder(null);
    setModalEditing(false);
  };

  // ── Single order status update ─────────────────────────────────────────────

  const handleStatusChange = async (id: number, status: OrderStatus) => {
    setUpdating(true);
    try {
      const updated = await updateOrder(id, { status });
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        if (modalOrder?.id === id) setModalOrder(updated);
        showToast(`Order status → ${status}`);
        closeModal();
      }
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (
    id: number,
    paymentStatus: string,
  ) => {
    setUpdating(true);
    try {
      const updated = await updateOrder(id, { paymentStatus } as any);
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        if (modalOrder?.id === id) setModalOrder(updated);
        showToast(`Payment status → ${paymentStatus}`);
      }
    } finally {
      setUpdating(false);
    }
  };

  // ── Shipment actions ─────────────────────────────────────────────────────

  const handleBookShipment = async (id: number) => {
    setShippingAction(true);
    try {
      const updated = await bookShipment(id);
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        if (modalOrder?.id === id) setModalOrder(updated);
        showToast("Shipment booked");
      }
    } catch {
      showToast("Failed to book shipment");
    } finally {
      setShippingAction(false);
    }
  };

  const handleCancelShipment = async (id: number) => {
    setShippingAction(true);
    try {
      const updated = await cancelShipment(id);
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        if (modalOrder?.id === id) setModalOrder(updated);
        showToast("Shipment cancelled");
      }
    } catch {
      showToast("Failed to cancel shipment");
    } finally {
      setShippingAction(false);
    }
  };

  // ── Bulk status update ─────────────────────────────────────────────────────

  const handleBulkAction = async (newStatus: string) => {
    const ids = [...selected];
    setUpdating(true);
    try {
      await Promise.all(
        ids.map((id) => updateOrder(id, { status: newStatus as OrderStatus })),
      );
      await fetchOrders({
        page,
        limit: PER_PAGE,
        sort,
        ...(activeStatus !== "All" && { status: activeStatus as OrderStatus }),
        ...(payFilter !== "All" && { paymentStatus: payFilter as any }),
        ...(search && { search }),
      });
      showToast(
        `${ids.length} order${ids.length !== 1 ? "s" : ""} marked as ${newStatus}`,
      );
      setSelected(new Set());
    } finally {
      setUpdating(false);
    }
  };

  const toggleRow = (id: number) =>
    setSelected((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = (chk: boolean) =>
    setSelected((p) => {
      const n = new Set(p);
      orders.forEach((o) => (chk ? n.add(o.id) : n.delete(o.id)));
      return n;
    });
  const allChecked =
    orders.length > 0 && orders.every((o) => selected.has(o.id));
  const someChecked = orders.some((o) => selected.has(o.id));

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="bg-[#f5f2ed] min-h-screen p-6 md:p-8 text-[#1a1916]">
        {/* ── Top bar ── */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="serif text-[22px] font-normal tracking-tight">
              Order Management
            </h1>
            <p className="text-[12px] text-[#b4b2a9] mt-0.5">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="mb-6">
          <SectionLabel>Overview</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fetching
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#e8e5df] rounded-xl p-4"
                  >
                    <Skeleton className="h-3 w-20 mb-3" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))
              : [
                  {
                    label: "Total Orders",
                    value: meta.total,
                    color: "text-[#1a1916]",
                  },
                  {
                    label: "Pending",
                    value: stats.pending,
                    color: "text-[#854f0b]",
                  },
                  {
                    label: "Delivered",
                    value: stats.delivered,
                    color: "text-[#3b6d11]",
                  },
                  {
                    label: "Revenue",
                    value: revenueStr(stats.revenue),
                    color: "text-[#1a1916]",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white border border-[#e8e5df] rounded-xl p-4"
                  >
                    <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#b4b2a9] mb-2">
                      {s.label}
                    </p>
                    <p
                      className={`text-xl font-medium leading-none ${s.color}`}
                    >
                      {s.value}
                    </p>
                  </div>
                ))}
          </div>
        </div>

        {/* ── Orders table card ── */}
        <div className="bg-white border border-[#e8e5df] rounded-xl p-5">
          {/* Search + dropdowns */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {/* <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b4b2a9] text-sm select-none">⌕</span>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name, email or order ID…"
                className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#e8e5df] rounded-xl bg-white text-[#1a1916] placeholder-[#b4b2a9] outline-none focus:border-[#1a1916] transition-colors"
              />
            </div> */}
            <select
              value={payFilter}
              onChange={(e) => {
                setPayFilter(e.target.value);
                resetPage();
              }}
              className="text-[12px] px-3 py-2 border border-[#e8e5df] rounded-xl bg-white text-[#5f5e5a] outline-none"
            >
              {["All", "Paid", "Unpaid", "Failed"].map((p) => (
                <option key={p} value={p}>
                  {p === "All" ? "All payments" : p}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as "newest" | "oldest");
                resetPage();
              }}
              className="text-[12px] px-3 py-2 border border-[#e8e5df] rounded-xl bg-white text-[#5f5e5a] outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {/* Status tabs */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusTab(s)}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${
                  activeStatus === s
                    ? "bg-[#1a1916] text-[#f5f2ed]"
                    : "bg-[#f5f2ed] text-[#888780] hover:text-[#1a1916]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Bulk bar */}
          {selected.size > 0 && (
            <BulkBar
              count={selected.size}
              onAction={handleBulkAction}
              onClear={() => setSelected(new Set())}
              disabled={updating}
            />
          )}

          {/* Select-all row */}
          <div className="flex items-center gap-2 mb-3">
            <label className="flex items-center gap-2 text-[11px] text-[#b4b2a9] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allChecked}
                ref={(el) => {
                  if (el) el.indeterminate = someChecked && !allChecked;
                }}
                onChange={(e) => toggleAll(e.target.checked)}
                className="accent-[#1a1916] w-3.5 h-3.5"
              />
              Select all visible
            </label>
            <span className="ml-auto text-[11px] text-[#b4b2a9]">
              {meta.total} order{meta.total !== 1 ? "s" : ""} total
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-[#e8e5df]">
                  {[
                    "",
                    "Order",
                    "Customer",
                    "Date",
                    "Items",
                    "Amount",
                    "Payment",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[9px] tracking-[0.18em] uppercase text-[#b4b2a9] font-medium pb-3 pr-4 last:pr-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f2ed]">
                {fetching ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={9} className="py-3 pr-4">
                        <Skeleton className="h-8 w-full" />
                      </td>
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-10 text-center text-[12px] text-[#b4b2a9]"
                    >
                      No orders match your filters
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const name = fullName(order);
                    const totalItems = order.items.reduce(
                      (s, i) => s + i.qty,
                      0,
                    );

                    return (
                      <tr
                        key={order.id}
                        className={`transition-colors ${selected.has(order.id) ? "bg-[#f5f2f0]" : "hover:bg-[#fafaf8]"}`}
                      >
                        <td className="py-3 pr-3 w-5">
                          <input
                            type="checkbox"
                            checked={selected.has(order.id)}
                            onChange={() => toggleRow(order.id)}
                            className="accent-[#1a1916] w-3.5 h-3.5 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-[12px] font-medium text-[#1a1916] font-mono">
                            {order.id}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <Initials name={name} />
                            <div>
                              <p className="text-[12px] font-medium text-[#1a1916]">
                                {name}
                              </p>
                              <p className="text-[10px] text-[#b4b2a9]">
                                {order.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-[11px] text-[#5f5e5a] whitespace-nowrap">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <span className="text-[12px] text-[#5f5e5a]">
                            {totalItems}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-[12px] font-medium text-[#1a1916]">
                            PKR {order.totalAmount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <PaymentBadge status={order.paymentStatus} />
                        </td>
                        <td className="py-3 pr-4">
                          <StatusPill status={order.status} />
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openModal(order, false)}
                              className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] hover:bg-[#1a1916] hover:text-[#f5f2ed] hover:border-[#1a1916] transition-all"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openModal(order, true)}
                              className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-[#faeeda] text-[#854f0b] border border-transparent hover:bg-[#1a1916] hover:text-[#f5f2ed] transition-all"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
            <p className="text-[11px] text-[#b4b2a9]">
              Showing {meta.total === 0 ? 0 : (page - 1) * PER_PAGE + 1}–
              {Math.min(page * PER_PAGE, meta.total)} of {meta.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1 || fetching}
                onClick={() => setPage((p) => p - 1)}
                className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] disabled:opacity-30 disabled:cursor-not-allowed transition-all enabled:hover:bg-[#1a1916] enabled:hover:text-[#f5f2ed] enabled:hover:border-[#1a1916]"
              >
                ←
              </button>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                (n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`text-[11px] font-medium w-8 h-8 rounded-lg transition-all ${
                      n === page
                        ? "bg-[#1a1916] text-[#f5f2ed]"
                        : "text-[#5f5e5a] hover:bg-[#f1efe8]"
                    }`}
                  >
                    {n}
                  </button>
                ),
              )}
              <button
                disabled={page === meta.totalPages || fetching}
                onClick={() => setPage((p) => p + 1)}
                className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-[#e8e5df] text-[#5f5e5a] disabled:opacity-30 disabled:cursor-not-allowed transition-all enabled:hover:bg-[#1a1916] enabled:hover:text-[#f5f2ed] enabled:hover:border-[#1a1916]"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {modalOrder && (
        <OrderModal
          order={modalOrder}
          onClose={closeModal}
          onStatusChange={handleStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
          onBookShipment={handleBookShipment}
          onCancelShipment={handleCancelShipment}
          shippingAction={shippingAction}
          updating={updating}
          initialEditing={modalEditing}
        />
      )}

      {/* ── Toast ── */}
      <Toast message={toast} />
    </>
  );
}