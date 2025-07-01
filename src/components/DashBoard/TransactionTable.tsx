import TransactionCard from "./TransactionCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
interface OptionsTransaction {
  id: string;
  status: "Paid" | "Pending";
  issuedBy: string;
  submissionDate: string;
  fairMarketValue: number;
  exercisePrice: number;
  shares: number;
  gainLoss?: number;
  cost: number;
  taxes: number;
}

const TransactionTable = () => {
  const transactions: OptionsTransaction[] = [
    {
      id: "C-21",
      status: "Paid",
      issuedBy: "Coda",
      submissionDate: "Nov 5, 2023",
      fairMarketValue: 0.2,
      exercisePrice: 0.12,
      shares: 100000,
      gainLoss: 20000.0,
      cost: 12500.0,
      taxes: 0.0,
    },
    {
      id: "C-23",
      status: "Pending",
      issuedBy: "Coda",
      submissionDate: "Nov 5, 2024",
      fairMarketValue: 0.2,
      exercisePrice: 0.12,
      shares: 20000,
      cost: 2400.0,
      taxes: 0.0,
    },
  ];

  return (
    <div className="space-y-4 mt-4">
      <p className="text-lg font-medium">Transaction History</p>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="date"
            className="border rounded p-2"
            defaultValue="2023-12-06"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            className="border rounded p-2"
            defaultValue="2024-11-06"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Export
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default TransactionTable;
