// src/app/core/models/about.model.ts
// src/app/core/models/about.model.ts
export interface AboutResponse {
  id?: number;
  summary: string;
  careerJourney?: string;
  currentFocus?: string;
  goals?: string;
}

export type AboutRequest = Omit<AboutResponse, 'id'>;

