// src/app/core/models/contact-message.model.ts
export interface ContactMessageResponse {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
// src/app/core/models/contact-message.model.ts
export interface ContactMessageRequest {
  name: string;
  email: string;
  mobileNumber?: string; // Optional field
  subject: string;
  message: string;
}