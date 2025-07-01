import { Card, CardContent } from '@/components/ui/card';

type cardTypesChart ={
    _title: string,
    total: number,
    trend: number,
  
}
export default function ChartCard({_title,total,trend}:cardTypesChart) {
  console.log({_title,total,trend})
    const isPositive = trend > 0;
  
    return (
      <Card className="w-full  bg-white p-4">
        <CardContent className="p-0 w-full">
          <div className="text-sm text-gray-500 mb-1">{_title}</div>
          <div className="flex flex-col">
            <span className="text-4xl font-semibold text-gray-900">{typeof total === 'number' ? total.toLocaleString() : '0'}</span>
            <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
             {trend?.toString().startsWith('-') ? '▼':'▲' }   {trend}%
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

