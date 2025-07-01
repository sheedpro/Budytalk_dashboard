import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// const topProducts = [
//   { name: 'Organic Tomatoes', current: 1200, previous: 1000, trend: 'up', category: 'Vegetables' },
//   { name: 'Fresh Lettuce', current: 1100, previous: 950, trend: 'up', category: 'Vegetables' },
//   { name: 'Sweet Corn', current: 900, previous: 920, trend: 'down', category: 'Vegetables' },
//   { name: 'Bell Peppers', current: 850, previous: 800, trend: 'up', category: 'Vegetables' },
//   { name: 'Carrots', current: 800, previous: 810, trend: 'down', category: 'Vegetables' },
// ];

// const decliningProductst = [
//   { name: 'Radishes', current: 200, previous: 400, trend: 'down', category: 'Vegetables' },
//   { name: 'Turnips', current: 180, previous: 300, trend: 'down', category: 'Root Vegetables' },
//   { name: 'Beets', current: 150, previous: 250, trend: 'down', category: 'Root Vegetables' },
//   { name: 'Kohlrabi', current: 120, previous: 200, trend: 'down', category: 'Vegetables' },
//   { name: 'Rutabaga', current: 100, previous: 180, trend: 'down', category: 'Root Vegetables' },
// ];

const monthlyData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const highDemandData = [1200, 1250, 1300, 1350, 1400, 1450];
const lowDemandData = [200, 180, 160, 140, 120, 100];
export type productsTrendTypes ={
  mostDemandedProducts:[]
}
interface Product {
  id: number;
  name: string;
  category: string;
  quantityRemaining: string;
  numberOfOrders: number;
  lastMonthOrders: string;
  previousMonthOrders: string;
  lastThreeMonthsOrders: string;
  previousThreeMonthsOrders: string;
  lastSixMonthsOrders: string;
  previousSixMonthsOrders: string;
  lastYearOrders: string;
  previousYearOrders: string;
  monthlyChange: number;
  quarterlyChange: number;
  halfYearlyChange: number;
  yearlyChange: number;
}
const ProductTrendsDashboard:React.FC<productsTrendTypes> = ({mostDemandedProducts}) => {
  const [timeRange, setTimeRange] = useState('1m');

  const getTrendIcon = (trend: number) => {
    if (trend > 5) {
      return <ArrowUp className="text-green-500" />;
    } else if (trend < 5) {
      return <ArrowDown className="text-red-500" />;
    } else {
      return <Minus className="text-gray-500" />;
    }
  };

  const calculateChange = (current:number, previous:number) => {
    const change = ((current - previous) / previous) * 100;

    console.log({change,current,previous});
    return change.toFixed(1);
  };
  
  const decliningProducts = mostDemandedProducts.filter(
    (product: Product) => Number(product.lastSixMonthsOrders) < 2
  );
  
//this is to get the orders per timestamp
const  getOrdersPerTimestep =(product:Product,timeRange:string)=>{
switch(timeRange){
  case '1y':
    return product.lastYearOrders
  case '2y':
  case '6m':
    return product.lastSixMonthsOrders
  case '3m':
    return product.lastThreeMonthsOrders
  case '1m':
    return product.lastMonthOrders;
  default:
    return product.numberOfOrders
}
}
  // Chart.js options and data configurations
  const lineChartOptions:ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Demand Trends Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const lineChartData = {
    labels: monthlyData,
    datasets: [
      {
        label: 'High Demand Products',
        data: highDemandData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      },
      {
        label: 'Low Demand Products',
        data: lowDemandData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4
      }
    ]
  };

  const barChartOptions:ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Current vs Previous Period'
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };

  const barChartData = {
    labels: [...mostDemandedProducts, ...decliningProducts]?.map((product:Product) => product.name),
    datasets: [
      {
        label: 'Current Period',
        data: [...mostDemandedProducts, ...decliningProducts]?.map((product:Product) => product.previousSixMonthsOrders),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
      },
      {
        label: 'Previous Period',
        data: [...mostDemandedProducts, ...decliningProducts]?.map((product:Product) => product.lastSixMonthsOrders),
        backgroundColor: 'rgba(148, 163, 184, 0.6)',
      }
    ]
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1 Month</SelectItem>
            <SelectItem value="3m">3 Months</SelectItem>
            <SelectItem value="6m">6 Months</SelectItem>
            <SelectItem value="1y">1 Year  </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Performing Products */}
        <Card>
          <CardHeader>
            <CardTitle>Most Demanded Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                                  

            {mostDemandedProducts.map((product: Product, index) => (
        <div key={product.id || index} className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center gap-2">
          {getTrendIcon(Number(product.lastThreeMonthsOrders))}
            <div>
              <span className="font-medium">{product.name}</span>
              <span className="text-sm text-gray-500 block">{product.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            
            <span className={`text-sm ${calculateChange(Number(product.previousThreeMonthsOrders),Number(product.lastThreeMonthsOrders)) >= '0' ? 'text-green-500' : 'text-red-500'}`}>
              {calculateChange(Number(product.previousThreeMonthsOrders),Number(product.lastThreeMonthsOrders))}%
            </span>
            <div>
            <span className="font-bold">{product.quantityRemaining}</span>
            <span className="text-sm text-gray-500 block">{getOrdersPerTimestep(product,timeRange)}</span>
            </div>
           
          </div>
        </div>
      ))}
            </div>
          </CardContent>
        </Card>

        {/* Declining Products */}
        <Card>
          <CardHeader>
            <CardTitle>Declining Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {decliningProducts.map((product:Product) => (
                <div key={product.id} className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(Number(product.lastThreeMonthsOrders))}
                    <div>
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-gray-500 block">{product.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-red-500">
                      {}%
                    </span>
                    <span className="font-bold">{}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Demand Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <Line options={lineChartOptions} data={lineChartData} />
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Product Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <Bar options={barChartOptions} data={barChartData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductTrendsDashboard;