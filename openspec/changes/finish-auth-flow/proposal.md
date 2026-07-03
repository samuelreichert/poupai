## Why

The current auth screen mixes sign-in and sign-up, then routes every successful submit to onboarding even when Supabase requires email confirmation. This creates a confusing first-run experience and makes the MVP feel unfinished before users can reach portfolio setup.

## What Changes

- Split email/password sign-in and sign-up into separate routes.
- Add boundary validation for email, password length, and password confirmation.
- Show a dedicated check-email state when Supabase creates a user without an immediate session.
- Keep auth business logic in hooks and keep screens focused on rendering.
- Preserve the existing AuthGate routing for signed-in users.

## Capabilities

### New Capabilities
- `user-auth`: Covers email/password sign-in, sign-up, confirmation handoff, and authenticated routing behavior.

### Modified Capabilities
- None.

## Impact

- Affects `app/(auth)`, `hooks/use-auth.ts`, and new auth-flow helpers/hooks.
- Uses the existing `@supabase/supabase-js` dependency and MMKV-backed Supabase storage.
- Does not change database schema, RLS policies, onboarding, goals, or macro allocation behavior.
