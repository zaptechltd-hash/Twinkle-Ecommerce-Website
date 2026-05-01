// ─── Query / Filters ──────────────────────────────────────────────────────

export type ProductCategory = 'Nightwear' | 'Robes' | 'Loungewear' | 'Sets';
export type ProductLocation  = 'Home' | 'Collection' | 'Both';
export type ProductStatus    = 'Active' | 'Draft' | 'Archived';
export type ProductSize      = 'S' | 'M' | 'L' | 'XL';
export type ProductSortBy    =
  | 'sales'
  | 'name'
  | 'price_asc'
  | 'price_desc'
  | 'createdAt'
  | 'stock_asc'
  | 'stock_desc';

export interface ProductQueryParams {
  search?:   string;
  category?: ProductCategory;
  location?: ProductLocation;
  status?:   ProductStatus;
  page?:     number;
  limit?:    number;
  sortBy?:   ProductSortBy;
}

// ─── Shared sub-shapes ────────────────────────────────────────────────────

export interface ProductImagePayload {
  url:    string;
  order?: number;
}

export interface ProductSizePayload {
  size:  ProductSize;
  stock: number;
}

// ─── Request bodies ───────────────────────────────────────────────────────

export interface CreateProductPayload {
  name:           string;
  description?:   string | null;
  category:       ProductCategory;
  status:         ProductStatus;
  tag?:           string | null;
  price:          number;
  discountPrice?: number | null;
  location:       ProductLocation;
  images:         ProductImagePayload[];
  sizes:          ProductSizePayload[];
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

// ─── Responses ────────────────────────────────────────────────────────────

export interface ProductImageResponse {
  id:    string;
  url:   string;
  order: number;
}

export interface ProductSizeResponse {
  id:    string;
  size:  ProductSize;
  stock: number;
}

export interface Product {
  id:           string;
  name:         string;
  description:  string | null;
  category:     ProductCategory;
  status:       ProductStatus;
  tag:          string | null;
  price:        number;
  discountPrice: number | null;
  location:     ProductLocation;
  sales:        number;
  images:       ProductImageResponse[];
  sizes:        ProductSizeResponse[];
  createdAt:    string;
  updatedAt:    string;
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