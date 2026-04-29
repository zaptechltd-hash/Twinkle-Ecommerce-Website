import useApi from "../../hooks/useApi";
import { AuthEndpointsV1 } from "./constants";
import type {
  AdminLoginPayload,
  AdminLoginResponse,
  AdminRegisterPayload,
  AdminRegisterResponse,
  CustomerLoginPayload,
  CustomerLoginResponse,
  CustomerRegisterPayload,
  CustomerRegisterResponse,
} from "./types";

const useAuthService = () => {
  const { callApi, loading, error } = useApi();


  const customerRegister = async (payload: CustomerRegisterPayload) => {
    return await callApi<CustomerRegisterResponse>({
      method: "post",
      url: AuthEndpointsV1.customerRegister,
      data: payload,
    });
  };

  const customerLogin = async (payload: CustomerLoginPayload) => {
    return await callApi<CustomerLoginResponse>({
      method: "post",
      url: AuthEndpointsV1.customerLogin,
      data: payload,
    });
  };

  const customerRefresh = async (refreshToken: string) => {
    return await callApi<CustomerLoginResponse>({
      method: "post",
      url: AuthEndpointsV1.customerRefresh,
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
  };

  const customerLogout = async (refreshToken: string) => {
    return await callApi({
      method: "post",
      url: AuthEndpointsV1.customerLogout,
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
  };

  // ── Admin ─────────────────────────────────────────────────

  const adminRegister = async (payload: AdminRegisterPayload) => {
    return await callApi<AdminRegisterResponse>({
      method: "post",
      url: AuthEndpointsV1.adminRegister,
      data: payload,
    });
  };

  const adminLogin = async (payload: AdminLoginPayload) => {
    return await callApi<AdminLoginResponse>({
      method: "post",
      url: AuthEndpointsV1.adminLogin,
      data: payload,
    });
  };

  const adminRefresh = async (refreshToken: string) => {
    return await callApi<AdminLoginResponse>({
      method: "post",
      url: AuthEndpointsV1.adminRefresh,
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
  };

  const adminLogout = async (refreshToken: string) => {
    return await callApi({
      method: "post",
      url: AuthEndpointsV1.adminLogout,
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
  };

  return {
    // Customer
    customerRegister,
    customerLogin,
    customerRefresh,
    customerLogout,
    // Admin
    adminRegister,
    adminLogin,
    adminRefresh,
    adminLogout,
    // State
    loading,
    error,
  };
};

export default useAuthService;