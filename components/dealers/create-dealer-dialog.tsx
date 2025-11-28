/**
 * Create/Edit Dealer Dialog Component
 */

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateDealer } from '@/hooks/use-dealers'

const dealerSchema = z.object({
  dealerCode: z.string().min(3, 'Dealer code must be at least 3 characters'),
  dealerName: z.string().min(3, 'Dealer name must be at least 3 characters'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  district: z.string().min(2, 'District is required'),
  phoneNumber: z.string().regex(/^[0-9]{10,11}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  debtLimit: z.number().min(0, 'Debt limit must be positive'),
})

type DealerFormData = z.infer<typeof dealerSchema>

interface CreateDealerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CITIES = [
  'Ho Chi Minh City',
  'Hanoi',
  'Da Nang',
  'Can Tho',
  'Hai Phong',
  'Bien Hoa',
  'Nha Trang',
  'Vung Tau',
]

export function CreateDealerDialog({ open, onOpenChange }: CreateDealerDialogProps) {
  const createDealer = useCreateDealer()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DealerFormData>({
    resolver: zodResolver(dealerSchema),
    defaultValues: {
      debtLimit: 0,
    },
  })

  const selectedCity = watch('city')

  useEffect(() => {
    if (!open) {
      reset({
        dealerCode: '',
        dealerName: '',
        address: '',
        city: '',
        district: '',
        phoneNumber: '',
        email: '',
        debtLimit: 0,
      })
    }
  }, [open, reset])

  const onSubmit = async (data: DealerFormData) => {
    try {
      await createDealer.mutateAsync(data)
      onOpenChange(false)
      reset()
    } catch (error) {
      console.error('Error saving dealer:', error)
    }
  }

  const isLoading = createDealer.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Dealer</DialogTitle>
          <DialogDescription>
            Add a new dealer to the network
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Dealer Code */}
            <div className="space-y-2">
              <Label htmlFor="dealerCode">
                Dealer Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dealerCode"
                placeholder="D001"
                {...register('dealerCode')}
              />
              {errors.dealerCode && (
                <p className="text-sm text-red-500">{errors.dealerCode.message}</p>
              )}
            </div>

            {/* Dealer Name */}
            <div className="space-y-2">
              <Label htmlFor="dealerName">
                Dealer Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dealerName"
                placeholder="EV Dealer Saigon Center"
                {...register('dealerName')}
              />
              {errors.dealerName && (
                <p className="text-sm text-red-500">{errors.dealerName.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">
              Address <span className="text-red-500">*</span>
            </Label>
            <Input id="address" placeholder="123 Le Loi Street" {...register('address')} />
            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedCity}
                onValueChange={(value: string) => setValue('city', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label htmlFor="district">
                District <span className="text-red-500">*</span>
              </Label>
              <Input id="district" placeholder="District 1" {...register('district')} />
              {errors.district && <p className="text-sm text-red-500">{errors.district.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input id="phoneNumber" placeholder="0901234567" {...register('phoneNumber')} />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="dealer@example.com"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          {/* Debt Limit */}
          <div className="space-y-2">
            <Label htmlFor="debtLimit">
              Debt Limit (VND) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="debtLimit"
              type="number"
              placeholder="1000000000"
              {...register('debtLimit', { valueAsNumber: true })}
            />
            {errors.debtLimit && (
              <p className="text-sm text-red-500">{errors.debtLimit.message}</p>
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
              Create Dealer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
