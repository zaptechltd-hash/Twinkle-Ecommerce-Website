export const OrderEndpointsV1 = {
  orders:   "/orders",
  order:    (id: number | string) => `/orders/${id}`,
  myOrders: "/orders/my/orders",
  customers: "/orders/customers",
  analytics: "/orders/analytics",
  bookShipment:   (id: number | string) => `/orders/${id}/book-shipment`,
  cancelShipment: (id: number | string) => `/orders/${id}/cancel-shipment`,
} as const;