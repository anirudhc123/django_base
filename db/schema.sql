-- This is a simulated export from dbdiagram.io. Paste this into dbdiagram.io to visualize:
  -- Users table (accounts_user)
  CREATE TABLE accounts_user (
      id BIGSERIAL PRIMARY KEY,
      email VARCHAR(254) UNIQUE NOT NULL,
      password VARCHAR(128) NOT NULL,
      username VARCHAR(150) NOT NULL,
      role VARCHAR(10) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
      is_active BOOLEAN DEFAULT TRUE,
      first_name VARCHAR(150),
      last_name VARCHAR(150),
      is_staff BOOLEAN DEFAULT FALSE,
      is_superuser BOOLEAN DEFAULT FALSE,
      date_joined TIMESTAMP NOT NULL,
      last_login TIMESTAMP
  );

  -- Tasks table (tasks_task)
  CREATE TABLE tasks_task (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(20) CHECK (status IN ('To Do', 'In Progress', 'Done')) DEFAULT 'To Do',
      time_taken INTEGER DEFAULT 0,
      due_date DATE,
      user_id BIGINT NOT NULL REFERENCES accounts_user(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Django migrations table (created automatically by Django)
  CREATE TABLE django_migrations (
      id BIGSERIAL PRIMARY KEY,
      app VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      applied TIMESTAMP NOT NULL
  );
  CREATE TABLE accounts_user_groups (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES accounts_user(id),
    group_id INTEGER NOT NULL REFERENCES auth_group(id)
);

CREATE TABLE accounts_user_user_permissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES accounts_user(id),
    permission_id INTEGER NOT NULL REFERENCES auth_permission(id)
);