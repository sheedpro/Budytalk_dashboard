"use client"

import { useState } from "react"
import { TrendingUp } from 'lucide-react'
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

// Sample data for top performing products
const topPerformingProducts = [
  {
    id: "PRD003",
    name: "Premium Potatoes",
    category: "Root Vegetables",
    sales: 2500,
    revenue: 7500,
    growth: "+25%",
    turnoverRate: "4.2 days",
    profit: "$3,750",
  },
  {
    id: "PRD004",
    name: "Fresh Carrots",
    category: "Root Vegetables",
    sales: 2200,
    revenue: 6600,
    growth: "+22%",
    turnoverRate: "4.5 days",
    profit: "$3,300",
  },
  // Add more top performing products...
]

export function TopPerformingTable() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = topPerformingProducts.filter((product) =>
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
              <TableHead>Sales</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Growth</TableHead>
              <TableHead>Turnover Rate</TableHead>
              <TableHead>Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.sales}</TableCell>
                <TableCell>${product.revenue}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    <TrendingUp className="mr-1 h-4 w-4" />
                    {product.growth}
                  </Badge>
                </TableCell>
                <TableCell>{product.turnoverRate}</TableCell>
                <TableCell>{product.profit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

