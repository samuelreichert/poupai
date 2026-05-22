import { useCallback, useEffect, useState } from 'react';

import { getIdealPercentTotal, getMacroAllocationRows, MacroAllocationRow, MacroPlanInput } from '@/lib/macro-plan';
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
      .select('investment_goal, macro_allocation_completed_at')
      .maybeSingle();

    const { data: macros } = await supabase
      .from('v_macro_position')
      .select('*')
      .order('display_order', { ascending: true });

    const investmentGoal = profile?.investment_goal ?? 0;
    const inputs: MacroPlanInput[] = (macros ?? []).map((macro) => ({
      id: macro.macro_id,
      name: macro.name,
      kind: macro.kind,
      idealPercent: macro.ideal_percent,
      currentValue: macro.current_value,
      displayOrder: macro.display_order,
    }));

    const nextRows = getMacroAllocationRows(investmentGoal, inputs);
    const totalCurrentValue = inputs.reduce((sum, macro) => sum + macro.currentValue, 0);
    const idealPercentTotal = getIdealPercentTotal(inputs);

    setRows(nextRows);
    setSummary({
      investment_goal: investmentGoal,
      total_current_value: totalCurrentValue,
      remaining_to_goal: investmentGoal - totalCurrentValue,
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
