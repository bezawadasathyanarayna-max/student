-- ====================================================================
-- STUDENT MANAGEMENT SYSTEM - DATABASE SCHEMA & INITIAL SEED DATA
-- Database Target: Supabase PostgreSQL
-- ====================================================================

-- 1. Create Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    register_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    age INT NOT NULL CHECK (age > 0),
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    semester VARCHAR(20) DEFAULT '4th Semester',
    gpa NUMERIC(3, 2) DEFAULT 3.80 CHECK (gpa >= 0.00 AND gpa <= 4.00),
    attendance_percentage INT DEFAULT 90 CHECK (attendance_percentage BETWEEN 0 AND 100),
    password_hash TEXT NOT NULL,
    phone VARCHAR(20) DEFAULT '+1 (555) 019-2834',
    avatar_url TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Student Academic Courses/Grades Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL CHECK (credits > 0),
    grade VARCHAR(5) NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
    instructor VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Student Attendance Details Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    total_classes INT NOT NULL CHECK (total_classes > 0),
    attended_classes INT NOT NULL CHECK (attended_classes >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Note: Since authentication is handled server-side using Express and the Supabase Service Role Key,
-- backend requests bypass RLS safely. We add policies for clean Supabase dashboard access if needed.

CREATE POLICY "Allow Service Role full access to students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow Service Role full access to courses" ON public.courses FOR ALL USING (true);
CREATE POLICY "Allow Service Role full access to attendance" ON public.attendance FOR ALL USING (true);

-- 5. Seed Initial Demo Students Data
-- Passwords:
-- REG2026001 => Password@123
-- REG2026002 => Student@456
-- REG2026003 => Pass@789

INSERT INTO public.students (id, register_number, name, email, age, department, year, semester, gpa, attendance_percentage, password_hash, phone, avatar_url)
VALUES 
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'REG2026001',
    'Alex Morgan',
    'alex.morgan@university.edu',
    21,
    'Computer Science & Engineering',
    '3rd Year',
    '6th Semester',
    3.88,
    94,
    '$2a$10$8UjFCYDQ.5FUiuLmE4o3g.lMB5Uv/YlcHXauxS3FDiq/.Bvybr3xK',
    '+1 (555) 234-5678',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
),
(
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'REG2026002',
    'Sophia Chen',
    'sophia.chen@university.edu',
    20,
    'Data Science & AI',
    '2nd Year',
    '4th Semester',
    3.95,
    98,
    '$2a$10$xs153aL5QcPphAu.O5/ZwuFmaF4L4eJPtGoSe11utDxlDHlg6oRaW',
    '+1 (555) 876-5432',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250'
),
(
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'REG2026003',
    'Marcus Vance',
    'marcus.vance@university.edu',
    22,
    'Information Technology',
    '4th Year',
    '8th Semester',
    3.72,
    89,
    '$2a$10$EddFRtI8TszOS3niJgbpa.eUHOekz6gdyN8bQcNsOyFRdFm/QpNhK',
    '+1 (555) 345-6789',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250'
)
ON CONFLICT (register_number) DO UPDATE 
SET name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash;

-- 6. Seed Courses for Demo Students
INSERT INTO public.courses (student_id, course_code, course_name, credits, grade, score, instructor)
VALUES 
-- Alex Morgan's Courses
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'CS301', 'Database Management Systems', 4, 'A+', 95, 'Dr. Aris Thorne'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'CS302', 'Data Structures & Algorithms', 4, 'A', 91, 'Prof. Elena Rostova'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'CS303', 'Web Full-Stack Architecture', 3, 'A+', 98, 'Dr. Robert Miller'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'CS304', 'Operating Systems', 3, 'B+', 85, 'Dr. Sarah Connor'),

-- Sophia Chen's Courses
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'DS201', 'Applied Machine Learning', 4, 'A+', 99, 'Dr. Alan Turing'),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'DS202', 'Probability & Statistics', 3, 'A+', 96, 'Prof. Katherine Johnson'),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'CS205', 'Python Software Engineering', 3, 'A', 92, 'Dr. Guido van Rossum'),

-- Marcus Vance's Courses
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'IT401', 'Cloud Native DevOps & Kubernetes', 4, 'A', 90, 'Prof. Linus Torvalds'),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'IT402', 'Cyber Security & Cryptography', 4, 'B+', 86, 'Dr. Kevin Mitnick')
ON CONFLICT DO NOTHING;

-- 7. Seed Attendance Records for Demo Students
INSERT INTO public.attendance (student_id, subject, total_classes, attended_classes)
VALUES 
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Database Management Systems', 40, 38),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Data Structures & Algorithms', 45, 42),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Web Full-Stack Architecture', 36, 35),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Operating Systems', 40, 36),

('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Applied Machine Learning', 42, 42),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Probability & Statistics', 38, 37),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Python Software Engineering', 40, 39),

('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Cloud Native DevOps & Kubernetes', 44, 39),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Cyber Security & Cryptography', 40, 35)
ON CONFLICT DO NOTHING;
