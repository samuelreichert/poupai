import { MacroKind } from '@/types/domain';

export type MacroPlanInput = {
  id?: string;
  name: string;
  kind: MacroKind;
  idealPercent: number;
  currentValue: number;
  displayOrder: number;
};

export type MacroAllocationRow = MacroPlanInput & {
  idealValue: number;
  currentPercent: number;
  diffToIdeal: number;
};

export const STARTER_MACRO_PLAN: MacroPlanInput[] = [
  { name: 'Ações', kind: 'stocks', idealPercent: 0, currentValue: 0, displayOrder: 1 },
  { name: 'ETFs Exterior', kind: 'etf_exterior', idealPercent: 0, currentValue: 0, displayOrder: 2 },
  { name: 'Tesouro Direto', kind: 'tesouro', idealPercent: 0, currentValue: 0, displayOrder: 3 },
  { name: 'Imóveis e FIIs', kind: 'fiis', idealPercent: 0, currentValue: 0, displayOrder: 4 },
  { name: 'Digital e Cripto', kind: 'cripto', idealPercent: 0, currentValue: 0, displayOrder: 5 },
  { name: 'Renda Fixa', kind: 'renda_fixa', idealPercent: 0, currentValue: 0, displayOrder: 6 },
];

export const DEFAULT_INVESTMENT_GOAL = 0;

export function getTotalCurrentValue(macros: MacroPlanInput[]): number {
  return macros.reduce((sum, macro) => sum + macro.currentValue, 0);
}

export function getIdealPercentTotal(macros: MacroPlanInput[]): number {
  return macros.reduce((sum, macro) => sum + macro.idealPercent, 0);
}

export function isCompleteIdealPercentTotal(total: number): boolean {
  return total >= 0.9999 && total <= 1.0001;
}

export function getMacroAllocationRows(
  investmentGoal: number,
  macros: MacroPlanInput[],
): MacroAllocationRow[] {
  const totalCurrentValue = getTotalCurrentValue(macros);

  return macros.map((macro) => {
    const idealValue = investmentGoal * macro.idealPercent;
    const currentPercent = totalCurrentValue > 0 ? macro.currentValue / totalCurrentValue : 0;

    return {
      ...macro,
      idealValue,
      currentPercent,
      diffToIdeal: idealValue - macro.currentValue,
    };
  });
}
