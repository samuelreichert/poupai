# Poupai Recovery Roadmap

## Decision

Keep and recover the existing project instead of restarting from scratch.

Reasons:

- The app already has Expo Router, native tabs, Supabase auth plumbing, MMKV-backed settings, macro allocation calculations, onboarding, and a Supabase schema with RLS.
- `npm run typecheck` and `npm run lint` passed before the recovery work began.
- The main waste is isolated SDK 56 demo code, not a broken product architecture.

## Branch Plan

### PR 1: Foundation

Branch: `chore/openspec-sdk57-foundation`

Scope:

- Remove SDK 56 demo routes/components.
- Add OpenSpec with Codex support.
- Keep official Expo AI skills from `expo/skills`.
- Migrate Expo SDK 56 to SDK 57.
- Preserve useful non-demo `expo-ideas` changes.

OpenSpec change: `foundation-sdk57-openspec`

Validation note: `expo-doctor` should be run on the branch. A local CocoaPods tooling warning may remain until CocoaPods 1.15.2 or newer is installed on the machine; this is environment setup, not app code.

### PR 2: Auth Flow

Scope:

- Split sign-in and sign-up into clear flows.
- Add loading, validation, confirmation, and session-routing states.
- Keep Supabase auth logic in hooks and rendering in screens.

OpenSpec flow:

1. Explore auth edge cases and current routing.
2. Propose the auth change.
3. Apply tasks.
4. Archive after merge.

### PR 3: Goals History

Scope:

- Replace `profiles.investment_goal` with a `goals` table.
- Add goal history, `reached_at`, status, and active/nearest-open semantics.
- Keep reached goals instead of deleting them.

OpenSpec flow:

1. Explore data model and migration path.
2. Propose the goals change.
3. Apply tasks.
4. Archive after merge.

### PR 4: Macro Allocation Against Nearest Goal

Scope:

- Make macros calculate ideal values against the nearest open goal.
- Keep current macro percentages and current invested values editable.
- Show how much each macro still needs to receive to reach the ideal allocation for that goal.

OpenSpec flow:

1. Explore allocation rules and empty-state behavior.
2. Propose the macro-goal allocation change.
3. Apply tasks.
4. Archive after merge.

## Operating Rule

For each non-trivial branch, use OpenSpec in this order:

1. `explore`
2. `propose`
3. `apply`
4. `archive`

Review gate:

- After `explore`, share the exploration result before creating or applying implementation tasks.
- After `propose`, share the generated OpenSpec artifacts for review.
- Wait for explicit approval before running `apply`.
- After `apply` is approved, continue through implementation and PR creation automatically.
- After the PR is merged, run `archive` automatically and open the small archive PR.
