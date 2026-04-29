export const ProductEndpointsV1 = {
  products: "/products",
  product: (id: string) => `/products/${id}`,
} as const;