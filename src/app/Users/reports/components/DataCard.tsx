import { ReactNode } from 'react';

interface DataCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    positive: boolean;
  } | null;
  icon?: ReactNode;
  color?: string;
  className?: string;
}

export default function DataCard({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'blue',
  className = ''
}: DataCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    red: 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300',
    orange: 'bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    yellow: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
    pink: 'bg-pink-50 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 ${className}`}>
      <div className="flex items-center mb-3">
        {icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} mr-3`}>
            {icon}
          </div>
        )}
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          {change && (
            <div className={`flex items-center mt-1 text-sm ${change.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              <span className="mr-1">
                {change.positive ? '↑' : '↓'}
              </span>
              <span>{change.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}