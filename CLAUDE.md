# Claude Instructions

## Project Overview

Vitsoe Designer is a standalone vanilla HTML/JS/CSS web app that lets users design custom layouts of the Vitsoe 606 modular shelving system. Users build configurations by placing vertical e-tracks, then adding shelves, cabinets, and other elements between them via drag-and-drop and a context menu.

**Key Features:**
- Grid system that replicates the Vitsoe 606 modular constraints
- Element library auto-discovered from the `elements/` folder
- Drag and drop to rearrange elements on the e-tracks
- Context menu on click: remove element, swap width (narrow/wide), replace with another element from the same category
- Moving e-tracks from wide to narrow spacing automatically swaps all elements in that bay to their narrow-width variant (and vice versa)

### Tech Stack

- Vanilla HTML, CSS, JavaScript (no frameworks)
- SVG elements rendered inline or as `<img>` tags

---

### Vitsoe 606 System

**Bay widths:**
- Narrow bay: 66.7cm (667px) — distance between two adjacent e-tracks
- Wide bay: 91.2cm (912px) — distance between two adjacent e-tracks

**E-tracks** are the vertical rails. Elements attach to e-tracks via pin holes.

**Elements** (shelves, cabinets, desks, etc.) come in narrow and wide widths to match the bay width. Each element type may have multiple options (e.g., different depths).

Because all elements use an isometric drawing style, different depths produce different pixel widths. Elements must be **right-aligned** within their bay so the right edge lines up with the right e-track — this keeps the isometric perspective consistent.

### Variables

| Variable | Value | Pixels (1cm = 10px) |
|---|---|---|
| Track width | 3.5cm | 35px |
| Pin hole size | 1.5cm | 15px |
| Pin hole spacing | 7cm | 70px |
| Pin hole start from top | 3cm | 30px |
| Wide bay distance | 91.2cm | 912px |
| Narrow bay distance | 66.7cm | 667px |
| Cabinet height | 55cm | 550px |

### Scale

1cm = 10px. Example: a 200cm e-track = 2000px tall.

---

### Element Files

All SVG elements live in `elements/`. The app should auto-discover elements by reading this folder.

**Naming convention:** `{category}-{width}-{option}.svg`
- `category`: element type (shelf, cab, etrack, desk, etc.)
- `width`: `wide` or `narrow` (omitted for e-tracks, which have a fixed width)
- `option`: variant identifier — may contain underscores as spaces in multi-word options (e.g., `1d_lock`)

**Examples:**
- `shelf-wide-22.svg` → category: shelf, width: wide, option: 22 (22cm depth)
- `cab-narrow-1d_lock.svg` → category: cab, width: narrow, option: 1d_lock
- `etrack-200.svg` → category: etrack, option: 200 (200cm length)

**E-track naming** differs slightly: `etrack-{length}.svg` where length is in cm. Available lengths: 57, 114, 171, 200.

**Context menu** should group replacement options by category (all shelves together, all cabinets together, etc.)

**Current element inventory:**

| File | Category | Width | Option | SVG Size (px) |
|---|---|---|---|---|
| etrack-57.svg | etrack | — | 57cm | 35 × 570 |
| etrack-114.svg | etrack | — | 114cm | 35 × 1140 |
| etrack-171.svg | etrack | — | 171cm | 35 × 1710 |
| etrack-200.svg | etrack | — | 200cm | 35 × 2000 |
| shelf-wide-22.svg | shelf | wide | 22 | 1027 × 244 |
| shelf-wide-36.svg | shelf | wide | 36 | 1086 × 280 |
| shelf-narrow-22.svg | shelf | narrow | 22 | 787 × 258 |
| shelf-narrow-36.svg | shelf | narrow | 36 | 849 × 280 |
| cab-wide-1d.svg | cab | wide | 1d | 1086 × 644 |
| cab-wide-1d_lock.svg | cab | wide | 1d_lock | 1086 × 644 |
| cab-narrow-1d.svg | cab | narrow | 1d | 850 × 644 |
| cab-narrow-1d_lock.svg | cab | narrow | 1d_lock | 850 × 644 |

---

## Documentation

When new features, integrations, architecture decisions, or other noteworthy information comes up during work, document it in `docs/readme.md`. Keep it updated as a living reference for the project.

---

## Plans

