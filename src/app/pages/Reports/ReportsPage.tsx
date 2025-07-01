import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { OrderReports } from "@/components/reports/OrderReports";
// import { ProductReports } from "@/components/reports/ProductReports";
// import { UserReports } from "@/components/reports/UserReports";
// import { TransactionReports } from "@/components/reports/TransactionReports";
import { ReportPageHeader } from "@/components/reports/ReportPageHeader";

export function ReportsPage() {
  return (

      <div className="container mx-auto py-6 space-y-8 max-w-7xl">
        <ReportPageHeader />
        
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className=" mb-8">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            {/* <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger> */}
          </TabsList>
          
          <TabsContent value="orders" className="space-y-6">
            <OrderReports />
          </TabsContent>
          
          {/* <TabsContent value="products" className="space-y-6">
            <ProductReports />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <UserReports />
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6">
            <TransactionReports />
          </TabsContent> */}
        </Tabs>
      </div>

  );
}