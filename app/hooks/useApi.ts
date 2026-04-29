import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import axiosClient from "../services/axiosClient";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient(config);
      return response.data as T;
    } catch (err) {
      let errorMessage = "Something went wrong";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
      setError(errorMessage);
       throw err;
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading, error };
};

export default useApi;