All implementation plans must be saved to `docs/plans/`. Filenames must start with the date in `YYYY-MM-DD` format, followed by a descriptive name (e.g., `docs/plans/2026-03-27-auth-system.md`, `docs/plans/2026-03-27-cms-migration.md`). This ensures plans are versioned, reviewable, and accessible across sessions.

---

## Logging Requirements

**CRITICAL:** For every code change or feature addition:

1. **Write a log entry** describing what was changed and why
2. **Save to `docs/log.md`** in the following format:

### Log Entry Format

```markdown
## [YYYY-MM-DD] - [Brief Change Title]

**What Changed:**
- Specific file(s) modified or created
- Description of the change

**Why:**
- Reason for the change (feature request, bug fix, refactor, etc.)

**Files Modified:**
- `path/to/file.ext`
- `path/to/file.ext`

---
```

### Example

```markdown
## 2026-03-27 - Added Parent Name field to notification form

**What Changed:**
- Added "Parent Name" input field to the email notification modal
- Updated `submitNotify()` to collect and send parent name to Google Apps Script

**Why:**
- Parents want to be identified when registering interest, not just by email

**Files Modified:**
- `index.html` - Added input field and updated form submission logic

---
```

### When to Log

Log entries are needed for:
- ✅ New features
- ✅ Bug fixes
- ✅ File modifications
- ✅ New file creation
- ✅ Schema/structure changes (e.g., adding columns to Google Sheet)

Don't log:
- ❌ Reading files to understand context
- ❌ Running tests/verification
- ❌ Responding to questions without code changes



### Workflow

1. **Make the code change(s)**
2. **Write the log entry** in the format above
3. **Append to `docs/log.md`**
4. **Inform the user** of what was done in your response

---

### How to Update `docs/log.md`

```javascript
// Pseudocode - in practice, use Read → Edit/Write
const logEntry = `
## [YYYY-MM-DD] - [Title]

**What Changed:**
- ...

**Why:**
- ...

**Files Modified:**
- ...

---
`;

// Append to docs/log.md
```

Always preserve existing log entries. New entries go at the **top** (most recent first) for easy scanning.

---

## Current Project State

### File Inventory
- `CLAUDE.md` — project instructions
- `elements/` — SVG element files (12 files: 4 etracks, 4 shelves, 4 cabinets)

### Active Features
- None yet — project is pre-development. SVG assets are ready.

---

## Design Context

### Users
Vitsoe customers planning their own 606 modular shelving system before purchasing. Design-conscious consumers who appreciate Vitsoe's aesthetic and Dieter Rams' philosophy. The tool should feel like an extension of the Vitsoe experience.

### Brand Personality
**Honest, unobtrusive, purposeful.** Inspired by Dieter Rams' 10 principles — particularly "as little design as possible," "honest," and "unobtrusive."

### Aesthetic Direction
- **Visual tone**: Ultra-functional minimalism with warmth. Quiet confidence, not cold or sterile.
- **Theme**: Light only.
- **Primary reference**: vitsoe.com — restrained, black-and-white dominant, generous whitespace, functional hierarchy
- **Other references**: Dieter Rams' design principles, Braun product design, the 606 system itself
- **Anti-references**: Generic SaaS dashboards, purple-gradient AI aesthetic, startup-flavored UI.

### Design Principles
1. **Less but better** — Every UI element must earn its place.
2. **Honest materials** — Real information, real proportions. No fake depth or gratuitous effects.
3. **The tool disappears** — The interface never competes with the user's configuration.
4. **Precision over flair** — Meticulous alignment, spacing, and typography.
5. **Accessible by default** — WCAG AA compliance (4.5:1 contrast, keyboard navigable, respects reduced motion).

### Typography (from vitsoe.com)
- Brand typeface: Univers (Frutiger, 1969). Free web equivalent: DM Sans or Source Sans 3
- Bold 700 for headings, regular for body. Sizes: 14px (secondary) to 32px (headings)
- Fixed `rem` sizing for app UI. `tabular-nums` for pricing/numeric data
- Restrained uppercase/letter-spacing for section labels only

### Color (from vitsoe.com)
- `#000` black (text), `#fff` white (backgrounds), `#f0f0f0` (panels), `#c2c2c2` (borders), `#666` (secondary text), `#0073b1` (links/accents)
- Spacing: 8px base unit. Common: 8, 16, 24, 32, 40, 48, 64px
