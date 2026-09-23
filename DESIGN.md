# LegalLens AI — Design System Documentation

> **Source of Truth for Frontend Implementation**
> Extracted from Stitch project `11353851148072686079` — "LegalLens AI Document Assistant"
> Design system name: **Precision Analytical Legal**
> Color mode: **LIGHT** | Device type: **DESKTOP** | Font roundness: **ROUND_FOUR**

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Colors](#2-colors)
3. [Typography](#3-typography)
4. [Spacing](#4-spacing)
5. [Borders & Border Radius](#5-borders--border-radius)
6. [Shadows & Elevation](#6-shadows--elevation)
7. [Buttons](#7-buttons)
8. [Cards & Analytical Containers](#8-cards--analytical-containers)
9. [Navigation](#9-navigation)
10. [Form Inputs](#10-form-inputs)
11. [Badges, Pills & Risk Indicators](#11-badges-pills--risk-indicators)
12. [Reusable Components](#12-reusable-components)
13. [Responsive Behavior](#13-responsive-behavior)
14. [Screen-by-Screen Layout](#14-screen-by-screen-layout)
15. [Icons & Assets](#15-icons--assets)

---

## 1. Design Philosophy

LegalLens AI is an **analytical instrument interface**, not a generic SaaS dashboard. The aesthetic is built on:

- **Sharp Precision**: Geometric structure, hairline dividers, engineered component corners
- **Computational Objectivity**: Systematic color coding for risk levels, data-dense layouts
- **Clinical Trustworthiness**: Clean white surfaces, no gimmicks, structured information hierarchy
- **Analytical Workbench**: Multi-pane split layouts for document + analysis side-by-side viewing

**Anti-patterns to avoid:**
- No faux parchment backgrounds or serif "legal" aesthetics
- No ornamental typography
- No heavy gradients for branding
- No rounded "bubble" corners

---

## 2. Colors

### 2.1 Google Fonts Imports Required

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
```

### 2.2 Complete Named Color Token Map

All colors are defined in Material Design 3 semantic naming convention.

| Token | Hex Value | Usage |
|---|---|---|
| `surface` | `#f8f9ff` | Page background, base canvas |
| `surface-dim` | `#cbdbf5` | Dimmed/muted surface areas |
| `surface-bright` | `#f8f9ff` | Bright surface (same as surface in light mode) |
| `surface-container-lowest` | `#ffffff` | Cards, modals, elevated whites |
| `surface-container-low` | `#eff4ff` | Subtle container tint, inner sections |
| `surface-container` | `#e5eeff` | Default container background |
| `surface-container-high` | `#dce9ff` | Higher-contrast containers, sticky bars |
| `surface-container-highest` | `#d3e4fe` | Progress bar backgrounds, muted fills |
| `surface-variant` | `#d3e4fe` | Alternate surface (same as container-highest) |
| `on-surface` | `#0b1c30` | Primary text on all surfaces |
| `on-surface-variant` | `#434655` | Secondary/muted text |
| `inverse-surface` | `#213145` | Dark banner/section background |
| `inverse-on-surface` | `#eaf1ff` | Text on dark/inverse surfaces |
| `outline` | `#737686` | Dividers, border lines, placeholder text |
| `outline-variant` | `#c3c6d7` | Subtle hairline borders |
| `surface-tint` | `#0053db` | Surface tint overlay |
| `primary` | `#004ac6` | Subtle primary (links, icons) |
| `primary-container` | `#2563eb` | **Main CTA button fill** (Electric Cobalt) |
| `on-primary` | `#ffffff` | Text on primary buttons |
| `on-primary-container` | `#eeefff` | Text on primary containers |
| `primary-fixed` | `#dbe1ff` | Icon container backgrounds (tinted blue) |
| `primary-fixed-dim` | `#b4c5ff` | Slightly darker icon container |
| `on-primary-fixed` | `#00174b` | Text/icons on fixed primary containers |
| `on-primary-fixed-variant` | `#003ea8` | Variant text on fixed primary |
| `inverse-primary` | `#b4c5ff` | Primary on dark surfaces |
| `secondary` | `#565e74` | Secondary text, moderate-risk color |
| `secondary-container` | `#dae2fd` | Active nav item background |
| `on-secondary` | `#ffffff` | Text on secondary |
| `on-secondary-container` | `#5c647a` | Text on secondary container |
| `on-secondary-fixed` | `#131b2e` | Text on active nav (dark on blue tint) |
| `on-secondary-fixed-variant` | `#3f465c` | Variant text on secondary fixed |
| `secondary-fixed` | `#dae2fd` | Secondary fixed container |
| `secondary-fixed-dim` | `#bec6e0` | Dimmer secondary fixed |
| `tertiary` | `#006243` | **Verified/compliant green** |
| `tertiary-container` | `#007d57` | Darker green for icons |
| `on-tertiary` | `#ffffff` | Text on tertiary |
| `on-tertiary-container` | `#bdffdc` | Text on tertiary container |
| `tertiary-fixed` | `#85f8c4` | Light green container tint |
| `tertiary-fixed-dim` | `#68dba9` | Dimmer green tint |
| `on-tertiary-fixed` | `#002114` | Dark text on green containers |
| `on-tertiary-fixed-variant` | `#005137` | Variant text on green |
| `error` | `#ba1a1a` | Critical risk/error color |
| `error-container` | `#ffdad6` | Error/risk background tint (soft rose) |
| `on-error` | `#ffffff` | Text on error |
| `on-error-container` | `#93000a` | Text on error container (dark crimson) |
| `background` | `#f8f9ff` | Same as surface |
| `on-background` | `#0b1c30` | Same as on-surface |

### 2.3 Semantic Color Roles in Practice

```
Primary CTA Actions       → bg: primary-container (#2563eb), text: on-primary (#fff)
Secondary/Ghost Actions   → bg: surface-container-low, text: on-surface, border: outline-variant
Destructive/Risk Actions  → bg: error-container (#ffdad6), text: on-error-container (#93000a)

Critical Risk             → error (#ba1a1a) + error-container (#ffdad6)
Moderate/Warning          → secondary (#565e74) + secondary-container (#dae2fd)
Verified/Compliant        → tertiary (#006243) + tertiary-fixed (#85f8c4)

Status orb – live/active  → bg-tertiary animate-pulse (green pulsing dot)
Status orb – critical     → bg-error animate-pulse (red pulsing dot)
Status orb – moderate     → bg-secondary (muted blue-grey dot)
```

### 2.4 Text Highlight Colors (Clause Annotations)

Used directly on document text to mark risk in clause viewer:

| Annotation Type | Background | Text Color |
|---|---|---|
| Critical Risk highlight | `bg-error-container/60` | `text-on-error-container` |
| Amber/liability highlight | `rgba(217, 119, 6, 0.12)` = `bg-amber-100` | `text-amber-900` |
| Rose/obligation highlight | `rgba(225, 29, 72, 0.12)` = `bg-rose-100` | `text-rose-900` |
| Surface-variant highlight | `bg-surface-variant/40` | `text-on-surface-variant` |

---

## 3. Typography

### 3.1 Font Families

| Role | Font Family | Google Font Import |
|---|---|---|
| Headlines (display, h1–h3) | **Space Grotesk** | `Space+Grotesk:wght@500;600;700` |
| Body, labels, code, UI text | **Geist** | `Geist:wght@300;400;500;600;700` |
| Icons | Material Symbols Outlined | Google Material Symbols CDN |

### 3.2 Complete Typography Scale

| Token | Font | Size | Line Height | Weight | Letter Spacing |
|---|---|---|---|---|---|
| `display-hero` | Space Grotesk | `3.5rem` (56px) | `4rem` (64px) | 700 | `-0.03em` |
| `headline-lg` | Space Grotesk | `2.25rem` (36px) | `2.75rem` (44px) | 600 | `-0.02em` |
| `headline-lg-mobile` | Space Grotesk | `1.75rem` (28px) | `2.25rem` (36px) | 600 | `-0.015em` |
| `headline-md` | Space Grotesk | `1.5rem` (24px) | `2rem` (32px) | 600 | `-0.015em` |
| `headline-sm` | Space Grotesk | `1.125rem` (18px) | `1.5rem` (24px) | 600 | `-0.01em` |
| `body-lg` | Geist | `1.125rem` (18px) | `1.75rem` (28px) | 400 | — |
| `body-md` | Geist | `0.9375rem` (15px) | `1.5rem` (24px) | 400 | — |
| `body-sm` | Geist | `0.8125rem` (13px) | `1.25rem` (20px) | 400 | — |
| `label-md` | Geist | `0.875rem` (14px) | `1.25rem` (20px) | 500 | `+0.01em` |
| `label-sm` | Geist | `0.75rem` (12px) | `1rem` (16px) | 600 | `+0.025em` |
| `code-clause` | Geist | `0.8125rem` (13px) | `1.375rem` (22px) | 400 | `-0.005em` |

### 3.3 Typography Usage Rules

- **Section labels / categories** → `label-sm` + `uppercase` + `tracking-wider` (e.g., "RISK QUOTA", "TOTAL ANALYZED")
- **Document-extracted code/hash** → `code-clause` (e.g., SHA-256 hashes, section references, version strings)
- **Call-to-action text** → `label-md` font-weight-500 on buttons
- **Headline tightening**: All Space Grotesk headlines use negative letter-spacing (tight tracking), never default browser spacing
- **Body in modals/cards** → `body-md` (0.9375rem), body in detail panels → `body-sm` (0.8125rem)

---

## 4. Spacing

### 4.1 Spacing Token Map

Based on a **4px/8px baseline grid**. Custom tokens used in Tailwind:

| Token | Value | Usage |
|---|---|---|
| `space-xs` | `0.25rem` (4px) | Micro-gaps between inline badges/dots |
| `space-sm` | `0.5rem` (8px) | Inner button padding-y, tight gaps |
| `space-md` | `1rem` (16px) | Standard padding, card inner gaps |
| `space-lg` | `1.5rem` (24px) | Section padding, large gaps |
| `space-xl` | `2.5rem` (40px) | Between major page sections |
| `gutter` | `1rem` (16px) | Mobile horizontal page padding |
| `gutter-desktop` | `1.5rem` (24px) | Desktop horizontal page padding |
| `margin` | `1rem` (16px) | Component margin (mobile) |
| `margin-desktop` | `2rem` (32px) | Component margin (desktop) |

### 4.2 Application of Spacing

- **Card internal padding**: `p-space-lg` (24px) — standard card content padding
- **Card internal padding (compact)**: `p-space-md` (16px) — for tighter info cards
- **Between cards in a list**: `space-y-space-md` (16px gap)
- **Between major dashboard sections**: `space-y-space-lg` (24px gap)
- **Page-level padding**: `px-gutter-desktop py-space-md` on desktop
- **Sidebar item padding**: `px-space-md py-space-sm` (16px horizontal, 8px vertical)
- **Inline badge padding**: `px-2.5 py-0.5` (10px / 2px) — pill pills
- **Button padding standard**: `px-space-md py-space-sm` = `px-4 py-2`
- **Button padding compact**: `px-space-md py-space-xs` = `px-4 py-1`

---

## 5. Borders & Border Radius

### 5.1 Border Radius Token Map

> Note: The Tailwind config overrides defaults. The token names match Tailwind class names.

| Class | Value | Usage |
|---|---|---|
| `rounded` (DEFAULT) | `0.125rem` (2px) | Micro-components, inline code tags, checkboxes |
| `rounded-lg` | `0.25rem` (4px) | Standard containers, form controls, table cells |
| `rounded-xl` | `0.5rem` (8px) | Cards, modals, panels, split-view frames |
| `rounded-full` | `0.75rem` (12px) | Risk badges, verification pills, category tags |

> **Important**: `rounded-full` in this design system maps to `0.75rem`, NOT the standard Tailwind 9999px. For true capsule/pill shapes (infinite radius), use inline `style="border-radius: 9999px"` or an explicit override class. Throughout the screens, both values are used in context.

> **Actual capsule pills** seen in code (risk badges, nav chips): `rounded-full` class applied to `px-2.5 py-0.5` spans — producing the pill morphology due to height + padding ratio.

### 5.2 Border Usage

- **Card boundaries**: `1px solid` using `outline-variant` (`#c3c6d7`) — hairline only
- **Input fields**: No explicit border; rely on background contrast + shadow
- **Header shadow border**: `shadow-[0_1px_8px_rgba(0,0,0,0.04)]` — replaces visible border
- **Sidebar shadow border**: `shadow-[1px_0_8px_rgba(0,0,0,0.03)]`
- **Dividers (horizontal)**: `h-[1px] bg-surface-container-high` — near-invisible hairlines
- **Card header separators**: Bottom border `border-b border-surface-container`
- **Progress bar tracks**: `bg-surface-container-highest rounded-full h-1.5`

---

## 6. Shadows & Elevation

### 6.1 Elevation System

| Level | Description | CSS Shadow |
|---|---|---|
| 0 – Base surface | Page background, flat | none |
| 1 – Card/Surface | Standard cards, containers | `shadow-sm` → `0 1px 3px 0 rgba(0,0,0,0.05)` |
| 2 – Hover/Active card | Card on hover or active state | `shadow-md` → `0 4px 6px -1px rgba(0,0,0,0.08)` |
| 3 – Raised panels | Feature cards, dropzone areas | `shadow-xl` → `0 20px 25px -5px rgba(0,0,0,0.08)` |
| 4 – Fixed chrome | Fixed nav/header | `shadow-[0_1px_8px_rgba(0,0,0,0.04)]` |

### 6.2 Specific Shadow Definitions from Source Code

```css
/* Fixed header (marketing + app) */
box-shadow: 0 1px 8px rgba(0,0,0,0.04);

/* Primary CTA button */
box-shadow: 0 1px 2px rgba(15,23,42,0.08);

/* Cards standard */
box-shadow: shadow-sm (Tailwind default)

/* Cards on hover */
transition: shadow-md (hover:shadow-md)

/* Full-page hero upload box */
shadow-xl

/* Sticky footer disclaimer bar */
shadow-md + backdrop-blur-md
```

### 6.3 Backdrop Blur Usage

- **Fixed navigation header**: `backdrop-blur-xl bg-surface-container-lowest/90` — frosted glass header on landing page
- **Sticky disclaimer banner**: `backdrop-blur-md bg-surface-container-lowest/95`
- **Login background overlay orbs**: `blur-3xl` and `blur-2xl` for ambient glow decorations

---

## 7. Buttons

### 7.1 Primary Button

Used for main CTAs: "Analyze Document", "Sign In", "Submit", "Ask AI Assistant"

```html
<button class="inline-flex items-center justify-center gap-space-xs
  px-space-md py-space-sm
  bg-primary-container text-on-primary
  hover:bg-primary
  rounded-lg
  font-label-md text-label-md
  shadow-[0_1px_2px_rgba(15,23,42,0.08)]
  transition-all">
  <!-- Icon optional -->
  <span class="material-symbols-outlined text-base">bolt</span>
  Button Label
</button>
```

**States:**
- Default: `bg-primary-container` (#2563eb)
- Hover: `hover:bg-primary` (#004ac6)
- Active: `active:scale-[0.99]`
- Disabled: muted opacity + `cursor-not-allowed`
- Loading: Replace text with spinning SVG (`animate-spin`) + loading copy

### 7.2 Secondary / Ghost Button

Used for auxiliary actions: "Compare Versions", "Export Brief", "Try Sample"

```html
<button class="inline-flex items-center gap-space-xs
  px-space-md py-space-sm
  bg-surface-container hover:bg-surface-container-high
  text-on-surface
  rounded-lg
  font-label-md text-label-md
  shadow-sm
  transition-all">
  Button Label
</button>
```

### 7.3 Surface-Low Button

Used for low-priority or tertiary actions:

```html
<button class="inline-flex items-center gap-1.5
  px-space-md py-space-xs
  bg-surface-container-low hover:bg-surface-container
  text-on-surface-variant
  rounded-lg
  font-label-md text-label-md
  transition-colors">
  Button Label
</button>
```

### 7.4 Destructive / Error Button

Used for critical risk overrides or confirmation of dangerous actions:

```html
<button class="bg-error-container text-on-error-container
  hover:bg-error hover:text-on-error
  px-space-md py-space-sm
  rounded-lg
  font-label-md text-label-md
  transition-all">
  Button Label
</button>
```

### 7.5 Icon-Only / Compact Button

Used in toolbars, zoom controls, viewer pagination:

```html
<button class="p-1 rounded
  text-on-surface-variant hover:bg-surface-container
  transition-colors">
  <span class="material-symbols-outlined text-[18px]">icon_name</span>
</button>
```

### 7.6 Full-Width Button

Used in login form submit, lawyer prep export:

```html
<button class="w-full flex items-center justify-center
  py-3.5 px-6
  rounded-lg
  bg-primary-container text-on-primary
  hover:bg-primary
  font-label-md text-label-md
  shadow-md
  transition-all group">
  <span>Button Label</span>
  <span class="material-symbols-outlined ml-2 text-lg group-hover:translate-x-1 transition-transform">
    arrow_forward
  </span>
</button>
```

### 7.7 SSO / Social Button

Used on login page for Google/Microsoft SSO:

```html
<button class="w-full flex items-center justify-center
  px-4 py-3
  bg-surface-container-low hover:bg-surface-container
  text-on-surface
  font-label-md text-label-md
  rounded-lg shadow-sm
  transition-all">
  <svg class="w-4 h-4 mr-2.5 flex-shrink-0"><!-- brand SVG --></svg>
  <span class="truncate">Google Workspace</span>
</button>
```

### 7.8 Button with Arrow Link Pattern

For in-content "learn more" / navigation CTAs:

```html
<a class="inline-flex items-center gap-1
  text-primary font-label-md text-label-md
  hover:underline font-semibold">
  Run complete audit
  <span class="material-symbols-outlined text-sm">arrow_forward</span>
</a>
```

---

## 8. Cards & Analytical Containers

### 8.1 Standard Analytical Card

The primary container for document items, analysis panels, metric blocks:

```html
<div class="bg-surface-container-lowest rounded-xl shadow-sm
  overflow-hidden transition-all hover:shadow-md">
  <div class="p-space-lg space-y-space-md">
    <!-- Card content -->
  </div>
</div>
```

### 8.2 Card Header with Section Label

```html
<div class="bg-surface-container-low px-space-lg py-space-sm
  flex flex-wrap items-center justify-between gap-space-sm">
  <div class="flex items-center gap-space-sm">
    <!-- Risk badge + title -->
  </div>
  <span class="font-code-clause text-code-clause text-on-surface-variant">
    Page 8 • Lines 142-158
  </span>
</div>
```

### 8.3 Metric / Stat Card (Dashboard KPI)

```html
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm
  flex flex-col justify-between relative group hover:shadow-md transition-all">
  <div class="flex items-start justify-between">
    <div>
      <span class="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wide">
        Metric Label
      </span>
      <div class="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">
        42
      </div>
    </div>
    <div class="p-space-xs bg-surface-container-low text-primary rounded-lg">
      <span class="material-symbols-outlined text-[24px]">icon</span>
    </div>
  </div>
  <div class="mt-space-sm flex items-center justify-between
    text-on-surface-variant font-label-sm text-label-sm">
    <span class="text-tertiary font-medium">↑ +3 this week</span>
    <span class="font-code-clause text-code-clause text-on-surface-variant">100% indexed</span>
  </div>
</div>
```

### 8.4 Info Box / Sub-section Container

Used inside cards to separate analysis categories:

```html
<div class="p-space-md rounded-lg bg-surface-container-low space-y-space-xs">
  <div class="flex items-center gap-1.5 text-primary font-label-md text-label-md mb-1 font-semibold">
    <span class="material-symbols-outlined text-base">translate</span>
    Plain-English Translation
  </div>
  <p class="font-body-md text-body-md text-on-surface leading-normal">
    Content here...
  </p>
</div>
```

### 8.5 Dark/Inverse Banner Card

Used for security/trust sections on the landing page:

```html
<div class="bg-inverse-surface text-inverse-on-surface
  rounded-xl p-space-xl shadow-xl relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
  <!-- content -->
</div>
```

### 8.6 Warning/Error Container (Omission Box)

```html
<div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
  <div class="flex items-center justify-between mb-space-md">
    <div class="flex items-center gap-space-sm">
      <div class="w-9 h-9 rounded-lg bg-error-container/40 flex items-center justify-center text-error">
        <span class="material-symbols-outlined text-[22px]">visibility_off</span>
      </div>
      <!-- title -->
    </div>
    <span class="px-2.5 py-0.5 bg-error-container text-on-error-container
      rounded-full font-label-sm text-label-sm font-semibold">
      2 Critical Gaps
    </span>
  </div>
  <!-- gaps list -->
</div>
```

### 8.7 Sticky Disclaimer Banner

Appears at the bottom of app screens, dismissible:

```html
<div class="sticky bottom-4 z-30 bg-surface-container-lowest/95 backdrop-blur-md
  p-space-md rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-space-sm">
  <div class="flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
    <span class="material-symbols-outlined text-[20px] text-primary shrink-0">shield</span>
    <span><strong class="text-on-surface font-semibold">Analytical Intelligence Guardrail:</strong>
    LegalLens AI is an assistive analytical tool...</span>
  </div>
  <button onclick="this.closest('.sticky').style.display='none'" class="...">
    <span class="material-symbols-outlined text-[18px]">close</span>
  </button>
</div>
```

---

## 9. Navigation

### 9.1 Global System Status Bar (App Only)

Appears above the main header on all authenticated screens. Fixed position, `z-50`.

```html
<div class="fixed top-0 left-0 right-0 z-50
  bg-surface-container-high px-gutter-desktop py-1
  flex items-center justify-between">
  <div class="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
    <span class="material-symbols-outlined text-[16px] text-tertiary">verified_user</span>
    <span>LegalLens AI provides AI-assisted analysis for educational purposes...</span>
  </div>
  <span class="font-code-clause text-code-clause text-on-surface-variant hidden md:inline">
    System Status: Optimal • Engine v4.19
  </span>
</div>
```

Height: `py-1` → approximately 24px. Pushes header down by `top-6` (1.5rem = 24px).

### 9.2 Application Header

Fixed at `top-6` (below system bar), `z-40`. Height: `h-16` (64px).

```html
<header class="fixed top-6 left-0 right-0 z-40
  bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
  <div class="h-16 w-full px-gutter-desktop flex items-center justify-between gap-space-md">

    <!-- Left: Logo + Brand -->
    <div class="flex items-center gap-space-md min-w-[240px]">
      <img src="[logo]" class="h-8 w-auto object-contain" alt="LegalLens AI Logo"/>
      <span class="font-headline-sm text-headline-sm tracking-tight text-on-surface">
        LegalLens<span class="text-primary">.ai</span>
      </span>
    </div>

    <!-- Center: Active document breadcrumb (md+) -->
    <div class="hidden md:flex items-center gap-space-sm
      bg-surface-container-low px-space-md py-space-xs rounded-lg
      text-on-surface-variant font-label-sm text-label-sm">
      <span class="material-symbols-outlined text-[18px] text-primary">description</span>
      <span class="text-on-surface font-medium">DocumentName.pdf</span>
      <span class="text-outline-variant">/</span>
      <span class="inline-flex items-center gap-1 text-tertiary font-medium">
        <span class="w-2 h-2 rounded-full bg-tertiary"></span>
        Analysis Verified (14 Clauses)
      </span>
    </div>

    <!-- Right: CTA + notifications + user -->
    <div class="flex items-center gap-space-md">
      <a class="inline-flex items-center gap-space-xs bg-primary-container text-on-primary
        hover:bg-primary px-space-md py-space-xs rounded-lg font-label-md text-label-md
        shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition-all">
        <span class="material-symbols-outlined text-[18px]">add</span>
        <span class="hidden sm:inline">Analyze New Document</span>
      </a>

      <!-- Notification bell with red dot -->
      <div class="relative flex items-center justify-center p-space-xs rounded-lg
        text-on-surface-variant hover:bg-surface-container cursor-pointer transition-colors">
        <span class="material-symbols-outlined text-[22px]">notifications</span>
        <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full
          ring-2 ring-surface-container-lowest"></span>
      </div>

      <!-- User avatar + name -->
      <div class="flex items-center gap-space-sm pl-space-xs">
        <img class="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container-high" src="[avatar]"/>
        <div class="hidden xl:flex flex-col text-left">
          <span class="font-label-md text-label-md text-on-surface font-semibold leading-none">Sarah Jenkins</span>
          <span class="font-label-sm text-label-sm text-on-surface-variant leading-tight">Legal Ops</span>
        </div>
      </div>
    </div>

  </div>
</header>
```

### 9.3 Landing Page Public Header

No system bar. Fixed at `top-0`, `z-50`. Height: `h-16`. Frosted glass effect.

```html
<header class="fixed top-0 w-full z-50
  bg-surface-container-lowest/90 backdrop-blur-xl
  shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
  <div class="h-16 w-full px-gutter-desktop flex items-center justify-between">

    <!-- Left: Logo -->
    <!-- Center: Nav links (desktop) -->
    <nav class="hidden lg:flex items-center gap-space-lg">
      <a class="transition-colors text-primary font-label-md" href="#">Features</a>
      <a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" href="#">How It Works</a>
      <!-- etc. -->
    </nav>

    <!-- Right: Sign in + CTA -->
    <div class="flex items-center gap-space-md">
      <a class="hidden sm:inline-flex text-on-surface-variant hover:text-on-surface
        font-label-md text-label-md px-space-sm py-space-xs transition-colors">Sign in</a>
      <a class="inline-flex items-center justify-center bg-primary-container text-on-primary
        hover:bg-primary px-space-md py-space-sm rounded-lg font-label-md text-label-md
        shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition-all">
        Analyze Document Free
      </a>
    </div>

  </div>
</header>
```

**Active nav link state**: `text-primary font-label-md` (no underline, just color change)
**Inactive nav link state**: `text-on-surface-variant hover:text-on-surface font-label-md text-label-md`

### 9.4 Left Sidebar Navigation (App)

Fixed sidebar. Width: `w-64` (256px). Position: `top-[5.5rem]` (88px from top = 24px system bar + 64px header). `z-30`.

```html
<aside class="fixed left-0 top-[5.5rem] bottom-0 w-64
  bg-surface-container-lowest
  shadow-[1px_0_8px_rgba(0,0,0,0.03)]
  z-30 flex flex-col justify-between p-space-md">

  <nav class="space-y-space-xs">

    <!-- Active item -->
    <a aria-current="page"
      class="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg
      bg-secondary-container text-on-secondary-fixed font-semibold transition-all">
      <span class="material-symbols-outlined text-[20px]">grid_view</span>
      Dashboard
    </a>

    <!-- Inactive item -->
    <a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg
      text-on-surface-variant hover:bg-surface-container hover:text-on-surface
      transition-all font-label-md text-label-md">
      <span class="material-symbols-outlined text-[20px]">folder_open</span>
      My Documents
    </a>

  </nav>

  <!-- Bottom: Usage Quota widget -->
  <div class="bg-surface-container-low p-space-md rounded-lg space-y-space-xs">
    <div class="flex items-center justify-between text-on-surface font-label-sm text-label-sm">
      <span>Risk Quota</span>
      <span class="font-code-clause text-code-clause text-primary">88%</span>
    </div>
    <div class="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
      <div class="bg-primary h-1.5 rounded-full" style="width: 88%"></div>
    </div>
    <p class="font-label-sm text-label-sm text-on-surface-variant">44/50 monthly deep clause scans utilized</p>
  </div>

</aside>
```

**Nav items list (left sidebar):**
1. Dashboard → `grid_view`
2. My Documents → `folder_open`
3. Upload & Analyze → `upload_file`
4. Clause Explorer → `policy`
5. Ask Document AI → `neurology`
6. Compare Versions → `difference`
7. Lawyer Prep Export → `assignment_turned_in`

**Main content offset**: `<div class="pl-64">` wraps all main content to offset the sidebar.

### 9.5 Footer (Marketing / Landing Page)

4-column grid. Background: `bg-surface-container-lowest`. Top border-shadow.

```html
<footer class="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(0,0,0,0.03)] mt-space-xl">
  <div class="w-full px-gutter-desktop py-space-xl">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-space-xl">
      <!-- Col 1: Brand -->
      <!-- Col 2: Product links -->
      <!-- Col 3: Governance & Trust links -->
      <!-- Col 4: Legal disclaimer text -->
    </div>
    <!-- Bottom bar -->
    <div class="mt-space-xl pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm
      text-on-surface-variant font-label-sm text-label-sm">
      <p>© 2025 LegalLens AI Technologies Inc. All rights reserved.</p>
      <div class="flex items-center gap-space-md">
        <a>Terms of Service</a>
        <a>Privacy Policy</a>
        <a>System Status</a>
      </div>
    </div>
  </div>
</footer>
```

---

## 10. Form Inputs

### 10.1 Text / Email / Password Input

```html
<div class="relative rounded-lg shadow-sm">
  <!-- Leading icon -->
  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
    <span class="material-symbols-outlined text-xl">alternate_email</span>
  </div>
  <input
    type="email"
    class="block w-full pl-11 pr-4 py-3
      bg-surface-container-lowest text-on-surface
      placeholder:text-outline
      font-body-md text-body-md
      rounded-lg
      focus:outline-none focus:bg-surface-container-lowest
      transition-colors shadow-inner"
    placeholder="name@organization.com"/>
</div>
```

- **Height**: `py-3` = 12px top/bottom → ~46px total height
- **Background**: `bg-surface-container-lowest` (white `#ffffff`)
- **Text**: `text-on-surface` (`#0b1c30`)
- **Placeholder**: `placeholder:text-outline` (`#737686`)
- **Focus**: No outline ring; subtle `focus:bg-surface-container-lowest` + inner shadow
- **Trailing action button** (password toggle): `absolute inset-y-0 right-0 pr-3.5`

### 10.2 Textarea (Chat Input)

```html
<textarea
  class="w-full bg-surface-container-lowest text-on-surface
    font-body-md text-body-md
    p-3 pr-24
    rounded-lg shadow-sm
    focus:outline-none focus:ring-2 focus:ring-primary
    resize-none placeholder:text-outline"
  rows="2"
  placeholder="Ask any question about this agreement...">
</textarea>
```

Focus state for textarea uses `focus:ring-2 focus:ring-primary` (2px blue ring).

### 10.3 Checkbox

```html
<input type="checkbox" class="w-4 h-4 rounded text-primary focus:outline-none cursor-pointer bg-surface-container-low"/>
```

### 10.4 Label

```html
<label class="block font-label-md text-label-md text-on-surface font-medium">
  Work or Personal Email
</label>
```

### 10.5 Drag-and-Drop File Zone

```html
<div class="relative group cursor-pointer rounded-lg
  bg-surface-container-low/60 hover:bg-surface-container
  transition-all p-space-xl flex flex-col items-center justify-center text-center"
  id="drop-zone">

  <input type="file" accept=".pdf,.docx,.txt"
    class="absolute inset-0 opacity-0 cursor-pointer z-20"/>

  <div class="w-14 h-14 rounded-xl bg-primary-fixed text-primary
    flex items-center justify-center mb-space-md shadow-sm
    group-hover:scale-105 transition-transform">
    <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">cloud_upload</span>
  </div>

  <h3 class="font-headline-sm text-headline-sm text-on-surface mb-1">
    Drag & drop your contract here, or
    <span class="text-primary underline decoration-primary/40 font-semibold">browse files</span>
  </h3>

  <p class="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
    PDF, DOCX, or scanned text files up to 25MB. Instant ephemeral parsing.
  </p>
</div>
```

**Drag states** (via JS): Add `bg-surface-container-high` class on dragenter/dragover; remove on dragleave/drop.

---

## 11. Badges, Pills & Risk Indicators

### 11.1 Critical Risk Badge

```html
<span class="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container
  font-label-sm text-label-sm font-semibold inline-flex items-center gap-1.5">
  <span class="w-2 h-2 rounded-full bg-error animate-pulse"></span>
  CRITICAL RISK
</span>
```

Or with animate-ping variant:
```html
<span class="inline-flex relative flex h-2 w-2">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
  <span class="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
</span>
```

### 11.2 Moderate Risk Badge

```html
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
  bg-surface-container-high text-on-secondary-fixed-variant
  font-label-sm text-label-sm font-medium">
  Safe with Caveats
</span>
```

### 11.3 Verified/Compliant Badge

```html
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
  bg-surface-container-low text-tertiary
  font-label-sm text-label-sm font-medium">
  Standard Terms
</span>
```

### 11.4 Live Status / System Badge

```html
<span class="font-label-sm text-label-sm uppercase tracking-wider text-tertiary font-semibold
  flex items-center gap-2">
  <span class="inline-flex relative h-2 w-2">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
    <span class="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
  </span>
  Node 04 • SOC2 Type II Certified
</span>
```

### 11.5 Category Tag / Doc Type Chip

```html
<span class="bg-surface-container px-2 py-0.5 rounded
  text-on-surface font-medium uppercase tracking-wider
  font-label-sm text-label-sm">
  Employment / C-Suite
</span>
```

### 11.6 Numeric Count Badge

```html
<span class="bg-error text-on-error px-1.5 py-0.2 rounded-full text-[11px] font-bold">3</span>
<span class="bg-surface-container-high text-on-surface px-1.5 py-0.2 rounded-full text-[11px]">24</span>
```

### 11.7 AI-Verified Badge

```html
<span class="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed
  font-label-sm text-label-sm font-semibold">
  100% Grounded
</span>
```

### 11.8 SVG Arc/Circular Risk Meter

Attention score arc gauge (40x40 SVG, rotated -90deg):

```html
<svg class="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
  <!-- Track -->
  <path class="text-surface-container-highest stroke-current"
    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
    fill="none" stroke-width="3.5"/>
  <!-- Fill (score% of 100) -->
  <path class="text-error stroke-current"
    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
    fill="none" stroke-dasharray="68, 100" stroke-linecap="round" stroke-width="3.5"/>
</svg>
```

Color rules: `text-error` for scores <75, `text-primary` for 75–89, `text-tertiary` for 90+.

---

## 12. Reusable Components

### 12.1 Segmented Tab Bar

Used in dashboard (document filter) and document analysis (risk panels):

```html
<div class="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg">
  <!-- Active -->
  <button class="px-space-sm py-1 rounded font-label-sm text-label-sm
    bg-surface-container-lowest text-primary shadow-sm font-semibold">
    All (14)
  </button>
  <!-- Inactive -->
  <button class="px-space-sm py-1 rounded font-label-sm text-label-sm
    text-on-surface-variant hover:text-on-surface transition-colors">
    Employment (4)
  </button>
</div>
```

### 12.2 Progress Bar

```html
<div class="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
  <div class="bg-primary h-1.5 rounded-full" style="width: 76%"></div>
</div>
```

Color variants: `bg-primary` (default), `bg-tertiary` (verified), `bg-error` (critical).

### 12.3 Split Pane Workbench

Used across Document Analysis, Ask AI, Compare screens:

```html
<div class="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
  <!-- Left panel (5 cols) -->
  <section class="xl:col-span-5"><!-- Document / raw content --></section>
  <!-- Right panel (7 cols) -->
  <section class="xl:col-span-7"><!-- AI analysis / chat --></section>
</div>
```

Or 4-col/8-col for dashboard layout:
```html
<div class="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
  <div class="xl:col-span-8"><!-- Document stream --></div>
  <div class="xl:col-span-4"><!-- Action drawer --></div>
</div>
```

### 12.4 Quick Prompt Chips (AI Chat)

```html
<button class="px-3 py-1.5 rounded-full
  bg-surface-container-lowest hover:bg-surface-container
  text-on-surface font-label-sm text-label-sm
  shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]
  text-left flex items-center gap-1.5">
  <span class="material-symbols-outlined text-[14px] text-primary">help_outline</span>
  <span>What happens to my stock options if I leave in year 1?</span>
</button>
```

### 12.5 AI Chat Bubbles

**User message** (right-aligned):
```html
<div class="flex justify-end">
  <div class="max-w-[85%] bg-primary-container text-on-primary
    rounded-xl rounded-tr-xs p-3.5 shadow-sm">
    <p class="font-body-md text-body-md text-on-primary">User message text</p>
  </div>
</div>
```

**AI response** (left-aligned):
```html
<div class="flex justify-start">
  <div class="max-w-[92%] bg-surface-container-low text-on-surface
    rounded-xl rounded-tl-xs p-4 shadow-sm space-y-3">
    <div class="flex items-center gap-2">
      <span class="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
        <span class="material-symbols-outlined text-[14px]">neurology</span>
      </span>
      <span class="font-label-md text-label-md font-bold text-on-surface">LegalLens AI Assistant</span>
      <span class="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
        100% Grounded
      </span>
    </div>
    <!-- Content -->
  </div>
</div>
```

### 12.6 Citation Link (Grounded References)

```html
<a class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded
  bg-surface-container-high hover:bg-surface-variant
  text-primary font-code-clause text-code-clause font-semibold transition-colors"
  href="#citation-sec-9-2">
  <span class="material-symbols-outlined text-[14px]">link</span>
  [P.8, Sec. 9.2 - Restrictive Covenants]
</a>
```

### 12.7 Questions for Counsel Card Item

```html
<div class="p-space-sm bg-surface-container-low rounded-lg relative group">
  <div class="flex items-start justify-between gap-space-xs">
    <span class="font-code-clause text-code-clause text-primary font-bold">01</span>
    <p class="font-body-sm text-body-sm text-on-surface flex-1">
      "Can Section 9.2 (18-month non-compete) be modified..."
    </p>
    <button class="copy-single-q text-on-surface-variant hover:text-primary transition-colors p-1">
      <span class="material-symbols-outlined text-[16px]">content_copy</span>
    </button>
  </div>
</div>
```

### 12.8 Deadline / Timeline Item

```html
<div class="bg-surface-container-low p-space-md rounded-lg space-y-space-xs relative overflow-hidden">
  <div class="flex items-center justify-between">
    <span class="inline-flex items-center gap-1 font-label-sm text-label-sm text-error
      bg-error-container px-2 py-0.5 rounded-full font-semibold">
      <span class="material-symbols-outlined text-[14px]">alarm</span>
      48 Hours Remaining
    </span>
    <span class="font-code-clause text-code-clause text-on-surface-variant">Section 12.3</span>
  </div>
  <h4 class="font-label-md text-label-md text-on-surface font-semibold pt-1">
    IP Assignment & Offer Signing Window
  </h4>
  <p class="font-body-sm text-body-sm text-on-surface-variant">
    Apex Tech offer expires. Requires formal rejection or redline submission.
  </p>
  <div class="pt-space-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface">
    <span class="text-on-surface-variant">Counterparty: Apex Tech Legal</span>
    <a class="text-primary font-medium hover:underline inline-flex items-center gap-0.5">
      Prepare Redline <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
    </a>
  </div>
</div>
```

### 12.9 Security / Trust Footnote Banner

Used in login and landing:

```html
<footer class="mt-6 px-4 py-4 rounded-xl bg-surface-container-low
  text-on-surface-variant flex items-start space-x-3.5 shadow-sm">
  <span class="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5"
    style="font-variation-settings: 'FILL' 1;">verified_user</span>
  <div class="text-left space-y-1">
    <p class="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wide">
      Enterprise Grade Isolation & Confidentiality
    </p>
    <p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
      All sessions are protected with end-to-end encryption...
    </p>
  </div>
</footer>
```

### 12.10 Feature Card (Landing 4-up Grid)

```html
<div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-md
  hover:shadow-xl transition-all flex flex-col justify-between group">
  <div>
    <div class="w-12 h-12 rounded-lg bg-primary-fixed text-primary
      flex items-center justify-center mb-space-md
      group-hover:scale-105 transition-transform">
      <span class="material-symbols-outlined text-2xl">translate</span>
    </div>
    <h3 class="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold">
      Feature Title
    </h3>
    <p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
      Feature description text here.
    </p>
  </div>
  <!-- Bottom metric strip -->
  <div class="mt-space-lg pt-space-md bg-surface-container-low p-space-sm rounded">
    <!-- Mini metric or indicator -->
  </div>
</div>
```

---

## 13. Responsive Behavior

### 13.1 Breakpoints (Tailwind defaults)

| Prefix | Min-width | Usage |
|---|---|---|
| (none) | 0px | Mobile-first base |
| `sm:` | 640px | Small tablets, landscape phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Small laptops |
| `xl:` | 1280px | Desktop workstation (primary target) |

### 13.2 Desktop Layout (≥1280px)

- **System bar** visible
- **Fixed left sidebar** (w-64) always shown; main content `pl-64`
- **Split pane workbench**: 12-column grid with 5+7 or 4+8 column split
- **Header center breadcrumb**: visible (`hidden md:flex`)
- **User name + role**: visible (`hidden xl:flex`)
- **Nav links**: full text labels shown in sidebar
- **Gutter**: `gutter-desktop` (1.5rem / 24px)

### 13.3 Tablet Layout (768–1279px)

- System bar visible
- Sidebar may be collapsed to icon-only or drawer pattern (implement as hamburger toggle)
- Header center breadcrumb visible at `md:`
- Single-column content, no split pane (xl: splits disappear)
- Feature grid: `md:grid-cols-2` (2 columns)

### 13.4 Mobile Layout (<768px)

- System bar hidden or truncated
- No sidebar — replaced with bottom tab navigation or drawer
- Header: only logo + notification + user avatar
- All grids collapse to single column (`grid-cols-1`)
- Padding reduces to `gutter` (1rem / 16px)
- Sticky chat input pinned to bottom on mobile

### 13.5 Content Width Constraints

- **Marketing/landing**: `max-w-7xl mx-auto` (1280px max)
- **App screens**: `max-w-[1520px] mx-auto` on document analysis
- **Auth screens (login/register)**: `max-w-xl mx-auto` (672px centered card)

---

## 14. Screen-by-Screen Layout

### Screen 1: Landing Page — "LegalLens AI – Understand Before You Sign"

**Route**: `/` (public)
**Dimensions**: 2560×6774 (tall scrollable page)
**Layout**: Full-width, single column, max-w-7xl sections

**Sections (top to bottom):**

1. **Fixed Header** — Public nav with logo, nav links, Sign In, CTA button
2. **Hero Section**
   - Ambient glow gradient blob (absolute, blurred, pointer-events-none)
   - Trust badge pill: lock icon + "Zero-Retention AI • 256-Bit Encrypted • Privacy-First Architecture" + pulsing green dot
   - `<h1>` Display-hero: "Understand before you sign."
   - Subtitle: body-lg, on-surface-variant
   - **Interactive Upload Dropzone Card** (`rounded-xl shadow-xl`):
     - Cloud upload icon in primary-fixed container
     - "Drag & drop" headline with "browse files" underline link
     - File type/size info
     - Two buttons: Primary "Upload & Analyze Free", Secondary "Try Sample Employment Contract"
     - Privacy assurance strip below
   - Stats grid (2×2 on mobile, 4 columns on md+): contracts analyzed, scan time, liabilities flagged, retention days
3. **Interactive Live Sample Preview Section**
   - Section label: "Interactive Verification Preview" + eye icon
   - `<h2>`: "How LegalLens dismantles toxic clauses"
   - Tab switcher (Non-Compete | Indemnification)
   - Split-pane card (5+7 cols on lg+):
     - Left: Raw legal text with `bg-error-container/60` highlight on risky language
     - Right: Risk badge, "Attention Score", Plain-English translation panel, "Why It Matters" bullets, "Recommended Counter-Proposal" code block
4. **Feature Grid**: 4 feature cards in `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
5. **Contract Type Strip**: 6 contract types in `grid-cols-2 sm:grid-cols-3 md:grid-cols-6`
6. **Security Banner**: dark inverse-surface full-width card
7. **Ethical Disclaimer Card**: info icon + disclaimer text
8. **Footer**: 4-column grid + bottom bar

---

### Screen 2: Login — "Login - LegalLens AI"

**Route**: `/login`
**Dimensions**: 2560×2436
**Layout**: Centered single card, full-screen height

**Structure:**
```
full-screen bg-surface flex items-center justify-center
  └─ relative container (max-w-xl mx-auto, z-10)
       ├─ Top status bar pill (SOC2 + TLS info, rounded-xl, backdrop-blur)
       └─ Elevated card (bg-surface-container-lowest rounded-xl shadow-xl p-8/p-12)
            ├─ Header: Policy icon, "LegalLens AI Studio" pill, h1 "Welcome back", subtitle
            ├─ Form: email input, password input + toggle, remember device checkbox
            ├─ Submit button (full-width, primary, arrow icon)
            ├─ SSO divider ("Or federated institutional sign in")
            ├─ SSO grid (2 cols: Google Workspace | Microsoft SSO)
            ├─ "Don't have an account?" link
            └─ Trust footnote banner (verified_user icon + description)
       └─ Bottom analytical metrics bar (font-code-clause, opacity-80)
```

**Background decoration:**
- Two blurred gradient orbs (absolute positioned, `blur-3xl`, `blur-2xl`)
- SVG grid pattern with radial mask (opacity 40%, stroke 0.75)

---

### Screen 3: Create Account — "Create Account - LegalLens AI"

**Route**: `/register`
**Dimensions**: 2560×2260
**Layout**: Same centered card pattern as login

**Structure:**
Similar to login but with:
- Name fields (first/last)
- Organization/company field
- Role dropdown
- Plan selection (free/pro)
- Terms of service checkbox
- "Already have an account? Sign In" link

---

### Screen 4: Dashboard — "Dashboard - LegalLens AI"

**Route**: `/dashboard`
**Dimensions**: 2560×4070
**Layout**: Sidebar (w-64) + Main (pl-64), full-screen

**Structure:**
```
System bar (top-0, h-6)
App header (top-6, h-16)
Left sidebar (top-[5.5rem], w-64)
Main content (pl-64, pt-[5.5rem])
  └─ px-gutter-desktop py-space-md space-y-space-lg
       ├─ Executive Briefing Bar (full-width card, relative overflow-hidden)
       │    ├─ Ambient blob (absolute -right-16 -top-16)
       │    ├─ Greeting headline + risk summary
       │    └─ Action buttons (Compare Versions | + Analyze New Document)
       ├─ Metric Telemetry Strip (grid 1/2/4 cols)
       │    4 stat cards: Total Analyzed | High Attention Flags | Pending Actions | Avg Latency
       └─ Main 12-col grid
            ├─ xl:col-span-8 — Document Stream
            │    ├─ Stream Controls (filter tab bar: All | Employment | Lease | NDAs)
            │    └─ Document cards (one per analyzed document):
            │         ├─ Icon in risk-colored container
            │         ├─ Document title + risk badge + SHA-256 + metadata
            │         ├─ Risk score dial (SVG arc)
            │         ├─ Extracted clause snippet/flags
            │         └─ Action row (Open Analysis | Ask AI | Export Brief)
            └─ xl:col-span-4 — Action Drawer
                 ├─ Fast Intake dropzone (mini upload card)
                 ├─ Analysis profile presets (2-col grid)
                 ├─ Upcoming Key Deadlines card
                 │    └─ Deadline items (error/warning style)
                 └─ "Consulting External Counsel?" teaser card
Sticky bottom disclaimer banner
```

---

### Screen 5: Upload Document — "Upload Document - LegalLens AI"

**Route**: `/upload`
**Dimensions**: 2560×2412
**Layout**: Sidebar + centered upload interface

**Structure:**
- Large drag-and-drop zone (primary focus)
- File type indicators (PDF, DOCX, TXT)
- Document type selector (Employment, Lease, NDA, etc.)
- Analysis profile presets
- Privacy assurance strip
- "Analyze Document" primary CTA button
- Recent uploads list (last 3 documents)

---

### Screen 6: Document Analysis — "Document Analysis - LegalLens AI"

**Route**: `/documents/[id]/analysis`
**Dimensions**: 2560×5978
**Layout**: Sidebar + full-width analysis workspace

**Structure:**
```
System bar + App header + Left sidebar
Document metadata bar (full-width, below header):
  ├─ Document breadcrumb (type • parties • pages • analysis time)
  ├─ Document title (headline-md)
  └─ Action row: Export Lawyer Brief | Compare Standard | Ask AI Assistant

Main workspace (max-w-[1520px] space-y-space-lg):
  ├─ Top Analytical Grid (12-col):
  │    ├─ 4-col: Attention Gauge Card (SVG circular arc, risk breakdown legend)
  │    ├─ 5-col: Executive Plain-English Summary
  │    └─ 3-col: Critical Timelines / Crucial Milestones
  │
  ├─ Segmented Navigation (tab bar: High Risk & Red Flags | All Clauses | Obligations | Omissions | Questions)
  │
  └─ Main 12-col Workspace:
       ├─ xl:col-span-8 — Clause Analysis Stream (active tab panel)
       │    ├─ Risk Clause cards (header: risk badge + section title + page ref)
       │    │    ├─ Extracted contract language with amber/rose highlights
       │    │    ├─ 2-col: Risk Assessment | Suggested Redline
       │    │    └─ Actions: Copy Clause | Propose Redline | precedent note
       │    ├─ Omission Detection box (missing protections)
       │    └─ Comparative Market Baseline (progress bars vs. NVCA standard)
       │
       └─ xl:col-span-4 — Contextual Rail (sticky top-24)
            ├─ Questions for Counsel (numbered list + copy buttons)
            ├─ "Draft Attorney Brief Email" primary button
            ├─ Document Entities & Parties list
            └─ AI Extraction Confidence metrics

Full-width Legal Disclaimer Banner (bottom)
```

---

### Screen 7: Clause Detail — "Clause Detail - LegalLens AI"

**Route**: `/documents/[id]/clause/[clauseId]`
**Dimensions**: 2560×5030
**Layout**: Sidebar + detailed single-clause deep-dive

**Structure:**
- Similar to Document Analysis but focused on one clause
- Full raw clause text at top with all annotations
- Full plain-English translation
- All risk bullets listed
- Counter-proposal / redline suggestions
- "Related clauses in document" sidebar panel
- "Add to Lawyer Prep" CTA

---

### Screen 8: Ask Document AI — "Ask Your Document - LegalLens AI"

**Route**: `/documents/[id]/ask`
**Dimensions**: 2560×3298
**Layout**: Sidebar + split-pane (document viewer left, chat right)

**Structure:**
```
Context sub-bar (below header):
  ├─ "Ask Document AI" headline + "Live Inference" badge
  └─ Document title + pages indexed + Settings + Export Session buttons

Guardrail banner (tertiary background):
  "Grounded Retrieval Mode Active: Answers strictly from contract text..."

Split-pane workbench (xl:grid-cols-12):
  ├─ xl:col-span-5 — Document Viewer
  │    ├─ Viewer toolbar (page nav, zoom, download)
  │    ├─ Document canvas (bg-surface-container-lowest, p-space-lg):
  │    │    ├─ Document header (file ref + page number)
  │    │    ├─ Legal text body with annotated highlights:
  │    │    │    ├─ Normal sections (text-on-surface-variant)
  │    │    │    ├─ Critical highlighted section (bg-error-container/40 + mark tags)
  │    │    │    └─ Moderate highlighted section (bg-surface-variant/40 + mark tags)
  │    │    └─ Page navigation (prev/next buttons)
  │    └─ Zero-Hallucination Sandbox info card (tertiary icon + description)
  │
  └─ xl:col-span-7 — Chat Interface
       ├─ Suggested Prompts header (3 quick-chip buttons)
       ├─ Chat messages stream (max-h-[580px], overflow-y-auto):
       │    ├─ User bubbles: right-aligned, bg-primary, rounded-xl rounded-tr-xs
       │    └─ AI bubbles: left-aligned, bg-surface-container-low, rounded-xl rounded-tl-xs
       │         ├─ AI header (neurology icon + "LegalLens AI Assistant" + grounded badge)
       │         ├─ Response text with bolded citations
       │         ├─ Detailed breakout box (bg-surface-container-lowest)
       │         └─ Source citations (clickable links to document sections)
       └─ Chat input form:
            ├─ Textarea (2 rows, pr-24 for action buttons)
            ├─ Action buttons inside textarea: mic + send (primary button)
            └─ Footer: lock icon + "Answers from document only" | Clear Chat button

Quick Analysis Metrics Bar (3 cols below chat):
  Critical Flags | Standard Terms | Inference Speed
```

---

### Screen 9: Compare Documents — "Compare Documents - LegalLens AI"

**Route**: `/documents/compare`
**Dimensions**: 2560×5174
**Layout**: Sidebar + side-by-side comparison panes

**Structure:**
- Document A selector + Document B selector (or standard template)
- Side-by-side text view with color-coded redline differences:
  - Added text: green background/tertiary color
  - Removed text: red background/error color + strikethrough
  - Changed: both deletion + addition inline
- Clause navigator (left mini-nav jumping to changed sections)
- Risk delta panel (right): what changed in risk score
- Export comparison report CTA

---

### Screen 10: Lawyer Preparation — "Lawyer Preparation - LegalLens AI"

**Route**: `/documents/[id]/lawyer-prep`
**Dimensions**: 2560×6440
**Layout**: Sidebar + preparation workflow

**Structure:**
- Document summary card (top)
- Generated questions for counsel (numbered, copyable)
- Risk clauses checklist (checkboxes to include in brief)
- Export options:
  - PDF brief
  - Email draft
  - Word document
- Preview of generated brief (condensed 1-page view)
- "Configure Counsel Brief" settings panel

---

## 15. Icons & Assets

### 15.1 Icon Library

**Google Material Symbols Outlined** — used exclusively throughout all screens.

```html
<span class="material-symbols-outlined">icon_name</span>
```

**Size classes used**: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-[14px]`, `text-[16px]`, `text-[18px]`, `text-[20px]`, `text-[22px]`, `text-[24px]`, `text-[26px]`

**Fill variant** (for solid icons): `style="font-variation-settings: 'FILL' 1;"`

**Icons reference by context:**

| Context | Icon |
|---|---|
| Upload / Cloud | `cloud_upload`, `upload`, `upload_file` |
| Document | `description`, `draft`, `folder_open`, `folder_special` |
| AI / Analysis | `neurology`, `psychology_alt`, `auto_read_pause` |
| Security | `lock`, `lock_clock`, `verified_user`, `enhanced_encryption`, `shield`, `security`, `policy` |
| Risk / Warning | `warning`, `priority_high`, `report_problem`, `flag`, `assignment_late` |
| Verified | `check_circle`, `verified`, `task_alt`, `fact_check` |
| Action | `bolt`, `add`, `add_circle`, `arrow_forward`, `chevron_right` |
| Navigation | `grid_view`, `difference`, `assignment_turned_in`, `rule` |
| Compare | `balance`, `difference` |
| Legal | `gavel`, `health_and_safety` |
| Export | `picture_as_pdf`, `file_download`, `forward_to_inbox`, `content_copy` |
| Timing | `event_upcoming`, `alarm`, `calendar_month`, `timer`, `notifications_active` |
| Search | `find_in_page`, `search_off`, `visibility`, `visibility_off` |
| Edit | `edit_note`, `tune`, `recommend` |
| Info | `info`, `lightbulb`, `contact_support` |
| UI | `close`, `notifications`, `translate`, `trending_up` |
| Chat | `send`, `mic`, `format_quote`, `tips_and_updates`, `chat_bubble_outline` |
| Zoom | `zoom_in`, `zoom_out` |

### 15.2 Brand Logo

LegalLens AI logo: wordmark style — text-based `LegalLens.ai` with `.ai` in `text-primary` color (#004ac6).

Visual logo: Hosted image asset. Usage:
```html
<img alt="LegalLens AI Logo" class="h-8 w-auto object-contain" src="[logo-url]"/>
```
Stitch logo URL (temporary, regenerate or replace with hosted asset).

### 15.3 User Avatar

Profile image: `w-8 h-8 rounded-full object-cover ring-2 ring-surface-container-high`
Larger avatar in clause detail: `w-9 h-9 rounded-lg object-cover`

### 15.4 Background Decorations

All ambient decorative elements are:
1. `absolute` positioned
2. `pointer-events-none` (no interaction)
3. `opacity-40` to `opacity-60`
4. Using `blur-2xl` or `blur-3xl` for soft glow effect
5. Using gradient combinations of `surface-variant`, `primary-fixed`, `tertiary-fixed`

Example ambient blob:
```html
<div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[72rem] h-[28rem]
  bg-gradient-to-b from-primary-fixed/40 via-surface-container-high/30 to-transparent
  blur-3xl pointer-events-none -z-10">
</div>
```

Example login grid pattern:
```html
<svg class="absolute inset-0 w-full h-full stroke-surface-dim/70
  [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]">
  <defs>
    <pattern id="grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke-width="0.75"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
</svg>
```

---

*End of DESIGN.md — LegalLens AI Document Assistant*
*Extracted from Stitch Project ID: 11353851148072686079*
*Design System: Precision Analytical Legal*
