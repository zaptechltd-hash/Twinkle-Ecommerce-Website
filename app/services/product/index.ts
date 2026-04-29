import useApi from "../../hooks/useApi";
import { ProductEndpointsV1 } from "./constants";
import type {
  CreateProductPayload,
  UpdateProductPayload,
  ProductQueryParams,
  Product,
  PaginatedProductsResponse,
} from "./types";

const useProductService = () => {
  const { callApi, loading, error } = useApi();

  // ─── Public ───────────────────────────────────────────────────────────────

  const getProducts = async (params?: ProductQueryParams) => {
    return await callApi<PaginatedProductsResponse>({
      method: "get",
      url: ProductEndpointsV1.products,
      params,
    });
  };

  const getProduct = async (id: string) => {
    return await callApi<Product>({
      method: "get",
      url: ProductEndpointsV1.product(id),
    });
  };

  // ─── Admin only ───────────────────────────────────────────────────────────

  const createProduct = async (payload: CreateProductPayload) => {
    return await callApi<Product>({
      method: "post",
      url: ProductEndpointsV1.products,
      data: payload,
    });
  };

  const updateProduct = async (id: string, payload: UpdateProductPayload) => {
    return await callApi<Product>({
      method: "patch",
      url: ProductEndpointsV1.product(id),
      data: payload,
    });
  };

  const deleteProduct = async (id: string) => {
    return await callApi<void>({
      method: "delete",
      url: ProductEndpointsV1.product(id),
    });
  };

  return {
    // Public
    getProducts,
    getProduct,
    // Admin
    createProduct,
    updateProduct,
    deleteProduct,
    // State
    loading,
    error,
  };
};

export default useProductService;