/**
 * Dealer Staff React Hook
 * Custom hook for dealer staff management
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  dealerStaffApi, 
  type CreateDealerStaffRequest, 
  type UpdateDealerStaffRequest 
} from '@/lib/api/dealer-staff'
import { useToast } from './use-toast'

export const useDealerStaff = (dealerId?: string) => {
  return useQuery({
    queryKey: ['dealer-staff', dealerId],
    queryFn: () => dealerStaffApi.getDealerStaff(dealerId),
    enabled: !!dealerId,
  })
}

export const useAddDealerStaff = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateDealerStaffRequest) => dealerStaffApi.addDealerStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-staff'] })
      toast({
        title: 'Success',
        description: 'Staff member added successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to add staff member',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateDealerStaff = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealerStaffRequest }) => 
      dealerStaffApi.updateDealerStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-staff'] })
      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update staff member',
        variant: 'destructive',
      })
    },
  })
}

export const useDeleteDealerStaff = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) => dealerStaffApi.deleteDealerStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-staff'] })
      toast({
        title: 'Success',
        description: 'Staff member removed successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to remove staff member',
        variant: 'destructive',
      })
    },
  })
}

