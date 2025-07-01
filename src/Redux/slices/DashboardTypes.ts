type totalUsers = {
  totalUsers: number;
  change: number;
};
type totalProducts = {
  totalProducts: number;
  change: number;
}
type totalPendingProducts ={
  totalPendingProducts: number;
  change: number;
}
type totalProviders = {
  totalProviders: number;
  change: number;
}
type ProductsTrends = {
  mostDemandedProducts: [];
};
export type userLocationsTypes = {
    id:number;
  location: string;
  user_name: string;
  about_user: string;
  user_type: string;
  picture: string;
  lat?: number;
  lng?: number;
}[];
type userLocation={
    userLocations:userLocationsTypes
}
/**"id": 13,
 *          "location": "Kawoko",
            "user_name": "Kachiko Brian",
            "about_user": null,
            "user_type": "user",
            "picture": "avatars/2eb797efd644102414dd3b66290ef018_avatars.jpg"
 */

type newUsersChart = {
  daily?: [];
  monthly: [];
  weekly?: [];
};
type newOrdersChart = {
  daily?: [];
  monthly?: [];
  weekly?: [];
}
export interface dashboardTypes {
  totalUsers: totalUsers;
  totalProducts: totalProducts;
  totalProviders: totalProviders;
  totalPendingProducts: totalPendingProducts;
  newUsersChart: newUsersChart;
  newOrdersChart: newOrdersChart;
  productsTrends: ProductsTrends;
  userLocations: userLocation |[];
}
