## Tasks

- [x] Add a Supabase migration for `goals`, RLS policies, indexes, and existing goal backfill.
- [x] Update `save_macro_mvp_plan` to persist the active goal through `goals`.
- [x] Update TypeScript database and domain types for goals.
- [x] Add goal data helpers/hooks needed by the existing macro plan flow.
- [x] Update macro summary reads to use the active goal value instead of `profiles.investment_goal`.
- [x] Preserve the MVP onboarding contract: macro allocation, total goal, current macro values, and global missing value remain available.
- [x] Verify archived OpenSpec files manually, typecheck, lint, and review Supabase schema changes statically because the local OpenSpec/Supabase CLIs were unavailable.
