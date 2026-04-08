// ============================================================
// Vitsoe 606 Designer — main.js
// ============================================================

// --- Constants (from CLAUDE.md variables) ---
const TRACK_WIDTH      = 35;   // 3.5cm
const PIN_HOLE_SIZE    = 15;   // 1.5cm
const PIN_HOLE_SPACING = 70;   // 7cm
const PIN_HOLE_START   = 30;   // 3cm from top
const WIDE_BAY         = 912;  // 91.2cm
const NARROW_BAY       = 667;  // 66.7cm
const CABINET_HEIGHT   = 550;  // 55cm
const SNAP_THRESHOLD   = 30;   // px — snap to standard bay width within this range

// --- Element manifest ---
const ELEMENT_FILES = [
  // E-tracks
  'etrack-57.svg', 'etrack-114.svg', 'etrack-171.svg', 'etrack-200.svg',
  // Shelves — metal
  'shelf-wide-16.svg', 'shelf-narrow-16.svg',
  'shelf-wide-22.svg', 'shelf-narrow-22.svg',
  'shelf-wide-30.svg', 'shelf-narrow-30.svg',
  'shelf-wide-36.svg', 'shelf-narrow-36.svg',
  'shelf-wide-rail.svg', 'shelf-narrow-rail.svg',
  'shelf-wide-slope18.svg', 'shelf-narrow-slope18.svg',
  'shelf-wide-slope79.svg', 'shelf-narrow-slope79.svg',
  // Shelves — wooden/special
  'shelf-wide-single.svg', 'shelf-narrow-single.svg',
  'shelf-wide-double.svg', 'shelf-narrow-double.svg',
  'shelf-wide-drawer.svg', 'shelf-narrow-drawer.svg',
  // Cabinets
  'cab-wide-1d.svg', 'cab-narrow-1d.svg',
  'cab-wide-1d_lock.svg', 'cab-narrow-1d_lock.svg',
  'cab-wide-2d.svg', 'cab-narrow-2d.svg',
  'cab-wide-3d.svg', 'cab-narrow-3d.svg',
  'cab-wide-uo.svg', 'cab-narrow-uo.svg',
  'cab-wide-fdd.svg', 'cab-narrow-fdd.svg',
  // Tables
  'table-wide-80.svg', 'table-narrow-80.svg',
  'table-wide-120.svg', 'table-narrow-120.svg',
  'table-wide-160.svg', 'table-narrow-160.svg',
  // Desk
  'desk-wide-shelf.svg', 'desk-narrow-shelf.svg',
];

// SVG metadata — dimensions and right-alignment offsets
const ELEMENT_META = {
  // E-tracks
  'etrack-57.svg':            { svgWidth: 35,   svgHeight: 570,  rightOffset: 0 },
  'etrack-114.svg':           { svgWidth: 35,   svgHeight: 1140, rightOffset: 0 },
  'etrack-171.svg':           { svgWidth: 35,   svgHeight: 1710, rightOffset: 0 },
  'etrack-200.svg':           { svgWidth: 35,   svgHeight: 2000, rightOffset: 0 },
  // Shelves — original hand-tuned
  'shelf-wide-22.svg':        { svgWidth: 1063, svgHeight: 244,  rightOffset: 32 },
  'shelf-wide-36.svg':        { svgWidth: 1130, svgHeight: 280,  rightOffset: 32 },
  'shelf-narrow-22.svg':      { svgWidth: 815,  svgHeight: 258,  rightOffset: 32 },
  'shelf-narrow-36.svg':      { svgWidth: 877,  svgHeight: 280,  rightOffset: 32 },
  // Shelves — auto-scaled from Vitsoe
  'shelf-wide-16.svg':        { svgWidth: 1058, svgHeight: 257,  rightOffset: 32 },
  'shelf-narrow-16.svg':      { svgWidth: 774,  svgHeight: 188,  rightOffset: 32 },
  'shelf-wide-30.svg':        { svgWidth: 1128, svgHeight: 283,  rightOffset: 32 },
  'shelf-narrow-30.svg':      { svgWidth: 825,  svgHeight: 207,  rightOffset: 32 },
  'shelf-wide-rail.svg':      { svgWidth: 1158, svgHeight: 290,  rightOffset: 32 },
  'shelf-narrow-rail.svg':    { svgWidth: 847,  svgHeight: 212,  rightOffset: 32 },
  'shelf-wide-slope18.svg':   { svgWidth: 1160, svgHeight: 263,  rightOffset: 32 },
  'shelf-narrow-slope18.svg': { svgWidth: 848,  svgHeight: 192,  rightOffset: 32 },
  'shelf-wide-slope79.svg':   { svgWidth: 1090, svgHeight: 648,  rightOffset: 32 },
  'shelf-narrow-slope79.svg': { svgWidth: 797,  svgHeight: 474,  rightOffset: 32 },
  'shelf-wide-single.svg':    { svgWidth: 1158, svgHeight: 290,  rightOffset: 32 },
  'shelf-narrow-single.svg':  { svgWidth: 847,  svgHeight: 212,  rightOffset: 32 },
  'shelf-wide-double.svg':    { svgWidth: 1158, svgHeight: 291,  rightOffset: 32 },
  'shelf-narrow-double.svg':  { svgWidth: 847,  svgHeight: 213,  rightOffset: 32 },
  'shelf-wide-drawer.svg':    { svgWidth: 1158, svgHeight: 291,  rightOffset: 32 },
  'shelf-narrow-drawer.svg':  { svgWidth: 847,  svgHeight: 213,  rightOffset: 32 },
  // Cabinets — original hand-tuned
  'cab-wide-1d.svg':          { svgWidth: 1086, svgHeight: 644,  rightOffset: 9 },
  'cab-wide-1d_lock.svg':     { svgWidth: 1086, svgHeight: 644,  rightOffset: 9 },
  'cab-narrow-1d.svg':        { svgWidth: 850,  svgHeight: 644,  rightOffset: 1 },
  'cab-narrow-1d_lock.svg':   { svgWidth: 850,  svgHeight: 644,  rightOffset: 1 },
  // Cabinets — auto-scaled from Vitsoe
  'cab-wide-2d.svg':          { svgWidth: 1165, svgHeight: 706,  rightOffset: 9 },
  'cab-narrow-2d.svg':        { svgWidth: 852,  svgHeight: 516,  rightOffset: 1 },
  'cab-wide-3d.svg':          { svgWidth: 1165, svgHeight: 706,  rightOffset: 9 },
  'cab-narrow-3d.svg':        { svgWidth: 852,  svgHeight: 516,  rightOffset: 1 },
  'cab-wide-uo.svg':          { svgWidth: 1165, svgHeight: 706,  rightOffset: 9 },
  'cab-narrow-uo.svg':        { svgWidth: 852,  svgHeight: 516,  rightOffset: 1 },
  'cab-wide-fdd.svg':         { svgWidth: 1165, svgHeight: 706,  rightOffset: 9 },
  'cab-narrow-fdd.svg':       { svgWidth: 852,  svgHeight: 516,  rightOffset: 1 },
  // Tables — auto-scaled from Vitsoe
  'table-wide-80.svg':        { svgWidth: 1171, svgHeight: 1205, rightOffset: 12 },
  'table-narrow-80.svg':      { svgWidth: 856,  svgHeight: 881,  rightOffset: 12 },
  'table-wide-120.svg':       { svgWidth: 1340, svgHeight: 1237, rightOffset: 12 },
  'table-narrow-120.svg':     { svgWidth: 980,  svgHeight: 904,  rightOffset: 12 },
  'table-wide-160.svg':       { svgWidth: 1443, svgHeight: 1294, rightOffset: 12 },
  'table-narrow-160.svg':     { svgWidth: 1056, svgHeight: 947,  rightOffset: 12 },
  // Desk — auto-scaled from Vitsoe
  'desk-wide-shelf.svg':      { svgWidth: 1254, svgHeight: 291,  rightOffset: 32 },
  'desk-narrow-shelf.svg':    { svgWidth: 917,  svgHeight: 213,  rightOffset: 32 },
};

