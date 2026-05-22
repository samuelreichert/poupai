CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  investment_goal numeric NOT NULL DEFAULT 0,
  risk_profile text CHECK (risk_profile IN ('conservative', 'moderate', 'aggressive')),
  onboarding_completed_at timestamptz,
  macro_allocation_completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS macros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  name text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('stocks', 'fiis', 'etf_exterior', 'tesouro', 'renda_fixa', 'cripto', 'custom')),
  ideal_percent numeric NOT NULL CHECK (ideal_percent >= 0 AND ideal_percent <= 1),
  display_order int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  macro_id uuid NOT NULL REFERENCES macros(id) ON DELETE CASCADE,
  symbol text,
  name text NOT NULL,
  weight numeric CHECK (weight IS NULL OR (weight >= 0 AND weight <= 1)),
  manual_current_value numeric CHECK (manual_current_value IS NULL OR manual_current_value >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION check_macro_percent_sum()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  total_percent numeric;
BEGIN
  SELECT COALESCE(SUM(ideal_percent), 0)
  INTO total_percent
  FROM macros
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);

  IF total_percent = 0 THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  IF total_percent < 0.9999 OR total_percent > 1.0001 THEN
    RAISE EXCEPTION 'Sum of ideal_percent for user % must equal 1.0, got %',
      COALESCE(NEW.user_id, OLD.user_id), total_percent;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER macros_set_updated_at
BEFORE UPDATE ON macros
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER assets_set_updated_at
BEFORE UPDATE ON assets
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE CONSTRAINT TRIGGER macro_percent_sum_insert
AFTER INSERT ON macros
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_macro_percent_sum();

CREATE CONSTRAINT TRIGGER macro_percent_sum_update
AFTER UPDATE ON macros
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_macro_percent_sum();

CREATE CONSTRAINT TRIGGER macro_percent_sum_delete
AFTER DELETE ON macros
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_macro_percent_sum();

CREATE OR REPLACE VIEW v_macro_position
WITH (security_invoker = true)
AS
SELECT
  m.id AS macro_id,
  m.user_id,
  m.name,
  m.kind,
  m.ideal_percent,
  m.display_order,
  COALESCE(SUM(a.manual_current_value), 0) AS current_value
FROM macros m
LEFT JOIN assets a ON a.macro_id = m.id
GROUP BY m.id;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE macros ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles
FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can read own macros" ON macros
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can manage own macros" ON macros
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own assets" ON assets
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can manage own assets" ON assets
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
