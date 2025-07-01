import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users, TrendingUp, TrendingDown, Target, AlertTriangle, Award, ArrowUpRight } from 'lucide-react';
import ReportLayout from '../components/ReportLayout';
import DataCard from '../components/DataCard';
import { DemographicData } from '../components/types';
import { apiRequests } from '@/context/apiRequests';

export default function AgeDistribution() {
  const [ageData, setAgeData] = useState<DemographicData[]>([]);
  const [previousAgeData, setPreviousAgeData] = useState<DemographicData[]>([]);
  const [, setMonthlyAgeData] = useState<DemographicData[]>([]);
  const [insights, setInsights] = useState<{title: string; description: string; icon: string; priority: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgeData = async () => {
      try {
        const [currentResponse, previousResponse, monthlyResponse] = await Promise.all([
          apiRequests.get('reports/demographics/age-distribution?period=24h'),
          apiRequests.get('reports/demographics/age-distribution?period=48h'),
          apiRequests.get('reports/demographics/age-distribution?period=30d')
        ]);
        
        const currentData = currentResponse.data;
        const previousData = previousResponse.data;
        const monthlyData = monthlyResponse.data;
        
        setAgeData(currentData);
        setPreviousAgeData(previousData);
        setMonthlyAgeData(monthlyData);
        
        // Generate insights once we have all data
        const generatedInsights = generateInsights(currentData, previousData, monthlyData);
        setInsights(generatedInsights);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching age distribution data:", error);
        setLoading(false);
      }
    };

    fetchAgeData();
  }, []);

  // Function to generate insights automatically based on the data
  const generateInsights = (
    currentData: DemographicData[], 
    previousData: DemographicData[],
    monthlyData: DemographicData[]
  ) => {
    const insights = [];
    
    // Find dominant age group
    const dominantGroup = currentData.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current);
    
    insights.push({
      title: "Primary Audience",
      description: `The ${dominantGroup.name} age group represents your largest user segment at ${dominantGroup.value}%.`,
      icon: "Award",
      priority: 1
    });
    
    // Find fastest growing segment
    const growthData = currentData.map((group, index) => {
      const previousValue = previousData[index]?.value || 0;
      const monthlyValue = monthlyData[index]?.value || 0;
      const dailyGrowth = ((group.value - previousValue) / previousValue) * 100;
      const monthlyGrowth = ((group.value - monthlyValue) / monthlyValue) * 100;
      
      return {
        name: group.name,
        dailyGrowth,
        monthlyGrowth
      };
    });
    
    const fastestGrowingDaily = growthData.reduce((prev, current) => 
      (prev.dailyGrowth > current.dailyGrowth) ? prev : current);
    
    if (fastestGrowingDaily.dailyGrowth > 1) {
      insights.push({
        title: "Growth Opportunities",
        description: `The ${fastestGrowingDaily.name} age group shows strong growth with an increase of ${fastestGrowingDaily.dailyGrowth.toFixed(1)}% in the last 24 hours.`,
        icon: "TrendingUp",
        priority: 2
      });
    }
    
    // Find underrepresented segments (less than 15%)
    const underrepresented = currentData.filter(group => group.value < 15);
    
    if (underrepresented.length > 0) {
      // Sort by value ascending
      underrepresented.sort((a, b) => a.value - b.value);
      
      insights.push({
        title: "Underrepresented Segments",
        description: `Users aged ${underrepresented.map(g => g.name).join(', ')} make up only ${underrepresented.reduce((sum, g) => sum + g.value, 0).toFixed(1)}% of your user base, representing opportunities for targeted marketing.`,
        icon: "AlertTriangle",
        priority: 3
      });
    }
    
    // Detect significant changes (more than 5% change)
    const significantChanges = growthData.filter(g => Math.abs(g.monthlyGrowth) > 5);
    
    if (significantChanges.length > 0) {
      // Sort by absolute change descending
      significantChanges.sort((a, b) => Math.abs(b.monthlyGrowth) - Math.abs(a.monthlyGrowth));
      
      const direction = significantChanges[0].monthlyGrowth > 0 ? "increase" : "decrease";
      
      insights.push({
        title: "Significant Shift Detected",
        description: `The ${significantChanges[0].name} age group has seen a ${Math.abs(significantChanges[0].monthlyGrowth).toFixed(1)}% ${direction} over the past month.`,
        icon: significantChanges[0].monthlyGrowth > 0 ? "ArrowUpRight" : "TrendingDown",
        priority: 4
      });
    }
    
    // Generate recommended actions based on insights
    let actions = [];
    
    if (dominantGroup) {
      actions.push(`Develop targeted content for the ${dominantGroup.name} age group`);
    }
    
    if (fastestGrowingDaily && fastestGrowingDaily.dailyGrowth > 1) {
      actions.push(`Create engagement strategies for the growing ${fastestGrowingDaily.name} segment`);
    }
    
    if (underrepresented.length > 0) {
      actions.push(`Investigate barriers to adoption for users ${underrepresented.map(g => g.name).join(', ')}`);
    }
    
    if (actions.length > 0) {
      insights.push({
        title: "Recommended Actions",
        description: actions.join('. ') + '.',
        icon: "Target",
        priority: 5
      });
    }
    
    // Sort insights by priority
    return insights.sort((a, b) => a.priority - b.priority);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Helper function to check if a timestamp is within the last 24 hours
  const isWithin24Hours = (timestamp: string) => {
    const now = new Date();
    const createdDate = new Date(timestamp);
    const diffInHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  const totalUsers = ageData.reduce((sum, item) => sum + item.value, 0);
  const dominantGroup = ageData.reduce((prev, current) => (prev.value > current.value) ? prev : current);
  const youngestGroup = ageData[0];
  const oldestGroup = ageData[ageData.length - 1];

  const getChange = (currentValue: number, previousValue: number) => {
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return change.toFixed(1);
  };

  const youngestGroupPrevious = previousAgeData[0];
  const oldestGroupPrevious = previousAgeData[previousAgeData.length - 1];

  const youngestChange = getChange(youngestGroup.value, youngestGroupPrevious.value);
  const oldestChange = getChange(oldestGroup.value, oldestGroupPrevious.value);

  // Get trend information for youngest group
  const youngestTrend = () => {
    // Check if created_at exists and is recent
    if (!youngestGroup.created_at) return { isRecent: false, isPositive: false };
    
    const isRecent = isWithin24Hours(youngestGroup.created_at);
    const isPositive = parseFloat(youngestChange) > 0;
    
    return { isRecent, isPositive };
  };

  // Get trend information for oldest group
  const oldestTrend = () => {
    // Check if created_at exists and is recent
    if (!oldestGroup.created_at) return { isRecent: false, isPositive: false };
    
    const isRecent = isWithin24Hours(oldestGroup.created_at);
    const isPositive = parseFloat(oldestChange) > 0;
    
    return { isRecent, isPositive };
  };

  const youngestTrendInfo = youngestTrend();
  const oldestTrendInfo = oldestTrend();

  // Helper function to render the correct icon component
  const renderIcon = (iconName: string, size: number = 18) => {
    switch (iconName) {
      case 'Users': return <Users size={size} />;
      case 'TrendingUp': return <TrendingUp size={size} />;
      case 'TrendingDown': return <TrendingDown size={size} />;
      case 'Target': return <Target size={size} />;
      case 'AlertTriangle': return <AlertTriangle size={size} />;
      case 'Award': return <Award size={size} />;
      case 'ArrowUpRight': return <ArrowUpRight size={size} />;
      default: return <Users size={size} />;
    }
  };

  return (
    <ReportLayout
      title="Age Distribution"
      description="Analysis of user base by age groups"
      category="Demographic Insights"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DataCard
          title="Total Users Analyzed"
          value={totalUsers.toLocaleString()}
          icon={<Users size={18} />}
          color="blue"
        />
        <DataCard
          title="Dominant Age Group"
          value={dominantGroup.name}
          change={{ value: `${dominantGroup.value}%`, positive: true }}
          icon={<Target size={18} />}
          color="purple"
        />
        <DataCard
          title="Youngest Segment"
          value={`${youngestGroup.value}%`}
          change={
            youngestTrendInfo.isRecent 
              ? { 
                  value: `${youngestChange}% vs 24 hours ago`, 
                  positive: youngestTrendInfo.isPositive 
                } 
              : null
          }
          icon={
            youngestTrendInfo.isRecent 
              ? (youngestTrendInfo.isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />)
              : <Users size={18} />
          }
          color="green"
        />
        <DataCard
          title="Oldest Segment"
          value={`${oldestGroup.value}%`}
          change={
            oldestTrendInfo.isRecent 
              ? { 
                  value: `${oldestChange}% vs 24 hours ago`, 
                  positive: oldestTrendInfo.isPositive 
                } 
              : null
          }
          icon={
            oldestTrendInfo.isRecent 
              ? (oldestTrendInfo.isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />)
              : <Users size={18} />
          }
          color="red"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Age Distribution Chart</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="55%"
                  labelLine={true}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
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
                <div className="flex items-center mb-2">
                  <span className="mr-2">{renderIcon(insight.icon)}</span>
                  <h4 className="font-medium text-gray-900 dark:text-white">{insight.title}</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {insight.description}
                </p>
              </div>
            ))}
            
            {insights.length === 0 && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">No Insights Available</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Not enough data to generate meaningful insights at this time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ReportLayout>
  );
}