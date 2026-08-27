export enum SkillCategory {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASE = 'DATABASE',
  DEVOPS = 'DEVOPS',
  TOOLS = 'TOOLS',
  SOFT_SKILLS = 'SOFT_SKILLS',
  OTHER = 'OTHER'
}

export interface SkillResponse {
  id: number;
  name: string;
  category: SkillCategory;
  proficiency: number;
  iconUrl?: string | null;
}

export interface SkillRequest {
  name: string;
  category: SkillCategory;
  proficiency: number;
  yearsOfExperience?: number | null;
  iconUrl?: string | null;
  displayOrder: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}