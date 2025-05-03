-- Create tender_documents table
CREATE TABLE IF NOT EXISTS tender_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  size INTEGER,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cover_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  documents JSONB,
  feedback TEXT,
  evaluated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (vendor_id, tender_id)
);

-- Create RLS policies for tender_documents

-- Allow staff to read tender documents
CREATE POLICY "Staff can read tender documents"
  ON tender_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.id = auth.uid()
    )
  );

-- Allow staff to insert tender documents
CREATE POLICY "Staff can insert tender documents"
  ON tender_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.id = auth.uid()
    )
  );

-- Allow vendors to read tender documents
CREATE POLICY "Vendors can read tender documents"
  ON tender_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = auth.uid()
    )
  );

-- Create RLS policies for applications

-- Allow vendors to read their own applications
CREATE POLICY "Vendors can read their own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (
    vendor_id = auth.uid()
  );

-- Allow vendors to insert their own applications
CREATE POLICY "Vendors can insert applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    vendor_id = auth.uid()
  );

-- Allow staff to read all applications
CREATE POLICY "Staff can read all applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.id = auth.uid()
    )
  );

-- Allow staff to update application status and feedback
CREATE POLICY "Staff can update application status and feedback"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.id = auth.uid()
    )
  );

-- Create RLS policies for submissions

-- Allow vendors to read their own submissions
CREATE POLICY "Vendors can read their own submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.submission_id = submissions.id
      AND applications.vendor_id = auth.uid()
    )
  );

-- Allow vendors to insert submissions
CREATE POLICY "Vendors can insert submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    TRUE -- Further checks are done at the application level
  );

-- Allow staff to read all submissions
CREATE POLICY "Staff can read all submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.id = auth.uid()
    )
  );

-- Enable Row Level Security
ALTER TABLE tender_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('tender_documents', 'Tender Documents', false),
  ('application_documents', 'Application Documents', false);

-- Create storage policies for tender_documents bucket

-- Allow staff to read tender documents
CREATE POLICY "Staff can read tender documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'tender_documents' AND (
      EXISTS (
        SELECT 1 FROM staff
        WHERE staff.id = auth.uid()
      )
    )
  );

-- Allow staff to insert tender documents
CREATE POLICY "Staff can insert tender documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'tender_documents' AND (
      EXISTS (
        SELECT 1 FROM staff
        WHERE staff.id = auth.uid()
      )
    )
  );

-- Allow vendors to read tender documents
CREATE POLICY "Vendors can read tender documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'tender_documents' AND (
      EXISTS (
        SELECT 1 FROM vendors
        WHERE vendors.id = auth.uid()
      )
    )
  );

-- Create storage policies for application_documents bucket

-- Allow vendors to read and write their own application documents
CREATE POLICY "Vendors can read and write their own application documents"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'application_documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'application_documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow staff to read all application documents
CREATE POLICY "Staff can read all application documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'application_documents' AND (
      EXISTS (
        SELECT 1 FROM staff
        WHERE staff.id = auth.uid()
      )
    )
  ); 