import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Legend
);

interface TimeframeData {
  labels?: string[];
  values?: number[];
}
interface NewOrdersChartProps {
  daily: TimeframeData;
  monthy: TimeframeData;
  weekly: TimeframeData;
}
const MonthlyOrdersChart:React.FC<NewOrdersChartProps>= ({daily,monthy}) => {
  const [timeframe, setTimeframe] = useState('daily');

  // Sample data for different timeframes
  const data: Record<string,TimeframeData> = {
    daily: {
      labels: daily?.labels?.slice(-30) ?? [],
      values: daily?.values ?? [],
    },
    weekly: {
      labels: Array.from({ length: 5 }, (_, i) => `Week ${i + 1}`),
      // values: weekly?.values?.slice(-5) ?? [],
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: monthy?.values ??[],
    },
  };

  const chartData = {
    labels: data[timeframe].labels,
    datasets: [
      {
        label: 'New Orders',
        data: data[timeframe].values,
        fill: false,
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
      }
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString() + ' orders';
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
          callback: function(value) {
            return value.toLocaleString() + ' orders';
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Monthly Orders</CardTitle>
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
        <div className="w-full h-[400px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyOrdersChart;