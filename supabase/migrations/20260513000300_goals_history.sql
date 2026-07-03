CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  name text NOT NULL,
  target_value numeric NOT NULL CHECK (target_value >= 0),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reached', 'archived')),
  reached_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT goals_reached_at_status_check CHECK (
    (status = 'reached' AND reached_at IS NOT NULL)
    OR (status <> 'reached' AND reached_at IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS goals_user_status_created_at_idx
ON goals (user_id, status, created_at);

CREATE UNIQUE INDEX IF NOT EXISTS goals_one_active_goal_per_user_idx
ON goals (user_id)
WHERE status = 'active';

CREATE TRIGGER goals_set_updated_at
BEFORE UPDATE ON goals
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own goals" ON goals
FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own goals" ON goals
FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own goals" ON goals
FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own goals" ON goals
FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON goals TO authenticated;

INSERT INTO goals (user_id, name, target_value, status, created_at, updated_at)
SELECT id, 'Meta principal', investment_goal, 'active', now(), now()
FROM profiles
WHERE investment_goal > 0
ON CONFLICT (user_id) WHERE status = 'active'
DO UPDATE
SET target_value = EXCLUDED.target_value,
    updated_at = now();

CREATE OR REPLACE FUNCTION save_macro_mvp_plan(
  p_investment_goal numeric,
  p_risk_profile text,
  p_macros jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_percent_total numeric;
  v_macro record;
  v_macro_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  IF p_investment_goal < 0 THEN
    RAISE EXCEPTION 'A meta de investimento não pode ser negativa';
  END IF;

  SELECT COALESCE(SUM((value->>'ideal_percent')::numeric), 0)
  INTO v_percent_total
  FROM jsonb_array_elements(p_macros);

  IF v_percent_total < 0.9999 OR v_percent_total > 1.0001 THEN
    RAISE EXCEPTION 'A soma das porcentagens precisa ser 100%%. Soma atual: %', v_percent_total;
  END IF;

  INSERT INTO profiles (
    id,
    risk_profile,
    onboarding_completed_at,
    macro_allocation_completed_at
  )
  VALUES (v_user_id, p_risk_profile, now(), now())
  ON CONFLICT (id) DO UPDATE
  SET risk_profile = EXCLUDED.risk_profile,
      onboarding_completed_at = COALESCE(profiles.onboarding_completed_at, now()),
      macro_allocation_completed_at = now(),
      updated_at = now();

  INSERT INTO goals (user_id, name, target_value, status)
  VALUES (v_user_id, 'Meta principal', p_investment_goal, 'active')
  ON CONFLICT (user_id) WHERE status = 'active'
  DO UPDATE
  SET name = EXCLUDED.name,
      target_value = EXCLUDED.target_value,
      updated_at = now();

  DELETE FROM macros WHERE user_id = v_user_id;

  FOR v_macro IN
    SELECT *
    FROM jsonb_to_recordset(p_macros) AS x(
      name text,
      kind text,
      ideal_percent numeric,
      current_value numeric,
      display_order int
    )
  LOOP
    INSERT INTO macros (user_id, name, kind, ideal_percent, display_order)
    VALUES (v_user_id, v_macro.name, v_macro.kind, v_macro.ideal_percent, v_macro.display_order)
    RETURNING id INTO v_macro_id;

    INSERT INTO assets (user_id, macro_id, symbol, name, weight, manual_current_value)
    VALUES (
      v_user_id,
      v_macro_id,
      NULL,
      'Saldo manual',
      NULL,
      v_macro.current_value
    );
  END LOOP;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION save_macro_mvp_plan(numeric, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION save_macro_mvp_plan(numeric, text, jsonb) TO authenticated;

ALTER TABLE profiles DROP COLUMN IF EXISTS investment_goal;
