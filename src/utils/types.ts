export interface Product {

  id: string;

  name: string;

  totalStock: number;

  description: string;

  lastStockAdded: string;


  sellers: {

    sellerId: string;

    name: string;

    email: string;

    contact: string;

    profileImage: string;

    stock: number;

    address: string;

    productImages: string[];

  }[];
  status: string; 


}

  export interface Seller {

    id: string;
  
    name: string;
  
    email: string;
  
    phone: string;
  
    location: string;
  
    profileImage: string;
  
    products: { 
      productId: string; 
      name: string; stock: number,
      lastStockAdded?: string,
      images?: string[];
      status?: string;
     }[];
  
  }
  