
export interface User {
  role: string;
  deletion_reason: string;
  disable_reason: string;
  id: number;
  full_name: string;
  email: string;
  user_name: string | null;
  user_type: string | null;
  user_status: string | null;
  picture: string | null;
  avatar_google: string | null;
  registration_type: string | null;
  about_user: string | null;
  user_intention: string | null;
  location: string | null;
  language: string | null;
  site_url: string | null;
  gender: string | null;
  age: number | null;
  income: string | null;
  education: string | null;
  registered_from: string | null;
  verification_status: string | null;
  image_cover: string | null;
  country: string | null;
  date_of_birth: string | null;
  physical_address: string | null;
  country_code: string | null;
  phone: string | null;
  fb_username: string | null;
  twitter_username: string | null;
  linkedin_username: string | null;
  youtube_username: string | null;
  online_status: string;
  auth_code: string | null;
  permission: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  device_token: string | null;
  apple_token: string | null;
  account_types: string;
  last_seen_at: string | null;
  notification_preferences: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_verified_at: string | null;
  deleted_at: string | null;
  seller?: BusinessProfile;
  buyer?: BusinessProfile;
}


export interface BusinessProfile {
  id: number;
  buyer_id?: number;
  seller_id?: number;
  image_url: string;
  email: string;
  email_verified_at: string;
  password: string;
  p_full_name: string;
  p_phone: string;
  p_whatsap_number: string;
  p_physical_address: string;
  p_job_title: string;
  b_website: string | null;
  b_name: string;
  b_email: string;
  b_phone: string;
  b_number_of_employee: number | string;
  b_year_of_established: string;
  b_description: string;
  registration_stage: number | string;
  b_type: string;
  farm_size?: string | null;
  noticed_us_from: string;
  main_category_id: number | null;
  main_category_ids: string | null;
  sub_category_ids: string | null;
  product_type_ids: string | null;
  created_at: string;
  updated_at: string;
  device_token?: string;
  first_name?: string;
  last_name?: string;
}
  
  export interface UserSegment {
    name: string;
    count: number;
    criteria: Record<string, any>;
  }
  
  export interface UserReport {
    periodStart: string;
    periodEnd: string;
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    disabledUsers: number;
    deletionRequests: number;
  }
  


