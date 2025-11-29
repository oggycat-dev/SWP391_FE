"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateDealer } from "@/hooks/use-dealers"
import type { Dealer } from "@/lib/api/dealers"

interface UpdateDealerDialogProps {
  dealer: Dealer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateDealerDialog({
  dealer,
  open,
  onOpenChange,
}: UpdateDealerDialogProps) {
  const updateDealer = useUpdateDealer()
  const [formData, setFormData] = useState({
    dealerName: dealer.dealerName,
    address: dealer.address,
    city: dealer.city,
    district: dealer.district,
    phoneNumber: dealer.phoneNumber,
    email: dealer.email,
    debtLimit: dealer.debtLimit,
  })

  // Reset form when dealer changes
  useEffect(() => {
    setFormData({
      dealerName: dealer.dealerName,
      address: dealer.address,
      city: dealer.city,
      district: dealer.district,
      phoneNumber: dealer.phoneNumber,
      email: dealer.email,
      debtLimit: dealer.debtLimit,
    })
  }, [dealer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await updateDealer.mutateAsync({
      id: dealer.id,
      ...formData,
    })
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Dealer</DialogTitle>
          <DialogDescription>
            Update dealer information. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Dealer Code - Read Only */}
            <div className="grid gap-2">
              <Label htmlFor="dealerCode">Dealer Code</Label>
              <Input
                id="dealerCode"
                value={dealer.dealerCode}
                disabled
                className="bg-muted"
              />
            </div>

            {/* Dealer Name */}
            <div className="grid gap-2">
              <Label htmlFor="dealerName">
                Dealer Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dealerName"
                value={formData.dealerName}
                onChange={(e) =>
                  setFormData({ ...formData, dealerName: e.target.value })
                }
                required
              />
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <Label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </div>

            {/* City & District */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="district">
                  District <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            {/* Debt Limit */}
            <div className="grid gap-2">
              <Label htmlFor="debtLimit">
                Debt Limit (VND) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="debtLimit"
                type="number"
                min="0"
                step="1000000"
                value={formData.debtLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    debtLimit: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateDealer.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateDealer.isPending}>
              {updateDealer.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

