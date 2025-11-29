/**
 * Dealer Discount Policies React Hook
 * Custom hook for dealer discount policy management
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  dealerDiscountPoliciesApi, 
  type CreateDealerDiscountPolicyRequest, 
  type UpdateDealerDiscountPolicyRequest 
} from '@/lib/api/dealer-discount-policies'
import { useToast } from './use-toast'

export const useDealerDiscountPolicies = (params?: {
  dealerId?: string
  activeOnly?: boolean
}) => {
  return useQuery({
    queryKey: ['dealer-discount-policies', params],
    queryFn: () => dealerDiscountPoliciesApi.getDealerDiscountPolicies(params),
  })
}

export const useCreateDealerDiscountPolicy = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateDealerDiscountPolicyRequest) => 
      dealerDiscountPoliciesApi.createDealerDiscountPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-discount-policies'] })
      toast({
        title: 'Success',
        description: 'Discount policy created successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create discount policy',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateDealerDiscountPolicy = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealerDiscountPolicyRequest }) => 
      dealerDiscountPoliciesApi.updateDealerDiscountPolicy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-discount-policies'] })
      toast({
        title: 'Success',
        description: 'Discount policy updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update discount policy',
        variant: 'destructive',
      })
    },
  })
}

export const useDeleteDiscountPolicy = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) => dealerDiscountPoliciesApi.deleteDealerDiscountPolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-discount-policies'] })
      toast({
        title: 'Success',
        description: 'Discount policy deleted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to delete discount policy',
        variant: 'destructive',
      })
    },
  })
}

