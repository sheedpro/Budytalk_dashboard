import { Button } from "@/components/ui/button"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar";
  import { Separator } from "@/components/ui/separator";
  import { AppSidebar } from "@/components/app-sidebar";
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from "@/components/ui/breadcrumb";
  import {
    Card,
    CardContent,

    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  import { Outlet } from "react-router";
import { useParams } from "react-router";
function UserDetailsDisplay() {
    const { userId } = useParams();
    const allUsers = Array.from({ length: 50 }, (_, i) => ({
        id: `User${String(i + 1).padStart(3, "0")}`,
        username: `user${i + 1}`,
        firstName: `FirstName${i + 1}`,
        lastName: `LastName${i + 1}`,
        accountCreated: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
          .toISOString()
          .split("T")[0],
        location: ["Kampala", "Nairobi", "Mbarara", "Dar es Salaam", "Kigali"][
          Math.floor(Math.random() * 5)
        ],
        phoneNumber: `+256${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: ["buyers", "sellers"][Math.floor(Math.random() * 2)],
      }));
const user = allUsers.find(user =>user.id ===userId)
if(!user){
    return <h1>User not found</h1>
  
}
  return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Admin dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>user Details</BreadcrumbPage>
      </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="w-full overflow-y-auto h-full">
          <Outlet />
          <div className="w-full">
      <div className="flex justify-center items-center">
        <img
          src="https://example.com/user-image.jpg"
          alt="User Image"
          className="h-24 w-24 rounded-full object-cover"
        />
        <div className="ml-4">
          
            <Card>
  <CardHeader>
    <CardTitle>User Details</CardTitle>
    
  </CardHeader>
  <CardContent>
  <div  className=" ">
                {
                Object.entries(user).map(([key,value])=>{
                    return (
                        <div key={key} className="flex gap-4">
                            <div className="text-sm font-medium">{key}:</div>
                            <div className="text-sm text-gray-500">{value}</div>
                        </div>
                    )
                })
                }
            </div>
  </CardContent>
</Card>
           
            <div className="flex items-center justify-end mt-4 gap-4">
          <Button variant="outline" className="w-24">
            Edit
          </Button>
          <Button variant="outline" className="w-24 bg-red-400">
            Delete
          </Button>
          <Button variant="outline" className="w-24">
            Block
          </Button>
</div>
          
    


        </div>
       
      </div>

    </div>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
   
  );
}

export default UserDetailsDisplay;
