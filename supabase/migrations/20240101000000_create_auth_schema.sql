-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create instances table first (since users references it)
CREATE TABLE IF NOT EXISTS auth.instances (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  uuid uuid NULL,
  raw_base_config text NULL,
  created_at timestamptz NULL,
  updated_at timestamptz NULL
);

-- Create users table
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_id uuid NULL REFERENCES auth.instances (id),
  aud varchar(255) NULL,
  role varchar(255) NULL,
  email varchar(255) NULL UNIQUE,
  encrypted_password varchar(255) NULL,
  email_confirmed_at timestamptz NULL,
  invited_at timestamptz NULL,
  confirmation_token varchar(255) NULL,
  confirmation_sent_at timestamptz NULL,
  recovery_token varchar(255) NULL,
  recovery_sent_at timestamptz NULL,
  email_change_token varchar(255) NULL,
  email_change varchar(255) NULL,
  email_change_sent_at timestamptz NULL,
  last_sign_in_at timestamptz NULL,
  raw_app_meta_data jsonb NULL,
  raw_user_meta_data jsonb NULL,
  is_super_admin bool NULL,
  created_at timestamptz NULL,
  updated_at timestamptz NULL,
  phone varchar(15) NULL UNIQUE,
  phone_confirmed_at timestamptz NULL,
  phone_change varchar(15) NULL,
  phone_change_token varchar(255) NULL,
  phone_change_sent_at timestamptz NULL,
  confirmed_at timestamptz NULL GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
  email_change_confirm_status smallint NULL DEFAULT 0,
  banned_until timestamptz NULL,
  reauthentication_token varchar(255) NULL,
  reauthentication_sent_at timestamptz NULL,
  CONSTRAINT users_email_check CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$')
);

-- Create mfa_factors table (since sessions references it)
CREATE TABLE IF NOT EXISTS auth.mfa_factors (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friendly_name text NULL,
  factor_type varchar(255) NOT NULL,
  status varchar(255) NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  secret text NULL,
  UNIQUE(user_id, friendly_name)
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS auth.sessions (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NULL,
  updated_at timestamptz NULL,
  factor_id uuid NULL REFERENCES auth.mfa_factors(id) ON DELETE CASCADE,
  aal varchar(255) NULL,
  not_after timestamptz NULL
);

-- Create identities table with modified constraint
CREATE TABLE IF NOT EXISTS auth.identities (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  identity_data jsonb NOT NULL,
  provider varchar(255) NOT NULL,
  last_sign_in_at timestamptz NULL,
  created_at timestamptz NULL,
  updated_at timestamptz NULL
);

-- Add a function to extract sub from identity_data
CREATE OR REPLACE FUNCTION auth.identity_data_sub(identity_data jsonb)
RETURNS text AS $$
BEGIN
  RETURN identity_data->>'sub';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create a unique index instead of a constraint
CREATE UNIQUE INDEX IF NOT EXISTS identities_provider_sub_idx 
ON auth.identities (provider, auth.identity_data_sub(identity_data));

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
  id bigint NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  token varchar(255) NULL UNIQUE,
  user_id varchar(255) NULL,
  revoked boolean NULL,
  created_at timestamptz NULL,
  updated_at timestamptz NULL,
  parent varchar(255) NULL,
  session_id uuid NULL REFERENCES auth.sessions(id) ON DELETE CASCADE
);

-- Create mfa_challenges table
CREATE TABLE IF NOT EXISTS auth.mfa_challenges (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  factor_id uuid NOT NULL REFERENCES auth.mfa_factors(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL,
  verified_at timestamptz NULL,
  ip_address inet NOT NULL
);

-- Create mfa_amr_claims table
CREATE TABLE IF NOT EXISTS auth.mfa_amr_claims (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL REFERENCES auth.sessions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  authentication_method varchar(255) NOT NULL,
  UNIQUE(session_id, authentication_method)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users(instance_id);
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users(email);
CREATE INDEX IF NOT EXISTS identities_user_id_idx ON auth.identities(user_id);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON auth.sessions(user_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_token_idx ON auth.refresh_tokens(token);
CREATE INDEX IF NOT EXISTS refresh_tokens_user_id_idx ON auth.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS mfa_factors_user_id_idx ON auth.mfa_factors(user_id);
CREATE INDEX IF NOT EXISTS mfa_challenges_factor_id_idx ON auth.mfa_challenges(factor_id);
CREATE INDEX IF NOT EXISTS mfa_amr_claims_session_id_idx ON auth.mfa_amr_claims(session_id);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
    select 
        coalesce(
            nullif(current_setting('request.jwt.claim.sub', true), ''),
            (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
        )::uuid
$$;

CREATE OR REPLACE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
    select 
        coalesce(
            nullif(current_setting('request.jwt.claim.role', true), ''),
            (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
        )::text
$$;

CREATE OR REPLACE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
    select 
        coalesce(
            nullif(current_setting('request.jwt.claim.email', true), ''),
            (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
        )::text
$$; 