/**
 * BBF Motion JS constants — mirrors CSS motion tokens for Framer Motion context.
 *
 * Framer Motion's `ease` and `duration` props require JS values; CSS custom
 * properties are not readable in JS at runtime. These constants are NOT a token
 * bypass — they mirror the canonical CSS tokens exactly so Framer animations
 * stay in sync with CSS transitions.
 *
 * Source of truth: src/styles/tokens/motion/duration.css + easing.css
 * Cross-reference: --bbf-motion-duration-fast = 180ms, --bbf-motion-duration-base = 240ms,
 *                  --bbf-motion-ease-out-quart = cubic-bezier(0.25, 1, 0.5, 1)
 */

/** = --bbf-motion-ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1) */
export const BBF_EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

/** = --bbf-motion-duration-fast: 180ms (in seconds for Framer) */
export const BBF_DURATION_FAST_S = 0.18;

/** = --bbf-motion-duration-base: 240ms (in seconds for Framer) */
export const BBF_DURATION_BASE_S = 0.24;
