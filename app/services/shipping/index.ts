import useApi from "../../hooks/useApi";
import { ShippingEndpointsV1 } from "./constants";
import type { ShippingCity } from "./types";

const useShippingService = () => {
  const { callApi, loading, error } = useApi();

  const getCities = async () => {
    return await callApi<ShippingCity[]>({
      method: "get",
      url: ShippingEndpointsV1.cities,
    });
  };

  return {
    getCities,
    loading,
    error,
  };
};

export default useShippingService;