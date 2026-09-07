-- ============================================================================
-- TRISAGE EMS (EMPLOYEE MANAGEMENT SYSTEM) - PHASE 1 SCHEMA MIGRATION
-- Project: Trisage Marketing Pvt. Ltd.
-- Author: Senior Database Architect
-- Date: 2026-08-17
-- Stack: Supabase (PostgreSQL 15+, Auth, Row Level Security)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 2. DOMAIN CONSTRAINTS & DATA TYPES
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- 3. TABLES & CONSTRAINTS
-- ----------------------------------------------------------------------------

-- A. DEPARTMENTS (Lookup Table)
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.departments IS 'Lookup table for company organizational units.';
COMMENT ON COLUMN public.departments.code IS 'Short department code e.g. VID, DES, DEV, SMM';

-- B. PROFILES (Extends Supabase auth.users 1:1 & Employee Profile Settings)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE, -- Nullable initially until assigned by HR e.g. TME-0102
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    bio TEXT,
    address TEXT,
    emergency_contact TEXT,
    joining_date DATE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL, -- Deleting a department leaves employee profiles intact
    role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'hr', 'admin')),
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Extended employee profiles mapped 1:1 to auth.users, supporting employee profile settings.';
COMMENT ON COLUMN public.profiles.employee_id IS 'Unique company employee ID code e.g. TME-0102. Can be NULL prior to onboarding.';
COMMENT ON COLUMN public.profiles.department_id IS 'FK to departments. ON DELETE SET NULL to preserve profile records if a department is dissolved.';

-- C. LEAVE TYPES (Lookup Table)
CREATE TABLE IF NOT EXISTS public.leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE, -- e.g. UL
    description TEXT,
    default_allowance_days INT NOT NULL DEFAULT 0 CHECK (default_allowance_days >= 0),
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
    requires_approval BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.leave_types IS 'Master lookup table for leave categories and default allowances.';

-- D. ATTENDANCE RECORDS (Daily Punch Log)
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    check_in_time TIMESTAMPTZ,
    check_out_time TIMESTAMPTZ,
    working_minutes INT CHECK (working_minutes IS NULL OR working_minutes >= 0),
    status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half_day', 'on_leave')),
    location_check_in JSONB, -- Stores { lat, long, accuracy, ip, address }
    location_check_out JSONB, -- Stores { lat, long, accuracy, ip, address }
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- BUSINESS RULE CONSTRAINTS
    CONSTRAINT unique_user_work_date UNIQUE (user_id, work_date), -- Enforces 1 record per employee per day
    CONSTRAINT check_out_after_check_in CHECK (check_out_time IS NULL OR check_in_time IS NULL OR check_out_time >= check_in_time)
);

COMMENT ON TABLE public.attendance_records IS 'Daily attendance logs per employee. Enforces 1 record per day via UNIQUE(user_id, work_date).';
COMMENT ON COLUMN public.attendance_records.working_minutes IS 'Auto-calculated via trigger upon check_out_time update.';
COMMENT ON COLUMN public.attendance_records.location_check_in IS 'JSONB metadata capturing geo-location, accuracy, and IP address on check-in.';

-- E. LEAVE REQUESTS
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES public.leave_types(id) ON DELETE RESTRICT, -- Prevents deleting leave types in use
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days NUMERIC(4, 1) NOT NULL CHECK (total_days > 0),
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- BUSINESS RULE CONSTRAINTS
    CONSTRAINT valid_leave_date_range CHECK (end_date >= start_date)
);

COMMENT ON TABLE public.leave_requests IS 'Employee leave applications and HR approval lifecycle.';
COMMENT ON COLUMN public.leave_requests.total_days IS 'Supports decimal days (e.g. 0.5 for half-day, 1.5 for 1 day + half day).';

-- F. AUDIT LOGS (Anti-Tamper & Change History)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- e.g. 'attendance_records', 'leave_requests'
    entity_id UUID NOT NULL,
    action TEXT NOT NULL, -- e.g. 'UPDATE', 'STATUS_CHANGE', 'HR_CORRECTION'
    performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.audit_logs IS 'Append-only audit trail for sensitive status changes and manual corrections.';

