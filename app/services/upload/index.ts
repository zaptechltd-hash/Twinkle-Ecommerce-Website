import useApi from "../../hooks/useApi";
import { UploadEndpointsV1 } from "./constants";
import type { PresignedUrlResponse, PresignedUrlPayload } from "./types";

const useUploadService = () => {
  const { callApi, loading, error } = useApi();

  const getPresignedUrl = async (payload: PresignedUrlPayload) => {
    return await callApi<PresignedUrlResponse>({
      method: "post",
      url:    UploadEndpointsV1.presign,
      data:   payload,
    });
  };

  return { getPresignedUrl, loading, error };
};

export default useUploadService;