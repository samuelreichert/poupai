## Why

The current MVP onboarding asks for goal, macro percentages, and current values in one dense screen. New users need a guided sequence that starts with choosing the macros they actually want to track, then captures the target goal, then captures current values so the home screen is useful immediately.

## What Changes

- Replace the single onboarding form with a step-based MVP onboarding flow.
- Let users select which starter macros they want to include before assigning allocation percentages.
- Capture ideal percentages only for selected macros and require the selected total to equal 100%.
- Capture the total portfolio goal as its own step.
- Capture current value for each selected macro as the final data-entry step.
- Save only selected macros through the existing `saveMacroPlan`/`save_macro_mvp_plan` path.
- Route users to the existing tabs after onboarding completes.

## Capabilities

### New Capabilities
- `mvp-onboarding-flow`: Covers first-run onboarding steps, selected macro state, validation, and final handoff to the app.

### Modified Capabilities
- `investment-goals`: Clarifies that the onboarding goal step happens after macro selection/allocation and before current macro values are captured.

## Impact

- Affects `app/(onboarding)/macros.tsx` and likely small helpers in `lib/macro-plan.ts`.
- Reuses existing inputs, theme tokens, Supabase RPC, and route guard behavior.
- Does not add new dependencies, new tables, or full goal-management UI.
- Does not implement custom macro creation; starter macro selection is enough for this MVP pass.
