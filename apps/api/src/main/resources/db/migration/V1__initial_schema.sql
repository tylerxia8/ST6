CREATE TABLE supporting_outcomes (
    id UUID PRIMARY KEY,
    rally_cry VARCHAR(160) NOT NULL,
    defining_objective VARCHAR(200) NOT NULL,
    outcome VARCHAR(240) NOT NULL,
    owner VARCHAR(120) NOT NULL,
    created_by VARCHAR(120) NOT NULL,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL,
    last_modified_by VARCHAR(120),
    last_modified_date TIMESTAMP WITH TIME ZONE
);

CREATE TABLE weekly_plans (
    id UUID PRIMARY KEY,
    week_start DATE NOT NULL,
    owner_id VARCHAR(80) NOT NULL,
    owner_name VARCHAR(160) NOT NULL,
    manager_id VARCHAR(80) NOT NULL,
    lifecycle_state VARCHAR(40) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(120) NOT NULL,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL,
    last_modified_by VARCHAR(120),
    last_modified_date TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_weekly_plan_owner_week UNIQUE (owner_id, week_start)
);

CREATE TABLE weekly_commits (
    id UUID PRIMARY KEY,
    weekly_plan_id UUID NOT NULL REFERENCES weekly_plans(id) ON DELETE CASCADE,
    supporting_outcome_id UUID NOT NULL REFERENCES supporting_outcomes(id),
    title VARCHAR(180) NOT NULL,
    description TEXT,
    category VARCHAR(40) NOT NULL,
    priority INTEGER NOT NULL,
    planned_hours NUMERIC(6, 2) NOT NULL,
    actual_hours NUMERIC(6, 2) NOT NULL DEFAULT 0,
    status VARCHAR(40) NOT NULL,
    manager_note TEXT,
    created_by VARCHAR(120) NOT NULL,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL,
    last_modified_by VARCHAR(120),
    last_modified_date TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_weekly_commits_plan ON weekly_commits(weekly_plan_id);
CREATE INDEX idx_weekly_commits_outcome ON weekly_commits(supporting_outcome_id);
