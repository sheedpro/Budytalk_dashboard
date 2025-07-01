import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
  import { useNavigate } from "react-router"
 
  
  const stats = [
    {
      title: "Total Products",
      value: "156",
      description: "Active products in inventory",
      icon: Package,
      trend: "+5.2%",
      url:'#'
    },
    {
      title: "Low Stock Items",
      value: "23",
      description: "Products below reorder point",
      icon: AlertTriangle,
      trend: "+12.3%",
      url:'/inventory/lowStock'
    },
    {
      title: "Top Performing",
      value: "45",
      description: "Products with high turnover",
      icon: TrendingUp,
      trend: "+8.1%",
      url:'/inventory/topPerforming'
    },
    {
      title: "Slow Moving",
      value: "12",
      description: "Products with low turnover",
      icon: TrendingDown,
      trend: "-2.5%",
      url:'/inventory/slowMoving'
    },
  ]
  
  export function InventoryStats() {
    const navigate = useNavigate()

    const handleCardClick=(url:string)=>{
        navigate(url)
    }



    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.trend.startsWith("+")
  
          return (
            <Card key={stat.title} className="cursor-pointer hover:border-b-red-100" onClick={()=>handleCardClick(stat.url)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div
                  className={`mt-2 text-xs ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend} from last month
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }
  
  