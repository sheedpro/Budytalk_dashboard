// src/types/product.ts
export interface Product {
  [x: string]: any;
  id: string;
  product_title: string;
  status: string;
  category: {
    category_name: string;
  };
  sub_category: {
    subcat_name: string;
  };
  product_type_name?: { // Optional to handle cases where it might not exist
    name: string;
  };
  product_type?: { // Optional to handle cases where it might not exist
    name: string;
  };
  images: { image_path: string }[];
  user?: { // Optional and nullable to handle API variations
    name: string;
    email: string;
  } | null;
  created_at: string;
  updated_at: string;
  formattedDate?: string; // Optional property for formatted date display
}