import { beforeEach, expect, test, vi } from 'vitest'

vi.mock('../src/data.js', () => {
  const isMissing = value => value === null || value === undefined || value === '-' || value === ''
  const getField = (hero, path) => {
    if (!hero) return null
    const value = path.split('.').reduce((current, key) => current?.[key], hero)
    return isMissing(value) ? null : value
  }
  const getHeightMetric = hero => hero?.appearance?.height?.[1] ?? null
  const getWeightMetric = hero => hero?.appearance?.weight?.[1] ?? null
  const parseMetricNumber = value => {
    if (isMissing(value)) return null
    const number = Number.parseFloat(value)
    return number > 0 ? number : null
  }
  return { getField, getHeightMetric, getWeightMetric, parseMetricNumber }
})

import { renderPagination, renderRows, updateSortHeaders } from '../src/table.js'
import { setHeroes, setPageSize, state } from '../src/state.js'

const hero = {
  id: 1,
  name: 'Batman',
  biography: { fullName: '-', placeOfBirth: 'Gotham', alignment: 'good' },
  appearance: {
    race: null,
    gender: 'Male',
    height: ["6'2", '188 cm'],
    weight: ['210 lb', '95 kg'],
  },
  powerstats: { intelligence: 100, strength: 26, speed: 27, durability: 34, power: 47, combat: 100 },
  images: { xs: 'https://example.com/batman-xs.jpg' },
}

function resetState() {
  state.heroes = []
  state.filtered = []
  state.sorted = []
  state.page = 1
  state.pageSize = 20
  state.sortCol = 'name'
  state.sortDir = 'asc'
  state.searchField = 'name'
  state.searchQuery = ''
  state.activeHeroId = null
}

beforeEach(() => {
  resetState()
  document.body.innerHTML = `
    <table id="heroTable">
      <thead>
        <tr>
          <th data-col="name">Name</th>
          <th data-col="appearance.weight">Weight</th>
          <th data-col="powerstats.intelligence">Intelligence</th>
        </tr>
      </thead>
      <tbody id="heroBody"></tbody>
    </table>
    <div id="pagination"></div>
  `
})

test('renderRows shows one no results row for empty data', () => {
  renderRows([])
  const rows = document.querySelectorAll('#heroBody tr')
  expect(rows).toHaveLength(1)
  expect(rows[0].textContent.toLowerCase()).toContain('no results')
})

test('renderRows creates one table row per hero with data-id', () => {
  renderRows([hero, { ...hero, id: 2, name: 'Thor' }])
  const rows = document.querySelectorAll('#heroBody tr')
  expect(rows).toHaveLength(2)
  expect(rows[0].dataset.id).toBe('1')
  expect(rows[1].dataset.id).toBe('2')
})

test('renderRows renders xs image and em dash for missing values', () => {
  renderRows([hero])
  const body = document.getElementById('heroBody')
  const img = body.querySelector('img')
  expect(img.src).toContain('batman-xs.jpg')
  expect(body.textContent).toContain('—')
})

test('renderPagination is empty when pageSize is all', () => {
  setHeroes(Array.from({ length: 50 }, (_, index) => ({ name: `Hero ${index}` })))
  setPageSize('all')
  renderPagination()
  expect(document.getElementById('pagination').innerHTML).toBe('')
})

test('renderPagination creates page buttons and marks active page', () => {
  setHeroes(Array.from({ length: 50 }, (_, index) => ({ name: `Hero ${index}` })))
  setPageSize(20)
  renderPagination()
  const buttons = document.querySelectorAll('#pagination button')
  expect(buttons).toHaveLength(3)
  expect(buttons[0].getAttribute('aria-current')).toBe('page')
})

test('updateSortHeaders marks only the sorted column', () => {
  state.sortCol = 'appearance.weight'
  state.sortDir = 'desc'
  updateSortHeaders()
  const active = document.querySelector('th[data-col="appearance.weight"]')
  const inactive = document.querySelector('th[data-col="name"]')
  expect(active.classList.contains('sorted-desc')).toBe(true)
  expect(active.classList.contains('sorted-asc')).toBe(false)
  expect(inactive.classList.contains('sorted-desc')).toBe(false)
  expect(inactive.classList.contains('sorted-asc')).toBe(false)
})
