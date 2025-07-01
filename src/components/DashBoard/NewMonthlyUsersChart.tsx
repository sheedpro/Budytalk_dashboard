import React, { useState, useEffect } from 'react';
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
import { TimeframeData } from '@/app/dashboard/DashBoard'; // Import TimeframeData from Dashboard

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface NewUsersChartProps {
  daily: TimeframeData;
  monthy: TimeframeData;
  weekly: TimeframeData;
}

const NewUsersChart: React.FC<NewUsersChartProps> = ({ daily, monthy, weekly }) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [{
      label: 'New Users',
      data: [],
      fill: false,
      borderColor: '#2563eb',
      backgroundColor: '#2563eb',
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 5,
    }]
  });

  // Process the data based on its type
  useEffect(() => {
    let labels: string[] = [];
    let values: number[] = [];

    switch (timeframe) {
      case 'daily':
        if (daily) {
          labels = [daily.date];
          values = [daily.value];
        }
        break;
      case 'weekly':
        if (weekly) {
          labels = [weekly.date];
          values = [weekly.value];
        }
        break;
      case 'monthly':
        if (monthy) {
          labels = [monthy.date];
          values = [monthy.value];
        }
        break;
    }

    setChartData({
      labels,
      datasets: [{
        label: 'New Users',
        data: values,
        fill: false,
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
      }]
    });
  }, [timeframe, daily, weekly, monthy]);

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
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString() + ' users';
            }
            return label;
          },
        },
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
          callback: function (value) {
            return value.toLocaleString() + ' users';
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
        <CardTitle className="text-lg font-medium">New Users Growth</CardTitle>
        <Select value={timeframe} onValueChange={(value) => setTimeframe(value as 'daily' | 'weekly' | 'monthly')}>
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

export default NewUsersChart;