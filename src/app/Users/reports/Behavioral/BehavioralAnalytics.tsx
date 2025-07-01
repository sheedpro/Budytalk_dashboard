import React, { useEffect, useState } from "react";
import {
  Download,
  Filter,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useBehavioralAnalytics } from './useBehavioralAnalyticsHook';

// Interfaces for data
interface CustomerBehavior {
  id: string;
  customerName: string;
  totalPurchases: number;
  averageOrderValue: number;
  lastPurchaseDate: string;
  purchaseFrequency: string;
  productPreference: string;
  timeSinceLastPurchase: string;
}

const BehavioralAnalytics: React.FC = () => {
  // Use the behavioral analytics hook
  const { fetchRawData, reportData } = useBehavioralAnalytics();

  // State management remains the same
  const [originalReportData, setOriginalReportData] = useState<CustomerBehavior[]>(reportData);
  const [filteredReportData, setFilteredReportData] = useState<CustomerBehavior[]>(reportData);
  const [customerSearch, setCustomerSearch] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCustomDateDialogOpen, setIsCustomDateDialogOpen] = useState<boolean>(false);

  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "Customer Name",
    "Total Purchases",
    "Avg. Order Value",
    "Last Purchase Date",
    "Purchase Frequency",
    "Product Preference",
    "Time Since Last Purchase",
  ]);

  // Fetch data on component mount
  useEffect(() => {
    fetchRawData();
  }, [fetchRawData]);

  // Update data when reportData changes
  useEffect(() => {
    setOriginalReportData(reportData);
    setFilteredReportData(reportData);
  }, [reportData]);

  // Customer search handler
  const handleCustomerSearch = (searchTerm: string) => {
    setCustomerSearch(searchTerm);
    const filteredData = originalReportData.filter((customer) =>
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReportData(filteredData);
  };

  const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
    if (type === 'csv') {
      // Convert reportData to CSV format
      const csvData = convertToCSV(filteredReportData, selectedColumns);

      // Create a download link
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'customer_data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (type === 'excel') {
      xlsxExport(filteredReportData, selectedColumns);
    } else if (type === 'pdf') {
      pdfExport(filteredReportData, selectedColumns);
    }
  };

  const convertToCSV = (data: CustomerBehavior[], columns: string[]): string => {
    const headers = columns.join(',');
    const rows = data.map(item => {
      return columns.map(column => {
        switch (column) {
          case 'Customer Name': return `"${item.customerName}"`;
          case 'Total Purchases': return `"${item.totalPurchases}"`;
          case 'Avg. Order Value': return `"${item.averageOrderValue}"`;
          case 'Last Purchase Date': return `"${item.lastPurchaseDate}"`;
          case 'Purchase Frequency': return `"${item.purchaseFrequency}"`;
          case 'Product Preference': return `"${item.productPreference}"`;
          case 'Time Since Last Purchase': return `"${item.timeSinceLastPurchase}"`;
          default: return '';
        }
      }).join(',');
    });

    return `${headers}\n${rows.join('\n')}`;
  };

  const xlsxExport = (data: CustomerBehavior[], columns: string[]) => {
    const wb = XLSX.utils.book_new();
    const ws_data = [
      columns, // Headers
      ...data.map(item => columns.map(column => {
        switch (column) {
          case 'Customer Name': return item.customerName;
          case 'Total Purchases': return item.totalPurchases;
          case 'Avg. Order Value': return item.averageOrderValue;
          case 'Last Purchase Date': return item.lastPurchaseDate;
          case 'Purchase Frequency': return item.purchaseFrequency;
          case 'Product Preference': return item.productPreference;
          case 'Time Since Last Purchase': return item.timeSinceLastPurchase;
          default: return '';
        }
      }))
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Customer Data");
    XLSX.writeFile(wb, "customer_data.xlsx");
  };

  const pdfExport = (data: CustomerBehavior[], columns: string[]) => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF();
      
      // Explicitly call autoTable as a separate function
      const tableColumn = columns;
      const tableRows: any[] = [];
  
      data.forEach(item => {
        const rowData = columns.map(column => {
          switch (column) {
            case 'Customer Name': return item.customerName;
            case 'Total Purchases': return item.totalPurchases.toString();
            case 'Avg. Order Value': return `$${item.averageOrderValue.toFixed(2)}`;
            case 'Last Purchase Date': return item.lastPurchaseDate;
            case 'Purchase Frequency': return item.purchaseFrequency;
            case 'Product Preference': return item.productPreference;
            case 'Time Since Last Purchase': return item.timeSinceLastPurchase;
            default: return '';
          }
        });
        tableRows.push(rowData);
      });
  
      // Use the imported autoTable function directly
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        styles: { 
          fontSize: 10,
          cellPadding: 3
        },
        headStyles: { 
          fillColor: [22, 160, 133],
          textColor: 255 
        }
      });
  
      doc.save('customer_data.pdf');
    } catch (error) {
      console.error('PDF Export Detailed Error:', error);
      alert('Failed to export PDF. Please check console for details.');
    }
  };

  const getDateRangeFromFilter = (filter: string): DateRange => {
    const today = new Date();
    const from = new Date();

    switch (filter) {
      case "last30":
        from.setDate(today.getDate() - 30);
        break;
      case "last90":
        from.setDate(today.getDate() - 90);
        break;
      case "thisYear":
        from.setMonth(0, 1); // January 1st of current year
        break;
      default:
        return { from: undefined, to: undefined };
    }

    return { from, to: today };
  };

  const handleDateRangeApply = (range: DateRange) => {
    if (!range.from || !range.to) {
      return;
    }

    const filteredData = originalReportData.filter((customer) => {
      const purchaseDate = new Date(customer.lastPurchaseDate);
      return range.from && range.to && purchaseDate >= range.from && purchaseDate <= range.to;
    });

    setFilteredReportData(filteredData);
    setIsCustomDateDialogOpen(false);
  };

  const handleCustomDateApply = () => {
    if (dateRange) {
      handleDateRangeApply(dateRange);
    }
  };
  

  return (
    <div className="bg-gray-50 dark:bg-gray-950 p-6 min-h-screen">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Behavioral Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customer Behavior Insights
          </p>
        </div>

        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <DropdownMenuItem
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleExport("csv")}
            >
              Export to CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleExport("excel")}
            >
              Export to Excel
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleExport("pdf")}
            >
              Export to PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        {/* Customer Search */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search Customers"
            value={customerSearch}
            onChange={(e) => handleCustomerSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>

        {/* Date Range Selector */}
        <Select
          onValueChange={(value) => {
            if (value === "custom") {
              setIsCustomDateDialogOpen(true);
            } else {
              const dateRange = getDateRangeFromFilter(value);
              handleDateRangeApply(dateRange);
            }
          }}
        >
          <SelectTrigger className="w-full md:w-1/3 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
            <SelectValue placeholder="Select Date Range" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <SelectItem
              value="last30"
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Last 30 Days
            </SelectItem>
            <SelectItem
              value="last90"
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Last 90 Days
            </SelectItem>
            <SelectItem
              value="thisYear"
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              This Year
            </SelectItem>
            <SelectItem
              value="custom"
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Custom Range
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Column Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <Filter className="mr-2 h-4 w-4" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            {[
              "Customer Name",
              "Total Purchases",
              "Avg. Order Value",
              "Last Purchase Date",
              "Purchase Frequency",
              "Product Preference",
              "Time Since Last Purchase",
            ].map((column) => (
              <DropdownMenuItem
                key={column}
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 text-gray-600 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-700"
                    checked={selectedColumns.includes(column)}
                    onChange={() => {
                      setSelectedColumns((prev) =>
                        prev.includes(column)
                          ? prev.filter((c) => c !== column)
                          : [...prev, column]
                      );
                    }}
                  />
                  {column}
                </label>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Custom Date Range Dialog */}
      <Dialog
        open={isCustomDateDialogOpen}
        onOpenChange={setIsCustomDateDialogOpen}
      >
        <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-200">
              Select Custom Date Range
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              className="text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsCustomDateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gray-700 dark:bg-gray-600 text-white hover:bg-gray-800 dark:hover:bg-gray-700"
              onClick={handleCustomDateApply}
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QuickBooks-Style Table */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                {selectedColumns.map((column) => (
                  <TableHead
                    key={column}
                    className="text-gray-700 dark:text-gray-200 font-semibold"
                  >
                    {column}
                  </TableHead>
                ))}
                {/* <TableHead className="text-right text-gray-700 dark:text-gray-200">
                  Actions
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReportData.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {selectedColumns.includes("Customer Name") && (
                    <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                      {row.customerName}
                    </TableCell>
                  )}
                  {selectedColumns.includes("Total Purchases") && (
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {row.totalPurchases}
                    </TableCell>
                  )}
                  {selectedColumns.includes("Avg. Order Value") && (
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      ${row.averageOrderValue.toFixed(2)}
                    </TableCell>
                  )}
                  {selectedColumns.includes("Last Purchase Date") && (
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {row.lastPurchaseDate}
                    </TableCell>
                  )}
                  {selectedColumns.includes("Purchase Frequency") && (
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {row.purchaseFrequency}
                    </TableCell>
                  )}
                  {selectedColumns.includes("Product Preference") && (
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {row.productPreference}
                    </TableCell>
                  )}
                  {selectedColumns.includes("Time Since Last Purchase") && (
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {row.timeSinceLastPurchase}
                    </TableCell>
                  )}
                  {/* <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => handleExport("excel")}
                        >
                          Export Customer Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehavioralAnalytics;