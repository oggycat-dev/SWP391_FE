"use client"

import { useState } from "react"
import { Plus, Search, Tag, Calendar, Percent, DollarSign } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_PROMOTIONS } from "@/lib/mock-data"

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPromotions = MOCK_PROMOTIONS.filter((promo) =>
    promo.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Promotions</h2>
          <p className="text-muted-foreground">Manage sales campaigns and discounts.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search promotions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredPromotions.map((promo) => (
          <Card key={promo.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    {promo.name}
                  </CardTitle>
                  <CardDescription>{promo.description}</CardDescription>
                </div>
                <Badge variant={promo.status === "active" ? "default" : "outline"}>{promo.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                  <div className="flex items-center gap-2">
                    {promo.discountType === "percentage" ? (
                      <Percent className="h-5 w-5 text-primary" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-primary" />
                    )}
                    <span className="font-medium">Discount Value</span>
                  </div>
                  <span className="text-xl font-bold">
                    {promo.discountType === "percentage"
                      ? `${promo.discountValue}%`
                      : `$${promo.discountValue.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Start: {format(new Date(promo.startDate), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>End: {format(new Date(promo.endDate), "MMM dd, yyyy")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