-- ----------------------------------------------------------------------------
-- 4. INDEXES
-- ----------------------------------------------------------------------------

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Attendance Queries
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON public.attendance_records(user_id, work_date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_work_date ON public.attendance_records(work_date DESC);

-- Leave Request Queries
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_date ON public.leave_requests(user_id, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_leave_requests_pending ON public.leave_requests(status) WHERE status = 'pending';

-- Audit Log Queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- ----------------------------------------------------------------------------
-- 5. FUNCTIONS & TRIGGERS
-- ----------------------------------------------------------------------------

-- A. Auto-updated_at Trigger Function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_attendance_updated_at ON public.attendance_records;
CREATE TRIGGER trg_attendance_updated_at
    BEFORE UPDATE ON public.attendance_records
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_leave_requests_updated_at ON public.leave_requests;
CREATE TRIGGER trg_leave_requests_updated_at
    BEFORE UPDATE ON public.leave_requests
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- B. Auto-calculate working minutes on check-out
CREATE OR REPLACE FUNCTION public.calculate_attendance_working_minutes()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.check_in_time IS NOT NULL AND NEW.check_out_time IS NOT NULL THEN
        NEW.working_minutes := ROUND(EXTRACT(EPOCH FROM (NEW.check_out_time - NEW.check_in_time)) / 60);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_calculate_working_minutes ON public.attendance_records;
CREATE TRIGGER trg_calculate_working_minutes
    BEFORE INSERT OR UPDATE OF check_in_time, check_out_time ON public.attendance_records
    FOR EACH ROW EXECUTE FUNCTION public.calculate_attendance_working_minutes();

-- C. Auto-create Profile row when Supabase Auth User signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'employee')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- D. Audit Logging Trigger Function
CREATE OR REPLACE FUNCTION public.log_entity_audit_trail()
RETURNS TRIGGER AS $$
DECLARE
    should_log BOOLEAN := FALSE;
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        IF (OLD.status IS DISTINCT FROM NEW.status) THEN
            should_log := TRUE;
        ELSIF (TG_TABLE_NAME = 'attendance_records') THEN
            IF (OLD.check_in_time IS DISTINCT FROM NEW.check_in_time) OR (OLD.check_out_time IS DISTINCT FROM NEW.check_out_time) THEN
                should_log := TRUE;
            END IF;
        END IF;

        IF (should_log) THEN
            INSERT INTO public.audit_logs (
                entity_type,
                entity_id,
                action,
                performed_by,
                old_values,
                new_values
            ) VALUES (
                TG_TABLE_NAME,
                NEW.id,
                TG_OP,
                auth.uid(),
                to_jsonb(OLD),
                to_jsonb(NEW)
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_attendance ON public.attendance_records;
CREATE TRIGGER trg_audit_attendance
    AFTER UPDATE ON public.attendance_records
    FOR EACH ROW EXECUTE FUNCTION public.log_entity_audit_trail();

DROP TRIGGER IF EXISTS trg_audit_leave_requests ON public.leave_requests;
CREATE TRIGGER trg_audit_leave_requests
    AFTER UPDATE ON public.leave_requests
    FOR EACH ROW EXECUTE FUNCTION public.log_entity_audit_trail();

-- E. Helper Function to Get User Role safely inside RLS
CREATE OR REPLACE FUNCTION public.get_user_role(user_uid UUID)
RETURNS TEXT AS $$
DECLARE
    user_role_val TEXT;
BEGIN
    SELECT role INTO user_role_val FROM public.profiles WHERE id = user_uid;
    RETURN COALESCE(user_role_val, 'employee');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES & PERMISSIONS
-- ----------------------------------------------------------------------------

-- Grant full table, sequence, and function access to authenticated, service_role, and anon
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;

GRANT SELECT ON public.departments TO anon, authenticated;
GRANT SELECT ON public.leave_types TO anon, authenticated;

-- Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- A. DEPARTMENTS POLICIES
DROP POLICY IF EXISTS "Departments are viewable by all users" ON public.departments;
DROP POLICY IF EXISTS "Departments are viewable by all authenticated users" ON public.departments;
CREATE POLICY "Departments are viewable by all users"
    ON public.departments FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Departments manageable by HR and Admin" ON public.departments;
CREATE POLICY "Departments manageable by HR and Admin"
    ON public.departments FOR ALL
    TO authenticated
    USING (public.get_user_role(auth.uid()) IN ('hr', 'admin'))
    WITH CHECK (public.get_user_role(auth.uid()) IN ('hr', 'admin'));

-- B. PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles viewable by all authenticated users" ON public.profiles;
CREATE POLICY "Profiles viewable by all authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Employees can update their own limited profile fields" ON public.profiles;
CREATE POLICY "Employees can update their own limited profile fields"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id 
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "HR and Admin can update any profile" ON public.profiles;
CREATE POLICY "HR and Admin can update any profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (public.get_user_role(auth.uid()) IN ('hr', 'admin'))
    WITH CHECK (public.get_user_role(auth.uid()) IN ('hr', 'admin'));

-- C. LEAVE TYPES POLICIES
DROP POLICY IF EXISTS "Leave types viewable by all users" ON public.leave_types;
DROP POLICY IF EXISTS "Leave types viewable by all authenticated users" ON public.leave_types;
CREATE POLICY "Leave types viewable by all users"
    ON public.leave_types FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Leave types manageable by HR and Admin" ON public.leave_types;
CREATE POLICY "Leave types manageable by HR and Admin"
    ON public.leave_types FOR ALL
    TO authenticated
    USING (public.get_user_role(auth.uid()) IN ('hr', 'admin'))
    WITH CHECK (public.get_user_role(auth.uid()) IN ('hr', 'admin'));

-- D. ATTENDANCE RECORDS POLICIES
DROP POLICY IF EXISTS "Employees can view own attendance" ON public.attendance_records;
CREATE POLICY "Employees can view own attendance"
    ON public.attendance_records FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.get_user_role(auth.uid()) IN ('hr', 'admin'));

DROP POLICY IF EXISTS "Employees can insert own attendance for current date" ON public.attendance_records;
CREATE POLICY "Employees can insert own attendance for current date"
    ON public.attendance_records FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id 
        AND work_date = CURRENT_DATE
    );

