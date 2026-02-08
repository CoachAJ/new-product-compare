
export enum AppPhase {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  INPUT = 'INPUT',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
}

export interface UserProfile {
  name: string;
  evalLink: string;
  ctaPreference: string;
  apiKey?: string;
}

export interface ProductData {
  name: string;
  productImage: string | null;     // Visual representation (Front/Bottle) used for image generation
  ingredientsImage: string | null; // Data source (Label/Nutrition Facts) used for analysis
  notes?: string;
  price?: string;
  isHomeProduct: boolean;
}

export interface ComparisonAnalysis {
  verdict: string;
  summary: string;
  pros: string[];
  cons: string[];
  scoreHome: number;
  scoreCompetitor: number;
  nutrientComparison: {
    nutrient: string;
    homeValue: string;
    competitorValue: string;
    advantage: 'home' | 'competitor' | 'neutral';
  }[];
  socialCopy: {
    facebook: string;
    linkedin: string;
    twitter: string;
    youtube: string;
    tiktok: string;
  };
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K',
}
