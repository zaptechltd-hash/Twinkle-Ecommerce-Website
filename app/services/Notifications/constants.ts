export const NotificationEndpointsV1 = {
  all:        '/notifications',
  markRead:   (id: string) => `/notifications/${id}/read`,
  markAllRead: '/notifications/mark-all-read',
} as const;