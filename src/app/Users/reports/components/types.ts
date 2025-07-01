export interface User {
    id: string;
    full_name: string;
    email: string;
    account_types: string;
    online_status: string;
    seller?: {
      b_name: string;
    };
    buyer?: {
      b_name: string;
    };
  }

  export interface DemographicData {
    id: string;
    name: string;
    value: number;
    color: string;
    created_at?: string; // Date string in ISO format
    // other properties...
  }
  

  
  export interface EducationData {
    id: string;
    level: string;
    count: number;
    percentage: number;
    color: string;
  }
  
  export interface GenderData {
    name: string;
    value: number;
    color: string;
  }
  
  export interface IncomeData {
    range: string;
    count: number;
    percentage: number;
    color: string;
  }
  
  export interface OccupationData {
    category: string;
    count: number;
    percentage: number;
    occupations: {
      title: string;
      count: number;
      percentage: number;
    }[];
    color: string;
  }