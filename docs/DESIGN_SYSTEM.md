# Design System

RestaurantOS uses a dark-first, premium design language. The UI should feel like high-end consumer hardware (like Apple or Teenage Engineering) rather than typical B2B SaaS software.

## Typography
We use **Geist Sans** (Inter-like, geometric) for standard UI and headings, and **Geist Mono** for financial data and tabular numbers.
- **Headings**: Tight tracking (`tracking-tight`), medium-to-bold weights. Generous line height (`leading-[1.1]`) on large displays.
- **Body**: Light font weights (`font-light`), relaxed line heights (`leading-relaxed`), typically rendered in `zinc-400` for readability against deep dark backgrounds.

## Color Palette
Reference: `app/globals.css`
- **Background**: Deep Zinc `hsl(222 47% 11%)`. We avoid pure black outside of the landing page hero.
- **Brand**: Amber/Orange `hsl(21 90% 48%)`. Used sparingly for primary actions and glowing highlights.
- **Surfaces**: We use slightly lighter Zinc `hsl(217 33% 17%)` for cards, with hover states lifting to `hsl(215 28% 22%)`.
- **Status Tokens**:
  - Available/Success: Emerald (`hsl(160 84% 39%)`)
  - Cooking/Warning: Amber (`hsl(43 96% 56%)`)
  - Ready/Critical: Red (`hsl(0 72% 51%)`)

## Grid and Spacing
- **Generous Whitespace**: We favor large paddings (`p-8`, `p-10`, `py-48`). Elements should never feel cramped.
- **Containment**: We restrict max-widths heavily (e.g., `max-w-7xl` for containers, `max-w-3xl` for text blocks) to maintain readable line lengths.

## Glassmorphism
We use glassmorphism strategically to establish physical depth, never just for aesthetics.
- Background blurs (`backdrop-blur-xl`, `backdrop-blur-2xl`) combined with ultra-low opacity backgrounds (`bg-zinc-900/40`).
- Combined with subtle border reflections (`border-zinc-800/60`).

## Shadows and Glows
We reject harsh drop shadows. Instead, we use large, soft, colored glows to simulate ambient light.
- E.g., `shadow-[0_20px_60px_-15px_rgba(234,179,8,0.2)]` for a deep, diffuse amber glow beneath an active card.

## Borders and Radii
- We favor highly rounded corners to offset the technical nature of the software.
- Standard buttons and inputs: `rounded-xl` or `rounded-2xl`.
- Large layout cards: `rounded-3xl` or `rounded-[23px]`.

## Buttons
- **Primary**: Brand colored with internal `glow-brand` shadows, smooth `hover:-translate-y-1` lifts.
- **Active States**: Distinct `active:scale-95` to give a physical "click" feel.

## Forms and Tables
- **Inputs**: Dark backgrounds, subtle borders, glowing rings on focus.
- **Tables**: `tabular-nums` enforced. Hover states on rows highlight the data without shifting layout.

## Responsive Behavior
- **Mobile**: Stacks cleanly, typography scales down (`text-5xl` down from `text-7xl`).
- **Tablet**: This is our primary target for the KDS and POS. Touch targets must be at least `48x48px` (`min-h-12 min-w-12`).