// --- Filename parser ---
function parseElementFilename(filename) {
  const name = filename.replace('.svg', '');
  const parts = name.split('-');
  if (parts[0] === 'etrack') {
    return { category: 'etrack', width: null, option: parts[1], filename };
  }
  const category = parts[0];
  const width = parts[1];
  const option = parts.slice(2).join('-');
  return { category, width, option, filename };
}

const ELEMENT_CATALOG = ELEMENT_FILES.map(parseElementFilename);

// Deduplicated catalog for library display — one entry per category+option
// Prefers 'wide' as display thumbnail since it's larger/clearer
const LIBRARY_CATALOG = (() => {
  const seen = new Map();
  ELEMENT_CATALOG.forEach(item => {
    if (item.category === 'etrack') {
      seen.set('etrack-' + item.option, item);
      return;
    }
    const key = item.category + '-' + item.option;
    const existing = seen.get(key);
    if (!existing || item.width === 'wide') {
      seen.set(key, item);
    }
  });
  return Array.from(seen.values());
})();

// --- Width swap helper ---
// Given a filename and target width ('wide'|'narrow'), return the matching variant
function getMatchingFilename(filename, targetWidth) {
  const parsed = parseElementFilename(filename);
  if (parsed.category === 'etrack' || parsed.width === targetWidth) return filename;
  const target = parsed.category + '-' + targetWidth + '-' + parsed.option + '.svg';
  return ELEMENT_META[target] ? target : filename; // fallback if no match
}

// ============================================================
// Application State
// ============================================================

const state = {
  tracks: [],
  elements: [],
  selectedId: null,
  zoom: 0.4,
  nextId: 1,
};

function genId() { return state.nextId++; }

// ============================================================
// DOM References
// ============================================================

const canvasWrapper = document.getElementById('canvas-wrapper');
const canvas = document.getElementById('canvas');
const libraryItems = document.getElementById('library-items');
const contextMenuEl = document.getElementById('context-menu');
const dragGhostEl = document.getElementById('drag-ghost');
const clearBtn = document.getElementById('clear-btn');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomFitBtn = document.getElementById('zoom-fit');
const zoomLevelEl = document.getElementById('zoom-level');

// ============================================================
// Zoom System
// ============================================================

let panX = 0, panY = 0;

function setZoom(z) {
  state.zoom = Math.max(0.1, Math.min(1.5, z));
  updateCanvasTransform();
  zoomLevelEl.textContent = Math.round(state.zoom * 100) + '%';
}

function updateCanvasTransform() {
  canvas.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + state.zoom + ')';
}

// --- Canvas panning (middle-click or Space+left-click) ---
let isPanning = false;
let panStartX = 0, panStartY = 0;
let panStartPanX = 0, panStartPanY = 0;
let spaceHeld = false;

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.repeat && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    spaceHeld = true;
    canvasWrapper.style.cursor = 'grab';
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    spaceHeld = false;
    if (!isPanning) canvasWrapper.style.cursor = '';
  }
});

canvasWrapper.addEventListener('mousedown', (e) => {
  // Middle-click or Space+left-click
  if (e.button === 1 || (spaceHeld && e.button === 0)) {
    e.preventDefault();
    isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panStartPanX = panX;
    panStartPanY = panY;
    canvasWrapper.style.cursor = 'grabbing';
  }
});

document.addEventListener('mousemove', (e) => {
  if (!isPanning) return;
  panX = panStartPanX + (e.clientX - panStartX);
  panY = panStartPanY + (e.clientY - panStartY);
  updateCanvasTransform();
});

document.addEventListener('mouseup', (e) => {
  if (isPanning) {
    const didMove = Math.abs(e.clientX - panStartX) > 3 || Math.abs(e.clientY - panStartY) > 3;
    isPanning = false;
    canvasWrapper.style.cursor = spaceHeld ? 'grab' : '';
    // If it was just a click (no drag), deselect
    if (!didMove && !spaceHeld) {
      state.selectedId = null;
      render();
    }
  }
});

clearBtn.addEventListener('click', () => {
  state.elements = [];
  state.selectedId = null;
  render();
});

zoomInBtn.addEventListener('click', () => setZoom(state.zoom + 0.1));
zoomOutBtn.addEventListener('click', () => setZoom(state.zoom - 0.1));
function zoomToFit() {
  if (state.tracks.length === 0) return;

  const firstTrack = state.tracks[0];
  const lastTrack = state.tracks[state.tracks.length - 1];

  // Find full content bounds including elements that extend past tracks
  let minX = firstTrack.x;
  let maxX = lastTrack.x + TRACK_WIDTH;
  let maxH = 0;
  state.tracks.forEach(t => {
    const m = ELEMENT_META[t.filename];
    if (m && m.svgHeight > maxH) maxH = m.svgHeight;
  });
  state.elements.forEach(el => {
    const meta = ELEMENT_META[el.filename];
    if (!meta) return;
    const rt = state.tracks[el.bayIndex + 1];
    if (!rt) return;
    const left = rt.x - meta.svgWidth + meta.rightOffset;
    const right = left + meta.svgWidth;
    if (left < minX) minX = left;
    if (right > maxX) maxX = right;
  });

  const contentW = maxX - minX;
  const contentH = maxH;

  // Account for canvas-wrapper CSS padding (124px left, 24px right/top/bottom)
  const style = getComputedStyle(canvasWrapper);
  const padL = parseFloat(style.paddingLeft) || 0;
  const padR = parseFloat(style.paddingRight) || 0;
  const padT = parseFloat(style.paddingTop) || 0;
  const padB = parseFloat(style.paddingBottom) || 0;
  const viewW = canvasWrapper.clientWidth - padL - padR;
  const viewH = canvasWrapper.clientHeight - padT - padB;

  const zoom = Math.min(viewW / contentW, viewH / contentH, 1) * 0.92;
  state.zoom = Math.max(0.1, Math.min(1.5, zoom));

  // Center the content in the usable viewport area
  const scaledW = contentW * state.zoom;
  const scaledH = contentH * state.zoom;
  panX = (viewW - scaledW) / 2 - minX * state.zoom - 90;
  panY = (viewH - scaledH) / 2;

  updateCanvasTransform();
  zoomLevelEl.textContent = Math.round(state.zoom * 100) + '%';
}

zoomFitBtn.addEventListener('click', zoomToFit);

// Ctrl/Cmd + scroll to zoom
canvasWrapper.addEventListener('wheel', (e) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom(state.zoom + delta);
  }
}, { passive: false });

// Convert mouse event to canvas coordinates (accounting for scroll + zoom)
function canvasCoords(e) {
  const rect = canvasWrapper.getBoundingClientRect();
  const x = (e.clientX - rect.left - panX) / state.zoom;
  const y = (e.clientY - rect.top - panY) / state.zoom;
  return { x, y };
}

// ============================================================
// Rendering
// ============================================================

function render() {
  canvas.innerHTML = '';

  // Render tracks
  state.tracks.forEach(renderTrack);

  // Sort for isometric z-order: elements rendered later appear in front.
  // 1. Left bays render first (behind), right bays render last (in front)
  // 2. Within same bay, bottom rows render first (behind), top rows last (in front)
  const sorted = [...state.elements].sort((a, b) => {
    if (a.bayIndex !== b.bayIndex) return a.bayIndex - b.bayIndex;
    return b.pinRow - a.pinRow;
  });
  sorted.forEach((el, i) => renderElement(el, i));

  // Render bay width labels between each pair of tracks
  renderBayLabels();

  // Render total dimensions above the unit
  renderTotalDimensions();

  // Update cost calculator
  updateCostPanel();
}

