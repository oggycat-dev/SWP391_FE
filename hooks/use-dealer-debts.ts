/**
 * React Query hooks for Dealer Debts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dealerDebtsApi } from '@/lib/api/dealer-debts'
import type { CreateDealerDebtRequest, PayDealerDebtRequest } from '@/lib/types/dealer'
import { useToast } from './use-toast'

const QUERY_KEYS = {
  dealerDebts: (dealerId?: string) => 
    dealerId ? ['dealer-debts', dealerId] : ['dealer-debts'],
  dealerDebt: (id: string) => ['dealer-debt', id],
}

/**
 * Hook to fetch all dealer debts
 */
export function useDealerDebts(dealerId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.dealerDebts(dealerId),
    queryFn: () => dealerDebtsApi.getDealerDebts(dealerId),
  })
}

/**
 * Hook to fetch a single dealer debt by ID
 */
export function useDealerDebt(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.dealerDebt(id!),
    queryFn: () => dealerDebtsApi.getDealerDebtById(id!),
    enabled: !!id,
  })
}

/**
 * Hook to create a new dealer debt
 */
export function useCreateDealerDebt() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateDealerDebtRequest) =>
      dealerDebtsApi.createDealerDebt(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dealerDebts() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dealerDebts(variables.dealerId) })
      queryClient.invalidateQueries({ queryKey: ['dealers'] })
      toast({
        title: 'Success',
        description: 'Dealer debt created successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create dealer debt',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook to record payment for a dealer debt
 */
export function usePayDealerDebt() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PayDealerDebtRequest }) =>
      dealerDebtsApi.payDealerDebt(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dealerDebts() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dealerDebts(result.dealerId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dealerDebt(result.id) })
      queryClient.invalidateQueries({ queryKey: ['dealers'] })
      toast({
        title: 'Success',
        description: 'Payment recorded successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to record payment',
        variant: 'destructive',
      })
    },
  })
}
