export interface Formula {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  averageValue?: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
  snippet?: string;
}

export interface GeminiResponse {
  summary: string;
  formulas: Formula[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  disease: string;
  doctorName?: string;
  response: GeminiResponse;
  sources: GroundingSource[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category?: string;
}