function renderTrack(track) {
  const meta = ELEMENT_META[track.filename];
  const div = document.createElement('div');
  div.className = 'track';
  div.style.left = track.x + 'px';
  div.style.top = '0px';
  div.style.width = meta.svgWidth + 'px';
  div.style.height = meta.svgHeight + 'px';
  div.dataset.trackId = track.id;

  const img = document.createElement('img');
  img.src = 'elements/' + track.filename;
  div.appendChild(img);
  canvas.appendChild(div);
}

function renderElement(el, stackIndex) {
  const meta = ELEMENT_META[el.filename];
  if (!meta) return;

  const rightTrack = state.tracks[el.bayIndex + 1];
  if (!rightTrack) return;

  const left = rightTrack.x - meta.svgWidth + meta.rightOffset;
  const top = PIN_HOLE_START + (el.pinRow * PIN_HOLE_SPACING);

  const div = document.createElement('div');
  div.className = 'element';
  if (state.selectedId === el.id) div.classList.add('selected');
  div.style.left = left + 'px';
  div.style.top = top + 'px';
  div.style.width = meta.svgWidth + 'px';
  div.style.height = meta.svgHeight + 'px';
  // stackIndex 0 = highest pinRow (bottom of rail, back), last = lowest pinRow (top, front)
  div.style.zIndex = 2 + stackIndex;
  div.dataset.elementId = el.id;

  // Inline SVG with currentColor strokes for hover coloring
  if (svgCache[el.filename]) {
    // Replace all stroke colors with currentColor
    let svgText = svgCache[el.filename];
    svgText = svgText.replace(/stroke="(black|#000|#000000)"/gi, 'stroke="currentColor"');
    svgText = svgText.replace(/stroke:#000[^;]*/gi, 'stroke:currentColor');
    div.innerHTML = svgText;
    const svg = div.querySelector('svg');
    if (svg) {
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.style.pointerEvents = 'none';
    }
  } else {
    const img = document.createElement('img');
    img.src = 'elements/' + el.filename;
    div.appendChild(img);
  }
  // Measurement label (shown on hover, counter-scaled against zoom)
  const dims = getDimensions(el.filename);
  if (dims) {
    const measureLabel = document.createElement('div');
    measureLabel.className = 'element-dimensions';
    measureLabel.textContent = 'L: ' + dims.L + ' cm   D: ' + dims.D + ' cm   H: ' + dims.H + ' cm';
    const invScale = 1 / state.zoom;
    measureLabel.style.transform = 'translateX(-50%) scale(' + invScale + ')';
    div.appendChild(measureLabel);
  }

  canvas.appendChild(div);
}

function renderBayLabels() {
  if (state.tracks.length < 2) return;
  const invScale = 1 / state.zoom;

  for (let i = 0; i < state.tracks.length - 1; i++) {
    const leftTrack = state.tracks[i];
    const rightTrack = state.tracks[i + 1];
    const leftMeta = ELEMENT_META[leftTrack.filename];
    const rightMeta = ELEMENT_META[rightTrack.filename];

    const bayLeft = leftTrack.x + TRACK_WIDTH;
    const bayRight = rightTrack.x;
    const distancePx = bayRight - bayLeft;
    const distanceCm = (distancePx / 10).toFixed(1);

    const label = document.createElement('div');
    label.className = 'bay-label';
    label.textContent = distanceCm + ' cm';
    label.style.left = (bayLeft + distancePx / 2) + 'px';
    // Position below the shorter track
    const trackHeight = Math.min(leftMeta.svgHeight, rightMeta.svgHeight);
    label.style.top = (trackHeight + 20) + 'px';
    label.style.transform = 'translateX(-50%) scale(' + invScale + ')';
    canvas.appendChild(label);
  }
}

function renderTotalDimensions() {
  if (state.tracks.length < 2) return;
  const invScale = 1 / state.zoom;

  const firstTrack = state.tracks[0];
  const lastTrack = state.tracks[state.tracks.length - 1];
  const totalWidthPx = lastTrack.x + TRACK_WIDTH - firstTrack.x;
  const totalWidthCm = (totalWidthPx / 10).toFixed(1);

  // Height from tallest track
  let maxHeight = 0;
  state.tracks.forEach(t => {
    const meta = ELEMENT_META[t.filename];
    if (meta.svgHeight > maxHeight) maxHeight = meta.svgHeight;
  });
  const totalHeightCm = (maxHeight / 10).toFixed(0);

  const label = document.createElement('div');
  label.className = 'total-dimensions';
  label.textContent = totalWidthCm + ' cm wide  ×  ' + totalHeightCm + ' cm tall';
  label.style.left = firstTrack.x + 'px';
  label.style.top = '-40px';
  label.style.transform = 'scale(' + invScale + ')';
  label.style.transformOrigin = 'bottom left';
  canvas.appendChild(label);
}

// ============================================================
// Bay & Pin Row Helpers
// ============================================================

function detectBay(x) {
  for (let i = 0; i < state.tracks.length - 1; i++) {
    const leftEdge = state.tracks[i].x + TRACK_WIDTH;
    const rightEdge = state.tracks[i + 1].x;
    if (x >= leftEdge && x <= rightEdge) return i;
  }
  return null;
}

function nearestPinRow(y, trackFilename) {
  const meta = ELEMENT_META[trackFilename];
  const trackHeight = meta ? meta.svgHeight : 2000;
  const maxPinRow = Math.floor((trackHeight - PIN_HOLE_START) / PIN_HOLE_SPACING);
  const row = Math.round((y - PIN_HOLE_START) / PIN_HOLE_SPACING);
  return Math.max(0, Math.min(row, maxPinRow));
}

function getBayWidth(bayIndex) {
  if (bayIndex < 0 || bayIndex >= state.tracks.length - 1) return null;
  const distance = state.tracks[bayIndex + 1].x - state.tracks[bayIndex].x - TRACK_WIDTH;
  const diffWide = Math.abs(distance - WIDE_BAY);
  const diffNarrow = Math.abs(distance - NARROW_BAY);
  return diffWide < diffNarrow ? 'wide' : 'narrow';
}

// ============================================================
// Drop Indicators (rendered into canvas during drag)
// ============================================================

let indicators = [];

function clearIndicators() {
  indicators.forEach(el => el.remove());
  indicators = [];
}

function showBayHighlight(bayIndex) {
  const lt = state.tracks[bayIndex];
  const rt = state.tracks[bayIndex + 1];
  if (!lt || !rt) return;
  const h = (ELEMENT_META[lt.filename] || {}).svgHeight || 2000;

  const div = document.createElement('div');
  div.className = 'bay-highlight';
  div.style.left = (lt.x + TRACK_WIDTH) + 'px';
  div.style.top = '0px';
  div.style.width = (rt.x - lt.x - TRACK_WIDTH) + 'px';
  div.style.height = h + 'px';
  canvas.appendChild(div);
  indicators.push(div);
}

function showPinGuide(bayIndex, y) {
  const lt = state.tracks[bayIndex];
  const rt = state.tracks[bayIndex + 1];
  if (!lt || !rt) return;

  const pinRow = nearestPinRow(y, lt.filename);
  const pinY = PIN_HOLE_START + (pinRow * PIN_HOLE_SPACING);

  const div = document.createElement('div');
  div.className = 'pin-guide';
  div.style.left = (lt.x + TRACK_WIDTH) + 'px';
  div.style.top = pinY + 'px';
  div.style.width = (rt.x - lt.x - TRACK_WIDTH) + 'px';
  canvas.appendChild(div);
  indicators.push(div);
}

function showSnapGuide(x, height) {
  const div = document.createElement('div');
  div.className = 'snap-guide';
  div.style.left = x + 'px';
  div.style.height = height + 'px';
  canvas.appendChild(div);
  indicators.push(div);
}

// ============================================================
// Ghost Element (follows cursor during drag)
// ============================================================

let ghostW = 0, ghostH = 0;

function showGhost(imgSrc, width, height) {
  dragGhostEl.innerHTML = '';
  ghostW = width * state.zoom;
  ghostH = height * state.zoom;
  const img = document.createElement('img');
  img.src = imgSrc;
  img.style.width = ghostW + 'px';
  img.style.height = ghostH + 'px';
  dragGhostEl.appendChild(img);
  dragGhostEl.classList.remove('hidden');
}

function moveGhost(e) {
  dragGhostEl.style.left = (e.clientX - ghostW / 2) + 'px';
  dragGhostEl.style.top = (e.clientY - ghostH / 2) + 'px';
}

function hideGhost() {
  dragGhostEl.classList.add('hidden');
  dragGhostEl.innerHTML = '';
}

// ============================================================
// Drag System (mouse-based)
// ============================================================

let drag = null;
// drag = { type: 'library'|'element'|'track', ... }

// --- Library Drag ---
function startLibraryDrag(e, catalogItem) {
  e.preventDefault();
  const meta = ELEMENT_META[catalogItem.filename];
  drag = {
    type: 'library',
    item: catalogItem,
  };
  showGhost('elements/' + catalogItem.filename, meta.svgWidth, meta.svgHeight);
  moveGhost(e);
}

// --- Element Drag ---
function startElementDrag(e, elementId) {
  e.preventDefault();
  const el = state.elements.find(x => x.id === elementId);
  if (!el) return;

  state.selectedId = elementId;

  // Compute offset between mouse Y and the element's pin row Y
  const coords = canvasCoords(e);
  const pinY = PIN_HOLE_START + (el.pinRow * PIN_HOLE_SPACING);

  drag = {
    type: 'element',
    elementId,
    origBayIndex: el.bayIndex,
    origPinRow: el.pinRow,
    origFilename: el.filename,
    offsetY: coords.y - pinY,
  };

  render();
}

// --- Track Drag ---
function startTrackDrag(e, trackId) {
  e.preventDefault();
  const track = state.tracks.find(t => t.id === trackId);
  if (!track) return;

  const coords = canvasCoords(e);
  drag = {
    type: 'track',
    trackId,
    offsetX: coords.x - track.x,
  };

  const domEl = canvas.querySelector('[data-track-id="' + trackId + '"]');
  if (domEl) domEl.classList.add('dragging');
}

// --- Global Mouse Move ---
document.addEventListener('mousemove', (e) => {
  if (!drag) return;

  if (drag.type === 'library') {
    moveGhost(e);
    clearIndicators();
    const coords = canvasCoords(e);
    const item = drag.item;
    const isEtrack = item && item.category === 'etrack';

    if (isEtrack) {
      const snapX = snapTrackPosition(coords.x);
      const meta = ELEMENT_META[item.filename];
      showSnapGuide(snapX, meta ? meta.svgHeight : 2000);
    } else {
      const bay = detectBay(coords.x);
      if (bay !== null) {
        showBayHighlight(bay);
        showPinGuide(bay, coords.y);
      }
    }
  }

  if (drag.type === 'element') {
    const coords = canvasCoords(e);
    const el = state.elements.find(x => x.id === drag.elementId);
    if (!el) return;

    const bayIndex = detectBay(coords.x);
    if (bayIndex !== null) {
      const pinRow = nearestPinRow(coords.y - drag.offsetY, state.tracks[bayIndex].filename);
      const bayWidth = getBayWidth(bayIndex);
      el.bayIndex = bayIndex;
      el.pinRow = pinRow;
      el.filename = getMatchingFilename(el.filename, bayWidth);
      render();
    }
  }

  if (drag.type === 'track') {
    const coords = canvasCoords(e);
    const track = state.tracks.find(t => t.id === drag.trackId);
    if (!track) return;

    const rawX = coords.x - drag.offsetX;
    const validPositions = getValidTrackPositions(drag.trackId);

    clearIndicators();

    if (validPositions.length > 0) {
      // Snap to the closest valid position
      let bestPos = validPositions[0];
      let bestDist = Math.abs(rawX - bestPos);
      validPositions.forEach(pos => {
        const dist = Math.abs(rawX - pos);
        if (dist < bestDist) {
          bestDist = dist;
          bestPos = pos;
        }
      });
      track.x = bestPos;

      // Show snap guides for all valid positions
      const meta = ELEMENT_META[track.filename];
      const trackH = meta ? meta.svgHeight : 2000;
      validPositions.forEach(pos => {
        if (pos !== bestPos) showSnapGuide(pos, trackH);
      });
    }

    render();
  }
});

// --- Global Mouse Up ---
document.addEventListener('mouseup', (e) => {
  if (!drag) return;

  if (drag.type === 'library') {
    hideGhost();
    clearIndicators();

    // Check if drop is over the canvas
    const rect = canvasWrapper.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom) {

      const coords = canvasCoords(e);
      const item = drag.item;

      if (item.category === 'etrack') {
        const newX = snapTrackPosition(coords.x);
        state.tracks.push({
          id: genId(),
          x: newX,
          filename: item.filename,
          lengthCm: parseInt(item.option),
        });
        state.tracks.sort((a, b) => a.x - b.x);
        reindexElements();
        autoSwapAllBays();
        render();
      } else {
        const bayIndex = detectBay(coords.x);
        if (bayIndex !== null) {
          const pinRow = nearestPinRow(coords.y, state.tracks[bayIndex].filename);
          const bayWidth = getBayWidth(bayIndex);
          const filename = getMatchingFilename(item.filename, bayWidth);
          state.elements.push({
            id: genId(),
            filename,
            bayIndex,
            pinRow,
          });
          render();
        }
      }
    }
    drag = null;
    return;
  }

  if (drag.type === 'element') {
    // Position already updated in real-time during mousemove — just finalize
    state.selectedId = null;
    // Remove .selected without full re-render to avoid flicker (hover CSS takes over)
    const domEl = canvas.querySelector('.element.selected');
    if (domEl) domEl.classList.remove('selected');
    drag = null;
    return;
  }

  if (drag.type === 'track') {
    clearIndicators();
    // Auto-swap elements in affected bays
    autoSwapAllBays();
    render();
    drag = null;
    return;
  }
});

