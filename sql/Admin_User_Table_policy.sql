-- Enable Row Level Security (if not already enabled)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own admin status" ON admin_users;
DROP POLICY IF EXISTS "Admin users can read all admin records" ON admin_users;
DROP POLICY IF EXISTS "Server-side admin operations" ON admin_users;

-- Policy for authenticated users to read their own admin status
CREATE POLICY "Users can read their own admin status"
ON admin_users
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for server-side operations (admin management through server)
CREATE POLICY "Server-side admin operations"
ON admin_users
USING (auth.role() = 'service_role');

-- Since we cannot safely check if a user is admin without causing recursion,
-- we'll rely on the application logic to handle admin verification
-- and server-side operations for admin management

-- Anonymous users have no access by default 