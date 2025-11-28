/**
 * Dealer Contracts React Hook
 * Custom hook for dealer contract management
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  dealerContractsApi,
  type DealerContractDto,
  type CreateDealerContractRequest,
  type UpdateDealerContractStatusRequest,
  DealerContractStatus,
} from '@/lib/api/dealer-contracts'
import { useToast } from './use-toast'

export const useDealerContracts = (params?: {
  dealerId?: string
  status?: DealerContractStatus
}) => {
  return useQuery({
    queryKey: ['dealer-contracts', params],
    queryFn: () => dealerContractsApi.getDealerContracts(params),
  })
}

export const useDealerContract = (id: string) => {
  return useQuery({
    queryKey: ['dealer-contract', id],
    queryFn: () => dealerContractsApi.getDealerContractById(id),
    enabled: !!id,
  })
}

export const useCreateDealerContract = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateDealerContractRequest) =>
      dealerContractsApi.createDealerContract(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-contracts'] })
      toast({
        title: 'Success',
        description: 'Dealer contract created successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create dealer contract',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateDealerContractStatus = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealerContractStatusRequest }) =>
      dealerContractsApi.updateDealerContractStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-contracts'] })
      queryClient.invalidateQueries({ queryKey: ['dealer-contract'] })
      toast({
        title: 'Success',
        description: 'Contract status updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update contract status',
        variant: 'destructive',
      })
    },
  })
}