// ============================================================
// E-track Snap Positioning
// ============================================================

// Given a raw x position, find the best valid position for a new track.
// First track: free placement (snapped to 10px grid).
// Subsequent tracks: snap to nearest existing track at WIDE_BAY or NARROW_BAY distance.
function snapTrackPosition(rawX) {
  if (state.tracks.length === 0) {
    return Math.round(rawX / 10) * 10;
  }

  let bestX = Math.round(rawX / 10) * 10;
  let bestDist = Infinity;

  state.tracks.forEach(t => {
    const candidates = [
      t.x + TRACK_WIDTH + WIDE_BAY,
      t.x + TRACK_WIDTH + NARROW_BAY,
      t.x - TRACK_WIDTH - WIDE_BAY,
      t.x - TRACK_WIDTH - NARROW_BAY,
    ];

    candidates.forEach(cx => {
      if (cx < 0) return;
      // Check it doesn't overlap an existing track
      const overlaps = state.tracks.some(other =>
        cx < other.x + TRACK_WIDTH && cx + TRACK_WIDTH > other.x
      );
      if (overlaps) return;

      const dist = Math.abs(cx - rawX);
      if (dist < bestDist) {
        bestDist = dist;
        bestX = cx;
      }
    });
  });

  return bestX;
}

// Compute all valid positions for an existing track being dragged.
// Must create standard bay widths with both neighbors.
function getValidTrackPositions(trackId) {
  const track = state.tracks.find(t => t.id === trackId);
  if (!track) return [];

  const trackIdx = state.tracks.indexOf(track);
  const leftNeighbor = trackIdx > 0 ? state.tracks[trackIdx - 1] : null;
  const rightNeighbor = trackIdx < state.tracks.length - 1 ? state.tracks[trackIdx + 1] : null;

  // Edge track with only left neighbor
  if (leftNeighbor && !rightNeighbor) {
    return [
      leftNeighbor.x + TRACK_WIDTH + NARROW_BAY,
      leftNeighbor.x + TRACK_WIDTH + WIDE_BAY,
    ];
  }

  // Edge track with only right neighbor
  if (!leftNeighbor && rightNeighbor) {
    return [
      rightNeighbor.x - TRACK_WIDTH - WIDE_BAY,
      rightNeighbor.x - TRACK_WIDTH - NARROW_BAY,
    ];
  }

  // Middle track — both neighbors constrain
  if (leftNeighbor && rightNeighbor) {
    const positions = [];
    [NARROW_BAY, WIDE_BAY].forEach(leftGap => {
      [NARROW_BAY, WIDE_BAY].forEach(rightGap => {
        const posFromLeft = leftNeighbor.x + TRACK_WIDTH + leftGap;
        const posFromRight = rightNeighbor.x - TRACK_WIDTH - rightGap;
        // Both constraints must agree on the same position
        if (Math.abs(posFromLeft - posFromRight) < 1) {
          positions.push(Math.round(posFromLeft));
        }
      });
    });
    // If no exact matches (neighbors too close/far), offer positions from left
    if (positions.length === 0) {
      [NARROW_BAY, WIDE_BAY].forEach(gap => {
        const pos = leftNeighbor.x + TRACK_WIDTH + gap;
        if (pos + TRACK_WIDTH < rightNeighbor.x) {
          positions.push(pos);
        }
      });
    }
    return positions;
  }

  return [];
}

