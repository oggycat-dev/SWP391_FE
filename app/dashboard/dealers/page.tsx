"use client"

import { useState } from "react"
import { Plus, Search, MapPin, Phone, Mail, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_DEALERS } from "@/lib/mock-data"

export default function DealersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDealers = MOCK_DEALERS.filter(
    (dealer) =>
      dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dealer Management</h2>
          <p className="text-muted-foreground">Manage dealer network and information.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Dealer
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dealers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDealers.map((dealer) => (
          <Card key={dealer.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">{dealer.name}</CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {dealer.code}
                </div>
              </div>
              <Badge variant={dealer.status === "active" ? "default" : "secondary"}>{dealer.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm mt-2">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{dealer.address}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{dealer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{dealer.email}</span>
                </div>
                <div className="mt-2 pt-2 border-t flex justify-between items-center">
                  <span className="text-xs font-medium">Manager: {dealer.managerName}</span>
                  <Badge variant="outline">{dealer.region}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
