/**
 * Dealers React Hook
 * Custom hook for dealer management
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dealersApi, type CreateDealerRequest, type UpdateDealerRequest } from '@/lib/api/dealers'
import { useToast } from './use-toast'

export const useDealers = (params?: {
  status?: string
  city?: string
  pageNumber?: number
  pageSize?: number
  searchTerm?: string
}) => {
  return useQuery({
    queryKey: ['dealers', params],
    queryFn: () => dealersApi.getDealers(params),
  })
}

export const useDealer = (id: string) => {
  return useQuery({
    queryKey: ['dealer', id],
    queryFn: () => dealersApi.getDealerById(id),
    enabled: !!id,
  })
}

export const useCreateDealer = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateDealerRequest) => dealersApi.createDealer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealers'] })
      toast({
        title: 'Success',
        description: 'Dealer created successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create dealer',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateDealer = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: UpdateDealerRequest) => dealersApi.updateDealer(data),
    onSuccess: (_data: unknown, variables: UpdateDealerRequest) => {
      queryClient.invalidateQueries({ queryKey: ['dealers'] })
      queryClient.invalidateQueries({ queryKey: ['dealer', variables.id] })
      toast({
        title: 'Success',
        description: 'Dealer updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update dealer',
        variant: 'destructive',
      })
    },
  })
}

export const useDeleteDealer = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) => dealersApi.deleteDealer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealers'] })
      toast({
        title: 'Success',
        description: 'Dealer deleted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to delete dealer',
        variant: 'destructive',
      })
    },
  })
}

export const useDealerDebt = (id: string) => {
  return useQuery({
    queryKey: ['dealer-debt', id],
    queryFn: () => dealersApi.getDealerDebt(id),
    enabled: !!id,
  })
}