// ============================================================
// Auto-swap element widths to match bay widths
// ============================================================

function autoSwapAllBays() {
  state.elements.forEach(el => {
    const bayWidth = getBayWidth(el.bayIndex);
    if (bayWidth) {
      el.filename = getMatchingFilename(el.filename, bayWidth);
    }
  });
}

// Re-index element bayIndex values after tracks are reordered
function reindexElements() {
  // For now, remove elements whose bayIndex is no longer valid
  // (tracks added/removed could invalidate bay indices)
  state.elements = state.elements.filter(el =>
    el.bayIndex >= 0 && el.bayIndex < state.tracks.length - 1
  );
}

// ============================================================
// Mouse Down — Dispatch to drag or selection
// ============================================================

canvas.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;

  dismissContextMenu();

  // Space held → panning handled by canvasWrapper listener
  if (spaceHeld) return;

  // Check if clicking on an element
  const elDiv = e.target.closest('.element');
  if (elDiv) {
    const id = parseInt(elDiv.dataset.elementId);
    startElementDrag(e, id);
    return;
  }

  // Check if clicking on a track
  const trackDiv = e.target.closest('.track');
  if (trackDiv) {
    const id = parseInt(trackDiv.dataset.trackId);
    startTrackDrag(e, id);
    return;
  }

  // Empty canvas → start pan (deselect on mouseup if no movement)
  isPanning = true;
  panStartX = e.clientX;
  panStartY = e.clientY;
  panStartPanX = panX;
  panStartPanY = panY;
  canvasWrapper.style.cursor = 'grabbing';
  e.preventDefault();
});

// Library mousedown
libraryItems.addEventListener('mousedown', (e) => {
  const itemDiv = e.target.closest('.library-item');
  if (!itemDiv || e.button !== 0) return;

  const filename = itemDiv.dataset.filename;
  const catalogItem = LIBRARY_CATALOG.find(c => c.filename === filename);
  if (catalogItem) {
    startLibraryDrag(e, catalogItem);
  }
});

// ============================================================
// Selection & Keyboard Shortcuts
// ============================================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (state.selectedId !== null) {
      // Don't delete if focused on an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      state.elements = state.elements.filter(el => el.id !== state.selectedId);
      state.selectedId = null;
      render();
    }
  }

  if (e.key === 'Escape') {
    dismissContextMenu();
    if (drag) {
      hideGhost();
      clearIndicators();
      // Restore original position for element drags
      if (drag.type === 'element') {
        const el = state.elements.find(x => x.id === drag.elementId);
        if (el) {
          el.bayIndex = drag.origBayIndex;
          el.pinRow = drag.origPinRow;
          el.filename = drag.origFilename;
        }
      }
      drag = null;
      render();
    }
    state.selectedId = null;
    render();
  }
});

// ============================================================
// Context Menu
// ============================================================

canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();

  // Right-click on element
  const elDiv = e.target.closest('.element');
  if (elDiv) {
    const id = parseInt(elDiv.dataset.elementId);
    const el = state.elements.find(x => x.id === id);
    if (!el) return;

    state.selectedId = id;
    render();
    showContextMenu(e.clientX, e.clientY, el);
    return;
  }

  // Right-click on track
  const trackDiv = e.target.closest('.track');
  if (trackDiv) {
    const id = parseInt(trackDiv.dataset.trackId);
    showTrackContextMenu(e.clientX, e.clientY, id);
    return;
  }

  dismissContextMenu();
});

function showContextMenu(x, y, el) {
  const parsed = parseElementFilename(el.filename);
  contextMenuEl.innerHTML = '';

  // Remove
  const removeItem = document.createElement('div');
  removeItem.className = 'menu-item';
  removeItem.textContent = 'Remove';
  removeItem.addEventListener('click', () => {
    state.elements = state.elements.filter(x => x.id !== el.id);
    state.selectedId = null;
    render();
    dismissContextMenu();
  });
  contextMenuEl.appendChild(removeItem);

  // Separator
  const sep = document.createElement('div');
  sep.className = 'menu-separator';
  contextMenuEl.appendChild(sep);

  // Replace — show same-category elements (deduplicated by option)
  const label = document.createElement('div');
  label.className = 'menu-label';
  label.textContent = 'Replace with';
  contextMenuEl.appendChild(label);

  const bayWidth = getBayWidth(el.bayIndex);
  const currentOption = parsed.option;
  const sameCategoryLib = LIBRARY_CATALOG.filter(c =>
    c.category === parsed.category && c.option !== currentOption
  );

  sameCategoryLib.forEach(c => {
    const matchedFilename = getMatchingFilename(c.filename, bayWidth);
    const replaceItem = document.createElement('div');
    replaceItem.className = 'menu-item';
    replaceItem.textContent = formatLabel(parseElementFilename(matchedFilename));
    replaceItem.addEventListener('click', () => {
      el.filename = matchedFilename;
      render();
      dismissContextMenu();
    });
    contextMenuEl.appendChild(replaceItem);
  });

  // Position the menu
  contextMenuEl.style.left = x + 'px';
  contextMenuEl.style.top = y + 'px';
  contextMenuEl.classList.remove('hidden');

  // Adjust if off-screen
  requestAnimationFrame(() => {
    const rect = contextMenuEl.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      contextMenuEl.style.left = (x - rect.width) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
      contextMenuEl.style.top = (y - rect.height) + 'px';
    }
  });
}

function showTrackContextMenu(x, y, trackId) {
  contextMenuEl.innerHTML = '';

  const removeItem = document.createElement('div');
  removeItem.className = 'menu-item';
  removeItem.textContent = 'Remove E-Track';
  removeItem.addEventListener('click', () => {
    const trackIdx = state.tracks.findIndex(t => t.id === trackId);
    if (trackIdx === -1) return;

    // Remove elements in bays that touch this track
    state.elements = state.elements.filter(el => {
      const leftBay = trackIdx - 1;
      const rightBay = trackIdx;
      return el.bayIndex !== leftBay && el.bayIndex !== rightBay;
    });

    state.tracks.splice(trackIdx, 1);
    reindexElements();
    state.selectedId = null;
    render();
    dismissContextMenu();
    updateCostPanel();
  });
  contextMenuEl.appendChild(removeItem);

  // Position
  contextMenuEl.style.left = x + 'px';
  contextMenuEl.style.top = y + 'px';
  contextMenuEl.classList.remove('hidden');

  requestAnimationFrame(() => {
    const rect = contextMenuEl.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      contextMenuEl.style.left = (x - rect.width) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
      contextMenuEl.style.top = (y - rect.height) + 'px';
    }
  });
}

