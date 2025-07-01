export interface Delivery {
  id: number
  customerName: string
  customerPhone: string
  address: string
  orderDate: string
  scheduledDate: string
  timeSlot: string
  status: "scheduled" | "in_progress" | "delivered" | "cancelled"
  driverName: string
  vehicleId: string
  progressPercentage: number
  eta: string
  hasIssue: boolean
  issueResolved?: boolean
  distance: number
}

export interface TimeSlot {
  id: string
  label: string
  count: number
}
