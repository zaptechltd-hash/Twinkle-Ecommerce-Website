// ─── Shared ───────────────────────────────────────────────────────────────

export interface SizeStockPayload {
  size: string;
  stock: number;
}

export interface VariantPayload {
  color: string;
  colorHex: string;
  sku: string;
  image?: string;
  sizes: SizeStockPayload[];
}

// ─── Query / Filters ──────────────────────────────────────────────────────

export type ProductCategory = "Nightwear" | "Robes" | "Loungewear" | "Sets";
export type ProductLocation  = "Home" | "Collection" | "Both";
export type ProductStatus    = "Active" | "Draft" | "Archived";
export type ProductSortBy    =
  | "sales"
  | "name"
  | "price_asc"
  | "price_desc"
  | "createdAt"
  | "stock_asc"
  | "stock_desc";

export interface ProductQueryParams {
  search?:   string;
  category?: ProductCategory;
  location?: ProductLocation;
  status?:   ProductStatus;
  page?:     number;
  limit?:    number;
  sortBy?:   ProductSortBy;
}

// ─── Request bodies ───────────────────────────────────────────────────────

export interface CreateProductPayload {
  name:       string;
  category:   ProductCategory;
  status:     ProductStatus;
  tag?:       string;
  price:      number;
  discountPrice?: number;
  location:   ProductLocation;
  sizeGuide?: Record<string, unknown>;
  variants:   VariantPayload[];
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

// ─── Responses ────────────────────────────────────────────────────────────

export interface SizeStock {
  id:    string;
  size:  string;
  stock: number;
}

export interface ProductVariant {
  id:       string;
  color:    string;
  colorHex: string;
  sku:      string;
  image:    string | null;
  sizes:    SizeStock[];
}

export interface Product {
  id:        string;
  name:      string;
  category:  ProductCategory;
  status:    ProductStatus;
  tag:       string | null;
  price:     number;
  discountPrice: number | null;
  location:  ProductLocation;
  sizeGuide: Record<string, unknown> | null;
  sales:     number;
  createdAt: string;
  updatedAt: string;
  variants:  ProductVariant[];
}

export interface PaginatedProductsResponse {
  data: Product[];
  meta: {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
  };
}