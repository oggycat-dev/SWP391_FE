/**
 * Dealer Detail Tabs Component
 * Enhanced dealer detail view with tabs for different management sections
 */

'use client'

import { Info, Users, DollarSign, Percent, FileText, Building2, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDealer } from '@/hooks/use-dealers'
import { DealerInfoTab } from './tabs/dealer-info-tab'
import { DealerStaffTab } from './tabs/dealer-staff-tab'
import { DealerDebtsTab } from './tabs/dealer-debts-tab'
import { DealerDiscountPoliciesTab } from './tabs/dealer-discount-policies-tab'
import { DealerContractsTab } from './tabs/dealer-contracts-tab'

interface DealerDetailTabsProps {
  dealerId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DealerDetailTabs({ dealerId, open, onOpenChange }: DealerDetailTabsProps) {
  const { data: dealer, isLoading } = useDealer(dealerId || '')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1600px] max-h-[95vh] p-0 gap-0 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-16 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-64 bg-muted rounded animate-pulse" />
          </div>
        ) : dealer ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b bg-gradient-to-r from-primary/5 to-primary/10 px-8 py-6 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-full hover:bg-background/80"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 border-2 border-primary/20">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{dealer.dealerName}</h2>
                    <Badge 
                      variant={dealer.status === 'Active' ? 'default' : 'secondary'}
                      className="text-sm px-3 py-1"
                    >
                      {dealer.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-mono font-medium bg-background/50 px-3 py-1 rounded-md">
                      {dealer.dealerCode}
                    </span>
                    <span>•</span>
                    <span>{dealer.city}</span>
                    <span>•</span>
                    <span>{dealer.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
              <div className="border-b px-8 bg-background/50">
                <TabsList className="h-auto bg-transparent p-0 gap-1">
                  <TabsTrigger 
                    value="info" 
                    className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg px-4 py-3"
                  >
                    <Info className="h-4 w-4" />
                    <span className="font-medium">Information</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="staff" 
                    className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg px-4 py-3"
                  >
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Staff</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="debts" 
                    className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg px-4 py-3"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Debts</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="discounts" 
                    className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg px-4 py-3"
                  >
                    <Percent className="h-4 w-4" />
                    <span className="font-medium">Discount Policies</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contracts" 
                    className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg px-4 py-3"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Contracts</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/20">
                <div className="px-8 py-6">
                  <TabsContent value="info" className="m-0">
                    <DealerInfoTab dealer={dealer} />
                  </TabsContent>

                  <TabsContent value="staff" className="m-0">
                    <DealerStaffTab dealerId={dealer.id} dealerName={dealer.dealerName} />
                  </TabsContent>

                  <TabsContent value="debts" className="m-0">
                    <DealerDebtsTab dealerId={dealer.id} dealerName={dealer.dealerName} />
                  </TabsContent>

                  <TabsContent value="discounts" className="m-0">
                    <DealerDiscountPoliciesTab dealerId={dealer.id} dealerName={dealer.dealerName} />
                  </TabsContent>

                  <TabsContent value="contracts" className="m-0">
                    <DealerContractsTab dealerId={dealer.id} dealerName={dealer.dealerName} />
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-24">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">Dealer not found</p>
            <p className="text-sm text-muted-foreground mt-2">The dealer you're looking for doesn't exist</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

