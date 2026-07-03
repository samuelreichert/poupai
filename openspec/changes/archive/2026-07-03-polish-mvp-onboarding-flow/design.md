## Context

The current onboarding screen at `app/(onboarding)/macros.tsx` is a single dense form. It initializes all starter macros, asks for investment goal, ideal percentages, and current values together, then saves everything through `saveMacroPlan`.

That implementation is technically useful, but it creates a poor first-run experience:

- users cannot explicitly choose which macros they want;
- unselected starter macros can still be saved with zero values;
- goal, allocation, and current values compete for attention;
- the user does not get a clear sense of progress through onboarding.

## Goals / Non-Goals

**Goals:**

- Turn onboarding into a guided MVP wizard.
- Keep the implementation inside the existing onboarding route unless implementation reveals a real need for nested routes.
- Let users choose starter macros before entering percentages.
- Require ideal percentages to total 100% only across selected macros.
- Require a positive total goal before current values are requested.
- Let current macro values be zero.
- Save only selected macros through the existing `saveMacroPlan` path.

**Non-Goals:**

- No custom macro creation in this PR.
- No new Supabase tables or migrations.
- No partial persistence/resume across app restarts.
- No risk profile UI; the existing `moderate` value can remain for this MVP pass.
- No full goal-management/history screen.

## Decisions

### Use one route with internal step state

Keep `app/(onboarding)/macros.tsx` as the onboarding entry point and manage step state inside the screen or a focused hook. This avoids changing AuthGate and route structure while still making the flow feel sequential.

Alternative considered: Separate routes for each onboarding step. That may be useful later for persistence/deep links, but it adds navigation surface before the MVP needs it.

### Keep one final save

The wizard should keep draft state locally and call `saveMacroPlan` only at the final step. This preserves the current RPC contract and avoids partially completed server state.

Alternative considered: Save after every step. Rejected for this pass because partial onboarding recovery is explicitly out of scope.

### Filter unselected macros before save

Selected macros are the source of truth. The save payload should include only selected macros, with their ideal percentages, current values, and display order normalized from the selected order.

### Reuse existing inputs and design tokens

Use existing `CurrencyInput`, `PercentInput`, theme tokens, and local StyleSheet patterns. Add small local controls only where needed, such as selectable macro rows/cards and step navigation.

## Risks / Trade-offs

- [Risk] Users select too many macros and face too many percentage inputs. -> Mitigation: keep starter macro list short and make back navigation cheap.
- [Risk] Users choose macros but never reach 100%. -> Mitigation: keep a visible total/remaining validation on the allocation step.
- [Risk] One-route wizard state is lost on app restart. -> Mitigation: accepted for MVP; partial persistence can be a later PR.
- [Risk] Filtering unselected macros can surprise users who expected them to appear later. -> Mitigation: clearly present selection as “classes que você quer acompanhar agora”.
