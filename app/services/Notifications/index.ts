import useApi from "../../hooks/useApi";
import { NotificationEndpointsV1 } from "./constants";
import type {
  Notification,
  NotificationsResponse,
  NotificationQueryParams,
} from "./types";

const useNotificationService = () => {
  const { callApi, loading, error } = useApi();

  const getNotifications = async (params?: NotificationQueryParams) => {
    return await callApi<NotificationsResponse>({
      method: "get",
      url: NotificationEndpointsV1.all,
      params,
    });
  };

  const markRead = async (id: string) => {
    return await callApi<void>({
      method: "patch",
      url: NotificationEndpointsV1.markRead(id),
    });
  };

  const markAllRead = async () => {
    return await callApi<void>({
      method: "patch",
      url: NotificationEndpointsV1.markAllRead,
    });
  };

  return {
    getNotifications,
    markRead,
    markAllRead,
    loading,
    error,
  };
};

export default useNotificationService;