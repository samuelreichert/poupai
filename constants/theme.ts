/**
 * Poupai Design System — "The Digital Private Office"
 * Single source of truth for colors, typography, spacing, radius, and shadows.
 * All components must reference these tokens. Never hardcode hex values.
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export const Colors = {
  // Surface hierarchy — define depth through tonal layering, not shadows
  surface: '#f7f9fb',               // main app background
  surface_container: '#eceef0',     // secondary nav / sidebars
  surface_container_low: '#f2f4f6', // secondary content sections
  surface_container_lowest: '#ffffff', // interactive cards — pop effect
  surface_container_high: '#e3e5e8', // list item hover states

  // Brand
  primary: '#000000',               // CTA gradient base
  primary_container: '#131b2e',     // Midnight Blue — CTA gradient end, dark backgrounds
  secondary: '#735c00',             // Champagne Gold — high-value actions (use sparingly)
  secondary_fixed: '#735c00',       // interactive Gold buttons (e.g. "Invest", "Transfer")
  on_primary_fixed_variant: '#735c00', // tertiary button text

  // Text
  on_surface: '#0f172a',            // primary text
  on_surface_variant: '#45464d',    // metadata / labels
  on_primary: '#ffffff',            // text on dark/midnight buttons

  // Borders — use ONLY as accessibility ghost border at 20% opacity
  outline_variant: '#c6c6cd',

  // Shadows — use at 4% opacity only
  shadow_color: '#0f172a',
} as const;

export type ColorToken = keyof typeof Colors;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

/**
 * Font family names — must match the keys used in useFonts() in app/_layout.tsx.
 * These are the exact strings registered by @expo-google-fonts.
 */
export const Fonts = {
  manrope_bold: 'Manrope_700Bold',         // Display + Headlines
  manrope_semibold: 'Manrope_600SemiBold',
  manrope_medium: 'Manrope_500Medium',
  inter_regular: 'Inter_400Regular',       // Body + Labels
  inter_medium: 'Inter_500Medium',
} as const;

/**
 * Type scale. lineHeight values are absolute pixels.
 * Use these in StyleSheet — e.g. { ...Typography.display_lg }
 */
export const Typography = {
  display_lg: {
    fontFamily: Fonts.manrope_bold,
    fontSize: 56,
    lineHeight: 62,  // account balances, net worth
  },
  display_sm: {
    fontFamily: Fonts.manrope_bold,
    fontSize: 36,
    lineHeight: 41,  // financial data anchors in cards
  },
  headline_lg: {
    fontFamily: Fonts.manrope_semibold,
    fontSize: 28,
    lineHeight: 34,
  },
  headline_md: {
    fontFamily: Fonts.manrope_semibold,
    fontSize: 22,
    lineHeight: 28,  // section titles
  },
  body_md: {
    fontFamily: Fonts.inter_regular,
    fontSize: 14,
    lineHeight: 21,  // 1.5 minimum per design rules
  },
  label_md: {
    fontFamily: Fonts.inter_regular,
    fontSize: 12,
    lineHeight: 17,  // metadata
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

/**
 * Named spacing scale in pixels.
 * Wide margins (16, 20) signify luxury — embrace "wasted space."
 */
export const Spacing = {
  3: 12,
  4: 16,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------

/** Always use DEFAULT or lg. No sharp 0px corners. No arbitrary radii. */
export const Radius = {
  DEFAULT: 8,
  lg: 16,
} as const;

// ---------------------------------------------------------------------------
// Elevation / Shadows
// ---------------------------------------------------------------------------

/**
 * Ambient shadow — use only for high-level modals.
 * Shadow color is a 4% tint of Midnight Blue, so it feels integrated.
 */
export const ambientShadow = {
  shadowColor: Colors.shadow_color,
  shadowOffset: { width: 0, height: 20 },
  shadowOpacity: 0.04,
  shadowRadius: 40,
  elevation: 4, // Android
} as const;

// ---------------------------------------------------------------------------
// Glassmorphism preset
// ---------------------------------------------------------------------------

/**
 * For floating action menus and navigation bars.
 * Apply opacity: 0.8 to backgroundColor (surface_container_lowest).
 * Pair with blurRadius or a BlurView (expo-blur) with intensity 20.
 */
export const Glass = {
  backgroundColor: Colors.surface_container_lowest,
  opacity: 0.8,
  blurIntensity: 20,
} as const;
