# Change Log

## 2026-04-07 - Simplified library and enforced standard bay widths

**What Changed:**
- Library now shows one entry per element option (8 items instead of 12) — no wide/narrow distinction
- Wide/narrow variant is auto-selected based on bay width when placing elements
- E-tracks snap to standard bay widths (667px or 912px) relative to nearest existing track
- Track dragging constrained to valid positions that create standard bay widths with neighbors
- Removed "Swap Width" from context menu (width is fully automatic)
- Updated library labels to show "Shelf — 22" instead of "Wide — 22"
- Added snap preview guide when dragging e-tracks onto canvas
- Context menu Replace options deduplicated (one per option, not per width variant)

**Why:**
- Users should not need to think about wide vs narrow — the system handles it
- Bays should only be standard Vitsoe widths (66.7cm or 91.2cm)

**Files Modified:**
- `main.js` — deduplicated library catalog, snap positioning, constrained track drag, updated labels, removed swap width

---

## 2026-04-07 - Phase 1.5: Major rewrite — zoom, mouse drag, context menu, width auto-swap

**What Changed:**
- Added zoom/scale system: CSS transform on canvas, default 40%, +/- buttons, Ctrl+scroll, Fit button
- Replaced broken HTML5 drag-and-drop with custom mousedown/mousemove/mouseup system
- Added width auto-swap: elements automatically match bay width (wide/narrow) on placement and when tracks move
- Added horizontal track dragging with snap to standard bay widths (667px/912px)
- Added selection system: click to select, visual outline, Delete/Backspace to remove
- Added right-click context menu: Remove, Swap Width, Replace (grouped by category)
- Added snap guide lines when dragging tracks near standard positions
- Added ghost element that follows cursor during drag
- Added Escape key to cancel drag/deselect

**Why:**
- Canvas was too large for screen (needed zoom)
- HTML5 DnD caused elements to revert instead of repositioning (replaced with mouse events)
- No width validation allowed mismatched elements in bays
- Tracks were not movable
- No way to select, delete, or interact with placed elements

**Files Modified:**
- `index.html` — added zoom controls, context menu container, drag ghost element
- `style.css` — added zoom controls, context menu, selection highlight, ghost, snap guide styles
- `main.js` — complete rewrite of drag system, added zoom, selection, context menu, width auto-swap, track dragging

---

## 2026-04-07 - Phase 1 MVP: Initial app scaffold with drag-and-drop

**What Changed:**
- Created `index.html` with two-region layout (library sidebar + scrollable canvas)
- Created `style.css` with flexbox layout, absolute positioning for canvas elements, z-index layering, drop indicators
- Created `main.js` with:
  - Constants matching CLAUDE.md variables (track width, pin hole spacing, bay distances, etc.)
  - Hardcoded element manifest with SVG metadata and right-alignment offsets
  - Filename parser (`parseElementFilename`) for auto-categorization
  - State model (tracks + elements with bay/pinRow positioning)
  - Full render loop creating absolutely-positioned DOM elements
  - Library panel populated by category (e-tracks, shelves, cabinets)
  - Drag from library to canvas (e-tracks snap to grid, elements snap to bay + pin row)
  - Drag to reposition existing elements on canvas
  - Bay detection and pin row snapping logic
  - Visual drop indicators (bay highlight + pin guide line)
  - Default state: 3 e-tracks (200cm) forming 2 wide bays
- Created `docs/readme.md` and `docs/log.md`

**Why:**
- Initial build of the Vitsoe Designer app — Phase 1 MVP per implementation plan

**Files Modified:**
- `index.html` — new file
- `style.css` — new file
- `main.js` — new file
- `docs/readme.md` — new file
- `docs/log.md` — new file

---
