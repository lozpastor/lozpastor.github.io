# Scroll constellation

The scroll guide is implemented in `src/components/scroll-constellation.tsx`.

- The component finds every element marked with `data-cosmic-section` and builds one responsive cubic Bézier SVG path through those sections.
- Scroll updates only a target path length. A single `requestAnimationFrame` loop interpolates the star towards that target and updates SVG transforms and dash offsets. The loop stops when the star reaches its target and restarts on the next scroll input.
- The permanent line uses `strokeDasharray` / `strokeDashoffset`, so it appears to be drawn as the star advances. A second short dash creates the temporary luminous trail.
- The first user scroll triggers a one-second SVG launch flare at the origin. It runs once per page visit and is independent from the scroll-driven star, so reversing the scroll never replays it.
- Geometry is recalculated only after layout changes, font loading or resize. Section proximity activates the `cosmic-active` title pulse.
- A small magnetic pull is applied inside a 7.5% viewport radius around each section point, producing the subtle arrival deceleration without detaching the star from the user scroll.
- With `prefers-reduced-motion`, the complete static line remains visible and the moving star and trail are removed.

## Main controls

At the top of `scroll-constellation.tsx`:

- `DESKTOP_X` and `MOBILE_X`: horizontal route for the hero origin and every section stop, expressed as viewport percentages. The current desktop origin is `30%` of the viewport width and its Y origin is the smaller value between `118px` and `12vh`.
- `STAR_VIEWPORT_OFFSET`: where the star sits vertically in the viewport while scrolling. It is currently `0.66`; increasing it makes the star travel lower on screen.
- `TRAIL_LENGTH`: length of the temporary tail in SVG units.
- `GLOW_STRENGTH`: trail opacity.

The launch flare size and brightness live in `.cosmic-launch-flare`, `@keyframes cosmic-launch` and the `launch-flare` radial gradient. The travelling star appearance is controlled by `.cosmic-star-tail`, `.cosmic-star-tail-wide` and the `star-glow` filter.

Add `data-cosmic-section` to any new section and `data-cosmic-title` to the element that should briefly illuminate when the star arrives. Keep the same number of route entries in `DESKTOP_X` / `MOBILE_X` as the hero origin plus section stops when you want full manual control of every curve.
