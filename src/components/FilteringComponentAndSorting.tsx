import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, SortDesc } from 'lucide-react';
// import { DatePickerWithRange } from '@/components/ui/date-range-picker';

interface FiltersProps {
  onSearchChange: (column: string, value: string) => void;
  onFilterChange: (filters: unknown) => void;
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  onSortChange: (sort: string) => void;
}

export default function Filters({
  onSearchChange,
  onFilterChange,
  onSortChange
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-4 p-4 ">
      <div className="flex gap-2">
        {/* Search By Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              <Search className="mr-2 h-4 w-4" />
              Search by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuLabel>
              <Input 
                placeholder="Basket ID"
                onChange={(e) => onSearchChange('basket_id', e.target.value)}
                className="w-full"
              />
            </DropdownMenuLabel>
            
            <DropdownMenuLabel>
              <Input 
                placeholder="Buyer's Name"
                onChange={(e) => onSearchChange('buyer_name', e.target.value)}
                className="w-full"
              />
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <Input 
                placeholder="Product"
                onChange={(e) => onSearchChange('buyerName', e.target.value)}
                className="w-full"
              />
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <Input 
                placeholder="Location"
                onChange={(e) => onSearchChange('location', e.target.value)}
                className="w-full"
              />
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter By Dropdown */}
        <Select onValueChange={onFilterChange}>
          <SelectTrigger className="w-[220px]">
          <Filter className="h-4 w-4" />
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Today"> Today</SelectItem>
            <SelectItem value="last hour">last hour</SelectItem>
            <SelectItem value="last minute">last minute</SelectItem>
            
          </SelectContent>
        </Select>
        

        {/* Date Range Picker */}
        {/* <DatePickerWithRange 
          onChange={(range) => {
            if (range?.from && range?.to) {
              onDateRangeChange(range);
            }
          }}
        /> */}

        {/* Sort By Dropdown */}
        <Select onValueChange={onSortChange}>
          <SelectTrigger className="w-[220px]">
            <SortDesc className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quantity-high">Quantity: High to Low</SelectItem>
            <SelectItem value="quantity-low">Quantity: Low to High</SelectItem>
            <SelectItem value="amount-high">Amount: High to Low</SelectItem>
            <SelectItem value="amount-low">Amount: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}