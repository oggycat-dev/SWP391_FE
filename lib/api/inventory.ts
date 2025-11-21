import { apiClient } from "./client"
import type { InventoryItem } from "@/lib/types"

export const inventoryApi = {
  getAll: (params?: any) => apiClient.get<InventoryItem[]>("/inventory", params),
  getById: (id: string) => apiClient.get<InventoryItem>(`/inventory/${id}`),
  updateStatus: (id: string, status: string) => apiClient.put<InventoryItem>(`/inventory/${id}/status`, { status }),
  transfer: (id: string, targetLocation: string) =>
    apiClient.post<InventoryItem>(`/inventory/${id}/transfer`, { targetLocation }),
}
