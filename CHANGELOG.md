# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

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
- `tests/data.test.js` — full coverage of data helpers and fetch caching
- `tests/search.test.js` — 33 tests covering all search operators
- `tests/modal.test.js` — 8 tests for open/close behavior
- `tests/state.test.js` — 10 tests covering all state functions
- `tests/table.test.js` — 6 tests covering all render functions
- `package.json`, `vitest.config.js` — test infrastructure
- `LICENSE.md`, `CONTRIBUTING.md` — project meta

### Fixed

- `src/modal.js` — restyle to match comic theme, add closing animation
- `src/modal.js` — remove rogue `addEventListener` at module load time
- `src/modal.js` — move `setActiveHero(null)` before `setTimeout`
- `src/modal.js` — delete commented-out old `innerHTML` block
- `tests/modal.test.js` — add fake timers and advance by 180ms for animation timing
- `tests/modal.test.js` — add `vi.mock` for `state.js`, add `setActiveHero(null)` spy test
