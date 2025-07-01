import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users, TrendingUp, Target, BarChart3 } from 'lucide-react';
import ReportLayout from '../components/ReportLayout';
import DataCard from '../components/DataCard';
import { GenderData } from '../components/types';
import { apiRequests } from '@/context/apiRequests';

export default function GenderBreakdown() {
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<{ title: string; description: string }[]>([]);

  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        const response = await apiRequests.get('reports/demographics/gender-distribution');
        const data = response.data.map((item: { name: string; value: number }) => ({
          ...item,
          color: getColor(item.name)
        }));
        setGenderData(data);
        generateInsights(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gender distribution data:", error);
        setLoading(false);
      }
    };

    fetchGenderData();
  }, []);

  const getColor = (gender: string) => {
    const colors = {
      'Male': '#3b82f6',
      'Female': '#ec4899',
      'Non-binary': '#8b5cf6',
      'Other': '#10b981'
    };
    return colors[capitalize(gender) as keyof typeof colors] || '#cccccc';
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const generateInsights = (data: GenderData[]) => {
    if (data.length === 0) return;
    const dominantGender = data.reduce((prev, current) => (prev.value > current.value) ? prev : current);
    const genderGap = Math.abs(data[0].value - data[1].value);
    const diversityScore = 100 - Math.abs(50 - data[0].value) - Math.abs(50 - data[1].value);

    const insightsList = [
      {
        title: "Dominant Gender",
        description: `${dominantGender.name} represents the largest portion of users at ${dominantGender.value}%.`
      },
      {
        title: "Gender Gap",
        description: `The difference between the two largest gender groups is ${genderGap}%.`
      },
      {
        title: "Diversity Score",
        description: `The gender diversity score is ${diversityScore}, indicating a ${diversityScore > 70 ? 'high' : 'moderate'} level of diversity.`
      }
    ];
    setInsights(insightsList);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ReportLayout
      title="Gender Breakdown"
      description="Analysis of user base by gender identity"
      category="Demographic Insights"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DataCard
          title="Total Users Analyzed"
          value={genderData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
          icon={<Users size={18} />}
          color="blue"
        />
        <DataCard
          title="Dominant Gender"
          value={insights[0]?.description || 'N/A'}
          icon={<Target size={18} />}
          color="purple"
        />
        <DataCard
          title="Gender Gap"
          value={insights[1]?.description || 'N/A'}
          icon={<TrendingUp size={18} />}
          color="green"
        />
        <DataCard
          title="Gender Diversity Score"
          value={insights[2]?.description || 'N/A'}
          icon={<BarChart3 size={18} />}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Gender Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="55%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563' }} 
                  itemStyle={{ color: '#d1d5db' }} 
                  formatter={(value) => `${value}%`} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Key Insights</h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{insight.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ReportLayout>
  );
}
