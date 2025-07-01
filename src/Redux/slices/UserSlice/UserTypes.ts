export type userTypes = {
  id: number;
  full_name: string | "";
  user_name: string | "";
  email: string | "";
  user_type: string | "";
  picture: string | "";
  location: string | "";
  user_status: string | "";
  last_seen_at: null | string;
};
/**
 * "id": 65,
                "full_name": "Nazareth Agribusiness Solutions Ltd",
                "user_name": "Gerald Nazareth",
                "email": "nazarethagribusinesssolutions@gmail.com",
                "user_type": "user",
                "picture": "avatars/78d984217974a06757b315dc338474a5_avatars.jpg",
                "location": null,
                "user_status": "Company",
                "last_seen_at": null
 */
export interface Users {
  buyers: [];
  buyerOrders: [];
  users: [];
}
