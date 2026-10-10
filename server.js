const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_jwt_key_student_mgmt_2026';

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
const isSupabaseConfigured = Boolean(
    supabaseUrl && 
    supabaseServiceKey && 
    !supabaseUrl.includes('your-supabase-project') &&
    !supabaseServiceKey.includes('your-supabase-service-role-key')
);

if (isSupabaseConfigured) {
    try {
        supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { persistSession: false }
        });
        console.log('✅ Supabase PostgreSQL Client initialized successfully.');
    } catch (err) {
        console.error('❌ Failed to initialize Supabase client:', err.message);
    }
} else {
    console.log('ℹ️ Supabase credentials not set or using placeholders. Running in Demo Mock Mode with built-in student data.');
}

// -------------------------------------------------------------------
// MOCK DEMO DATA (Used when Supabase is not yet configured)
// -------------------------------------------------------------------
const MOCK_STUDENTS = [
    {
        id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        register_number: 'REG2026001',
        name: 'Alex Morgan',
        email: 'alex.morgan@university.edu',
        age: 21,
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        semester: '6th Semester',
        gpa: 3.88,
        attendance_percentage: 94,
        password_hash: '$2a$10$8UjFCYDQ.5FUiuLmE4o3g.lMB5Uv/YlcHXauxS3FDiq/.Bvybr3xK', // Password@123
        phone: '+1 (555) 234-5678',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        courses: [
            { id: '1', course_code: 'CS301', course_name: 'Database Management Systems', credits: 4, grade: 'A+', score: 95, instructor: 'Dr. Aris Thorne' },
            { id: '2', course_code: 'CS302', course_name: 'Data Structures & Algorithms', credits: 4, grade: 'A', score: 91, instructor: 'Prof. Elena Rostova' },
            { id: '3', course_code: 'CS303', course_name: 'Web Full-Stack Architecture', credits: 3, grade: 'A+', score: 98, instructor: 'Dr. Robert Miller' },
            { id: '4', course_code: 'CS304', course_name: 'Operating Systems', credits: 3, grade: 'B+', score: 85, instructor: 'Dr. Sarah Connor' }
        ],
        attendance: [
            { subject: 'Database Management Systems', total_classes: 40, attended_classes: 38 },
            { subject: 'Data Structures & Algorithms', total_classes: 45, attended_classes: 42 },
            { subject: 'Web Full-Stack Architecture', total_classes: 36, attended_classes: 35 },
            { subject: 'Operating Systems', total_classes: 40, attended_classes: 36 }
        ]
    },
    {
        id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
        register_number: 'REG2026002',
        name: 'Sophia Chen',
        email: 'sophia.chen@university.edu',
        age: 20,
        department: 'Data Science & AI',
        year: '2nd Year',
        semester: '4th Semester',
        gpa: 3.95,
        attendance_percentage: 98,
        password_hash: '$2a$10$xs153aL5QcPphAu.O5/ZwuFmaF4L4eJPtGoSe11utDxlDHlg6oRaW', // Student@456
        phone: '+1 (555) 876-5432',
        avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
        courses: [
            { id: '5', course_code: 'DS201', course_name: 'Applied Machine Learning', credits: 4, grade: 'A+', score: 99, instructor: 'Dr. Alan Turing' },
            { id: '6', course_code: 'DS202', course_name: 'Probability & Statistics', credits: 3, grade: 'A+', score: 96, instructor: 'Prof. Katherine Johnson' },
            { id: '7', course_code: 'CS205', course_name: 'Python Software Engineering', credits: 3, grade: 'A', score: 92, instructor: 'Dr. Guido van Rossum' }
        ],
        attendance: [
            { subject: 'Applied Machine Learning', total_classes: 42, attended_classes: 42 },
            { subject: 'Probability & Statistics', total_classes: 38, attended_classes: 37 },
            { subject: 'Python Software Engineering', total_classes: 40, attended_classes: 39 }
        ]
    },
    {
        id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
        register_number: 'REG2026003',
        name: 'Marcus Vance',
        email: 'marcus.vance@university.edu',
        age: 22,
        department: 'Information Technology',
        year: '4th Year',
        semester: '8th Semester',
        gpa: 3.72,
        attendance_percentage: 89,
        password_hash: '$2a$10$EddFRtI8TszOS3niJgbpa.eUHOekz6gdyN8bQcNsOyFRdFm/QpNhK', // Pass@789
        phone: '+1 (555) 345-6789',
        avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
        courses: [
            { id: '8', course_code: 'IT401', course_name: 'Cloud Native DevOps & Kubernetes', credits: 4, grade: 'A', score: 90, instructor: 'Prof. Linus Torvalds' },
            { id: '9', course_code: 'IT402', course_name: 'Cyber Security & Cryptography', credits: 4, grade: 'B+', score: 86, instructor: 'Dr. Kevin Mitnick' }
        ],
        attendance: [
            { subject: 'Cloud Native DevOps & Kubernetes', total_classes: 44, attended_classes: 39 },
            { subject: 'Cyber Security & Cryptography', total_classes: 40, attended_classes: 35 }
        ]
    }
];

