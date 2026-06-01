import api from "../api";

export interface ApiCoupon {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchase?: number | null;
  maxDiscount?: number | null;
  usageLimit: number;
  usageCount: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
  applicablePlans: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const couponService = {
  getAll: () => api.get<ApiCoupon[]>("/api/coupons"),
  getById: (id: number) => api.get<{ data: ApiCoupon }>(`/api/coupons/${id}`),
  create: (data: Partial<ApiCoupon>) => api.post<{ message: string; data: ApiCoupon }>("/api/coupons", data),
  update: (id: number, data: Partial<ApiCoupon>) => api.put<{ message: string; data: ApiCoupon }>(`/api/coupons/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/api/coupons/${id}`),
};
