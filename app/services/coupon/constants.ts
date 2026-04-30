export const CouponEndpointsV1 = {
  validate: "/coupons/validate",
  findAll: "/coupons",
  create: "/coupons",
  toggle: (id: string) => `/coupons/${id}/toggle`,
  remove: (id: string) => `/coupons/${id}`,
} as const;