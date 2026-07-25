# ⚡ RestaurantOS Motion & Micro-Interaction Guidelines
**Hardware-Accelerated Kinetic UX Specification (Immutable Design Contract)**
*Reference: [UI_GUIDELINES.md](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/UI_GUIDELINES.md)*

---

## 1. Executive Motion Philosophy

In a Smart Restaurant Operating System, kinetic motion is never decorative filler. Every animation must provide **measurable operational clarity**, confirm tactile actions in high-speed environments, or guide the user's focus toward urgent time-sensitive events (such as kitchen dishes ready for floor serving or critical AI inventory depletion alarms).

All transitions and interface transforms in RestaurantOS are standardized on **Framer Motion** paired with Tailwind CSS v4 transitions, adhering strictly to **hardware-accelerated properties** (`transform`, `opacity`, `scale`) to maintain 60 FPS fluidity on low-powered touchscreen terminals and handheld tablets.

---

## 2. Kinetic Purpose & Functional Scope

We categorize motion into **four strict operational archetypes**:

1. **Tactile Confirmation (Micro-Interactions)**: Instantly acknowledging visual interaction on touch devices so waitstaff and customers never doubt whether a button tap registered.
2. **State Transition Choreography**: Visually clarifying operational shifts (such as a table changing occupancy status or a kitchen order advancing across KDS stations).
3. **Spatial Continuity (Drawer & Dialog Slide-Ins)**: Preserving mental mapping by sliding table inspection sheets and customer dining bags out from consistent screen edges rather than jarring pop-ins.
4. **Urgency & Alarm Pulsing (Operational Signaling)**: Directing staff eye focus toward critical action items without annoying auditory alarm fatigue.

---

## 3. Micro-Interaction & Component Specifications

### A. Tactile Button & Card Press (`whileTap`, `whileHover`)
* **Touch Tap Scale-Down**: All interactive action buttons and menu dish tiles apply a subtle compression effect upon touch down:
  ```tsx
  // Standard tactile push behavior for interactive components
  <motion.button 
    whileTap={{ scale: 0.96 }} 
    whileHover={{ scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  >
    {children}
  </motion.button>
  ```
* **Why it matters**: In busy commercial settings, instant geometric feedback reassures staff that their tap executed cleanly, eliminating duplicate clicks and erroneous multiple order submissions!

### B. Kitchen Display System (KDS) Card Lane Shifts (`layoutId`)
* **Smooth Layout Transitions**: When a Chef taps a KDS ticket to advance its state from `QUEUED` to `COOKING`, the order card does not snap or disappear instantly.
* **Shared Layout Animation**: Using Framer Motion's shared layout animation (`layout` and `layoutId` props), the ticket glides smoothly across the widescreen masonry columns into its new cooking status group with a **280ms cubic-bezier ease-out** transition. This visual continuity helps entire kitchen crews track dish flow across stations effortlessly.

### C. Realtime Alert & Overdue Timer Pulsing (`animate`)
* **Urgency Signaling**: When an active table assistance call (`WAITER_CALL`) or overdue kitchen dish (>18 minutes elapsed) occurs, static text is insufficient.
* **Subtle Neon Pulse**: High-priority cards implement a graceful border pulsing loop:
  ```tsx
  <motion.div 
    animate={{ borderColor: ['#EF4444', '#F97316', '#EF4444'], boxShadow: ['0 0 0px #EF4444', '0 0 16px #F97316', '0 0 0px #EF4444'] }}
    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    className="border-2 rounded-xl"
  >
    {/* Urgent Alert Content */}
  </motion.div>
  ```
* **Why it matters**: Creates an unmistakable visual Beacon that guides waiter floor focus immediately without disturbing dining ambiance.

### D. Slide-Over Drawers & Bottom Cart Sheets
* **Edge Entry Directionality**:
  * **Waiter Table Inspector (`SCR-06`)**: Slides in from the **Right Edge** (`initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' }`) over an 80% opacity dark blur backdrop.
  * **Customer Mobile Order Bag (`SCR-03`)**: Slides smoothly up from the **Bottom Edge** (`initial: { y: '100%' }, animate: { y: 0 }`), matching native smartphone OS expectations.
  * **Animation Timing**: Strictly bounded to **250ms–300ms** duration with spring easing (`stiffness: 300, damping: 30`) to ensure high-speed perceived responsiveness.

---

## 4. Performance & Accessibility Governance

### A. Strict Hardware-Acceleration Mandate
* **Prohibited Properties**: Engineers are strictly forbidden from animating layout-triggering CSS properties such as `width`, `height`, `margin`, `padding`, or `top/left/right/bottom` positioning offsets.
* **Approved Properties**: Animations must rely exclusively on GPU-accelerated compositing layers: `transform (translate, scale, rotate)` and `opacity`.

### B. Operating System Reduced Motion Support (`prefers-reduced-motion`)
To honor user cognitive ergonomics and accessible visual comfort, all animations must respect system accessibility flags:
* **Framer Motion Integration**: All motion wrappers must invoke Framer Motion's native `useReducedMotion()` hook or CSS `@media (prefers-reduced-motion: reduce)` tokens.
* **Fallback Action**: When reduced motion is enabled by an operating system or terminal device, kinetic sliding and infinite pulsing loops automatically degrade to **instantaneous zero-millisecond fades or solid state border indicators**, ensuring zero functional impairment while respecting visual stability.
