// ─── Enums ────────────────────────────────────────────────────────────────────

export type OrderStatus    = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentMethod  = "card" | "cod";
export type PaymentStatus  = "Paid" | "Unpaid" | "Failed" | "Cancelled";

// ─── Request bodies ───────────────────────────────────────────────────────────

export interface CreateOrderItemPayload {
  productId:     string;
  productName:   string;
  size:          string;
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
  discountAmount?: number; 
  items:         CreateOrderItemPayload[];
}

export interface UpdateOrderPayload {
  status?:        OrderStatus;
  paymentStatus?: PaymentStatus;
}

export interface OrderQueryParams {
  search?:        string;
  status?:        OrderStatus;
  paymentStatus?: PaymentStatus;
  page?:          number;
  limit?:         number;
  sort?:          "newest" | "oldest";
}


export interface OrderItem {
  id:            string;
  productId:     string;
  productName:   string;
  size:          string;
  image:         string | null;
  unitPrice:     number;
  originalPrice: number;
  qty:           number;
  lineTotal:     number;
  // Removed: variantId, color, sku
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
  discountAmount: number; 
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

export interface Customer {
  email:       string;
  name:        string;
  totalOrders: number;
  totalSpent:  number;
  joined:      string;
}

export interface PaginatedCustomersResponse {
  data: Customer[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CustomerQueryParams {
  search?: string;
  page?:   number;
  limit?:  number;
  sort?:   'spent-desc' | 'spent-asc' | 'orders-desc' | 'name-asc';
}
// ─── Analytics ────────────────────────────────────────────────────────────────

export type AnalyticsPeriod = 'today' | 'week' | 'month' | 'year';

export interface MetricWithChange {
  value:         number;
  previousValue: number;
  changePct:     number | null; 
  direction:     'up' | 'down' | 'neutral';
}

export interface PaymentBreakdownRow {
  status: 'Paid' | 'Unpaid' | 'Failed'| "Cancelled";
  value:  number; 
  pct:    number;  
}

export interface OrderStatusBreakdownRow {
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  count:  number;
}

export interface ChartPoint {
  label:   string; 
  orders:  number;
  revenue: number;
}

export interface AnalyticsResponse {
  period:      AnalyticsPeriod;
  periodStart: string;
  periodEnd:   string;
  revenue:      MetricWithChange;
  orders:       MetricWithChange;
  newCustomers: MetricWithChange;
  aov:          MetricWithChange;
  paymentBreakdown: PaymentBreakdownRow[];
  statusBreakdown:  OrderStatusBreakdownRow[];
  chart:            ChartPoint[];
}

export interface AnalyticsQueryParams {
  period?: AnalyticsPeriod;
}