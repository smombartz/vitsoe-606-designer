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
  'etrack-57.svg',
  'etrack-114.svg',
  'etrack-171.svg',
  'etrack-200.svg',
  'shelf-wide-22.svg',
  'shelf-wide-36.svg',
  'shelf-narrow-22.svg',
  'shelf-narrow-36.svg',
  'cab-wide-1d.svg',
  'cab-wide-1d_lock.svg',
  'cab-narrow-1d.svg',
  'cab-narrow-1d_lock.svg',
];

// SVG metadata — dimensions and right-alignment offsets
const ELEMENT_META = {
  'etrack-57.svg':         { svgWidth: 35,   svgHeight: 570,  rightOffset: 0 },
  'etrack-114.svg':        { svgWidth: 35,   svgHeight: 1140, rightOffset: 0 },
  'etrack-171.svg':        { svgWidth: 35,   svgHeight: 1710, rightOffset: 0 },
  'etrack-200.svg':        { svgWidth: 35,   svgHeight: 2000, rightOffset: 0 },
  'shelf-wide-22.svg':     { svgWidth: 1027, svgHeight: 244,  rightOffset: 38 },
  'shelf-wide-36.svg':     { svgWidth: 1086, svgHeight: 280,  rightOffset: 39 },
  'shelf-narrow-22.svg':   { svgWidth: 787,  svgHeight: 258,  rightOffset: 40 },
  'shelf-narrow-36.svg':   { svgWidth: 849,  svgHeight: 280,  rightOffset: 39 },
  'cab-wide-1d.svg':       { svgWidth: 1086, svgHeight: 644,  rightOffset: 17 },
  'cab-wide-1d_lock.svg':  { svgWidth: 1086, svgHeight: 644,  rightOffset: 17 },
  'cab-narrow-1d.svg':     { svgWidth: 850,  svgHeight: 644,  rightOffset: 9 },
  'cab-narrow-1d_lock.svg':{ svgWidth: 850,  svgHeight: 644,  rightOffset: 9 },
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
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomFitBtn = document.getElementById('zoom-fit');
const zoomLevelEl = document.getElementById('zoom-level');

// ============================================================
// Zoom System
// ============================================================

function setZoom(z) {
  state.zoom = Math.max(0.1, Math.min(1.5, z));
  canvas.style.transform = 'scale(' + state.zoom + ')';
  zoomLevelEl.textContent = Math.round(state.zoom * 100) + '%';
}

zoomInBtn.addEventListener('click', () => setZoom(state.zoom + 0.1));
zoomOutBtn.addEventListener('click', () => setZoom(state.zoom - 0.1));
zoomFitBtn.addEventListener('click', () => {
  // Fit tallest track on screen
  const maxH = state.tracks.reduce((max, t) => {
    const m = ELEMENT_META[t.filename];
    return m ? Math.max(max, m.svgHeight) : max;
  }, 2000);
  const viewH = canvasWrapper.clientHeight - 40;
  setZoom(viewH / maxH);
});

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
  const x = (e.clientX - rect.left + canvasWrapper.scrollLeft) / state.zoom;
  const y = (e.clientY - rect.top + canvasWrapper.scrollTop) / state.zoom;
  return { x, y };
}

// ============================================================
// Rendering
// ============================================================

