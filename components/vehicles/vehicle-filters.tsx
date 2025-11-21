"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function VehicleFilters() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-end">
      <div className="flex-1 space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by model or brand..." className="pl-9" />
        </div>
      </div>
      <div className="w-full space-y-2 md:w-48">
        <Label>Brand</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            <SelectItem value="tesla">Tesla</SelectItem>
            <SelectItem value="lucid">Lucid</SelectItem>
            <SelectItem value="porsche">Porsche</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full space-y-2 md:w-48">
        <Label>Price Range</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Any Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Price</SelectItem>
            <SelectItem value="under-50k">Under $50k</SelectItem>
            <SelectItem value="50k-100k">$50k - $100k</SelectItem>
            <SelectItem value="over-100k">Over $100k</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
