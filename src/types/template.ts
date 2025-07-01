export interface Template {
    id: string;
    name: string;
    category: string;
    status: "APPROVED" | "PENDING" | "REJECTED" | "DRAFT";
    language: string;
    lastModified: string;
    createdBy?: string;
    components: Array<{
      type: string;
      text?: string;
      format?: string;
      buttons?: Array<{
        type: string;
        text: string;
        url?: string;
        phone_number?: string;
      }>;
    }>;
  }