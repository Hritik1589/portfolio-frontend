// src/app/core/models/blog.model.ts

export interface BlogResponse {
  id: number;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;      // Changed from imageUrl
  category?: string;        // Added to match backend
  status?: string;          // Added to match backend (DRAFT, PUBLISHED)
  publishedDate?: string;   // Changed from publishedAt to match backend
  createdAt?: string;
  updatedAt?: string;
  tags?: any[];             // Keeping this if you still use tags
  excerpt?: string;         // Keeping as optional if you generate it on frontend
}

export interface BlogRequest {
  title: string;
  content: string;
  coverImage?: string;      // Changed from imageUrl
  category?: string;        // Added to match backend
  status?: string;          // Added to match backend
  tags?: string[]; 
}

// Reusable generic wrappers
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}