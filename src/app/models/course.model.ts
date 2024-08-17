export interface Course {
    id: string
    university: string;
    city?: string;
    country?: string;
    course_name: string;
    course_description?: string;
    start_date: string;  // Using string for simplicity; can use Date object
    end_date: string;
    price: number;
    currency: string;
  }
  