/**
 * Dealer Debts React Hook
 * Custom hook for dealer debt management
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  dealerDebtsApi, 
  type CreateDealerDebtRequest, 
  type PayDealerDebtRequest 
} from '@/lib/api/dealer-debts'
import { useToast } from './use-toast'

export const useDealerDebts = (dealerId?: string) => {
  return useQuery({
    queryKey: ['dealer-debts', dealerId],
    queryFn: () => dealerDebtsApi.getDealerDebts(dealerId),
    enabled: !!dealerId,
  })
}

export const useDealerDebt = (id: string) => {
  return useQuery({
    queryKey: ['dealer-debt', id],
    queryFn: () => dealerDebtsApi.getDealerDebtById(id),
    enabled: !!id,
  })
}

export const useCreateDealerDebt = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateDealerDebtRequest) => dealerDebtsApi.createDealerDebt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-debts'] })
      toast({
        title: 'Success',
        description: 'Dealer debt created successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create dealer debt',
        variant: 'destructive',
      })
    },
  })
}

export const usePayDealerDebt = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PayDealerDebtRequest }) => 
      dealerDebtsApi.payDealerDebt(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-debts'] })
      queryClient.invalidateQueries({ queryKey: ['dealer-debt'] })
      toast({
        title: 'Success',
        description: 'Payment recorded successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to record payment',
        variant: 'destructive',
      })
    },
  })
}

