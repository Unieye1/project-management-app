-- migrate:up

CREATE TYPE task_status AS ENUM ('pending','in_progress','completed','cancelled');
CREATE TYPE project_status AS ENUM ('active','in_progress','completed');
CREATE TYPE member_role AS ENUM ('member','admin','owner');



CREATE TABLE users (
    id UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL ,
    email TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE users_profiles (
    id UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users ON DELETE CASCADE,
    name TEXT NOT NULL ,
    bio TEXT ,
    phone TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE projects(
   id UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
   owner_id UUID NOT NULL  REFERENCES users ON DELETE RESTRICT,
   name TEXT NOT NULL,
   status project_status NOT NULL  DEFAULT 'active' ,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE tasks (
    id UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL  REFERENCES projects ON DELETE CASCADE,
    title TEXT NOT NULL,
     description TEXT,
     priority INTEGER NOT NULL DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    due_date DATE,
    assigned_at UUID REFERENCES users ON DELETE SET NULL,
   status task_status NOT NULL  DEFAULT 'pending' ,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
CREATE TABLE project_members (
    project_id UUID NOT NULL REFERENCES projects ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users ON DELETE CASCADE,
    role member_role NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id)
);


-- migrate:down
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS users_profiles;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS project_members;
DROP TYPE IF EXISTS task_status ;
DROP TYPE IF EXISTS project_status ;
DROP TYPE IF EXISTS member_role ;