/**
 * Create Dealer Contract Dialog Component
 */

'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, CalendarIcon } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useCreateDealerContract } from '@/hooks/use-dealer-contracts'
import { useDealers } from '@/hooks/use-dealers'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

const contractSchema = z.object({
  dealerId: z.string().min(1, 'Please select a dealer'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  terms: z.string().min(10, 'Contract terms must be at least 10 characters'),
  commissionRate: z.number().min(0).max(100, 'Commission rate must be between 0 and 100'),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
})

type ContractFormData = z.infer<typeof contractSchema>

interface CreateDealerContractDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDealerContractDialog({
  open,
  onOpenChange,
}: CreateDealerContractDialogProps) {
  const createContract = useCreateDealerContract()
  const { data: dealersData } = useDealers({ pageSize: 100 })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      commissionRate: 5,
    },
  })

  const selectedDealerId = watch('dealerId')
  const startDate = watch('startDate')
  const endDate = watch('endDate')

  useEffect(() => {
    if (!open) {
      reset({
        dealerId: '',
        startDate: undefined,
        endDate: undefined,
        terms: '',
        commissionRate: 5,
      })
    }
  }, [open, reset])

  const onSubmit = async (data: ContractFormData) => {
    try {
      await createContract.mutateAsync({
        dealerId: data.dealerId,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        terms: data.terms,
        commissionRate: data.commissionRate,
      })
      onOpenChange(false)
      reset()
    } catch (error) {
      console.error('Error creating contract:', error)
    }
  }

  const isLoading = createContract.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Dealer Contract</DialogTitle>
          <DialogDescription>
            Create a new contract agreement with a dealer
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Dealer Selection */}
          <div className="space-y-2">
            <Label htmlFor="dealerId">
              Dealer <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedDealerId}
              onValueChange={(value: string) => setValue('dealerId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dealer" />
              </SelectTrigger>
              <SelectContent>
                {dealersData?.items?.map((dealer) => (
                  <SelectItem key={dealer.id} value={dealer.id}>
                    {dealer.dealerName} ({dealer.dealerCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.dealerId && (
              <p className="text-sm text-red-500">{errors.dealerId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label>
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => setValue('startDate', date as Date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>
                End Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => setValue('endDate', date as Date)}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Commission Rate */}
          <div className="space-y-2">
            <Label htmlFor="commissionRate">
              Commission Rate (%) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="commissionRate"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="5.0"
              {...register('commissionRate', { valueAsNumber: true })}
            />
            {errors.commissionRate && (
              <p className="text-sm text-red-500">{errors.commissionRate.message}</p>
            )}
          </div>

          {/* Terms */}
          <div className="space-y-2">
            <Label htmlFor="terms">
              Contract Terms <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="terms"
              placeholder="Enter contract terms and conditions..."
              rows={6}
              {...register('terms')}
            />
            {errors.terms && (
              <p className="text-sm text-red-500">{errors.terms.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Contract
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
