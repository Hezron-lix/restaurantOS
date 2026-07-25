# ⚡ Motion System
**Framer Motion Animation Patterns for RestaurantOS**
*Consolidated and finalized from Sprint 2.5 MOTION_GUIDELINES.md*

---

## Philosophy

Motion in RestaurantOS is **functional, not decorative**. Every animation must serve one of these operational purposes:

1. **Tactile confirmation** — confirms a touch input registered in a high-distraction environment
2. **State transition clarity** — makes operational status changes visible and unambiguous
3. **Spatial continuity** — preserves mental model when panels slide in/out
4. **Urgency signaling** — directs staff attention to time-sensitive events

**Performance rule**: Only `transform` and `opacity` may be animated. Never animate `width`, `height`, `margin`, `padding`, or positional properties (`top`, `left`).

---

## Core Motion Variants (Reusable Framer Motion Objects)

These are the standard named variants to be imported and reused across all components:

```typescript
// lib/motion.ts — shared motion variant library

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.15, ease: 'easeOut' },
};

export const slideInRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0,      opacity: 1 },
  exit:    { x: '100%', opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};

export const slideInBottom = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0,      opacity: 1 },
  exit:    { y: '100%', opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};

export const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1,    opacity: 1 },
  exit:    { scale: 0.95, opacity: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const staggerItem = {
  initial: { y: 12, opacity: 0 },
  animate: { y: 0,  opacity: 1 },
  transition: { duration: 0.22, ease: 'easeOut' },
};
```

---

## Component-Specific Motion Specifications

### 1. Button / Interactive Card Press
```typescript
// Applied via whileTap and whileHover on motion.button or motion.div
const buttonMotion = {
  whileHover: { scale: 1.02 },
  whileTap:   { scale: 0.96 },
  transition: { type: 'spring', stiffness: 400, damping: 25 },
};
```
**Purpose**: In a kitchen environment with greasy gloves, operators need instant visual confirmation that a button tap was registered.

---

### 2. Sheet / Drawer Entry (Waiter Table Inspector, Customer Bag)

**Waiter table inspector** — enters from right edge:
```typescript
// Consistent with SCR-06 slide-over behavior
initial: { x: '100%' }
animate: { x: 0 }
exit:    { x: '100%' }
transition: { type: 'spring', stiffness: 300, damping: 30 }
```

**Customer order bag** — enters from bottom edge:
```typescript
// Consistent with mobile bottom sheet behavior on SCR-03
initial: { y: '100%' }
animate: { y: 0 }
exit:    { y: '100%' }
transition: { type: 'spring', stiffness: 300, damping: 30 }
```

---

### 3. KDS Ticket Layout Transition
```typescript
// Applied to KdsOrderTicket via layout and layoutId props
// When a chef taps COOKING, the ticket repositions smoothly across kanban columns
<motion.div layout layoutId={`ticket-${orderId}`} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
  {/* ticket content */}
</motion.div>
```
**Purpose**: Smooth positional transition avoids disorientation when chefs track specific order tickets as they move between QUEUED / COOKING / READY columns.

---

### 4. Urgency Pulse (READY state, Waiter Calls)
```typescript
// Applied to KdsOrderTicket border and RealtimeNotificationPill when state is READY or WAITER_CALL
animate={{
  borderColor: ['#EF4444', '#F97316', '#EF4444'],
  boxShadow: [
    '0 0 0px rgba(239,68,68,0)',
    '0 0 20px rgba(249,115,22,0.4)',
    '0 0 0px rgba(239,68,68,0)',
  ],
}}
transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
```
**Purpose**: Creates unmistakable beacon effect for time-sensitive events without auditory alarm fatigue.

---

### 5. Page / Screen Transition
```typescript
// Applied at the layout level (app/(staff)/layout.tsx, etc.)
initial: { opacity: 0, y: 8 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.25, ease: 'easeOut' }
```

---

### 6. Toast / Notification Entry
```typescript
initial: { x: 40, opacity: 0 }
animate: { x: 0,  opacity: 1 }
exit:    { x: 40, opacity: 0 }
transition: { duration: 0.2, ease: 'easeOut' }
```

---

## Accessibility: Reduced Motion

All motion components must respect the system `prefers-reduced-motion` preference:

```typescript
// In any component using Framer Motion
import { useReducedMotion } from 'framer-motion';

function AnimatedCard({ children }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.22 }}
    >
      {children}
    </motion.div>
  );
}
```

**Fallback behavior**: When reduced motion is enabled, all animations become instantaneous opacity fades with zero positional movement. Pulsing loops stop entirely and are replaced by solid static border colors.

---

## What NOT to Animate

| Prohibited | Why |
| :--- | :--- |
| `width`, `height` | Forces layout recalculation, causes jank |
| `margin`, `padding` | Same as above |
| `top`, `left`, `bottom`, `right` | Use `transform: translate` instead |
| Full-page skeleton loader spin | Replaced by shimmer (CSS) or skeleton components |
| Hover effects on KDS touch screens | Touch monitors don't hover; remove `whileHover` from KDS components |
