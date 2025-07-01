import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type buyersData={
    buyerId: string;
    p_full_name: string;
    email: string;
    p_phone: string;
    location: string;
    image_url: string;
    p_physical_address: string;
    buyerCreatedAt: string;
    totalNumberOfOrders: number;
  }[];
/**
 *  {
                "buyerId": 5,
                "p_full_name": "Alex Gimei",
                "email": "gimeialez@gmail.com",
                "image_url": "storage/sellerAvatar/1735037146_cb1075e9-7d47-4a33-90e0-165cddc36f46.jpeg",
                "p_physical_address": "Namugongo, Kampala, Uganda",
                "p_phone": "+256788185681",
                "buyerCreatedAt": "2024-12-24 13:45:46",
                "totalNumberOfOrders": 1
            },
 */
export interface buyers{
    buyers:buyersData | [],
}
const BuyersTable:React.FC<buyers> = ({buyers}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [] = useState(1);

  // Filter sellers based on search query

  // Pagination logic

  const handleRowClick = (buyerId: string) => {
    navigate(`/buyer-details/${buyerId}`);
  };

  const handleViewDetails = (buyerId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event from firing
    navigate(`/buyer-details/${buyerId}`);
  };
//TODO i have to also add the status of the order
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Buyers</h1>
      <div className="mb-4">
        <Input
          placeholder="Search buyers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Buyer ID</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>NumberOfOrders</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buyers.map((buyer) => (
            <TableRow key={buyer.buyerId} onClick={() => handleRowClick(buyer.buyerId)} className="cursor-pointer">
              <TableCell>{buyer.buyerId}</TableCell>
              <TableCell>
                <img
                  src={buyer.image_url}
                  alt={buyer.p_full_name}
                  className="w-10 h-10 rounded-full"
                />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{buyer.p_full_name}</p>
                  <p className="text-sm text-gray-500">{buyer.email}</p>
                  <p className="text-sm text-gray-500">{buyer.p_phone}</p>
                </div>
              </TableCell>
              <TableCell>{buyer.p_physical_address}</TableCell>
              <TableCell>
                {buyer.totalNumberOfOrders}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleViewDetails(buyer.buyerId, e)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination */}
      {/* {filteredUsers.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )} */}
    </div>
  );
};

export default BuyersTable;