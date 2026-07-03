import { useCallback, useEffect, useState } from 'react';

import {
  getIdealPercentTotal,
  getMacroAllocationRows,
  getNearestOpenGoal,
  getTotalCurrentValue,
  MacroAllocationRow,
  MacroPlanInput,
} from '@/lib/macro-plan';
import { supabase } from '@/lib/supabase';
import { MacroPlanSummary } from '@/types/domain';

export function useMacroPlan() {
  const [rows, setRows] = useState<MacroAllocationRow[]>([]);
  const [summary, setSummary] = useState<MacroPlanSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    const { data: profile } = await supabase
      .from('profiles')
      .select('macro_allocation_completed_at')
      .maybeSingle();

    const { data: openGoals } = await supabase
      .from('goals')
      .select('id, target_value')
      .eq('status', 'open')
      .order('target_value', { ascending: true })
      .order('created_at', { ascending: true });

    const { data: macros } = await supabase
      .from('v_macro_position')
      .select('*')
      .order('display_order', { ascending: true });

    const inputs: MacroPlanInput[] = (macros ?? []).map((macro) => ({
      id: macro.macro_id,
      name: macro.name,
      kind: macro.kind,
      idealPercent: macro.ideal_percent,
      currentValue: macro.current_value,
      displayOrder: macro.display_order,
    }));

    const totalCurrentValue = getTotalCurrentValue(inputs);
    const nearestOpenGoal = getNearestOpenGoal(
      totalCurrentValue,
      (openGoals ?? []).map((goal) => ({
        id: goal.id,
        targetValue: goal.target_value,
      })),
    );
    const investmentGoal = nearestOpenGoal?.targetValue ?? 0;
    const nextRows = getMacroAllocationRows(investmentGoal, inputs);
    const idealPercentTotal = getIdealPercentTotal(inputs);

    setRows(nextRows);
    setSummary({
      investment_goal: investmentGoal,
      total_current_value: totalCurrentValue,
      remaining_to_goal: Math.max(investmentGoal - totalCurrentValue, 0),
      ideal_percent_total: idealPercentTotal,
      macro_allocation_completed_at: profile?.macro_allocation_completed_at ?? null,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { rows, summary, loading, reload: load };
}
