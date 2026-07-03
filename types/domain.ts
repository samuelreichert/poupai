export type MacroKind =
  | 'stocks'
  | 'fiis'
  | 'etf_exterior'
  | 'tesouro'
  | 'renda_fixa'
  | 'cripto'
  | 'custom';

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';
export type GoalStatus = 'active' | 'reached' | 'archived';

export interface Profile {
  id: string;
  display_name: string | null;
  risk_profile: RiskProfile | null;
  onboarding_completed_at: string | null;
  macro_allocation_completed_at: string | null;
}

export interface InvestmentGoal {
  id: string;
  user_id: string;
  name: string;
  target_value: number;
  status: GoalStatus;
  reached_at: string | null;
}

export interface MacroPlanSummary {
  investment_goal: number;
  total_current_value: number;
  remaining_to_goal: number;
  ideal_percent_total: number;
  macro_allocation_completed_at: string | null;
}
