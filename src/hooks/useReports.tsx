import{ useState } from 'react'
import { apiRequests } from '@/context/apiRequests'

// interface OrdersReportSummary {
//   total_orders: number
//   total_revenue: string
//   orders_by_status: {
//     delivered: number
//     pending: number
//     confirmed: number
//     dispatched: number
//     canceled: number
//   }
//   payment_methods: {
//     [key: string]: number
//   }
//   orders_per_day: {
//     [key: string]: number
//   }
//   delivered_orders: number
//   other_orders: number
// }

interface Order {
  id: number
  user_id: number
  shipping_address: string
  status: string
  total_price: string
  payment_method: string | null
  created_at: string
  updated_at: string
  delivery_slot_id: number | null
  delivery_date: string
  time_slot: string
  payment_status: string | null
  stage: string
  priority_score: number | null
  priority_level: string | null
  order_number: string
}

// interface OrdersReportResponse {
//   summary: OrdersReportSummary
//   orders: {
//     current_page: number
//     data: Order[]
//     first_page_url: string
//     from: number
//     last_page: number
//     last_page_url: string
//     next_page_url: string | null
//     path: string
//     per_page: number
//     prev_page_url: string | null
//     to: number
//     total: number
//     links: Array<{
//       url: string | null
//       label: string
//       active: boolean
//     }>
//   }
// }

export default function useReports() {
  const [ordersReport, setOrdersReport] = useState<Order[] | []>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeFrame, setTimeFrame] = useState('')
  const [status, setStatus] = useState('')
  const [userType, setUserType] = useState('')
  const [farm, setFarm] = useState('')

  const fetchOrdersReport = async () => {
    setLoading(true)
    try {
      const response = await apiRequests.getOrdersReport({ timeFrame, status, userType, farm })
      setOrdersReport(response.orders?.data)
      console.log(response.orders.data)
    } catch (error) {
      setError(error as string)
    } finally {
      setLoading(false)
    }
  }

  return {
    ordersReport,
    loading,
    error,
    timeFrame,
    status,
    userType,
    farm,
    fetchOrdersReport,
    setTimeFrame,
    setStatus,
    setUserType,
    setFarm
  }
}
