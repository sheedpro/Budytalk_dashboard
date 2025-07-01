import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Briefcase, Target } from 'lucide-react';
import ReportLayout from '../components/ReportLayout';
import DataCard from '../components/DataCard';
import { apiRequests } from '@/context/apiRequests';

export default function OccupationAnalysis() {
  const [occupationData, setOccupationData] = useState<{ data: { job_title: string; percentage: number }[]; totalUsers: number; dominantOccupation: string; occupationGap: number; diversityScore: number; insights: { title: string; description: string }[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOccupationData = async () => {
      try {
        const response = await apiRequests.get('reports/demographics/occupation-insights');
        setOccupationData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching occupation insights data:", error);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchOccupationData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (occupationData?.data.length === 0) {
    return (
      <ReportLayout
        title="Occupation Analysis"
        description="Analysis of user occupation distribution"
        category="Demographic Insights"
      >
        <div>No data available</div>
      </ReportLayout>
    );
  }

  const totalUsers = occupationData?.totalUsers ?? 0;
  const dominantOccupation = occupationData?.dominantOccupation ?? 'N/A';
  const occupationGap = occupationData?.occupationGap ?? 0;
  const insights = occupationData?.insights ?? [];

  return (
    <ReportLayout
      title="Occupation Analysis"
      description="Analysis of user occupation distribution"
      category="Demographic Insights"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DataCard
          title="Total Users Analyzed"
          value={totalUsers.toLocaleString()}
          icon={<Briefcase size={18} />}
          color="green"
        />
        <DataCard
          title="Dominant Occupation"
          value={dominantOccupation}
          change={{ value: `${occupationGap}`, positive: true }}
          icon={<Target size={18} />}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Occupation Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={occupationData?.data || []}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="job_title" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563' }} 
                  itemStyle={{ color: '#d1d5db' }} 
                  formatter={(value, _name) => [`${value}%`, 'Percentage']} 
                />
                <Legend />
                <Bar dataKey="percentage" name="Percentage" fill="#8884d8" />
              </BarChart>
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