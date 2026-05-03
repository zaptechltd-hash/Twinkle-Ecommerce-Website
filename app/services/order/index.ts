import useApi from "../../hooks/useApi";
import { OrderEndpointsV1 } from "./constants";
import type {
  CreateOrderPayload,
  UpdateOrderPayload,
  OrderQueryParams,
  Order,
  PaginatedOrdersResponse,
  CustomerQueryParams,
  PaginatedCustomersResponse,
  AnalyticsQueryParams,
  AnalyticsResponse,
} from "./types";

const useOrderService = () => {
  const { callApi, loading, error } = useApi();

  // ─── Public ───────────────────────────────────────────────────────────────

  /** Place an order — works for both guests and logged-in users */
  const createOrder = async (payload: CreateOrderPayload) => {
    return await callApi<Order>({
      method: "post",
      url: OrderEndpointsV1.orders,
      data: payload,
    });
  };

  // ─── Authenticated user ───────────────────────────────────────────────────

  /** Get the logged-in user's own order history */
  const getMyOrders = async () => {
    return await callApi<Order[]>({
      method: "get",
      url: OrderEndpointsV1.myOrders,
    });
  };

  // ─── Admin only ───────────────────────────────────────────────────────────

  /** List all orders with optional filters + pagination */
  const getOrders = async (params?: OrderQueryParams) => {
    return await callApi<PaginatedOrdersResponse>({
      method: "get",
      url: OrderEndpointsV1.orders,
      params,
    });
  };

  /** Get a single order by ID */
  const getOrder = async (id: string) => {
    return await callApi<Order>({
      method: "get",
      url: OrderEndpointsV1.order(id),
    });
  };

  /** Update order status or payment status */
  const updateOrder = async (id: string, payload: UpdateOrderPayload) => {
    return await callApi<Order>({
      method: "patch",
      url: OrderEndpointsV1.order(id),
      data: payload,
    });
  };

  const getAnalytics = async (params?: AnalyticsQueryParams) => {
    return await callApi<AnalyticsResponse>({
      method: "get",
      url: OrderEndpointsV1.analytics,
      params,
    });
  };

  const getCustomers = async (params?: CustomerQueryParams) => {
    return await callApi<PaginatedCustomersResponse>({
      method: "get",
      url: OrderEndpointsV1.customers,
      params,
    });
  };

return {
  createOrder,
  getMyOrders,
  getOrders,
  getOrder,
  updateOrder,
  getCustomers,
  getAnalytics,   
  loading,
  error,
};
};

export default useOrderService;
