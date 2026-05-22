import { supabase } from '@/lib/supabase';
import { MacroPlanInput } from '@/lib/macro-plan';
import { RiskProfile } from '@/types/domain';

export async function saveMacroPlan(
  investmentGoal: number,
  riskProfile: RiskProfile | null,
  macros: MacroPlanInput[],
) {
  const { error } = await supabase.rpc('save_macro_mvp_plan', {
    p_investment_goal: investmentGoal,
    p_risk_profile: riskProfile,
    p_macros: macros.map((macro) => ({
      name: macro.name,
      kind: macro.kind,
      ideal_percent: macro.idealPercent,
      current_value: macro.currentValue,
      display_order: macro.displayOrder,
    })),
  });

  if (error) {
    throw error;
  }
}
