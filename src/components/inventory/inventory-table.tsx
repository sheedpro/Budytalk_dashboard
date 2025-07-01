"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Extended sample data
const inventory = Array.from({ length: 50 }, (_, i) => ({
  id: `PRD${String(i + 1).padStart(3, '0')}`,
  name: [
    "Organic Tomatoes",
    "Fresh Lettuce",
    "Carrots",
    "Potatoes",
    "Red Onions",
    "Bell Peppers",
    "Cucumbers",
    "Sweet Corn"
  ][Math.floor(Math.random() * 8)],
  category: ["Vegetables", "Fruits", "Herbs", "Root Vegetables"][
    Math.floor(Math.random() * 4)
  ],
  quantity: Math.floor(Math.random() * 500) + 50,
  unit: "kg",
  status: ["In Stock", "Low Stock", "Out of Stock"][Math.floor(Math.random() * 3)],
  reorderPoint: 100,
}))

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "In Stock", label: "In Stock" },
  { value: "Low Stock", label: "Low Stock" },
  { value: "Out of Stock", label: "Out of Stock" },
]

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function InventoryTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")

  const itemsPerPage = 10

  // Filter inventory based on search query and status
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInventory = filteredInventory.slice(startIndex, startIndex + itemsPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle status filter change
  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button> */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reorder Point</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  {item.quantity} {item.unit}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      item.status === "In Stock"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Low Stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {item.status}
                  </Badge>
                  {item.quantity < item.reorderPoint && (
                    <AlertTriangle className="ml-2 inline-block h-4 w-4 text-yellow-500" />
                  )}
                </TableCell>
                <TableCell>{item.reorderPoint} {item.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredInventory.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

