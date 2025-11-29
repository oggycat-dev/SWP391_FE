"use client"

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Info, Users, DollarSign, Percent, FileText, Building2, MapPin, Phone, Mail, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDealer } from '@/hooks/use-dealers'
import { DealerInfoTab } from '@/components/dealers/tabs/dealer-info-tab'
import { DealerStaffTab } from '@/components/dealers/tabs/dealer-staff-tab'
import { DealerDebtsTab } from '@/components/dealers/tabs/dealer-debts-tab'
import { DealerDiscountPoliciesTab } from '@/components/dealers/tabs/dealer-discount-policies-tab'
import { DealerContractsTab } from '@/components/dealers/tabs/dealer-contracts-tab'
import { UpdateDealerDialog } from '@/components/dealers/update-dealer-dialog'

export default function DealerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dealerId = params.id as string

  const { data: dealer, isLoading } = useDealer(dealerId)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="h-12 bg-muted rounded animate-pulse" />
        <div className="h-32 bg-muted rounded animate-pulse" />
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (!dealer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Building2 className="h-20 w-20 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Dealer Not Found</h2>
          <p className="text-muted-foreground mb-4">The dealer you're looking for doesn't exist</p>
          <Button onClick={() => router.push('/dashboard/dealers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dealers
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {/* Back Button */}
      <div>
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard/dealers')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dealers
        </Button>
      </div>

      {/* Dealer Header Card */}
      <div className="rounded-xl border bg-gradient-to-br from-card to-card/50 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
          <div className="flex items-start gap-6">
            {/* Dealer Icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border-2 border-primary/20 shadow-lg">
              <Building2 className="h-10 w-10 text-primary" />
            </div>

            {/* Dealer Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{dealer.dealerName}</h1>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="outline" className="font-mono text-base px-3 py-1">
                      {dealer.dealerCode}
                    </Badge>
                    <Badge 
                      variant={dealer.status === 'Active' ? 'default' : 'secondary'}
                      className="text-sm px-3 py-1"
                    >
                      {dealer.status}
                    </Badge>
                  </div>
                </div>
                <Button 
                  onClick={() => setUpdateDialogOpen(true)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Update Dealer
                </Button>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/50">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{dealer.city}, {dealer.district}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/50">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{dealer.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/50">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium truncate">{dealer.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="rounded-xl border bg-card shadow-sm">
        <Tabs defaultValue="info" className="w-full">
          <div className="border-b px-6 py-3 bg-muted/30">
            <TabsList className="h-auto bg-transparent p-0 gap-1">
              <TabsTrigger 
                value="info" 
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2.5"
              >
                <Info className="h-4 w-4" />
                <span className="font-medium">Information</span>
              </TabsTrigger>
              <TabsTrigger 
                value="staff" 
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2.5"
              >
                <Users className="h-4 w-4" />
                <span className="font-medium">Staff</span>
              </TabsTrigger>
              <TabsTrigger 
                value="debts" 
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2.5"
              >
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">Debts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="discounts" 
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2.5"
              >
                <Percent className="h-4 w-4" />
                <span className="font-medium">Discount Policies</span>
              </TabsTrigger>
              <TabsTrigger 
                value="contracts" 
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2.5"
              >
                <FileText className="h-4 w-4" />
                <span className="font-medium">Contracts</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
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
        </Tabs>
      </div>

      {/* Update Dealer Dialog */}
      {dealer && (
        <UpdateDealerDialog
          dealer={dealer}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
        />
      )}
    </div>
  )
}

