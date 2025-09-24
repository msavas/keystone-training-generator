-- Keystone Kaizen Training Generator Database Schema
-- This file contains the SQL commands to set up the database in Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table for tracking user usage
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    generations_used INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generations table for audit trail
CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration INTEGER NOT NULL CHECK (duration >= 30 AND duration <= 240),
    industry TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    slide_deck_url TEXT,
    instructor_guide_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_created_at ON generations(created_at);
CREATE INDEX idx_generations_status ON generations(status);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generations_updated_at BEFORE UPDATE ON generations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
-- Allow users to read their own data
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (true); -- Allow service role to read all users

-- Allow service role to insert new users
CREATE POLICY "Service role can insert users" ON users
    FOR INSERT WITH CHECK (true);

-- Allow service role to update user data
CREATE POLICY "Service role can update users" ON users
    FOR UPDATE USING (true);

-- Create RLS policies for generations table
-- Allow users to view their own generations
CREATE POLICY "Users can view their own generations" ON generations
    FOR SELECT USING (true); -- Allow service role to read all generations

-- Allow service role to insert generations
CREATE POLICY "Service role can insert generations" ON generations
    FOR INSERT WITH CHECK (true);

-- Allow service role to update generations
CREATE POLICY "Service role can update generations" ON generations
    FOR UPDATE USING (true);

-- Grant necessary permissions to the service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant read access to anon role for specific operations
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON users TO anon;
GRANT SELECT ON generations TO anon;

-- Insert some sample data for testing (optional)
-- INSERT INTO users (email, generations_used) VALUES 
--     ('test@example.com', 1),
--     ('demo@keystonekaizen.com', 0);

-- Create a view for user statistics (optional)
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.generations_used,
    u.created_at as user_created_at,
    COUNT(g.id) as total_generations,
    COUNT(CASE WHEN g.status = 'completed' THEN 1 END) as completed_generations,
    COUNT(CASE WHEN g.status = 'failed' THEN 1 END) as failed_generations,
    MAX(g.created_at) as last_generation_date
FROM users u
LEFT JOIN generations g ON u.id = g.user_id
GROUP BY u.id, u.email, u.generations_used, u.created_at;

-- Grant access to the view
GRANT SELECT ON user_stats TO service_role;