// Helper: Extract JWT token from Cookie or Authorization Header
function getAuthToken(req) {
    if (req.cookies && req.cookies.student_token) {
        return req.cookies.student_token;
    }
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return null;
}

// Authentication Middleware
function authenticateToken(req, res, next) {
    const token = getAuthToken(req);
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.student = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired session token. Please log in again.' });
    }
}

// -------------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------------

// 1. Health & Config Check API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        supabase_configured: isSupabaseConfigured,
        mode: isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Demo Mock Mode',
        timestamp: new Date().toISOString()
    });
});

// 2. Student Login API
app.post('/api/auth/login', async (req, res) => {
    try {
        const { register_number, password } = req.body;

        if (!register_number || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both Register Number and Password.'
            });
        }

        const formattedRegNo = String(register_number).trim().toUpperCase();
        let studentRecord = null;

        // Query Supabase or Mock Data
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('register_number', formattedRegNo)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Supabase fetch error:', error);
            }
            if (data) {
                studentRecord = data;
            }
        }

        // Fallback to Mock Data if Supabase isn't configured or student not found in DB
        if (!studentRecord) {
            const foundMock = MOCK_STUDENTS.find(s => s.register_number === formattedRegNo);
            if (foundMock) {
                studentRecord = foundMock;
            }
        }

        if (!studentRecord) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Register Number or Password.'
            });
        }

        // Verify bcrypt password hash
        const isMatch = bcrypt.compareSync(password, studentRecord.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Register Number or Password.'
            });
        }

        // Generate JWT token (expires in 24h)
        const tokenPayload = {
            id: studentRecord.id,
            register_number: studentRecord.register_number,
            name: studentRecord.name,
            email: studentRecord.email,
            department: studentRecord.department
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

        // Set HTTP-only Cookie
        res.cookie('student_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Omit password hash before sending to client
        const { password_hash, ...safeStudentData } = studentRecord;

        return res.json({
            success: true,
            message: 'Login successful!',
            token,
            student: safeStudentData,
            dataSource: isSupabaseConfigured ? 'Supabase DB' : 'Demo Local Data'
        });

    } catch (error) {
        console.error('Login Endpoint Error:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected server error occurred during authentication.'
        });
    }
});

// 3. Get Logged-in Student Profile & Academic Details
app.get('/api/student/me', authenticateToken, async (req, res) => {
    try {
        const studentId = req.student.id;
        const regNo = req.student.register_number;

        let studentData = null;
        let coursesData = [];
        let attendanceData = [];

        if (isSupabaseConfigured && supabase) {
            // Fetch profile
            const { data: profile } = await supabase
                .from('students')
                .select('*')
                .eq('id', studentId)
                .single();

            if (profile) {
                studentData = profile;
                
                // Fetch courses
                const { data: courses } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('student_id', studentId);
                coursesData = courses || [];

                // Fetch attendance
                const { data: attendance } = await supabase
                    .from('attendance')
                    .select('*')
                    .eq('student_id', studentId);
                attendanceData = attendance || [];
            }
        }

        // Fallback to mock data if student not in Supabase yet
        if (!studentData) {
            const mock = MOCK_STUDENTS.find(s => s.id === studentId || s.register_number === regNo);
            if (mock) {
                studentData = { ...mock };
                coursesData = mock.courses || [];
                attendanceData = mock.attendance || [];
                delete studentData.courses;
                delete studentData.attendance;
            }
        }

        if (!studentData) {
            return res.status(404).json({ success: false, message: 'Student record not found.' });
        }

        // Remove sensitive fields
        delete studentData.password_hash;

        return res.json({
            success: true,
            student: {
                ...studentData,
                courses: coursesData,
                attendance: attendanceData
            }
        });
    } catch (error) {
        console.error('Get Profile Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve student profile.' });
    }
});

// 4. Logout API
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('student_token');
    return res.json({
        success: true,
        message: 'Logged out successfully.'
    });
});

// Serve frontend for all non-API routes (SPA behavior)
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(404).json({ success: false, message: 'API route not found' });
    }
});

// Start Server locally
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n🚀 Server active on http://localhost:${PORT}`);
        console.log(`🎓 Mode: ${isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Demo Local Mock Mode'}`);
    });
}

module.exports = app;
