// ─── Enums ────────────────────────────────────────────────────────────────────

export type OrderStatus    = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentMethod  = "card" | "cod";
export type PaymentStatus  = "Paid" | "Unpaid" | "Failed";

// ─── Request bodies ───────────────────────────────────────────────────────────

export interface CreateOrderItemPayload {
  productId:     string;
  productName:   string;
  variantId:     string;
  color:         string;
  size:          string;
  sku:           string;
  image?:        string;
  unitPrice:     number;
  originalPrice: number;
  qty:           number;
}

export interface CreateOrderPayload {
  userId?:       string;          // omit for guest orders
  email:         string;
  firstName:     string;
  lastName:      string;
  address:       string;
  apartment?:    string;
  city:          string;
  postalCode?:   string;
  phone:         string;
  paymentMethod: PaymentMethod;
  discountCode?: string;
  items:         CreateOrderItemPayload[];
}

export interface UpdateOrderPayload {
  status?:        OrderStatus;
  paymentStatus?: PaymentStatus;
}

// ─── Query params (admin list) ────────────────────────────────────────────────

export interface OrderQueryParams {
  search?:        string;
  status?:        OrderStatus;
  paymentStatus?: PaymentStatus;
  page?:          number;
  limit?:         number;
  sort?:          "newest" | "oldest";
}

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface OrderItem {
  id:            string;
  productId:     string;
  productName:   string;
  variantId:     string;
  color:         string;
  size:          string;
  sku:           string;
  image:         string | null;
  unitPrice:     number;
  originalPrice: number;
  qty:           number;
  lineTotal:     number;
}

export interface Order {
  id:            string;
  userId:        string | null;
  email:         string;
  firstName:     string;
  lastName:      string;
  address:       string;
  apartment:     string | null;
  city:          string;
  postalCode:    string | null;
  phone:         string;
  country:       string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status:        OrderStatus;
  discountCode:  string | null;
  totalAmount:   number;
  shippingCost:  number;
  items:         OrderItem[];
  createdAt:     string;
  updatedAt:     string;
}

export interface PaginatedOrdersResponse {
  data: Order[];
  meta: {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
  };
}