function dismissContextMenu() {
  contextMenuEl.classList.add('hidden');
  contextMenuEl.innerHTML = '';
}

// Dismiss context menu on click outside
document.addEventListener('mousedown', (e) => {
  if (!contextMenuEl.contains(e.target)) {
    dismissContextMenu();
  }
});

// ============================================================
// Library Panel
// ============================================================

function populateLibrary() {
  const groups = {};
  LIBRARY_CATALOG.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  const categoryOrder = ['etrack', 'shelf', 'cab', 'table_desk'];
  const categoryLabels = { etrack: 'E-Tracks', shelf: 'Shelves', cab: 'Cabinets', table_desk: 'Tables & Desks' };

  // Merge table and desk into one group
  groups['table_desk'] = [...(groups['table'] || []), ...(groups['desk'] || [])];
  delete groups['table'];
  delete groups['desk'];

  categoryOrder.forEach(cat => {
    const items = groups[cat];
    if (!items) return;

    const section = document.createElement('div');
    section.className = 'library-category';

    const heading = document.createElement('h3');
    heading.className = 'collapsible-header';
    heading.innerHTML = '<span class="collapse-arrow">→</span> ' + (categoryLabels[cat] || cat);
    section.appendChild(heading);

    const content = document.createElement('div');
    content.className = 'collapsible-content collapsed';

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'library-item';
      div.dataset.filename = item.filename;

      const img = document.createElement('img');
      img.src = 'elements/' + item.filename;
      div.appendChild(img);

      const label = document.createElement('span');
      label.className = 'label';
      label.textContent = formatLabel(item);
      div.appendChild(label);

      const price = document.createElement('span');
      price.className = 'library-price';
      price.textContent = '$' + getPrice(item.filename).toLocaleString();
      div.appendChild(price);

      content.appendChild(div);
    });

    section.appendChild(content);

    // Toggle collapse on heading click
    heading.addEventListener('click', () => {
      const isCollapsed = content.classList.toggle('collapsed');
      heading.querySelector('.collapse-arrow').textContent = isCollapsed ? '→' : '↓';
    });

    libraryItems.appendChild(section);
  });
}

function formatLabel(item) {
  if (item.category === 'etrack') return item.option + 'cm';
  const categoryLabelsShort = { shelf: 'Shelf', cab: 'Cabinet', table: 'Table', desk: 'Desk' };
  const catLabel = categoryLabelsShort[item.category] || item.category;
  const optionLabel = item.option.replace(/_/g, ' ');
  return catLabel + ': ' + optionLabel;
}

// ============================================================
// Cost Calculator
// ============================================================

// Prices inlined to avoid fetch() issues with file:// protocol
const priceData = {
  currency: 'USD',
  components: {
    etrack: {
      '57':  { price: 75,  label: 'E-Track 57cm' },
      '114': { price: 100, label: 'E-Track 114cm' },
      '171': { price: 115, label: 'E-Track 171cm' },
      '200': { price: 125, label: 'E-Track 200cm' },
    },
    shelf: {
      '16':      { narrow: 135, wide: 160, label: 'Shelf 16cm' },
      '22':      { narrow: 145, wide: 170, label: 'Shelf 22cm' },
      '30':      { narrow: 155, wide: 180, label: 'Shelf 30cm' },
      '36':      { narrow: 165, wide: 190, label: 'Shelf 36cm' },
      'rail':    { narrow: 290, wide: 335, label: 'Shelf w/ Hanging Rail' },
      'slope18': { narrow: 205, wide: 225, label: '18° Sloping Shelf' },
      'slope79': { narrow: 230, wide: 255, label: '79° Sloping Shelf' },
      'single':  { narrow: 355, wide: 405, label: 'Single Shelf' },
      'double':  { narrow: 475, wide: 555, label: 'Double Shelf' },
      'drawer':  { narrow: 595, wide: 695, label: 'Shelf w/ Drawer' },
    },
    cab: {
      '1d':      { narrow: 1175, wide: 1390, label: 'One Drawer Cabinet' },
      '1d_lock': { narrow: 1215, wide: 1435, label: 'One Drawer w/ Lock' },
      '2d':      { narrow: 1350, wide: 1575, label: 'Two Drawer Cabinet' },
      '3d':      { narrow: 1545, wide: 1765, label: 'Three Drawer Cabinet' },
      'uo':      { narrow: 1350, wide: 1575, label: 'Up and Over Door' },
      'fdd':     { narrow: 1445, wide: 1665, label: 'Fold-Down Door w/ Lock' },
    },
    table: {
      '80':  { narrow: 920,  wide: 1015, label: 'Table 80cm' },
      '120': { narrow: 985,  wide: 1095, label: 'Table 120cm' },
      '160': { narrow: 1375, wide: 1495, label: 'Table 160cm' },
    },
    desk: {
      'shelf': { narrow: 715, wide: 775, label: 'Desk Shelf' },
    },
  },
};

// Element dimensions in cm: L (length), D (depth), H (height)
// Length depends on bay width (wide=91.2, narrow=66.7)
const elementDimensions = {
  shelf: {
    '16':      { D: 16, H: 2 },
    '22':      { D: 22, H: 2 },
    '30':      { D: 30, H: 2 },
    '36':      { D: 36, H: 2 },
    'rail':    { D: 30, H: 17 },
    'slope18': { D: 30, H: 2 },
    'slope79': { D: 22, H: 2 },
    'single':  { D: 30, H: 17 },
    'double':  { D: 30, H: 17 },
    'drawer':  { D: 30, H: 17 },
  },
  cab: {
    '1d':      { D: 36, H: 55 },
    '1d_lock': { D: 36, H: 55 },
    '2d':      { D: 43, H: 55 },
    '3d':      { D: 43, H: 55 },
    'uo':      { D: 43, H: 55 },
    'fdd':     { D: 43, H: 55 },
  },
  table: {
    '80':  { D: 80,  H: 2 },
    '120': { D: 120, H: 2 },
    '160': { D: 160, H: 2 },
  },
  desk: {
    'shelf': { D: 30, H: 17 },
  },
};

function getDimensions(filename) {
  const parsed = parseElementFilename(filename);
  if (parsed.category === 'etrack') return null;
  const catDims = elementDimensions[parsed.category];
  if (!catDims) return null;
  const dims = catDims[parsed.option];
  if (!dims) return null;
  const L = parsed.width === 'wide' ? 91.2 : 66.7;
  return { L, D: dims.D, H: dims.H };
}

function getPrice(filename) {
  if (!priceData) return 0;
  const parsed = parseElementFilename(filename);
  const catPrices = priceData.components[parsed.category];
  if (!catPrices) return 0;
  const optPrices = catPrices[parsed.option];
  if (!optPrices) return 0;

  // E-tracks have a flat price; elements have narrow/wide prices
  if (optPrices.price !== undefined) return optPrices.price;
  return optPrices[parsed.width] || 0;
}

function getPriceLabel(filename) {
  if (!priceData) return filename;
  const parsed = parseElementFilename(filename);
  const catPrices = priceData.components[parsed.category];
  if (!catPrices) return formatLabel(parsed);
  const optPrices = catPrices[parsed.option];
  if (!optPrices) return formatLabel(parsed);
  return optPrices.label || formatLabel(parsed);
}

