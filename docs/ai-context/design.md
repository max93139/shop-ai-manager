Premium, bright, minimal admin SaaS aesthetic. Inspired by Linear / Notion / Stripe Dashboard / Vercel — without copying any of them. No dark theme, no purple gradients, no glassmorphism, no glow effects.


1. Color tokens

css:root{
  /* Backgrounds */
  --bg: #FAFAF8;              /* app background — warm off-white, not pure white */
  --surface: #FFFFFF;          /* cards, sidebar, topbar */
  --surface-soft: #F8F7F5;     /* hover states, subtle panels */
  --surface-sunken: #F3F1EC;   /* inset elements: thumbnails, track backgrounds */

  /* Borders */
  --border: #EAE7E1;           /* default hairline border */
  --border-strong: #DBD7CF;    /* inputs, dividers that need more definition */

  /* Text */
  --text: #1C1B19;             /* primary text — near-black, warm undertone */
  --text-secondary: #6F6B63;   /* labels, secondary copy */
  --text-tertiary: #A39E93;    /* placeholders, meta, timestamps */

  /* Accent (primary brand color) */
  --accent: #0F6B4F;           /* emerald — primary actions, active states */
  --accent-hover: #0C5940;
  --accent-soft: #E7F2ED;      /* accent backgrounds: badges, active nav, focus rings */
  --accent-line: #BFDDD0;      /* accent borders */

  /* Secondary semantic accent */
  --info: #3B6FA0;
  --info-soft: #EAF1F8;

  /* Status colors */
  --warning: #B0700A;
  --warning-soft: #FBF1DF;
  --danger: #B84343;
  --danger-soft: #FBECEC;
}

Rules:


Never pure white (#FFF) as the app background — reserve pure white for elevated surfaces (cards) sitting on top of --bg.
Status is always communicated by color and shape/label together (badge dot + text), never color alone — WCAG AA requirement.
Accent is used sparingly: primary buttons, active nav item, focus rings, key data points. Never as a background wash across large areas.



2. Typography

Three type roles, never interchangeable:

RoleTypefaceUsageDisplayFraunces (serif, weights 400–650)Page titles, brand wordmark only. Never body copy.Body / UIInter (weights 400–700)All interface text: labels, buttons, table cells, descriptions.Data / MonoIBM Plex Mono (weights 400–500)All numeric values: prices, quantities, SKUs, IDs, percentages, timestamps in tables.

css--font-display: 'Fraunces', Georgia, serif;
--font-body: 'Inter', -apple-system, sans-serif;
--font-mono: 'IBM Plex Mono', monospace;

Type scale:

TokenSizeWeightUsagePage title24px650 (Fraunces)Top of each pageCard title14.5px650 (Inter)Card headersBody13–14px400–500Default textLabel / eyebrow11–12.5px600, uppercase, +0.05–0.08em trackingForm labels, table headers, nav group labelsKPI value26px500 (mono)Dashboard metricsMicro / meta10.5–12px400Timestamps, captions

Base font size: 14px, line-height 1.5.


3. Spacing & grid


Base unit: 8px — all padding/margin/gap values are multiples of 8 (with 4px used only for micro adjustments like badge dot gaps).
Layout grid: 12 columns, content max-width 1360px, centered.
Standard card padding: 20px 22px.
Standard page content padding: 28px 32px 60px.
Standard gap between grid cards: 16px.



4. Radius

css--radius-sm: 8px;   /* buttons, inputs, small chips */
--radius-md: 12px;  /* kanban cards, secondary containers */
--radius-lg: 16px;  /* cards, main containers */
--radius-xl: 20px;  /* rarely used — hero/feature blocks */

Fully rounded (20px/50%) reserved for pills, badges, avatars, toggles.


5. Elevation / shadows

css--shadow-sm: 0 1px 2px rgba(28,27,25,.05);
--shadow-md: 0 6px 16px rgba(28,27,25,.06), 0 1px 2px rgba(28,27,25,.04);
--shadow-lg: 0 16px 40px rgba(28,27,25,.10), 0 2px 8px rgba(28,27,25,.05);


shadow-sm — default resting state for all cards.
shadow-md — hover/raised state, dropdowns.
shadow-lg — modals, drawers, toasts only.
Never use glow, colored shadows, or blur-heavy "glassmorphism" shadows.



6. Motion


Transitions: 120–150ms ease for hover/active states (background, border, color).
Page transitions: fade + 4px translateY, 250ms ease.
No decorative animation loops except a single subtle "pulse" ring for live/online status indicators (1.8s ease-out infinite).
Respect prefers-reduced-motion.



7. Component tokens

Buttons


.btn-primary: --accent fill, white text, shadow-sm, hover → --accent-hover.
.btn-secondary: white fill, 1px solid --border-strong, hover → --surface-soft.
.btn-ghost: transparent, --text-secondary, hover → --surface-soft fill.
.btn-danger: white fill, --danger text, light red border.
Sizes: default 9px 15px / small 6px 11px. Font: 13px / 600 weight. Radius: --radius-sm.


Inputs / Selects


1px solid --border-strong, --radius-sm, 9px 12px padding.
Focus: border → --accent, plus 0 0 0 3px var(--accent-soft) ring — no default browser outline.


Badges (status)


Pill shape, 3px 9px padding, 11.5px / 600 text, small colored dot prefix.
Variants: success (accent), warning, danger, info, neutral (gray).


Cards


White surface, 1px solid --border, --radius-lg, --shadow-sm.
Optional .card-head row: title (Inter 14.5/650) + right-aligned meta/action.


Tables


Header row: uppercase 11px labels, --text-tertiary, no background fill, bottom border only.
Row hover: --surface-soft background.
Numeric columns always in mono font, right-context (SKU, price, stock, totals).


Tabs


Underline style: 2px solid --accent on active, 13.5px/600 text, inactive = --text-tertiary.


Sidebar navigation


Grouped by section with uppercase micro-labels.
Active item: --accent-soft background + --accent-hover text, no left-bar needed — background fill is sufficient signal.
Icons: 17×17, stroke-based (1.8px stroke), never filled/solid icons.


Toggles


Track 36×20px, --surface-sunken off / --accent on. White knob, 2px inset.


Progress bars


6px height, fully rounded track (--surface-sunken), fill in --accent / --warning / --danger depending on threshold.


Toasts


Dark (--text color) fill, white text, --radius-md, --shadow-lg, bottom-right placement.


Divider (signature motif)


.stitch-divider: 1px dashed horizontal rule (6px dash pattern) — a tailoring/stitching reference used in place of plain <hr> inside cards, sparingly.



8. Iconography


Stroke-only line icons, 1.8px stroke width, 17×17 in nav / 15×15 in buttons.
No filled icons, no duotone, no emoji as UI icons.
Rounded line caps/joins throughout for a softer, premium feel.



9. Accessibility baseline


All text/background pairs meet WCAG AA contrast at their given size.
Every interactive element has a visible :focus-visible state (2px solid --accent, 2px offset).
Status is never color-only (icon/label/shape accompanies every badge).
Motion is subtle and reduced-motion-safe.



10. What NOT to do


No dark backgrounds, no purple/violet gradients, no neon accents.
No glassmorphism (blurred translucent panels), no glow/bloom effects.
No oversized decorative charts — charts stay compact and data-dense, not illustrative.
No pure black (#000) or pure white (#FFF) as dominant surfaces — always the warm off-white / near-black pairing defined above.
No more than one accent color driving UI state (emerald only — blue is reserved strictly for "info" semantics, not decoration). 