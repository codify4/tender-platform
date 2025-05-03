-- Enable RLS on vendors table
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Policy for vendors to view their own profiles
CREATE POLICY "Vendors can view their own profiles"
  ON vendors
  FOR SELECT
  USING (auth.uid() = id);

-- Policy for vendors to insert their own profiles
CREATE POLICY "Vendors can insert their own profiles"
  ON vendors
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy for vendors to update their own profiles
CREATE POLICY "Vendors can update their own profiles"
  ON vendors
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id); 