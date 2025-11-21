import { apiClient } from "./client"
import type { Customer } from "@/lib/types"

export const customersApi = {
  getAll: (params?: any) => apiClient.get<Customer[]>("/customers", params),
  getById: (id: string) => apiClient.get<Customer>(`/customers/${id}`),
  create: (data: Partial<Customer>) => apiClient.post<Customer>("/customers", data),
  update: (id: string, data: Partial<Customer>) => apiClient.put<Customer>(`/customers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/customers/${id}`),
}
