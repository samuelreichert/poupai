## 1. Onboarding Draft Model

- [x] 1.1 Add focused helper types/functions for selected macro draft state.
- [x] 1.2 Ensure selected macros are the only macros included in the final save payload.
- [x] 1.3 Preserve the existing `saveMacroPlan` API and Supabase RPC shape.

## 2. Wizard UI

- [x] 2.1 Refactor `app/(onboarding)/macros.tsx` into an internal step-based flow.
- [x] 2.2 Add macro selection step with at least-one-selected validation.
- [x] 2.3 Add ideal allocation step for selected macros with 100% total validation.
- [x] 2.4 Add goal step with positive-goal validation.
- [x] 2.5 Add current values step that accepts zero or positive values.
- [x] 2.6 Add back/continue/save controls and localized error/validation text.

## 3. Completion

- [x] 3.1 Save selected macros, goal, percentages, and current values through `saveMacroPlan`.
- [x] 3.2 Route to the existing tabs after successful save.
- [x] 3.3 Keep the user in onboarding and show retry feedback when save fails.

## 4. Verification

- [x] 4.1 Add or update focused tests for onboarding draft filtering/validation helpers if helpers are introduced.
- [x] 4.2 Run OpenSpec validation for `polish-mvp-onboarding-flow`.
- [x] 4.3 Run typecheck and lint.
