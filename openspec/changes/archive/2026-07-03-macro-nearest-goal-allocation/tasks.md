## 1. Goal Status Model

- [x] 1.1 Add a Supabase migration that changes non-reached goals from `active` to `open`.
- [x] 1.2 Remove the one-active-goal uniqueness constraint so multiple open goals can exist.
- [x] 1.3 Update `save_macro_mvp_plan` to create or update the main onboarding open goal without duplicating it on every macro edit.
- [x] 1.4 Update TypeScript database and domain goal status unions from `active` to `open`.

## 2. Nearest Goal Selection

- [x] 2.1 Add a focused goal-selection helper for nearest open goal behavior.
- [x] 2.2 Update `useMacroPlan` to load open goals and calculate rows against the selected nearest open goal.
- [x] 2.3 Preserve summary output for selected goal target, total current value, total missing value, and macro allocation completion state.

## 3. Verification

- [x] 3.1 Add or update focused tests for nearest open goal selection and macro allocation calculations.
- [x] 3.2 Run OpenSpec validation for `macro-nearest-goal-allocation`.
- [x] 3.3 Run typecheck and lint.
- [x] 3.4 Run relevant Supabase/schema checks when local CLI support is available, or document the static validation fallback.
