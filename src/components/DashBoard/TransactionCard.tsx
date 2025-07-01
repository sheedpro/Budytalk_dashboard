import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

// Types for our data
interface OptionsTransaction {
  id: string;
  status: 'Paid' | 'Pending';
  issuedBy: string;
  submissionDate: string;
  fairMarketValue: number;
  exercisePrice: number;
  shares: number;
  gainLoss?: number;
  cost: number;
  taxes: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'Ush',
  }).format(value);
};

// const formatLargeNumber = (value: number) => {
//   return new Intl.NumberFormat('en-US').format(value);
// };

// Row Card Component
const TransactionCard = ({ transaction }: { transaction: OptionsTransaction }) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-200 to-purple-100 rounded" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg">
                 williams bought 100kgs of tomato
                </h3>
                <Badge 
                  variant='destructive'
                  className={`${
                    transaction.status === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {transaction.status}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {transaction.submissionDate}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {transaction.gainLoss && (
                <span className="text-green-600">
                  {formatCurrency(transaction.gainLoss)}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Cost: {formatCurrency(transaction.cost)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-6 gap-4 mt-4 text-sm">
        <div>
            <div className="text-gray-500">TransactionId</div>
            <div className="font-medium">32423525</div>
          </div>
          <div>
            <div className="text-gray-500">Payee</div>
            <div className="font-medium">Favor</div>
          </div>
          <div>
            <div className="text-gray-500">fee</div>
            <div className="font-medium">{formatCurrency(transaction.fairMarketValue)}</div>
          </div>
          <div>
            <div className="text-gray-500">details</div>
            <div className="font-medium">paid last</div>
          </div>
          <div>
            <div className="text-gray-500">Taxes</div>
            <div className="font-medium">{formatCurrency(transaction.taxes)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default TransactionCard