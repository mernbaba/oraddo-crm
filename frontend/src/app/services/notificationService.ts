import api from "../api";

// Real PostgreSQL model: notification (no id field in definition — Sequelize adds it)
export interface ApiNotification {
  id: number;
  type: string;
  message: string;
  userId?: number;
  adminId?: number;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export const notificationService = {
  getAll: () => api.get<ApiNotification[]>("/api/notifications"),
  getForAdmin: (adminId: number) =>
    api.get<ApiNotification[]>(`/api/notifications/${adminId}`),
  markRead: (id: number) => api.post(`/api/notifications/${id}/read`, {}),
  delete: (id: number) => api.delete(`/api/notifications/${id}`),
  create: (data: Partial<ApiNotification>) =>
    api.post<ApiNotification>("/api/notifications", data),
};
