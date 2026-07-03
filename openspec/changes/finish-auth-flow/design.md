## Overview

This change turns the single mixed auth screen into a small email/password auth flow:

- `/(auth)/sign-in`
- `/(auth)/sign-up`
- `/(auth)/check-email`

The root `AuthGate` remains responsible for signed-in routing. Screens should not duplicate the profile/onboarding decision.

## Supabase Behavior

Supabase `signInWithPassword` returns an error for invalid credentials. Supabase `signUp` may return a session immediately, or may return no session when email confirmation is required. The app should treat `data.session === null` after sign-up as a confirmation handoff and show check-email.

## Hook Design

Add a dedicated auth-flow hook that owns:

- field state
- validation
- loading state
- localized error/status messages
- calls to `useAuth().signIn` and `useAuth().signUp`
- route transitions after sign-up confirmation handoff

Screens remain rendering-focused and receive form state/actions from the hook.

## UI Design

Keep the existing quiet finance-app visual language:

- full-screen `ScrollView` with automatic content insets
- design tokens from `constants/theme.ts`
- `StyleSheet.create()` for reusable styles
- Brazilian Portuguese UI strings
- clear primary action and secondary navigation action

## Non-Goals

- No OAuth providers.
- No password reset flow.
- No schema or RLS change.
- No email deep-link callback handling.
- No new dependencies.
