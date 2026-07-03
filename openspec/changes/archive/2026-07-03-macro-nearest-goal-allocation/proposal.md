## Why

Macro allocation currently calculates against a single active goal. The MVP needs the allocation target to follow the nearest open investment goal so users with accumulated goals can see the next practical target without losing reached-goal history.

## What Changes

- Select the nearest open goal as the calculation basis for macro ideal values and missing amounts.
- Treat open goals as ordered targets, preferring the smallest open `target_value` that is greater than or equal to the current total portfolio value.
- Preserve the current macro math: ideal value is selected goal value multiplied by the macro ideal percentage, and missing value is ideal value minus current value.
- Keep the portfolio summary showing the selected goal value and total missing amount for that goal.
- Prepare goal status semantics so more than one open goal can exist for future goal-management UI.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `investment-goals`: Defines nearest-open goal selection for macro allocation and open-goal status semantics.

## Impact

- Affects goal selection in `useMacroPlan`, macro allocation summary values, and goal status/types.
- May require a Supabase migration to allow multiple open goals instead of one unique active goal.
- Keeps onboarding and macro editing APIs compatible with the existing `save_macro_mvp_plan` call shape.
- Does not add full multi-goal management UI; goal creation/history screens remain follow-up work.
