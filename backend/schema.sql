CREATE TABLE users (
    id UUID PRIMARY KEY,
    clerk_id TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    linkedin_url TEXT,
    github_username TEXT,
    portfolio_url TEXT,
    xp INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    subscription_tier TEXT DEFAULT 'starter',
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE skills (
    id UUID PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    market_demand NUMERIC DEFAULT 0,
    decay_risk NUMERIC DEFAULT 0,
    resources JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE skill_scores (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    current_score NUMERIC DEFAULT 0,
    target_score NUMERIC DEFAULT 0,
    evidence_strength NUMERIC DEFAULT 0,
    gap_score NUMERIC DEFAULT 0,
    source_breakdown JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE career_goals (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dream_job_title TEXT NOT NULL,
    dream_company TEXT,
    target_location TEXT,
    target_salary INTEGER,
    readiness_score NUMERIC DEFAULT 0,
    reality_check_score NUMERIC DEFAULT 0,
    interview_probability NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE roadmaps (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    career_goal_id UUID REFERENCES career_goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    days INTEGER DEFAULT 30,
    compression_score NUMERIC DEFAULT 0,
    completion_rate NUMERIC DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
    day INTEGER NOT NULL,
    topic TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    estimated_hours NUMERIC DEFAULT 1,
    resources JSONB DEFAULT '{}'::jsonb,
    mini_challenge TEXT,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE resume_analyses (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name TEXT,
    ats_score NUMERIC DEFAULT 0,
    resume_strength NUMERIC DEFAULT 0,
    missing_keywords JSONB DEFAULT '[]'::jsonb,
    improved_bullets JSONB DEFAULT '[]'::jsonb,
    raw_text_excerpt TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE github_analyses (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    languages JSONB DEFAULT '{}'::jsonb,
    activity_score NUMERIC DEFAULT 0,
    project_depth_score NUMERIC DEFAULT 0,
    shadow_learning_risk NUMERIC DEFAULT 0,
    findings JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mock_interviews (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mode TEXT NOT NULL,
    questions JSONB DEFAULT '[]'::jsonb,
    transcript TEXT,
    communication_score NUMERIC DEFAULT 0,
    confidence_score NUMERIC DEFAULT 0,
    technical_score NUMERIC DEFAULT 0,
    feedback JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE learning_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    xp_earned INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE projects (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    level TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack JSONB DEFAULT '[]'::jsonb,
    github_structure JSONB DEFAULT '{}'::jsonb,
    deployment_guide JSONB DEFAULT '[]'::jsonb,
    api_suggestions JSONB DEFAULT '[]'::jsonb,
    resume_impact_score NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ai_reports (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL,
    summary TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    model TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
