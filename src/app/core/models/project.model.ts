// 1. The Request interface for the Admin to create/update projects
export interface ProjectRequest {
  title: string;
  slug: string;                  
  shortDescription: string;      
  detailedDescription: string;   
  startDate: string;             
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: any[];
}

// 2. The Response interface for both Admin and Public to read projects
export interface ProjectResponse {
  id: number;
  title: string;
  slug: string; 
  shortDescription: string;      
  detailedDescription: string;   
  startDate: string;             
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: any[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 3. The Pagination interface for the Public list
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; 
}

// Assuming your global ApiResponse looks like this:
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}