// ── Request Payloads ──────────────────────────────────────────


export interface ValidateCouponPayload {
  code: string;
  subtotal: number;
}

export interface CreateCouponPayload {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  expiresAt?: string;
  usageLimit?: number;
}

// ── Response Shapes ───────────────────────────────────────────

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  isActive: boolean;
  status: string;
  expiresAt?: string;
  usageLimit?: number;
  usageCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ValidateCouponResponse {
  valid: boolean;
  code: string;
  discountAmount: number; // ✅ add this
  message?: string;
}

export type CreateCouponResponse = Coupon;
export type FindAllCouponsResponse = Coupon[];
export type ToggleCouponResponse = Coupon;