const costItemsEl = document.getElementById('cost-items');
const costTotalEl = document.getElementById('cost-total-amount');

function updateCostPanel() {
  if (!costItemsEl) return;

  // Count items by filename
  const counts = {};
  state.tracks.forEach(t => {
    counts[t.filename] = (counts[t.filename] || 0) + 1;
  });
  state.elements.forEach(el => {
    counts[el.filename] = (counts[el.filename] || 0) + 1;
  });

  costItemsEl.innerHTML = '';

  if (Object.keys(counts).length === 0) {
    costItemsEl.innerHTML = '<div class="cost-empty">Add elements to see costs</div>';
    costTotalEl.textContent = '$0';
    return;
  }

  let total = 0;
  // Sort: etracks first, then by label
  const entries = Object.entries(counts).sort((a, b) => {
    const pa = parseElementFilename(a[0]);
    const pb = parseElementFilename(b[0]);
    if (pa.category === 'etrack' && pb.category !== 'etrack') return -1;
    if (pa.category !== 'etrack' && pb.category === 'etrack') return 1;
    return getPriceLabel(a[0]).localeCompare(getPriceLabel(b[0]));
  });

  entries.forEach(([filename, count]) => {
    const unitPrice = getPrice(filename);
    const lineTotal = unitPrice * count;
    total += lineTotal;

    const div = document.createElement('div');
    div.className = 'cost-line';
    div.innerHTML =
      '<span class="cost-label">' + count + '× ' + getPriceLabel(filename) + '</span>' +
      '<span class="cost-unit">$' + unitPrice.toLocaleString() + '</span>' +
      '<span class="cost-price">$' + lineTotal.toLocaleString() + '</span>';
    costItemsEl.appendChild(div);
  });

  costTotalEl.textContent = '$' + total.toLocaleString();
}

// ============================================================
// Default State
// ============================================================

function initDefaultState() {
  const startX = 200;
  const defaultTrack = 'etrack-200.svg';
  const bayStep = TRACK_WIDTH + WIDE_BAY; // 947px per bay

  // 4 e-tracks forming 3 wide bays
  for (let i = 0; i < 4; i++) {
    state.tracks.push({
      id: genId(), x: startX + bayStep * i, filename: defaultTrack, lengthCm: 200,
    });
  }

  // Bay 0 (left): 2 shelves at top, desk at bottom
  state.elements.push({ id: genId(), filename: 'shelf-wide-36.svg', bayIndex: 0, pinRow: 1 });
  state.elements.push({ id: genId(), filename: 'shelf-wide-36.svg', bayIndex: 0, pinRow: 6 });
  state.elements.push({ id: genId(), filename: 'desk-wide-shelf.svg', bayIndex: 0, pinRow: 18 });

  // Bay 1 (middle): 2 shelves at top, 2-drawer cabinet at bottom
  state.elements.push({ id: genId(), filename: 'shelf-wide-36.svg', bayIndex: 1, pinRow: 1 });
  state.elements.push({ id: genId(), filename: 'shelf-wide-36.svg', bayIndex: 1, pinRow: 6 });
  state.elements.push({ id: genId(), filename: 'cab-wide-2d.svg', bayIndex: 1, pinRow: 18 });

  // Bay 2 (right): 1 shelf at top, 2 shallow shelves in middle, 1 shelf lower
  state.elements.push({ id: genId(), filename: 'shelf-wide-36.svg', bayIndex: 2, pinRow: 1 });
  state.elements.push({ id: genId(), filename: 'shelf-wide-22.svg', bayIndex: 2, pinRow: 6 });
  state.elements.push({ id: genId(), filename: 'shelf-wide-22.svg', bayIndex: 2, pinRow: 10 });
  state.elements.push({ id: genId(), filename: 'shelf-wide-drawer.svg', bayIndex: 2, pinRow: 18 });
}

// ============================================================
// Export Functions
// ============================================================

function getExportBounds() {
  if (state.tracks.length === 0) return null;
  const firstTrack = state.tracks[0];
  const lastTrack = state.tracks[state.tracks.length - 1];
  let maxHeight = 0;
  state.tracks.forEach(t => {
    const meta = ELEMENT_META[t.filename];
    if (meta.svgHeight > maxHeight) maxHeight = meta.svgHeight;
  });
  // Find the leftmost edge of any element (they extend left of the first track due to isometric depth)
  let minX = firstTrack.x;
  state.elements.forEach(el => {
    const meta = ELEMENT_META[el.filename];
    if (!meta) return;
    const rightTrack = state.tracks[el.bayIndex + 1];
    if (!rightTrack) return;
    const left = rightTrack.x - meta.svgWidth + meta.rightOffset;
    if (left < minX) minX = left;
  });

  const padding = 120;
  const x = minX - padding;
  const y = -padding;
  const w = (lastTrack.x + TRACK_WIDTH - minX) + padding * 2;
  const h = maxHeight + padding * 2;
  return { x, y, w, h };
}

function buildExportSVG() {
  const bounds = getExportBounds();
  if (!bounds) return null;

  let svgContent = '';

  // White background
  svgContent += '<rect x="' + bounds.x + '" y="' + bounds.y + '" width="' + bounds.w + '" height="' + bounds.h + '" fill="white"/>';

  // Helper: wrap cached SVG as a nested <svg> with position and size,
  // preserving the original viewBox so geometry renders correctly
  function embedSVG(filename, x, y, w, h) {
    const raw = svgCache[filename];
    if (!raw) return '';
    // Extract the original viewBox if present
    const vbMatch = raw.match(/viewBox="([^"]+)"/i);
    const vb = vbMatch ? vbMatch[1] : '0 0 ' + w + ' ' + h;
    // Extract inner content (everything between <svg ...> and </svg>)
    const innerMatch = raw.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
    const inner = innerMatch ? innerMatch[1] : '';
    return '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }

  // Tracks
  state.tracks.forEach(track => {
    const meta = ELEMENT_META[track.filename];
    svgContent += embedSVG(track.filename, track.x, 0, meta.svgWidth, meta.svgHeight);
  });

  // Elements (sorted for z-order)
  const sorted = [...state.elements].sort((a, b) => {
    if (a.bayIndex !== b.bayIndex) return a.bayIndex - b.bayIndex;
    return b.pinRow - a.pinRow;
  });

  sorted.forEach(el => {
    const meta = ELEMENT_META[el.filename];
    if (!meta) return;
    const rightTrack = state.tracks[el.bayIndex + 1];
    if (!rightTrack) return;
    const left = rightTrack.x - meta.svgWidth + meta.rightOffset;
    const top = PIN_HOLE_START + (el.pinRow * PIN_HOLE_SPACING);
    svgContent += embedSVG(el.filename, left, top, meta.svgWidth, meta.svgHeight);
  });

  // Bay labels
  for (let i = 0; i < state.tracks.length - 1; i++) {
    const leftTrack = state.tracks[i];
    const rightTrack = state.tracks[i + 1];
    const bayLeft = leftTrack.x + TRACK_WIDTH;
    const bayRight = rightTrack.x;
    const distancePx = bayRight - bayLeft;
    const distanceCm = (distancePx / 10).toFixed(1);
    const leftMeta = ELEMENT_META[leftTrack.filename];
    const rightMeta = ELEMENT_META[rightTrack.filename];
    const trackHeight = Math.min(leftMeta.svgHeight, rightMeta.svgHeight);
    const cx = bayLeft + distancePx / 2;
    svgContent += '<text x="' + cx + '" y="' + (trackHeight + 40) + '" text-anchor="middle" font-size="28" fill="#bbb" font-family="sans-serif">' + distanceCm + ' cm</text>';
  }

  // Total dimensions
  if (state.tracks.length >= 2) {
    const firstTrack = state.tracks[0];
    const lastTrack = state.tracks[state.tracks.length - 1];
    const totalW = ((lastTrack.x + TRACK_WIDTH - firstTrack.x) / 10).toFixed(1);
    let maxH = 0;
    state.tracks.forEach(t => { const m = ELEMENT_META[t.filename]; if (m.svgHeight > maxH) maxH = m.svgHeight; });
    const totalH = (maxH / 10).toFixed(0);
    svgContent += '<text x="' + firstTrack.x + '" y="' + (bounds.y + 40) + '" font-size="28" fill="#bbb" font-family="sans-serif">' + totalW + ' cm wide × ' + totalH + ' cm tall</text>';
  }

  const svg = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="' + bounds.w + '" height="' + bounds.h + '" viewBox="' + bounds.x + ' ' + bounds.y + ' ' + bounds.w + ' ' + bounds.h + '">' + svgContent + '</svg>';
  return svg;
}

