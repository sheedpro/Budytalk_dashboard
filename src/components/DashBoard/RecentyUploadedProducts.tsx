import { Button } from '@/components/ui/button'; // ShadCN Button
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // ShadCN Card

const RecentlyUploadedProducts = () => {
  return (
    <Card className="flex items-start p-4 border">
      
      <img
        src="https://via.placeholder.com/40"
        alt="User Avatar"
        className="w-10 h-10 rounded-full mr-4"
      />

      
      <div className="flex-1">
       
        <CardHeader className="p-0 mb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              100kgs of Rice <span className="text-gray-500">By williams!</span>
            </CardTitle>
            <span className="text-sm text-gray-500">3 days ago</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <p className="text-sm text-gray-600">
           this are products quality 
          </p>
        </CardContent>

        
        <div className="flex items-center mt-3 space-x-2">
          <Button variant="default" size="sm" className='bg-green-400'>
            Approve
          </Button>
          <Button variant="destructive" size="sm">
            Reject
          </Button>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RecentlyUploadedProducts;
