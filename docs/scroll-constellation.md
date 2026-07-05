# Scroll constellation

The scroll guide is implemented in `src/components/scroll-constellation.tsx`.

- The component finds every element marked with `data-cosmic-section` and builds one responsive cubic Bézier SVG path through those sections.
- Scroll updates only a target path length. A single `requestAnimationFrame` loop interpolates the star towards that target and updates SVG transforms and dash offsets. The loop stops completely as soon as the star reaches its target and restarts on the next scroll input.
- The permanent line uses `strokeDasharray` / `strokeDashoffset`, so it appears to be drawn as the star advances. A second short dash creates the temporary luminous trail.
- Geometry is recalculated only after layout changes, font loading or resize. Section proximity activates the `cosmic-active` title pulse.
- A small magnetic pull is applied inside a 7.5% viewport radius around each section point, producing the subtle arrival deceleration without detaching the star from the user's scroll.
- With `prefers-reduced-motion`, the complete static line remains visible and the moving star and trail are removed.

## Main controls

At the top of `scroll-constellation.tsx`:

- `DESKTOP_X` and `MOBILE_X`: horizontal route of each section point, as viewport percentages. The desktop origin is `1415 / 1440`; its Y origin is `292`.
- `STAR_VIEWPORT_OFFSET`: where the star sits vertically in the viewport while scrolling.
- `TRAIL_LENGTH`: length of the temporary tail in SVG units.
- `GLOW_STRENGTH`: trail opacity.

Add `data-cosmic-section` to any new section and `data-cosmic-title` to the element that should briefly illuminate when the star arrives.