function render() {
  canvas.innerHTML = '';

  // Render tracks
  state.tracks.forEach(renderTrack);

  // Render elements sorted by pinRow descending — items higher up (lower pinRow)
  // render last so they appear in front (isometric: higher = closer to viewer)
  const sorted = [...state.elements].sort((a, b) => b.pinRow - a.pinRow);
  sorted.forEach((el, i) => renderElement(el, i));
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

  const img = document.createElement('img');
  img.src = 'elements/' + el.filename;
  div.appendChild(img);
  canvas.appendChild(div);
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

function showGhost(imgSrc, width, height) {
  dragGhostEl.innerHTML = '';
  const img = document.createElement('img');
  img.src = imgSrc;
  img.style.width = (width * state.zoom) + 'px';
  img.style.height = (height * state.zoom) + 'px';
  dragGhostEl.appendChild(img);
  dragGhostEl.classList.remove('hidden');
}

function moveGhost(e) {
  dragGhostEl.style.left = (e.clientX + 8) + 'px';
  dragGhostEl.style.top = (e.clientY + 8) + 'px';
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

  // Select on drag start
  state.selectedId = elementId;

  drag = {
    type: 'element',
    elementId,
  };

  const meta = ELEMENT_META[el.filename];
  showGhost('elements/' + el.filename, meta.svgWidth, meta.svgHeight);
  moveGhost(e);

  // Dim the original
  const domEl = canvas.querySelector('[data-element-id="' + elementId + '"]');
  if (domEl) domEl.classList.add('dragging');
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

  if (drag.type === 'library' || drag.type === 'element') {
    moveGhost(e);

    // Show indicators on canvas
    clearIndicators();
    const coords = canvasCoords(e);
    const item = drag.type === 'library' ? drag.item : null;
    const isEtrack = item && item.category === 'etrack';

    if (isEtrack) {
      // Show where the etrack would snap to
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
    hideGhost();
    clearIndicators();

    const el = state.elements.find(x => x.id === drag.elementId);
    if (el) {
      const rect = canvasWrapper.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {

        const coords = canvasCoords(e);
        const bayIndex = detectBay(coords.x);
        if (bayIndex !== null) {
          const pinRow = nearestPinRow(coords.y, state.tracks[bayIndex].filename);
          el.bayIndex = bayIndex;
          el.pinRow = pinRow;
          // Auto-swap width to match bay
          const bayWidth = getBayWidth(bayIndex);
          el.filename = getMatchingFilename(el.filename, bayWidth);
        }
      }
    }
    render();
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
  if (e.button !== 0) return; // left click only

  dismissContextMenu();

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

  // Click on empty canvas → deselect
  state.selectedId = null;
  render();
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
      // If dragging a track, we need to re-render to reset position
      // (track position was being updated live, so we'd need to restore)
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

  const elDiv = e.target.closest('.element');
  if (!elDiv) {
    dismissContextMenu();
    return;
  }

  const id = parseInt(elDiv.dataset.elementId);
  const el = state.elements.find(x => x.id === id);
  if (!el) return;

  state.selectedId = id;
  render();
  showContextMenu(e.clientX, e.clientY, el);
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

  const categoryOrder = ['etrack', 'shelf', 'cab'];
  const categoryLabels = { etrack: 'E-Tracks', shelf: 'Shelves', cab: 'Cabinets' };

  categoryOrder.forEach(cat => {
    const items = groups[cat];
    if (!items) return;

    const section = document.createElement('div');
    section.className = 'library-category';

    const heading = document.createElement('h3');
    heading.textContent = categoryLabels[cat] || cat;
    section.appendChild(heading);

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

      section.appendChild(div);
    });

    libraryItems.appendChild(section);
  });
}

function formatLabel(item) {
  if (item.category === 'etrack') return item.option + 'cm';
  const categoryLabelsShort = { shelf: 'Shelf', cab: 'Cabinet' };
  const catLabel = categoryLabelsShort[item.category] || item.category;
  const optionLabel = item.option.replace(/_/g, ' ');
  return catLabel + ' — ' + optionLabel;
}

// ============================================================
// Default State
// ============================================================

function initDefaultState() {
  const startX = 100;
  const defaultTrack = 'etrack-200.svg';

  state.tracks.push({
    id: genId(), x: startX, filename: defaultTrack, lengthCm: 200,
  });
  state.tracks.push({
    id: genId(), x: startX + TRACK_WIDTH + WIDE_BAY, filename: defaultTrack, lengthCm: 200,
  });
  state.tracks.push({
    id: genId(), x: startX + (TRACK_WIDTH + WIDE_BAY) * 2, filename: defaultTrack, lengthCm: 200,
  });
}

// ============================================================
// Init
// ============================================================

function init() {
  populateLibrary();
  initDefaultState();
  setZoom(state.zoom);
  render();
}

init();
