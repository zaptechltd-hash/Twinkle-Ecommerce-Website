export const AuthEndpointsV1 = {
  adminRegister: "/auth/admin/register",
  adminLogin: "/auth/admin/login",
  adminRefresh: "/auth/admin/refresh",
  adminLogout: "/auth/admin/logout",

  customerRegister: "/auth/customer/register",
  customerLogin: "/auth/customer/login",
  customerRefresh: "/auth/customer/refresh",
  customerLogout: "/auth/customer/logout",
} as const;