import { debounce, fetchHeroes } from './data.js'
import {
  getCurrentPage,
  hydrateFromURL,
  setActiveHero,
  setFilter,
  setHeroes,
  setPageSize,
  setSort,
  state,
  syncURL,
} from './state.js'
import { renderPagination, renderRows, updateSortHeaders } from './table.js'
import { closeModal, openModal } from './modal.js'
import './pop-up.js'

// Boot starts by loading the remote data. fetchHeroes owns caching and network
// failure handling, so app.js only decides what to render with the result.
const heroes = await fetchHeroes()

if (!heroes) {
  // Keep the failure visible in the table area instead of leaving a blank page.
  const body = document.getElementById('heroBody')
  if (body) body.innerHTML = '<tr><td colspan="15">Could not load hero data.</td></tr>'
} else {
  // Data must be loaded before hydrating the URL because URL filters and sorts
  // need an existing hero list to operate on.
  setHeroes(heroes)
  hydrateFromURL()
  render()
  bindEvents()

  // If a shared URL contains a hero id, reopen that detail view after the first
  // table render so the page and modal match the URL state.
  if (state.activeHeroId !== null) {
    const hero = state.heroes.find(item => String(item.id) === String(state.activeHeroId))
    if (hero) openModal(hero)
  }
}

// The central render pass for the app. State-changing handlers call this after
// updating state so the table, pagination, headers, count and URL stay aligned.
function render() {
  renderRows(getCurrentPage())
  renderPagination()
  updateSortHeaders()
  syncURL()
  updateResultCount()
}

// The count reflects filtered results, not just the current page.
function updateResultCount() {
  const count = document.getElementById('resultCount')
  if (count) count.textContent = `${state.filtered.length} results`
}

// All DOM event wiring lives here. Each handler updates state first, then calls
// render() unless it only affects the modal URL state.
function bindEvents() {
  const searchInput = document.getElementById('searchInput')
  const searchField = document.getElementById('searchField')
  const pageSize = document.getElementById('pageSize')
  const table = document.getElementById('heroTable')
  const modalClose = document.getElementById('modalClose')
  const modalBackdrop = document.getElementById('modalBackdrop')

  if (searchInput) searchInput.value = state.searchQuery
  if (searchField) searchField.value = state.searchField
  if (pageSize) pageSize.value = String(state.pageSize)

  // Search is debounced so filtering hundreds of heroes does not run on every
  // key event during fast typing.
  const applySearch = debounce(() => {
    setFilter(searchInput?.value ?? '', searchField?.value ?? 'name')
    render()
  }, 150)

  searchInput?.addEventListener('input', applySearch)
  searchField?.addEventListener('change', () => {
    setFilter(searchInput?.value ?? '', searchField.value)
    render()
  })
  pageSize?.addEventListener('change', () => {
    setPageSize(pageSize.value === 'all' ? 'all' : Number(pageSize.value))
    render()
  })

  // Header clicks use each <th data-col> value as the sort key.
  table?.querySelectorAll('th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      setSort(th.dataset.col)
      render()
    })
  })

  // Row clicks open the modal for the matching hero and immediately sync the
  // hero id into the URL, making detail views shareable.
  table?.addEventListener('click', event => {
    const row = event.target.closest('tr[data-id]')
    if (!row) return
    const hero = state.heroes.find(item => String(item.id) === row.dataset.id)
    if (!hero) return
    setActiveHero(hero.id)
    openModal(hero)
    syncURL()
  })

  // The modal module clears activeHeroId; app.js follows that by syncing the URL
  // so closing the modal removes the hero parameter too.
  modalClose?.addEventListener('click', () => {
    closeModal()
    syncURL()
  })
  modalBackdrop?.addEventListener('click', () => {
    closeModal()
    syncURL()
  })
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal()
      syncURL()
    }
  })
}
