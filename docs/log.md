# Change Log

## 2026-04-08 - Export as PNG, SVG, and PDF

**What Changed:**
- Added Export panel to library sidebar with PNG, SVG, and PDF export buttons
- PNG: 2x resolution render of the design with white background
- SVG: Full vector export including all elements, tracks, bay labels, and total dimensions
- PDF: Landscape A4 with title, dimensions subtitle, rendered design image, and optional price list table
- "Include price list" checkbox for PDF export (checked by default)
- Added jsPDF v2.5.2 via CDN for PDF generation
- Export panel is collapsible like other sidebar sections

**Why:**
- Users need to export their configurations for sharing, printing, or purchasing

**Files Modified:**
- `index.html` — added export panel HTML and jsPDF CDN script
- `style.css` — added export panel styles
- `main.js` — added `buildExportSVG()`, `exportAsPNG()`, `exportAsSVG()`, `exportAsPDF()`, export button wiring

---

## 2026-04-08 - Bay width labels and total unit dimensions

**What Changed:**
- Added bay width labels (e.g. "91.2 cm") in light grey centered between each pair of e-tracks, positioned below the tracks
- Added total unit dimensions ("X cm wide × Y cm tall") above the first e-track in the top left
- Both labels counter-scale against zoom to stay readable at any zoom level

**Why:**
- Users need to see bay distances and overall unit dimensions while designing

**Files Modified:**
- `main.js` — added `renderBayLabels()` and `renderTotalDimensions()` called from `render()`
- `style.css` — added `.bay-label` and `.total-dimensions` styles

---

## 2026-04-07 - Show element dimensions on hover

**What Changed:**
- Added `elementDimensions` data with L/D/H measurements for all element types
- `renderElement` now appends a `.element-dimensions` label to each element
- Label shows "L: 91.2 cm   D: 22 cm   H: 2 cm" in light grey beneath the element, visible only on hover

**Why:**
- Users need to see physical measurements when planning their configuration

**Files Modified:**
- `main.js` — added dimensions data, `getDimensions()` helper, and label in `renderElement`
- `style.css` — added `.element-dimensions` styles (positioned below, light grey, fade in on hover)

---

## 2026-04-07 - Fixed shelf-22 and shelf-36 SVG widths

**What Changed:**
- Extended shelf SVGs to correct widths by shifting right-side geometry (bracket, pin holes, shelf surface, bottom lip) while keeping left side unchanged
- Corrected approach: bracket-to-bracket span must be constant (wide=947px, narrow=693px) — initial attempt wrongly interpolated total SVG width
- Final widths: wide-22=1063, wide-36=1130, narrow-22=815, narrow-36=877
- Updated ELEMENT_META svgWidth values in main.js

**Why:**
- 22cm and 36cm shelves were drawn too narrow and didn't properly span between e-tracks

**Files Modified:**
- `elements/shelf-wide-22.svg`
- `elements/shelf-wide-36.svg`
- `elements/shelf-narrow-22.svg`
- `elements/shelf-narrow-36.svg`
- `main.js` — updated svgWidth in ELEMENT_META

---

## 2026-04-07 - Fixed shelf-22 and shelf-36 right-alignment offset

**What Changed:**
- Set `rightOffset` to 40 for shelf-wide-22, shelf-wide-36, and shelf-narrow-36 (were 38-39)

**Why:**
- These shelves were misaligned to the e-track by 1-2px compared to all other shelves which use rightOffset 40

**Files Modified:**
- `main.js` — updated ELEMENT_META rightOffset values

---

## 2026-04-07 - E-track deletion via context menu

**What Changed:**
- Right-clicking an e-track now shows a context menu with "Remove E-Track"
- Removing a track also removes all elements in the bays that touched it
- Bay indices are re-indexed after removal via existing `reindexElements()`

**Why:**
- Users had no way to delete e-tracks once placed

**Files Modified:**
- `main.js` — added track right-click handler and `showTrackContextMenu()` function

---

## 2026-04-07 - Improved collapse arrows: bigger size, arrow characters

**What Changed:**
- Increased `.collapse-arrow` from 10px/12px to 14px/16px for better visibility
- Replaced triangle characters (▾/▸) with arrow characters (↓/→)
- Added smooth transition on the arrow

**Why:**
- Collapse arrows were too small and hard to see
- Arrows (↓/→) are clearer affordances than triangles for expand/collapse

**Files Modified:**
- `style.css` — updated `.collapse-arrow` size and added transition
- `main.js` — swapped ▾→↓ and ▸→→ in all collapsible header toggles

---

## 2026-04-07 - Added full component library, price list, and cost calculator

**What Changed:**
- Downloaded 17 isometric SVGs from Vitsoe 606 components page and created wide+narrow variants (34 new SVG files)
- New elements: shelves (16cm, 30cm, hanging rail, 18° slope, 79° slope, single, double, drawer), cabinets (2d, 3d, up-over, fold-down door), tables (80cm, 120cm, 160cm), desk shelf
- SVGs auto-scaled from Vitsoe originals (283×283 viewBox) to our 1cm=10px system with content bbox cropping
- Created `prices.json` with all component prices in USD from vitsoe.com/us/606/components
- Added cost calculator panel in library sidebar — updates live as elements are added/removed
- Shows per-item line items with quantities and running total
- Updated ELEMENT_FILES (44 total), ELEMENT_META, and LIBRARY_CATALOG
- Added table and desk categories to library

**Why:**
- Expand element library to cover all Vitsoe 606 rail-mounted components
- Enable users to estimate costs as they design

**Files Modified:**
- `elements/` — 34 new SVG files
- `prices.json` — new file, USD price list
- `main.js` — expanded manifest/meta, cost calculator logic, new categories
- `style.css` — cost panel styles
- `index.html` — cost panel container

---

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
