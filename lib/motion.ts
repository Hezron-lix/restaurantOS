/**
 * RestaurantOS — Shared Framer Motion Variant Library
 * Reference: docs/design/MOTION_SYSTEM.md
 *
 * Import named variants to keep animation logic consistent across all components.
 * All animations use only GPU-accelerated properties: transform and opacity.
 */

import type { Variants, TargetAndTransition, VariantLabels } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Page / Screen Transitions
// ─────────────────────────────────────────────────────────────────────────────

export const fadeIn: Variants = {
  initial:  { opacity: 0 },
  animate:  { opacity: 1 },
  exit:     { opacity: 0 },
};
export const fadeInTransition = { duration: 0.15, ease: 'easeOut' };

export const pageEnter: Variants = {
  initial:  { opacity: 0, y: 8 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: 8 },
};
export const pageTransition = { duration: 0.25, ease: 'easeOut' };

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -20 },
};
export const fadeUpTransition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

// ─────────────────────────────────────────────────────────────────────────────
// Sheet / Drawer Entry Directions
// ─────────────────────────────────────────────────────────────────────────────

/** Waiter table inspector — enters from right edge */
export const slideInRight: Variants = {
  initial:  { x: '100%', opacity: 0 },
  animate:  { x: 0,      opacity: 1 },
  exit:     { x: '100%', opacity: 0 },
};

/** Customer mobile order bag — enters from bottom edge */
export const slideInBottom: Variants = {
  initial:  { y: '100%', opacity: 0 },
  animate:  { y: 0,      opacity: 1 },
  exit:     { y: '100%', opacity: 0 },
};

/** Notifications / toasts — enter from right */
export const slideInRightFast: Variants = {
  initial:  { x: 40, opacity: 0 },
  animate:  { x: 0,  opacity: 1 },
  exit:     { x: 40, opacity: 0 },
};

export const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

// ─────────────────────────────────────────────────────────────────────────────
// Modal / Dialog
// ─────────────────────────────────────────────────────────────────────────────

export const scaleIn: Variants = {
  initial:  { scale: 0.95, opacity: 0 },
  animate:  { scale: 1,    opacity: 1 },
  exit:     { scale: 0.95, opacity: 0 },
};
export const scaleTransition = { duration: 0.2, ease: 'easeOut' as const };

// ─────────────────────────────────────────────────────────────────────────────
// Stagger (List Items, Card Grids)
// ─────────────────────────────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  initial: { y: 12, opacity: 0 },
  animate: { y: 0,  opacity: 1 },
};
export const staggerItemTransition = { duration: 0.22, ease: 'easeOut' };

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Elements (Buttons, Cards)
// ─────────────────────────────────────────────────────────────────────────────

/** Apply to motion.button or motion.div for tactile press feedback */
export const buttonMotion = {
  whileHover: { scale: 1.02 } as TargetAndTransition | VariantLabels,
  whileTap:   { scale: 0.96 } as TargetAndTransition | VariantLabels,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

/** Hover lift for cards */
export const hoverLift = {
  whileHover: { y: -4, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)' } as TargetAndTransition | VariantLabels,
  transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
};

/**
 * KDS touch screen variant — NO whileHover (touch-only monitors don't hover).
 * Use this for KdsOrderTicket advance-status buttons.
 */
export const kdsButtonMotion = {
  whileTap:   { scale: 0.97 } as TargetAndTransition | VariantLabels,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Urgency Pulse (READY state, Waiter Calls, AI Critical Alerts)
// ─────────────────────────────────────────────────────────────────────────────

/** Apply to motion.div as animate prop when status is READY or WAITER_CALL */
export const urgencyPulseAnimate: TargetAndTransition = {
  borderColor: ['#EF4444', '#F97316', '#EF4444'],
  boxShadow: [
    '0 0 0px rgba(239,68,68,0)',
    '0 0 20px rgba(249,115,22,0.4)',
    '0 0 0px rgba(239,68,68,0)',
  ],
};
export const urgencyPulseTransition = {
  repeat: Infinity,
  duration: 2,
  ease: 'easeInOut' as const,
};

// ─────────────────────────────────────────────────────────────────────────────
// KDS Ticket Layout (shared layout animation)
// ─────────────────────────────────────────────────────────────────────────────

/** Apply layout + layoutId={orderId} + this transition to KdsOrderTicket */
export const kdsTicketLayoutTransition = {
  duration: 0.28,
  ease: 'easeOut' as const,
};

// ─────────────────────────────────────────────────────────────────────────────
// Floating Animation
// ─────────────────────────────────────────────────────────────────────────────

export const floatingAnimate: TargetAndTransition = {
  y: [0, -8, 0],
};
export const floatingTransition = {
  repeat: Infinity,
  duration: 4,
  ease: 'easeInOut' as const,
};
