## Overview

This change extracts investment targets from `profiles.investment_goal` into a first-class `goals` table. The goal table becomes the place for active and historical goals, while the existing macro allocation UI can continue using a single current target value through updated hooks/RPCs.

## Data Model

Proposed table:

```sql
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade default auth.uid(),
  name text not null,
  target_value numeric not null check (target_value >= 0),
  status text not null check (status in ('active', 'reached', 'archived')),
  reached_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Indexes/constraints:

- Index `goals_user_status_created_at_idx` for active/history reads.
- Partial unique index for one active goal per user: `where status = 'active'`.
- Check that `reached_at` is set when status is `reached` and empty otherwise.

## Migration Strategy

1. Create `goals`.
2. Enable RLS and add user-owned policies with `TO authenticated`, `USING`, and `WITH CHECK`.
3. Backfill one active goal for profiles whose `investment_goal > 0`.
4. Update `save_macro_mvp_plan` to upsert the active goal instead of updating `profiles.investment_goal`.
5. Drop `profiles.investment_goal` after the active goals are backfilled and `save_macro_mvp_plan` no longer writes to that profile field.

## App/Data Flow

- Add goal domain types such as `GoalStatus` and `InvestmentGoal`.
- Update generated `Database` types with `goals` and any new RPC/view shape.
- Update `useMacroPlan` to read the active goal amount from `goals`.
- Keep `MacroPlanSummary.investment_goal` as a compatibility property for this PR, backed by the active goal.
- Keep onboarding UI unchanged visually: the "Meta de investimento" input still saves a current goal.

## MVP Onboarding Flow

The MVP flow should remain oriented around a first usable portfolio:

1. User creates an account.
2. User chooses the macros they want to hold or already hold.
3. User sets ideal percentages for those macros.
4. User registers the total portfolio goal.
5. User registers how much they already have in each macro.
6. User can view ideal percentage, current percentage, ideal value, current value, missing value by macro, and total missing value for the active goal.

This change supports the goal persistence part of that flow. The larger onboarding step split and macro selection UX can happen in follow-up UI work without changing the goal storage model.

## Security Notes

- New public-schema table must have RLS enabled.
- Policies must filter by `user_id = auth.uid()` and include `WITH CHECK` for inserts/updates.
- Because Supabase changed exposure behavior for new public tables in 2026, confirm API access/grants during implementation if local or remote tests show table access issues.
- Avoid introducing new `SECURITY DEFINER` functions. The existing `save_macro_mvp_plan` is already `SECURITY DEFINER`; changes must preserve the explicit `auth.uid()` guard.

## Non-Goals

- No UI for managing multiple goals yet.
- No automatic reached-goal detection.
- No macro calculation against nearest open goal; that is the next change.
- No deletion of historical goals.
