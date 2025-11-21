import { apiClient } from "./client"
import type { Vehicle } from "@/lib/types"

export const vehiclesApi = {
  getAll: (params?: any) => apiClient.get<Vehicle[]>("/vehicles", params),
  getById: (id: string) => apiClient.get<Vehicle>(`/vehicles/${id}`),
  create: (data: Partial<Vehicle>) => apiClient.post<Vehicle>("/vehicles", data),
  update: (id: string, data: Partial<Vehicle>) => apiClient.put<Vehicle>(`/vehicles/${id}`, data),
  delete: (id: string) => apiClient.delete(`/vehicles/${id}`),
}
