import { getCurrentPage, setPage, state, syncURL } from './state.js'

// Column order mirrors the project table contract and the <th data-col> values
// from index.html. Keeping it in one array makes row rendering predictable.
const COLUMNS = [
  'images.xs',
  'name',
  'biography.fullName',
  'powerstats.intelligence',
  'powerstats.strength',
  'powerstats.speed',
  'powerstats.durability',
  'powerstats.power',
  'powerstats.combat',
  'appearance.race',
  'appearance.gender',
  'appearance.height',
  'appearance.weight',
  'biography.placeOfBirth',
  'biography.alignment',
]

// The API represents missing values with null-like values, "-" and empty
// strings. The table translates those into a visual dash instead of leaking API
// quirks into the UI.
function isMissing(value) {
  return value === null || value === undefined || value === '-' || value === ''
}

// A tiny path reader for display values. Height and weight are special because
// the API stores both imperial and metric values, and the spec asks us to show
// the metric value at index 1.
function getValue(hero, path) {
  if (path === 'appearance.height') return hero?.appearance?.height?.[1]
  if (path === 'appearance.weight') return hero?.appearance?.weight?.[1]
  return path.split('.').reduce((current, key) => current?.[key], hero)
}

// Returns safe display text for table cells. "&mdash;" is used instead of a raw
// Unicode dash so the source file stays ASCII while the browser still displays
// the required em dash.
function display(value) {
  if (isMissing(value) || value === '0 cm' || value === '0 kg') return '&mdash;'
  return String(value)
}

// Renders the current page of heroes into <tbody>. Each row keeps the hero id in
// data-id so app.js can open the correct detail modal when a row is clicked.
export function renderRows(heroes) {
  const tbody = document.getElementById('heroBody')
  if (!tbody) return

  if (!heroes.length) {
    tbody.innerHTML = '<tr><td colspan="15">No results</td></tr>'
    return
  }

  tbody.innerHTML = heroes.map(hero => {
    const cells = COLUMNS.map(col => {
      if (col === 'images.xs') {
        const src = getValue(hero, col)
        return `<td>${isMissing(src) ? '&mdash;' : `<img src="${src}" alt="${display(hero.name)}" />`}</td>`
      }
      return `<td>${display(getValue(hero, col))}</td>`
    }).join('')

    return `<tr data-id="${hero.id}">${cells}</tr>`
  }).join('')
}

// Rebuilds pagination controls from state.sorted and state.pageSize. The
// buttons wire themselves directly because table.js owns pagination rendering
// according to the shared contract.
export function renderPagination() {
  const pagination = document.getElementById('pagination')
  if (!pagination) return

  if (state.pageSize === 'all') {
    pagination.innerHTML = ''
    return
  }

  const totalPages = Math.ceil(state.sorted.length / Number(state.pageSize))
  pagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1
    const current = page === state.page ? ' aria-current="page"' : ''
    return `<button type="button" data-page="${page}"${current}>${page}</button>`
  }).join('')

  pagination.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      setPage(Number(button.dataset.page))
      syncURL()
      renderRows(getCurrentPage())
      renderPagination()
    })
  })
}

// Clears stale sort classes first, then marks exactly one active header. CSS can
// use these classes to show ascending/descending indicators.
export function updateSortHeaders() {
  document.querySelectorAll('th[data-col]').forEach(th => {
    th.classList.remove('sorted-asc', 'sorted-desc')
    if (th.dataset.col === state.sortCol) {
      th.classList.add(state.sortDir === 'asc' ? 'sorted-asc' : 'sorted-desc')
    }
  })
}
