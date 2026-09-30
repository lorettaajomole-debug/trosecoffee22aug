/**
 * TROSE COFFEE — APPROVED MASTER REFERENCE PALETTE (P7.1E)
 * Multicolored Bauhaus Layout:
 * - Warm Ivory / Canvas: #F4EFEA
 * - Black / Charcoal: #0E0C0B
 * - TROSE Mustard / Gold: #C88E38
 * - Burnt Red / Terracotta: #8A2B2B / #7B2424
 * - Forest Green: #162820
 * - Deep Navy: #142233
 * - Espresso Brown: #2A1D15
 * - Kraft Tan: #D4B896
 */

export const TROSE_THEME = {
  colors: {
    cream: '#F4EFEA',
    black: '#0E0C0B',
    gold: '#C88E38',
    burntRed: '#8A2B2B',
    terracotta: '#7B2424',
    forest: '#162820',
    navy: '#142233',
    espresso: '#2A1D15',
    kraft: '#D4B896',
  },
  typography: {
    display: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
    sans: "'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif",
    mono: "'Space Mono', monospace",
  },
  logo: {
    png: '/assets/trose-logo.png',
    svg: '/assets/trose-logo.svg',
    alt: 'TROSE Coffee',
  }
} as const;
