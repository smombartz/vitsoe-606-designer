# Vitsoe 606 Designer

A standalone web app for designing custom Vitsoe 606 modular shelving layouts.

## How to Run

Open `index.html` in a web browser. No build step or server required.

## Architecture

- `index.html` — page structure (library sidebar + canvas)
- `style.css` — layout and styling
- `main.js` — all application logic (state, rendering, drag & drop)
- `elements/` — SVG assets auto-discovered via hardcoded manifest

## How It Works

1. **E-tracks** (vertical rails) are placed on a canvas
2. **Elements** (shelves, cabinets) are dragged from the library into bays between e-tracks
3. Elements snap to **pin hole** positions on the e-tracks (every 7cm / 70px)
4. All elements are **right-aligned** within their bay to maintain isometric perspective consistency

## Element Naming Convention

`{category}-{width}-{option}.svg` — see CLAUDE.md for full details.
