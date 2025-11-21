import { apiClient } from "./client"
import type { Order } from "@/lib/types"

export const ordersApi = {
  getAll: (params?: any) => apiClient.get<Order[]>("/orders", params),
  getById: (id: string) => apiClient.get<Order>(`/orders/${id}`),
  create: (data: Partial<Order>) => apiClient.post<Order>("/orders", data),
  update: (id: string, data: Partial<Order>) => apiClient.put<Order>(`/orders/${id}`, data),
  delete: (id: string) => apiClient.delete(`/orders/${id}`),
}
