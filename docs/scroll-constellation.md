# Scroll constellation

The shooting star is a progressive enhancement implemented in
`src/shooting-star.ts`. The page content never depends on it.

- The origin comes from the real first text box of `#hero-title`, measured with a
  DOM `Range`. It therefore stays beside the first line when the type wraps.
- A hidden exit waypoint moves the trajectory into the outer margin before the
  video ends. Every later waypoint is derived from the left edge of its `.shell`,
  so the path cannot cross readable content.
- One document-height SVG path connects the hero and all elements marked with
  `data-star-section`. Cubic Bézier controls keep the path monotonic in Y.
- Scroll updates a target path length. One `requestAnimationFrame` loop eases the
  star to that target, updates the SVG transform and stops when it arrives.
- Before scrolling, only the star is visible. Once launched, `strokeDashoffset`
  draws the travelled route. The luminous trail is sampled from that same path,
  so its endpoint always coincides with the star.
- The drawn route is based on the current position, not the furthest position.
  Scrolling upwards therefore retracts the route and removes the old line.
- Reaching a chapter marks it as invoked. Its eyebrow becomes fully visible and
  reverses to its latent state when the star travels back above it.
- The final contact panel is a real stop. Its left edge anchors the star and its
  portfolio-colour background animates during the arrival pulse.
- `ResizeObserver`, `document.fonts.ready` and viewport changes rebuild the
  geometry after layout changes.
- Under `prefers-reduced-motion`, the route is static and the star, trail, flare
  and title pulse are removed.

## Controls

The main visual controls are deliberately local:

- Origin: `startOffset` and the Y offset inside `buildGeometry()`.
- Route position: `railPosition()` and `sectionOuterGap`.
- Curve softness: the `verticalDistance * 0.42` handle inside
  `createBezierPath()`.
- Follow speed: the `0.0105` exponential smoothing value in `renderFrame()`.
- Stop resistance: `zone` and `resistance` in `applySectionMagnet()`.
- Trail length: the `120–210` range used when sampling the trail.
- Brightness and line weight: `.cosmic-*` rules and SVG gradients in
  `src/index.css` and `source.html`.

To add a stop, mark the target with `data-star-section` and its heading with
`data-star-title`. Add `data-star-anchor="edge"` when the star should touch the
target border instead of following the outer rail.
