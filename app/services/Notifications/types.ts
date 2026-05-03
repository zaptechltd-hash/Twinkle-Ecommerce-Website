// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType = 'order' | 'payment' | 'stock' | 'review' | 'customer';

export interface Notification {
  id:         string;
  type:       NotificationType;
  message:    string;
  read:       boolean;
  resourceId: string | null;
  createdAt:  string;
}

export interface NotificationsResponse {
  data:        Notification[];
  total:       number;
  unreadCount: number;
}

export interface NotificationQueryParams {
  unread?: boolean;
}