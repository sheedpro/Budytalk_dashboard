
import { useState } from "react"
import { AlertTriangle } from 'lucide-react'
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

// Sample data for low stock products
const lowStockProducts = [
  {
    id: "PRD001",
    name: "Organic Tomatoes",
    category: "Vegetables",
    currentStock: 45,
    reorderPoint: 100,
    unit: "kg",
    lastRestocked: "2024-01-10",
    supplier: "Fresh Farms Inc.",
  },
  {
    id: "PRD002",
    name: "Fresh Lettuce",
    category: "Vegetables",
    currentStock: 30,
    reorderPoint: 80, 
    unit: "kg",
    lastRestocked: "2024-01-12",
    supplier: "Green Gardens Ltd.",
  },
  // Add more low stock products...
]

export function LowStockTable() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = lowStockProducts.filter((product) =>
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
              <TableHead>Current Stock</TableHead>
              <TableHead>Reorder Point</TableHead>
              <TableHead>Last Restocked</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {product.currentStock} {product.unit}
                </TableCell>
                <TableCell>
                  {product.reorderPoint} {product.unit}
                </TableCell>
                <TableCell>{product.lastRestocked}</TableCell>
                <TableCell>{product.supplier}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    Low Stock
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

