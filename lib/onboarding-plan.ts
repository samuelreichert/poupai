import type { MacroPlanInput } from '@/lib/macro-plan';
import type { MacroKind } from '@/types/domain';

export type OnboardingMacroDraft = MacroPlanInput & {
  selected: boolean;
};

export function createOnboardingMacroDraft(macros: MacroPlanInput[]): OnboardingMacroDraft[] {
  return macros.map((macro) => ({
    ...macro,
    selected: false,
  }));
}

export function toggleOnboardingMacroSelection(
  macros: OnboardingMacroDraft[],
  kind: MacroKind,
): OnboardingMacroDraft[] {
  return macros.map((macro) =>
    macro.kind === kind
      ? {
          ...macro,
          selected: !macro.selected,
        }
      : macro,
  );
}

export function updateOnboardingMacroDraft(
  macros: OnboardingMacroDraft[],
  kind: MacroKind,
  patch: Partial<Pick<OnboardingMacroDraft, 'idealPercent' | 'currentValue'>>,
): OnboardingMacroDraft[] {
  return macros.map((macro) => (macro.kind === kind ? { ...macro, ...patch } : macro));
}

export function getSelectedOnboardingMacros(macros: OnboardingMacroDraft[]): OnboardingMacroDraft[] {
  return macros.filter((macro) => macro.selected);
}

export function getOnboardingSaveMacros(macros: OnboardingMacroDraft[]): MacroPlanInput[] {
  return getSelectedOnboardingMacros(macros).map((macro, index) => ({
    name: macro.name,
    kind: macro.kind,
    idealPercent: macro.idealPercent,
    currentValue: macro.currentValue,
    displayOrder: index + 1,
  }));
}

export function hasSelectedOnboardingMacros(macros: OnboardingMacroDraft[]): boolean {
  return getSelectedOnboardingMacros(macros).length > 0;
}
