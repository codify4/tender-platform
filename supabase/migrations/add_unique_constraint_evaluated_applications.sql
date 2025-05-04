-- Add unique constraint to evaluated_applications table
-- This addresses the error: "there is no unique or exclusion constraint matching the ON CONFLICT specification"

-- First check if the table exists, create it if not
CREATE TABLE IF NOT EXISTS evaluated_applications (
  id SERIAL PRIMARY KEY,
  application_id UUID NOT NULL,
  vendor_name TEXT,
  tender_title TEXT,
  score NUMERIC,
  technical_score NUMERIC,
  financial_score NUMERIC,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  evaluation_data JSONB
);

-- Add unique constraint on application_id
ALTER TABLE evaluated_applications 
ADD CONSTRAINT evaluated_applications_application_id_key 
UNIQUE (application_id); 