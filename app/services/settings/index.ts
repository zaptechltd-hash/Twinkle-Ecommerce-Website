import useApi from "../../hooks/useApi";
import { SettingsEndpointsV1 } from "./constants";
import type { Settings, UpdateSettingsPayload } from "./types";

const useSettingsService = () => {
  const { callApi, loading, error } = useApi();

  const getSettings = async () => {
    return await callApi<Settings>({
      method: "get",
      url: SettingsEndpointsV1.settings,
    });
  };

  const updateSettings = async (payload: UpdateSettingsPayload) => {
    return await callApi<Settings>({
      method: "put",
      url: SettingsEndpointsV1.settings,
      data: payload,
    });
  };

  return {
    getSettings,
    updateSettings,
    loading,
    error,
  };
};

export default useSettingsService;