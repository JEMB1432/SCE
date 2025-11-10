CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3 CHECK (credits > 0),
    hours_per_week INTEGER DEFAULT 4,
    semester_available INTEGER CHECK (semester_available >= 1 AND semester_available <= 12),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year VARCHAR(9) NOT NULL,
    semester INTEGER CHECK (semester >= 1 AND semester <= 2),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
    UNIQUE(student_id, subject_id, academic_year, semester)
);

CREATE TABLE evaluation_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    weight DECIMAL(5,2) CHECK (weight >= 0 AND weight <= 100),
    max_score DECIMAL(5,2) DEFAULT 100,
    evaluation_order INTEGER,
    is_final_exam BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE grades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    evaluation_type_id UUID REFERENCES evaluation_types(id) ON DELETE CASCADE,
    score DECIMAL(5,2) CHECK (score >= 0 AND score <= 100),
    comments TEXT,
    graded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(enrollment_id, evaluation_type_id)
);

CREATE TABLE evaluation_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    total_evaluations INTEGER DEFAULT 3,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'assistant' CHECK (role IN ('admin', 'teacher', 'assistant')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_subject_id ON enrollments(subject_id);
CREATE INDEX idx_grades_enrollment_id ON grades(enrollment_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_subjects_code ON subjects(subject_code);


CREATE VIEW student_grades_detail AS
SELECT 
    s.student_code,
    s.first_name,
    s.last_name,
    sub.subject_code,
    sub.name as subject_name,
    sub.credits,
    e.academic_year,
    e.semester,
    et.name as evaluation_name,
    et.weight as evaluation_weight,
    g.score,
    g.graded_at
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN subjects sub ON e.subject_id = sub.id
JOIN evaluation_types et ON sub.id = et.subject_id
LEFT JOIN grades g ON e.id = g.enrollment_id AND et.id = g.evaluation_type_id;

CREATE VIEW student_subject_grades AS
SELECT 
    s.id as student_id,
    s.student_code,
    s.first_name,
    s.last_name,
    sub.id as subject_id,
    sub.subject_code,
    sub.name as subject_name,
    e.academic_year,
    e.semester,
    COUNT(g.id) as evaluations_completed,
    AVG(g.score) as average_score,
    SUM(et.weight * g.score / 100) as weighted_average
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN subjects sub ON e.subject_id = sub.id
JOIN evaluation_types et ON sub.id = et.subject_id
LEFT JOIN grades g ON e.id = g.enrollment_id AND et.id = g.evaluation_type_id
WHERE g.score IS NOT NULL
GROUP BY s.id, s.student_code, s.first_name, s.last_name, 
         sub.id, sub.subject_code, sub.name, e.academic_year, e.semester;   