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

  SELECT COALESCE(SUM((value->>'ideal_percent')::numeric), 0)
  INTO v_percent_total
  FROM jsonb_array_elements(p_macros);

  IF v_percent_total < 0.9999 OR v_percent_total > 1.0001 THEN
    RAISE EXCEPTION 'A soma das porcentagens precisa ser 100%%. Soma atual: %', v_percent_total;
  END IF;

  INSERT INTO profiles (
    id,
    investment_goal,
    risk_profile,
    onboarding_completed_at,
    macro_allocation_completed_at
  )
  VALUES (v_user_id, p_investment_goal, p_risk_profile, now(), now())
  ON CONFLICT (id) DO UPDATE
  SET investment_goal = EXCLUDED.investment_goal,
      risk_profile = EXCLUDED.risk_profile,
      onboarding_completed_at = COALESCE(profiles.onboarding_completed_at, now()),
      macro_allocation_completed_at = now(),
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

GRANT EXECUTE ON FUNCTION save_macro_mvp_plan(numeric, text, jsonb) TO authenticated;
