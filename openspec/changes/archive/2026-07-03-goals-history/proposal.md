## Why

Poupai currently stores a single `profiles.investment_goal`, which makes the user's target disposable and prevents goal history. The MVP needs durable goals so completed targets remain visible and later macro allocation work can choose the right open goal as its calculation basis.

## What Changes

- Introduce a `goals` data model owned by each authenticated user.
- Preserve reached goals with `reached_at` instead of deleting or overwriting them.
- Support an active/open goal that replaces `profiles.investment_goal` as the source for the current target amount.
- Migrate existing `profiles.investment_goal` values into an initial active goal.
- Update app/domain/database types and data hooks to read goal data from `goals`.
- Keep macro allocation behavior otherwise compatible until the follow-up macro-goal allocation PR.

## Capabilities

### New Capabilities
- `investment-goals`: Covers goal records, status/history semantics, active goal selection, and migration away from `profiles.investment_goal`.

### Modified Capabilities
- None.

## Impact

- Affects Supabase migrations, generated database types, domain types, and hooks/screens that currently read or write `profiles.investment_goal`.
- Requires RLS policies for the new `goals` table.
- Updates `save_macro_mvp_plan` so onboarding can persist the current goal through the new table.
- Does not implement macro allocation against the nearest open goal; that remains the next OpenSpec change.