function downloadFile(data, filename, mimeType) {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportAsSVG() {
  const svg = buildExportSVG();
  if (!svg) return;
  downloadFile(svg, 'vitsoe-606-design.svg', 'image/svg+xml');
}

function exportAsPNG() {
  const svgStr = buildExportSVG();
  if (!svgStr) return;

  const bounds = getExportBounds();
  const scale = 2; // 2x for high-res
  const canvas = document.createElement('canvas');
  canvas.width = bounds.w * scale;
  canvas.height = bounds.h * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  const img = new Image();
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function () {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, bounds.w, bounds.h);
    ctx.drawImage(img, 0, 0, bounds.w, bounds.h);
    URL.revokeObjectURL(url);

    canvas.toBlob(function (blob) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'vitsoe-606-design.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 'image/png');
  };
  img.src = url;
}

function exportAsPDF(includePrices) {
  const svgStr = buildExportSVG();
  if (!svgStr) return;

  const bounds = getExportBounds();
  if (!window.jspdf) {
    alert('PDF library failed to load. Please check your internet connection and reload.');
    return;
  }
  const jsPDF = window.jspdf.jsPDF;

  // Landscape A4 for wide designs
  const pageW = 297;
  const pageH = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Title
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text('Vitsoe 606 Configuration', margin, margin + 6);

  // Total dimensions subtitle
  if (state.tracks.length >= 2) {
    const firstTrack = state.tracks[0];
    const lastTrack = state.tracks[state.tracks.length - 1];
    const totalW = ((lastTrack.x + TRACK_WIDTH - firstTrack.x) / 10).toFixed(1);
    let maxH = 0;
    state.tracks.forEach(t => { const m = ELEMENT_META[t.filename]; if (m.svgHeight > maxH) maxH = m.svgHeight; });
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(totalW + ' cm wide  ×  ' + (maxH / 10).toFixed(0) + ' cm tall', margin, margin + 12);
  }

  // Render design image
  const imgTop = margin + 18;
  const designScale = contentW / bounds.w;
  const imgH = bounds.h * designScale;

  // Convert SVG to image, then add to PDF
  const canvas = document.createElement('canvas');
  const pxScale = 3;
  canvas.width = bounds.w * pxScale;
  canvas.height = bounds.h * pxScale;
  const ctx = canvas.getContext('2d');
  ctx.scale(pxScale, pxScale);

  const img = new Image();
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function () {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, bounds.w, bounds.h);
    ctx.drawImage(img, 0, 0, bounds.w, bounds.h);
    URL.revokeObjectURL(url);

    const imgData = canvas.toDataURL('image/png');
    const clampedH = Math.min(imgH, pageH - imgTop - margin - 10);
    const clampedW = clampedH / imgH * contentW;
    doc.addImage(imgData, 'PNG', margin, imgTop, clampedW, clampedH);

    // Price list
    if (includePrices) {
      let y = imgTop + clampedH + 10;

      // Check if we need a new page
      if (y > pageH - margin - 30) {
        doc.addPage();
        y = margin + 6;
      }

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Price List', margin, y);
      y += 7;

      // Gather cost items
      const counts = {};
      state.tracks.forEach(t => { counts[t.filename] = (counts[t.filename] || 0) + 1; });
      state.elements.forEach(el => { counts[el.filename] = (counts[el.filename] || 0) + 1; });

      const entries = Object.entries(counts).sort((a, b) => {
        const pa = parseElementFilename(a[0]);
        const pb = parseElementFilename(b[0]);
        if (pa.category === 'etrack' && pb.category !== 'etrack') return -1;
        if (pa.category !== 'etrack' && pb.category === 'etrack') return 1;
        return getPriceLabel(a[0]).localeCompare(getPriceLabel(b[0]));
      });

      doc.setFontSize(9);
      let total = 0;

      // Table header
      doc.setTextColor(150);
      doc.text('Item', margin, y);
      doc.text('Qty', margin + 140, y, { align: 'right' });
      doc.text('Unit', margin + 165, y, { align: 'right' });
      doc.text('Total', margin + 195, y, { align: 'right' });
      y += 1;
      doc.setDrawColor(200);
      doc.line(margin, y, margin + 195, y);
      y += 4;

      doc.setTextColor(60);
      entries.forEach(([filename, count]) => {
        if (y > pageH - margin - 10) {
          doc.addPage();
          y = margin + 6;
        }
        const unitPrice = getPrice(filename);
        const lineTotal = unitPrice * count;
        total += lineTotal;

        doc.text(getPriceLabel(filename), margin, y);
        doc.text(String(count), margin + 140, y, { align: 'right' });
        doc.text('$' + unitPrice.toLocaleString(), margin + 165, y, { align: 'right' });
        doc.text('$' + lineTotal.toLocaleString(), margin + 195, y, { align: 'right' });
        y += 5;
      });

      // Total line
      y += 1;
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(margin + 130, y, margin + 195, y);
      y += 5;
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text('Total', margin + 130, y);
      doc.text('$' + total.toLocaleString(), margin + 195, y, { align: 'right' });
    }

    doc.save('vitsoe-606-design.pdf');
  };
  img.src = url;
}

// ============================================================
// Init
// ============================================================

// SVG content cache for inline rendering
const svgCache = {};

async function preloadSVGs() {
  const promises = ELEMENT_FILES.map(async (filename) => {
    try {
      const resp = await fetch('elements/' + filename);
      const text = await resp.text();
      svgCache[filename] = text;
    } catch (e) {
      // Fallback: will use <img> tag if fetch fails
    }
  });
  await Promise.all(promises);
}

async function init() {
  await preloadSVGs();
  populateLibrary();
  initDefaultState();
  render();
  zoomToFit();

  // Cost panel collapse
  const costHeader = document.getElementById('cost-header');
  const costBody = document.getElementById('cost-body');
  if (costHeader && costBody) {
    costHeader.addEventListener('click', () => {
      const isCollapsed = costBody.classList.toggle('collapsed');
      costHeader.querySelector('.collapse-arrow').textContent = isCollapsed ? '→' : '↓';
    });
  }

  // Export panel collapse
  const exportHeader = document.getElementById('export-header');
  const exportBody = document.getElementById('export-body');
  if (exportHeader && exportBody) {
    exportHeader.addEventListener('click', () => {
      const isCollapsed = exportBody.classList.toggle('collapsed');
      exportHeader.querySelector('.collapse-arrow').textContent = isCollapsed ? '→' : '↓';
    });
  }

  // Export buttons
  document.getElementById('export-png').addEventListener('click', exportAsPNG);
  document.getElementById('export-svg').addEventListener('click', exportAsSVG);
  document.getElementById('export-pdf').addEventListener('click', () => {
    const includePrices = document.getElementById('pdf-include-prices').checked;
    exportAsPDF(includePrices);
  });

  // Show/hide price checkbox only near PDF button
  const pdfPriceOption = document.getElementById('pdf-price-option');
  pdfPriceOption.classList.add('visible');
}

init();
