---
name: APIHub Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '450'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 24px
  container-max: 1280px
---

## Brand & Style
The design system is engineered for a high-performance developer ecosystem, merging the utility of technical tools with the polished aesthetics of premium SaaS platforms. The brand personality is authoritative yet accessible, prioritizing speed, clarity, and reliability.

The visual direction follows a **Modern Corporate** style with **Minimalist** and **Glassmorphic** influences. It utilizes heavy whitespace to reduce cognitive load during complex API management tasks. The interface relies on high-contrast typography and a rigorous grid to establish a professional, "tool-first" atmosphere that feels both cutting-edge and dependable.

## Colors
This design system uses a logic-driven palette designed for clarity in both light and dark modes. 

- **Primary (Indigo):** Reserved for primary actions, active states, and brand moments.
- **Secondary (Slate/Zinc):** Used for deep backgrounds and high-contrast text.
- **Tertiary (Emerald):** Denotes success, system health, and "Live" API statuses.
- **Neutral:** A scaled grey palette used for secondary text, borders, and structural dividers.

In **Dark Mode**, the background shifts to a deep slate (#020617), maintaining high contrast by elevating surface colors slightly to #0F172A for cards and modals.

## Typography
The system utilizes **Inter** for all UI elements to ensure maximum legibility across high-density data views. **Geist** (Monospaced) is used for API endpoints, code snippets, and technical labels to provide a distinct visual "mode" for developer data.

Hierarchy is established through weight and tight letter-spacing on larger headings. For mobile, headline sizes are scaled down to prevent excessive wrapping while maintaining bold weights. Use the `label-caps` role for metadata, categories, and small headers in sidebars.

## Layout & Spacing
The design system employs a **12-column fluid grid** for the main content area, with a maximum container width of 1280px to maintain readability on ultra-wide monitors. 

- **Desktop:** 24px margins and 24px gutters. Sidebars are fixed-width (typically 240px-280px) while the main stage remains fluid.
- **Tablet:** 16px margins and 16px gutters. Sidebars often collapse into a hamburger menu or narrow icon-only bar.
- **Mobile:** 16px margins. Layouts reflow to a single column, with horizontal scrolling reserved only for wide data tables or code blocks.

Spacing follows a linear 4px/8px base-unit system. Use "Generous" (2xl/3xl) vertical spacing between major sections to emphasize the minimal aesthetic.

## Elevation & Depth
Depth is created through a combination of **Glassmorphism** and **Tonal Layering**.

- **Navigation & Headers:** Use a backdrop-blur (12px to 20px) with a semi-transparent background (e.g., `rgba(255, 255, 255, 0.7)` in light mode). This keeps the user grounded in their context while scrolling.
- **Cards & Surfaces:** Instead of heavy shadows, use "Crisp Borders" (1px solid #E2E8F0) and a very subtle ambient shadow (0px 4px 12px rgba(0,0,0,0.03)). 
- **Modals:** Use a more pronounced shadow (0px 20px 40px rgba(0,0,0,0.1)) and a dark-tinted overlay to pull focus.
- **Interactive States:** On hover, cards should lift slightly via a subtle shadow increase or a 1px border color change to the primary indigo.

## Shapes
The shape language is "Soft-Rounded," using a consistent **16px (rounded-2xl)** radius for all primary containers, cards, and modals. 

- **Buttons & Inputs:** Use the standard `rounded-lg` (8px) for a more precise, tool-like feel within the larger rounded containers.
- **Tags & Badges:** Use `rounded-full` (pill-shaped) to distinguish them from interactive buttons.
- **Code Blocks:** Maintain a slightly smaller 12px radius to preserve internal grid alignment of monospaced text.

## Components
- **Buttons:** Primary buttons are solid Indigo (#4F46E5) with white text. Secondary buttons use a subtle grey border with no background. Ghost buttons are reserved for low-priority actions in toolbars.
- **Cards:** White background, 1px border (#E2E8F0), and 16px corner radius. Content inside should have 24px of padding.
- **Input Fields:** 8px radius, 1px border. Focus state uses a 2px Indigo ring with 0% offset.
- **Lists:** Clean, borderless rows with 12px vertical padding, separated by a 1px divider. Use hover highlights (`bg-slate-50`) to indicate interactivity.
- **Navigation:** Top-nav or sidebar-nav should use the glassmorphic blur effect. Active items are marked with a subtle Indigo left-border or a light Indigo background tint.
- **Chips:** Small, pill-shaped, using a light tint of the primary color or status color (e.g., light green background with dark green text for "Active").
- **API Terminal:** A specialized component with a dark (#0F172A) background, Geist Mono font, and syntax highlighting mirroring the primary and tertiary colors.