DROP POLICY IF EXISTS "HR and Admin can insert attendance for any employee" ON public.attendance_records;
CREATE POLICY "HR and Admin can insert attendance for any employee"
    ON public.attendance_records FOR INSERT
    TO authenticated
    WITH CHECK (public.get_user_role(auth.uid()) IN ('hr', 'admin'));

DROP POLICY IF EXISTS "Employees can update own check-out time while active" ON public.attendance_records;
CREATE POLICY "Employees can update own check-out time while active"
    ON public.attendance_records FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id 
        AND check_out_time IS NULL
    )
    WITH CHECK (
        auth.uid() = user_id
    );

DROP POLICY IF EXISTS "HR and Admin can update any attendance record" ON public.attendance_records;
CREATE POLICY "HR and Admin can update any attendance record"
    ON public.attendance_records FOR UPDATE
    TO authenticated
    USING (public.get_user_role(auth.uid()) IN ('hr', 'admin'))
    WITH CHECK (public.get_user_role(auth.uid()) IN ('hr', 'admin'));

-- E. LEAVE REQUESTS POLICIES
DROP POLICY IF EXISTS "Employees can view own leave requests, HR can view all" ON public.leave_requests;
CREATE POLICY "Employees can view own leave requests, HR can view all"
    ON public.leave_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.get_user_role(auth.uid()) IN ('hr', 'admin'));

DROP POLICY IF EXISTS "Employees can insert own pending leave requests" ON public.leave_requests;
CREATE POLICY "Employees can insert own pending leave requests"
    ON public.leave_requests FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id 
        AND status = 'pending'
    );

DROP POLICY IF EXISTS "Employees can cancel own pending leave requests" ON public.leave_requests;
CREATE POLICY "Employees can cancel own pending leave requests"
    ON public.leave_requests FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id 
        AND status = 'pending'
    )
    WITH CHECK (
        auth.uid() = user_id 
        AND status = 'cancelled'
    );

DROP POLICY IF EXISTS "HR and Admin can review and update leave requests" ON public.leave_requests;
CREATE POLICY "HR and Admin can review and update leave requests"
    ON public.leave_requests FOR UPDATE
    TO authenticated
    USING (public.get_user_role(auth.uid()) IN ('hr', 'admin'))
    WITH CHECK (public.get_user_role(auth.uid()) IN ('hr', 'admin'));

-- F. AUDIT LOGS POLICIES
DROP POLICY IF EXISTS "Audit logs viewable only by HR and Admin" ON public.audit_logs;
CREATE POLICY "Audit logs viewable only by HR and Admin"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.get_user_role(auth.uid()) IN ('hr', 'admin'));

-- ----------------------------------------------------------------------------
-- 7. INITIAL SEED DATA
-- ----------------------------------------------------------------------------
INSERT INTO public.departments (name, code, description) VALUES
    ('Video Editor', 'VID', 'Video creation, editing, and post-production.'),
    ('Graphic Designer', 'DES', 'Visual graphics, branding, and asset design.'),
    ('Website Development', 'DEV', 'Frontend, backend, and web application engineering.'),
    ('Social Media Marketing', 'SMM', 'Social channels management, strategy, and engagement.')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.leave_types (name, code, description, default_allowance_days, is_paid, requires_approval) VALUES
    ('Unpaid Leave (LOP)', 'UL', 'Unpaid leave / Loss of Pay for time off approval.', 0, FALSE, TRUE)
ON CONFLICT (code) DO NOTHING;
