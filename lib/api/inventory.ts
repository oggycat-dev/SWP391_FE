import { apiClient } from "./client"
import type { Inventory } from "@/lib/types"

export const inventoryApi = {
  getAll: (params?: any) => apiClient.get<Inventory[]>("/inventory", params),
  getById: (id: string) => apiClient.get<Inventory>(`/inventory/${id}`),
  updateStatus: (id: string, status: string) => apiClient.put<Inventory>(`/inventory/${id}/status`, { status }),
  transfer: (id: string, targetLocation: string) =>
    apiClient.post<Inventory>(`/inventory/${id}/transfer`, { targetLocation }),
}
