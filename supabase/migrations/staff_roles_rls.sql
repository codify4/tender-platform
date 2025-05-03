-- Enable RLS on staff_roles table
ALTER TABLE staff_roles ENABLE ROW LEVEL SECURITY;

-- Policy for staff to view and update their own roles
CREATE POLICY "Staff can view their own roles"
  ON staff_roles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy for staff to insert their own roles
CREATE POLICY "Staff can set their own roles"
  ON staff_roles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy for staff to update their own roles
CREATE POLICY "Staff can update their own roles"
  ON staff_roles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id); 