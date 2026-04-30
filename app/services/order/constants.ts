export const OrderEndpointsV1 = {
  orders:   "/orders",
  order:    (id: string) => `/orders/${id}`,
  myOrders: "/orders/my/orders",
} as const;
