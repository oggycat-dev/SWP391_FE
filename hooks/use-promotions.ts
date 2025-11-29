/**
 * React Query hooks for Promotions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { promotionsApi } from '@/lib/api/promotions'
import type { 
  CreatePromotionRequest, 
  UpdatePromotionRequest,
  UpdatePromotionStatusRequest,
  PromotionStatus
} from '@/lib/types/promotion'
import { useToast } from './use-toast'

const QUERY_KEYS = {
  promotions: (filters?: { status?: PromotionStatus; fromDate?: string; toDate?: string }) => 
    filters ? ['promotions', filters] : ['promotions'],
  promotion: (id: string) => ['promotion', id],
}

/**
 * Hook to fetch all promotions
 */
export function usePromotions(params?: {
  status?: PromotionStatus
  fromDate?: string
  toDate?: string
}) {
  return useQuery({
    queryKey: QUERY_KEYS.promotions(params),
    queryFn: () => promotionsApi.getPromotions(params),
  })
}

/**
 * Hook to fetch a single promotion by ID
 */
export function usePromotion(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.promotion(id!),
    queryFn: () => promotionsApi.getPromotionById(id!),
    enabled: !!id,
  })
}

/**
 * Hook to create a new promotion
 */
export function useCreatePromotion() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreatePromotionRequest) =>
      promotionsApi.createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
      toast({
        title: 'Success',
        description: 'Promotion created successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create promotion',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to update a promotion
 */
export function useUpdatePromotion() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePromotionRequest }) =>
      promotionsApi.updatePromotion(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.promotion(result.id) })
      toast({
        title: 'Success',
        description: 'Promotion updated successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update promotion',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to update promotion status
 */
export function useUpdatePromotionStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePromotionStatusRequest }) =>
      promotionsApi.updatePromotionStatus(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.promotion(result.id) })
      toast({
        title: 'Success',
        description: 'Promotion status updated successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update promotion status',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to delete a promotion
 */
export function useDeletePromotion() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) => promotionsApi.deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
      toast({
        title: 'Success',
        description: 'Promotion deleted successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete promotion',
        variant: 'destructive',
      })
    },
  })
}
