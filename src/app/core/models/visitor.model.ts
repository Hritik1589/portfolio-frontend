export interface SiteVisitor {
  id: number;
  ipAddress: string;
  lastUserAgent: string;
  visitCount: number;
  lastVisitDate: string; // Date as ISO string from backend
  createdAt?: string;    // BaseEntity fields (optional)
  updatedAt?: string;
}