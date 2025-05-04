// Database schema types for the tender platform

// Submission table schema
export interface Submission {
  id: string;
  vendor_id: string;
  tender_id: string;
  submission_id: string;
  status: 'pending' | 'evaluated' | 'recommended' | 'rejected';
  created_at: string;
  updated_at: string;
  vendor_name: string;
  tender_title: string;
  tender_reference: string;
  score: number | null;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url?: string;
  }>;
  criteria: Array<{
    id: string;
    title: string;
    weight: number;
    maxScore: number;
  }>;
}

// Evaluated Application table schema
export interface EvaluatedApplication {
  id: number;
  application_id: string;
  vendor_name: string;
  tender_title: string;
  score: number;
  technical_score: number;
  financial_score: number;
  recommendation: 'award' | 'reject' | 'conditional';
  created_at: string;
  evaluation_data: {
    technical_evaluation: {
      experience: {
        correct: string[];
        mistakes: string[];
        score: number;
      };
      team: {
        correct: string[];
        mistakes: string[];
        score: number;
      };
      total_score: number;
    };
    financial_evaluation: {
      correct: string[];
      mistakes: string[];
      score: number;
    };
    compliance_issues: string[];
    score: number;
    recommendation: 'award' | 'reject' | 'conditional';
  };
}

// Tender table schema
export interface Tender {
  id: string;
  title: string;
  reference: string;
  description: string;
  category: string;
  budget: number;
  status: 'draft' | 'published' | 'closed' | 'awarded';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  requirements: string[];
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url?: string;
  }>;
}

// Database tables
export type Database = {
  public: {
    Tables: {
      submissions: {
        Row: Submission;
        Insert: Omit<Submission, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Submission, 'id' | 'created_at' | 'updated_at'>>;
      };
      evaluated_applications: {
        Row: EvaluatedApplication;
        Insert: Omit<EvaluatedApplication, 'id' | 'created_at'>;
        Update: Partial<Omit<EvaluatedApplication, 'id' | 'created_at'>>;
      };
      tenders: {
        Row: Tender;
        Insert: Omit<Tender, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tender, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}; 