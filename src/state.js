import { getField, getHeightMetric, getWeightMetric, parseMetricNumber } from './data.js'
import { filterHeroes, parseQuery } from './search.js'

// This single state object is the source of truth for the app.
// The table never sorts or filters independently; it only renders the
// already-prepared arrays stored here.
export const state = {
  // The complete API response. This never changes after setHeroes unless the
  // app reloads or a new dataset is provided in tests.
  heroes: [],

  // The dataset after applying the current search query.
  filtered: [],

  // The filtered dataset after applying the current sort column and direction.
  sorted: [],

  // Pagination and table controls. pageSize can be a number or the string
  // "all", matching the page-size select option.
  page: 1,
  pageSize: 20,
  sortCol: 'name',
  sortDir: 'asc',

  // Search controls. searchField is one of the table column paths.
  searchField: 'name',
  searchQuery: '',

  // Used by app.js and modal.js to keep the detail view reflected in the URL.
  activeHeroId: null,
}

// Sort uses the same display-oriented metric fields that the table shows.
// Height and weight are special because the API stores them as arrays like
// ["6'8", "203 cm"], and the project contract says to use the metric entry.
function getSortValue(hero, col) {
  if (col === 'appearance.height') return parseMetricNumber(getHeightMetric(hero))
  if (col === 'appearance.weight') return parseMetricNumber(getWeightMetric(hero))
  return getField(hero, col)
}

// Missing values must always go last, even when sorting descending.
// For real values, numbers use arithmetic comparison and strings use
// localeCompare with numeric mode so strings like "Hero 2" sort before "Hero 10".
function compareValues(a, b, dir) {
  const aMissing = a === null || a === undefined || a === '-' || a === ''
  const bMissing = b === null || b === undefined || b === '-' || b === ''

  if (aMissing && bMissing) return 0
  if (aMissing) return 1
  if (bMissing) return -1

  const direction = dir === 'desc' ? -1 : 1
  if (typeof a === 'number' && typeof b === 'number') return (a - b) * direction
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }) * direction
}

// Rebuilds state.sorted from state.filtered. This function is deliberately
// small because every state change that affects ordering eventually flows here.
function applySort() {
  state.sorted = [...state.filtered].sort((a, b) => (
    compareValues(getSortValue(a, state.sortCol), getSortValue(b, state.sortCol), state.sortDir)
  ))
}

// Rebuilds the filtered and sorted lists together so they cannot drift apart.
// parseQuery returns null for an empty search, and filterHeroes treats that as
// "no filter", which keeps the full hero list.
function applyFilter() {
  const filterFn = parseQuery(state.searchQuery, state.searchField)
  state.filtered = filterHeroes(state.heroes, filterFn)
  applySort()
}

// Loads the full dataset into state and immediately applies the default
// name-ascending sort required by the spec.
export function setHeroes(heroes) {
  state.heroes = Array.isArray(heroes) ? heroes : []
  applyFilter()
}

// Search always resets to page 1 because a previously selected page may no
// longer exist after filtering.
export function setFilter(query, field = state.searchField) {
  state.searchQuery = query ?? ''
  state.searchField = field || 'name'
  state.page = 1
  applyFilter()
}

// Clicking the active column toggles direction. Clicking a different column
// starts with ascending order, matching normal table-sort behavior.
export function setSort(col) {
  if (state.sortCol === col) {
    state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc'
  } else {
    state.sortCol = col
    state.sortDir = 'asc'
  }
  applySort()
}

// Keeps page numbers positive and integer-ish. Invalid values fall back to the
// first page instead of throwing, which keeps the error-handling contract simple.
export function setPage(n) {
  const page = Number(n)
  state.page = Number.isInteger(page) && page > 0 ? page : 1
}

// The select element provides string values, so this normalizes numeric sizes
// while preserving the special "all" mode.
export function setPageSize(size) {
  state.pageSize = size === 'all' ? 'all' : Number(size)
  state.page = 1
}

// null closes the modal. Any non-null id marks the current hero detail view.
export function setActiveHero(id) {
  state.activeHeroId = id === undefined ? null : id
}

// Returns only the heroes that should be visible on the current page.
// Out-of-range pages return an empty list so table rendering can show
// "No results" instead of crashing.
export function getCurrentPage() {
  if (state.pageSize === 'all') return state.sorted

  const pageSize = Number(state.pageSize)
  const start = (state.page - 1) * pageSize
  const end = start + pageSize
  if (start < 0 || start >= state.sorted.length) return []
  return state.sorted.slice(start, end)
}

// Reads URL parameters back into state. This runs after setHeroes, so applying
// the filter at the end is enough to rebuild filtered and sorted arrays.
export function hydrateFromURL() {
  const params = new URLSearchParams(window.location.search)
  const query = params.get('q') ?? state.searchQuery
  const field = params.get('field') ?? state.searchField
  const sort = params.get('sort')
  const dir = params.get('dir')
  const size = params.get('size')
  const page = params.get('page')
  const hero = params.get('hero')

  state.searchQuery = query
  state.searchField = field
  if (sort) state.sortCol = sort
  if (dir === 'asc' || dir === 'desc') state.sortDir = dir
  if (size) state.pageSize = size === 'all' ? 'all' : Number(size)
  if (page) setPage(Number(page))
  if (hero) state.activeHeroId = Number.isNaN(Number(hero)) ? hero : Number(hero)

  applyFilter()
}

// Writes the important UI state into the URL without navigating. Default values
// are omitted so the URL stays short, but every non-default table/search/modal
// setting can still be shared or restored.
export function syncURL() {
  const params = new URLSearchParams()
  if (state.searchQuery) params.set('q', state.searchQuery)
  if (state.searchField !== 'name') params.set('field', state.searchField)
  if (state.sortCol !== 'name') params.set('sort', state.sortCol)
  if (state.sortDir !== 'asc') params.set('dir', state.sortDir)
  if (state.pageSize !== 20) params.set('size', String(state.pageSize))
  if (state.page !== 1) params.set('page', String(state.page))
  if (state.activeHeroId !== null) params.set('hero', String(state.activeHeroId))

  const query = params.toString()
  const nextURL = `${window.location.pathname}${query ? `?${query}` : ''}`
  window.history.replaceState({}, '', nextURL)
}
