## Context

The previous goals-history change moved the target amount from `profiles.investment_goal` into `goals` and made `useMacroPlan` read a single active goal. That is enough for the current onboarding screen, but it does not fully match the MVP product rule: goals can accumulate over time, and macro allocations should point at the closest open target rather than a disposable profile field.

Current macro math already has the right shape:

```text
idealValue = selectedGoalValue * macro.idealPercent
currentPercent = macro.currentValue / totalCurrentValue
diffToIdeal = idealValue - macro.currentValue
```

The missing piece is selecting `selectedGoalValue` from the right goal record.

## Goals / Non-Goals

**Goals:**

- Let multiple non-reached goals exist for the same user.
- Select the nearest open goal for macro allocation summaries.
- Keep the existing onboarding and macro-edit save flow compatible.
- Preserve reached-goal history and current macro percentage/current-value editing.
- Keep UI output focused on selected goal, ideal percentage, current percentage, ideal value, current value, per-macro difference, and total missing value.

**Non-Goals:**

- No full goal management screen in this PR.
- No automatic reached-goal marking in this PR.
- No market-data integration or asset-level rebalancing.
- No change to the macro percent sum rule.

## Decisions

### Use `open` as the status for not-yet-reached goals

`active` implies there can only be one current goal, which conflicts with accumulated future targets. The implementation should migrate active rows to `open`, allow `status in ('open', 'reached', 'archived')`, and drop the unique partial index that enforced one active goal per user.

Alternative considered: Keep `active` and allow multiple active goals. That would avoid renaming, but it makes the data model harder to understand because multiple rows would be called active.

### Select nearest open goal in app/domain logic

`useMacroPlan` already loads goals and macro positions to build a user-facing summary. It should load open goals and choose:

1. The open goal with the smallest `target_value` greater than or equal to `totalCurrentValue`.
2. If no open goal is above the current total, the largest open goal.
3. If no open goal exists, `0`.

This keeps the selection close to the calculation and avoids a database view/RPC before the product flow needs server-side reuse.

Alternative considered: Create a SQL function for nearest-goal selection. That is useful later if multiple screens need the same selection, but for this MVP it adds surface area without much benefit.

### Keep `MacroPlanSummary.investment_goal` for compatibility

The property name can remain `investment_goal` for this PR, but its value should mean “selected nearest open goal target”. This avoids a broad UI rename while the MVP screens are still stabilizing.

### Preserve the existing save API

`saveMacroPlan(investmentGoal, riskProfile, macros)` and `save_macro_mvp_plan` should keep their call shape. The RPC can create or update the onboarding/main open goal, while future goal-management UI can add additional open goals through dedicated flows.

## Risks / Trade-offs

- Existing rows use `active` → migration updates them to `open` before the status check changes.
- Removing one-active uniqueness can allow duplicate open targets → the MVP still uses one main onboarding goal; future goal-management UI should add duplicate prevention where appropriate.
- Nearest-goal fallback can show a goal below current portfolio value if all open goals are below the current total → this is intentional until automatic reached detection exists.
- Status rename affects TypeScript unions and any queries filtering `active` → implementation must update all app references.
