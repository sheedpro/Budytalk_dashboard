import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export default function OrderTableSkeleton() {
    const loadingRows = Array.from({length:10},(_,i)=>i)
  return (
    <div className="w-full">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12"></TableHead>
          <TableHead className="w-24">Order ID</TableHead>
          <TableHead className="w-48">Customer</TableHead>
          <TableHead className="w-64">Items</TableHead>
          <TableHead className="w-32">Total</TableHead>
          <TableHead className="w-32">Status</TableHead>
          <TableHead className="w-48">Delivery Date</TableHead>
          <TableHead className="w-48">Created</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loadingRows.map((row) => (
          <TableRow key={row} className="border-b border-gray-200">
            <TableCell>
              <Skeleton className="h-5 w-5 rounded-full bg-gray-200" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-12 bg-gray-200" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full max-w-36 bg-gray-200" />
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-3/4 bg-gray-200" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-16 bg-gray-200" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full max-w-36 bg-gray-200" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full max-w-36 bg-gray-200" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-8 rounded-md bg-gray-200" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
  )
}
