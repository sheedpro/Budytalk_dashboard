import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { UserOrdersTable } from "@/components/Users/UserOrderTable";
import { useDispatch } from "react-redux";
import { buyersData } from "@/components/Users/BuyersTable";
import { useUsers } from "@/hooks/useUsers";

const BuyerDetails= () => {
  const { Buyers,makeUserCalls,BuyersOrders } = useUsers();
  console.log({Buyers})
  const buyersData:buyersData = Buyers
  console.log({buyersData})
  const { Id } = useParams<{ Id: string }>();
  console.log(Id)
  const buyer = buyersData.find((b) => Number(b.buyerId) === Number(Id));
  console.log("buyer",buyer)
  const [stockValues] = useState<{ [productId: string]: number }>({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const dispatch = useDispatch();
 
  useEffect(() => {
const fetchOrders = async ()=>{
try{
  await makeUserCalls.fetchBuyerOrders(dispatch,Number(Id));
}catch(err){
  console.error("Error fetching orders:", err);
}
}
fetchOrders();
  },[dispatch,Id])
  if (!buyersData) {
    return <div>buyer not found</div>;
  }

  // Filter products based on search query and status
  // const filteredProducts = seller.products.filter((product) => {
  //   const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     product.productId.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesStatus = statusFilter === "all" || product.status === statusFilter;
  //   return matchesSearch && matchesStatus;
  // });

  // Handle stock input changes

  // Handle save action
  const handleSave = () => {
    setIsConfirmationOpen(true);
  };

  // Confirm save action
  const confirmSave = () => {
    console.log("Updated stock values:", stockValues);
    setIsConfirmationOpen(false);
    setIsSaveDisabled(true);
  };

  return (
    <div className="p-4">
      <h1>{buyer?.p_full_name} Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600">Location: {buyer?.p_physical_address}</p>
          <p className="text-gray-600">Email: {buyer?.email}</p>
          <p className="text-gray-600">phone: {buyer?.p_phone}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      
     <UserOrdersTable orders={BuyersOrders}/>
      <Button className="mt-4" onClick={handleSave} disabled={isSaveDisabled}>
        Save Changes
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Stock Updates</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the following stock values?
              <ul className="mt-2">
                {/* {Object.entries(stockValues).map(([productId, stock]) => {
                  const product = seller.products.find((p) => p.productId === productId);
                  return (
                    <li key={productId}>
                      {product?.name}: {stock}
                    </li>
                  );
                })} */}
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSave}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyerDetails;