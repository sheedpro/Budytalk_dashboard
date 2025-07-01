"use client"

import { useState } from "react"
import { TrendingDown } from 'lucide-react'
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample data for slow moving products
const slowMovingProducts = [
  {
    id: "PRD005",
    name: "Exotic Herbs",
    category: "Herbs",
    daysInStock: 45,
    lastSale: "2023-12-01",
    currentStock: 200,
    suggestedAction: "Discount",
    value: "$600",
  },
  {
    id: "PRD006",
    name: "Specialty Mushrooms",
    category: "Vegetables",
    daysInStock: 38,
    lastSale: "2023-12-08",
    currentStock: 150,
    suggestedAction: "Promote",
    value: "$750",
  },
  // Add more slow moving products...
]

export function SlowMovingTable() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = slowMovingProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Days in Stock</TableHead>
              <TableHead>Last Sale</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Suggested Action</TableHead>
              <TableHead>Stock Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800"
                  >
                    <TrendingDown className="mr-1 h-4 w-4" />
                    {product.daysInStock} days
                  </Badge>
                </TableCell>
                <TableCell>{product.lastSale}</TableCell>
                <TableCell>{product.currentStock}</TableCell>
                <TableCell>{product.suggestedAction}</TableCell>
                <TableCell>{product.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

