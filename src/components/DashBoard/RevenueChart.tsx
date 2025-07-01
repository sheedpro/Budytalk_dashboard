import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  
} from 'chart.js';
import { ChartOptions } from 'chart.js';
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);interface ChartData {
    [key: string]: {
      labels: string[];
      values: number[];
    };
  }

const RevenueChart = () => {
  const [timeframe, setTimeframe] = useState('daily');
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
  // Sample data for different timeframes
  const data:ChartData = {
    daily: {
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      values: Array.from({ length: 30 }, () => Math.floor(Math.random() * 3000 + 1000)),
    },
    weekly: {
      labels: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
      values: Array.from({ length: 12 }, () => Math.floor(Math.random() * 15000 + 5000)),
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50000 + 20000)),
    },
  };

//   const filteredData = startDate && endDate
//     ? {
//         labels: data[timeframe].labels.slice(0, 5), // Example: Slice to match date range
//         values: data[timeframe].values.slice(0, 5),
//       }
//     : data[timeframe];
  const chartData = {
    labels: data[timeframe].labels,
    datasets: [
      {
        label: 'Revenue',
        data: data[timeframe].values,
        fill: true,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      {
        label: 'Previous Period',
        data: data[timeframe].values.map(v => v * 0.8),
        fill: true,
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderDash: [5, 5],
      },
    ],
  };

  const options: ChartOptions<"line">= {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';

                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USh' }).format(context.parsed.y);
                }
                return label;
            }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number | string) {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USh",
              maximumSignificantDigits: 3,
            }).format(value as number);
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };
  

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
      {/* <div className="flex items-center gap-4 mb-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
          />
        </div> */}
        <div className=" w-full h-[400px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;