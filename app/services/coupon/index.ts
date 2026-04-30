import useApi from "../../hooks/useApi";
import { CouponEndpointsV1 } from "./constants";
import type {
  ValidateCouponPayload,
  ValidateCouponResponse,
  CreateCouponPayload,
  CreateCouponResponse,
  FindAllCouponsResponse,
  ToggleCouponResponse,
} from "./types";

const useCouponService = () => {
  const { callApi, loading, error } = useApi();

  const validateCoupon = async (payload: ValidateCouponPayload) => {
    return await callApi<ValidateCouponResponse>({
      method: "post",
      url: CouponEndpointsV1.validate,
      data: payload,
    });
  };

  const findAllCoupons = async () => {
    return await callApi<FindAllCouponsResponse>({
      method: "get",
      url: CouponEndpointsV1.findAll,
    });
  };

  const createCoupon = async (payload: CreateCouponPayload) => {
    return await callApi<CreateCouponResponse>({
      method: "post",
      url: CouponEndpointsV1.create,
      data: payload,
    });
  };

  const toggleCoupon = async (id: string) => {
    return await callApi<ToggleCouponResponse>({
      method: "patch",
      url: CouponEndpointsV1.toggle(id),
    });
  };

  const removeCoupon = async (id: string) => {
    return await callApi({
      method: "delete",
      url: CouponEndpointsV1.remove(id),
    });
  };

  return {
    validateCoupon,
    findAllCoupons,
    createCoupon,
    toggleCoupon,
    removeCoupon,
    loading,
    error,
  };
};

export default useCouponService;