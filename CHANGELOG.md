# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

## [1.0.0] — 2026-05-28

### Added

- `index.html` — full page structure with all required IDs and table columns
- `src/style.css` — comic book theme, animations, modal, responsive layout
- `src/pop-up.js` — comic word effect on click
- `src/data.js` — `fetchHeroes`, `getField`, `getHeightMetric`, `getWeightMetric`, `parseMetricNumber`, `debounce`
- `src/search.js` — `parseQuery` with all operators, `filterHeroes`
- `src/modal.js` — `openModal`, `closeModal` with closing animation
- `src/state.js` — single state object, sort/filter/pagination, URL sync
- `src/table.js` — `renderRows`, `renderPagination`, `updateSortHeaders`
- `src/app.js` — boot sequence, `render()`, all event listeners
- `tests/data.test.js` — 20 tests covering data helpers, fetch caching, unit conversion
- `tests/search.test.js` — 33 tests covering all search operators
- `tests/modal.test.js` — 8 tests for open/close behavior
- `tests/state.test.js` — 10 tests covering all state functions
- `tests/table.test.js` — 6 tests covering all render functions
- `package.json`, `vitest.config.js` — test infrastructure
- `README.md`, `CONTRIBUTING.md`, `LICENSE.md` — project meta
- Accessibility: `role="dialog"` and `aria-modal="true"` on `#modal`
- Accessibility: `openModal` moves keyboard focus to the close button

### Fixed

- `src/modal.js` — restyle to match comic theme, add closing animation
- `src/modal.js` — remove rogue `addEventListener` at module load time
- `src/modal.js` — move `setActiveHero(null)` before the close `setTimeout`
- `src/modal.js` — delete commented-out old `innerHTML` block
- `src/data.js` — replace `parseInt` with `parseFloat` in `parseMetricNumber`
- `src/data.js` — replace `!number` guard with explicit `isNaN(number) || number === 0`
- `src/data.js` — normalize tons to kg and meters to cm so the weight/height sort is physically correct
- `src/data.js` — remove remaining `console.log` from `fetchHeroes` catch
- `src/app.js` — `#resultCount` now shows `"{count} results"` instead of a bare number
- `src/table.js` — pagination click handler now calls `syncURL` so page state persists in the URL
- `index.html` — remove duplicate `<script>` tag; `pop-up.js` is imported inside `app.js`
- `tests/modal.test.js` — fake timers + `advanceTimersByTime(180)` for animation timing
- `tests/modal.test.js` — `vi.mock` for `state.js` + `setActiveHero(null)` spy test

### Changed

- `src/style.css` — convert flat section comments to boxed banner headers
- `src/search.js` — add why-comments explaining operator order and design choices
- `src/modal.js` — add why-comments explaining animation pattern and focus behavior
