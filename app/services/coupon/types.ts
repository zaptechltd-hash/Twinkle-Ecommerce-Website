// ── Request Payloads ──────────────────────────────────────────

export interface ValidateCouponPayload {
  code: string;
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
  coupon?: Coupon;
  message?: string;
}

export type CreateCouponResponse = Coupon;
export type FindAllCouponsResponse = Coupon[];
export type ToggleCouponResponse = Coupon;