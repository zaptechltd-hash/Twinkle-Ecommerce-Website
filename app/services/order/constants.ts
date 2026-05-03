export const OrderEndpointsV1 = {
  orders:   "/orders",
  order:    (id: string) => `/orders/${id}`,
  myOrders: "/orders/my/orders",
  customers: "/orders/customers",
  analytics: "/orders/analytics",
} as const;
