# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Fixed

- `modal.js` — remove rogue `addEventListener` at module load time; was crashing all modal tests
- `modal.js` — move `setActiveHero(null)` before `setTimeout` so URL clears immediately on close
- `modal.js` — delete commented-out old `innerHTML` block
- `tests/modal.test.js` — add `vi.useFakeTimers` and `vi.advanceTimersByTime(180)` for animation timing
- `tests/modal.test.js` — add `vi.mock` for `state.js` and spy test for `setActiveHero(null)`

### Added

- `src/state.js` — single state object, sort/filter/pagination, URL sync
- `src/table.js` — `renderRows`, `renderPagination`, `updateSortHeaders`
- `src/app.js` — boot sequence, `render()`, all event listeners
- `tests/state.test.js` — 10 tests covering all state functions
- `tests/table.test.js` — 6 tests covering all render functions
- `CONTRIBUTING.md` — ownership, branch, commit, and workflow guidelines
- `docs/data-review.md` — full codebase review with findings and compliance table
- `docs/lessons.md` — teaching record and lesson plan

---

## [0.1.0] — 2026-05-24

### Added

- `index.html` — full page structure with all required IDs and table columns
- `src/style.css` — comic book theme, animations, modal, responsive layout
- `src/pop-up.js` — comic word effect on click (`spawnComicWord`)
- `src/data.js` — `fetchHeroes`, `getField`, `getHeightMetric`, `getWeightMetric`, `parseMetricNumber`, `debounce`
- `src/modal.js` — `openModal`, `closeModal` with closing animation
- `src/search.js` — `parseQuery` with all operators, `filterHeroes`
- `tests/data.test.js` — full coverage of data helpers and fetch caching
- `tests/search.test.js` — 33 tests covering all search operators
- `tests/modal.test.js` — 8 tests for open/close behaviour
- `package.json`, `vitest.config.js` — test infrastructure
- `LICENSE.md` — MIT license

### Fixed

- `src/modal.js` — restyle to match comic theme, add closing animation
