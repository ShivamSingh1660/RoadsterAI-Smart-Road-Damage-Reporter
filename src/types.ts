export type Category = 'Pothole' | 'Road Crack' | 'Surface Damage' | 'Waterlogging' | 'Other';
export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  status: Status;
  location: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  confidence?: number;
  recommendedAction?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface AnalysisResult {
  category: Category;
  severity: Severity;
  confidence: number;
  recommendedAction: string;
}
