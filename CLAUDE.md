# Poupai — Project Rules for AI

## Project Overview

**Poupai** is a personal finance and stock portfolio tracker, inspired by [investidor10.com.br](https://investidor10.com.br/), GitHub App, and Revolut. It is built with Expo + React Native + TypeScript using a single codebase.

**Platforms:**
- iOS — primary target
- Android — primary target
- Web — secondary target
- macOS / Windows / Linux — out of scope

**Stack:** Expo SDK (latest), Expo Router, React Native, TypeScript, MMKV.

---

## Architecture Rules

- Use `@expo/ui` for native UI components wherever applicable: SwiftUI on iOS, Jetpack Compose on Android.
- Use **Expo Router native tabs** exclusively for tab navigation. Reference: https://docs.expo.dev/versions/latest/sdk/router/native-tabs/
- Prefer Expo SDK modules over third-party libraries. Only reach for a third-party lib if the Expo SDK does not cover the need.
- Keep `newArchEnabled: true` in app.json at all times.
- The main focus is iOS and Android first. If a feature is not possible on Web, that is acceptable.
- **Always use `@/` path aliases for internal imports** (e.g. `import { Colors } from '@/constants/theme'`). Never use relative paths (`../`, `./`) for imports between app modules. The alias is configured in `tsconfig.json` and resolves to the project root.

## Storage Rules

- Use **MMKV** (`react-native-mmkv`) for all persistent config and settings. No `AsyncStorage` for config.
- MMKV scope includes: feature flags, maintenance mode, force-update flags, user preferences, and any global app config.

## Dependency Rules

- **Never install a new dependency without explicit user permission.**
- When a new dependency is needed: first check if the Expo SDK covers the need. If not, research the latest version and platform support, then propose with justification and wait for approval.
- Always use the latest stable versions of packages.
- Before proposing any implementation, search for the most up-to-date documentation for the relevant package. Avoid stale examples.

## Code Quality Rules

- Write **minimal code** — only what is asked, nothing beyond the stated scope.
- No speculative features, helpers, or abstractions for hypothetical future requirements.
- No docstrings or comments on code that is not being modified.
- No error handling for impossible scenarios. Trust framework and internal code guarantees.
- No validation at non-boundary locations. Only validate at system boundaries (user input, external APIs).
- No feature flags or backwards-compatibility shims when code can simply be changed.
- Three similar lines of code is better than a premature abstraction.
- Focus on React Native best practices and performance.

## Process Rules

- **Always understand the full architecture before starting implementation.** Ask about the big picture if it is unclear.
- Before implementing anything, confirm the scope and approach with the user.
- Never commit changes unless explicitly asked.
- Always research the most current package documentation before proposing an implementation.

---

## Design System: "The Digital Private Office"

The UI is designed to feel like a high-end concierge service — private, calm, and curated. Think magazine editorial layout, not software UI. Inspirations: **GitHub App**, **Revolut App**.

All color tokens, typography scale, spacing, and shadow presets are defined in `constants/theme.ts`.

### Color Tokens

`Colors` has `light` and `dark` variants. Access via `Colors[scheme].token_name`. Use `useColorScheme()` to get the active scheme. Do not hardcode hex values in components.

**Light mode:**

| Token | Value | Usage |
|---|---|---|
| `surface` | `#f7f9fb` | Main app background |
| `surface_container` | `#eceef0` | Secondary nav / sidebars |
| `surface_container_low` | `#f2f4f6` | Secondary content sections |
| `surface_container_lowest` | `#ffffff` | Interactive cards — pop effect |
| `surface_container_high` | `#e3e5e8` | List item hover states |
| `primary` | `#000000` | CTA gradient base |
| `primary_container` | `#131b2e` | Midnight Blue — CTA end |
| `secondary` | `#735c00` | Champagne Gold — high-value actions only |
| `on_surface` | `#0f172a` | Primary text |
| `on_surface_variant` | `#45464d` | Metadata / labels |
| `on_primary` | `#ffffff` | Text on dark buttons |

**Dark mode:**

| Token | Value | Usage |
|---|---|---|
| `surface` | `#000000` | Real black background |
| `surface_container` | `#0c1422` | Dark navy containers |
| `surface_container_low` | `#090f1c` | Slightly elevated |
| `surface_container_lowest` | `#131b2e` | Midnight Blue cards — pop against black |
| `surface_container_high` | `#1c2840` | Hover states / highest elevation |
| `primary` | `#f8fafc` | Near-white CTA gradient base |
| `primary_container` | `#131b2e` | Midnight Blue unchanged |
| `secondary` | `#c9a227` | Gold — brightened for dark backgrounds |
| `on_surface` | `#f1f5f9` | Near-white primary text |
| `on_surface_variant` | `#94a3b8` | Muted slate for labels |
| `on_primary` | `#131b2e` | Dark text on light CTA buttons |

### Typography

- **Manrope** — Display and Headlines (large numbers, section titles)
- **Inter** — Body and Labels (all body text, metadata)
- Minimum line height: **1.5** for body text to maintain the "Quiet Luxury" airy feel.

Use the named type scale from `constants/theme.ts` (`display_lg`, `display_sm`, `headline_lg`, `headline_md`, `body_md`, `label_md`). Do not define ad-hoc font sizes in components.

### The "No-Line" Rule

**1px solid borders are strictly prohibited** for sectioning content. They create visual friction. Instead use:
- **Tonal shifts:** Place a `surface_container_low` section against a `surface` background.
- **Negative space:** Use spacing scale `8`–`12` to create mental dividers without physical lines.

### The "Glass & Signature" Rule

- Floating action menus and navigation bars: use **Glassmorphism** — `surface_container_lowest` at 80% opacity with a 20px backdrop blur.
- Main CTAs: apply a linear gradient from `primary` (`#000000`) to `primary_container` (`#131b2e`) for "silk-like" depth. No flat color CTAs.

### Elevation

No heavy shadows. Use **tonal layering** to create depth:
- Lift an element by changing its surface token (e.g. active card on `surface_container_lowest` against `surface_container_low` background).
- For high-level modals only: ambient shadow `0 20px 40px rgba(15, 23, 42, 0.04)`.
- Ghost border fallback for accessibility: `outline_variant` at 20% opacity.

Use the `ambientShadow` preset from `constants/theme.ts`.

### Spacing

Use the named spacing scale from `constants/theme.ts`. Wide margins (scale `16` or `20`) signify luxury — embrace "wasted space."

### Border Radius

Always use `radius.DEFAULT` (8px) or `radius.lg` (16px). No sharp 0px corners. No arbitrary radii.

### Component Rules

**Buttons:**
- Primary: Midnight Blue gradient (`primary` → `primary_container`), `on_primary` text, `radius.DEFAULT`.
- Secondary: Champagne Gold (`secondary_fixed`) — reserved for high-value actions like "Invest" or "Transfer".
- Tertiary: Ghost style — no background, `on_primary_fixed_variant` text, subtle underline on hover.

**Input Fields:**
- No traditional box. Use `surface_container_low` background with a 3px bottom-border in `outline_variant` transitioning to `secondary` (Gold) on focus.
- Padding: spacing scale `4` (16px).

**Cards & Lists:**
- Never use divider lines between list items. Use vertical spacing scale `3` (12px) and `surface_container_high` hover states.
- Financial data (balances, prices): always anchor with `display_sm` or `headline_lg` type scale.

**"Portfolio Pulse" Component:**
- Glassmorphic card: `surface_container_lowest` at 70% opacity.
- Champagne Gold sparkline for growth.
- Sits over a `primary_container` gradient background.

### Do's and Don'ts

**Do:**
- Embrace "wasted space." Wide margins (scale `16` or `20`) signify luxury.
- Use asymmetrical layouts (e.g. left-aligned headline + right-aligned CTA) for an editorial feel.
- Use `secondary_fixed` (Gold) sparingly — only for the most important interactive elements.

**Don't:**
- Don't use 1px solid borders. They break the "Quiet Luxury" illusion.
- Don't use standard "Success Green" or "Warning Orange" at full saturation. Mute them or use `tertiary` tokens.
- Don't use sharp 0px corners. Always use `radius.DEFAULT` (8px) or `radius.lg` (16px).
- Don't hardcode hex values in components. Always reference tokens from `constants/theme.ts`.
