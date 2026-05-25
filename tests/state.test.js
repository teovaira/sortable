import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('../src/data.js', () => {
  const isMissing = value => value === null || value === undefined || value === '-' || value === ''
  const getField = (hero, path) => {
    if (!hero) return null
    const value = path.split('.').reduce((current, key) => current?.[key], hero)
    return isMissing(value) ? null : value
  }
  const getHeightMetric = hero => {
    const value = hero?.appearance?.height?.[1]
    return isMissing(value) || value === '0 cm' ? null : value
  }
  const getWeightMetric = hero => {
    const value = hero?.appearance?.weight?.[1]
    return isMissing(value) || value === '0 kg' ? null : value
  }
  const parseMetricNumber = value => {
    if (isMissing(value)) return null
    const number = Number.parseFloat(value)
    return number > 0 ? number : null
  }
  return { getField, getHeightMetric, getWeightMetric, parseMetricNumber }
})

import {
  getCurrentPage,
  hydrateFromURL,
  setFilter,
  setHeroes,
  setPage,
  setPageSize,
  setSort,
  state,
  syncURL,
} from '../src/state.js'

function resetURL(url = `${window.location.origin}/`) {
  window.history.replaceState({}, '', url)
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
  resetURL()
})

describe('state defaults', () => {
  test('initial state values match defaults', () => {
    expect(state).toMatchObject({
      heroes: [],
      filtered: [],
      sorted: [],
      page: 1,
      pageSize: 20,
      sortCol: 'name',
      sortDir: 'asc',
      searchField: 'name',
      searchQuery: '',
      activeHeroId: null,
    })
  })
})

test('setHeroes stores heroes and applies name ascending sort', () => {
  setHeroes([{ name: 'Zorro' }, { name: 'Aquaman' }])
  expect(state.heroes).toHaveLength(2)
  expect(state.filtered).toHaveLength(2)
  expect(state.sorted[0].name).toBe('Aquaman')
})

test('setFilter filters by field and resets page to 1', () => {
  setHeroes([{ name: 'Batman' }, { name: 'Thor' }])
  state.page = 2
  setFilter('man', 'name')
  expect(state.filtered).toEqual([{ name: 'Batman' }])
  expect(state.page).toBe(1)
})

test('setSort toggles current column and starts new columns ascending', () => {
  setHeroes([{ name: 'Batman' }, { name: 'Thor' }])
  setSort('name')
  expect(state.sortDir).toBe('desc')
  setSort('appearance.gender')
  expect(state.sortCol).toBe('appearance.gender')
  expect(state.sortDir).toBe('asc')
})

test('setSort reverses sorted data after toggling name descending', () => {
  setHeroes([{ name: 'Aquaman' }, { name: 'Zorro' }])
  setSort('name')
  expect(state.sorted.map(hero => hero.name)).toEqual(['Zorro', 'Aquaman'])
})

test('setSort sorts metric weight numerically and keeps missing values last', () => {
  const light = { name: 'Light', appearance: { weight: ['172 lb', '78 kg'] } }
  const heavy = { name: 'Heavy', appearance: { weight: ['972 lb', '441 kg'] } }
  const unknown = { name: 'Unknown', appearance: { weight: ['-', '0 kg'] } }
  setHeroes([heavy, unknown, light])
  setSort('appearance.weight')
  expect(state.sorted).toEqual([light, heavy, unknown])
})

test('setPageSize with a number resets page to 1', () => {
  state.page = 3
  setPageSize(50)
  expect(state.pageSize).toBe(50)
  expect(state.page).toBe(1)
})

test('setPageSize with all resets page to 1', () => {
  state.page = 3
  setPageSize('all')
  expect(state.pageSize).toBe('all')
  expect(state.page).toBe(1)
})

test('getCurrentPage returns slices, all items, and empty out-of-range pages', () => {
  setHeroes(Array.from({ length: 25 }, (_, index) => ({ name: `Hero ${index}` })))
  setPageSize(20)
  expect(getCurrentPage()).toHaveLength(20)
  setPage(2)
  expect(getCurrentPage()).toHaveLength(5)
  setPage(3)
  expect(getCurrentPage()).toEqual([])
  setPageSize('all')
  expect(getCurrentPage()).toHaveLength(25)
})

test('syncURL and hydrateFromURL preserve state fields including all pageSize', () => {
  setHeroes([{ id: 1, name: 'Batman' }, { id: 2, name: 'Thor' }])
  setFilter('man', 'name')
  setSort('name')
  setPageSize('all')
  state.activeHeroId = 1
  syncURL()

  const url = window.location.href
  resetState()
  setHeroes([{ id: 1, name: 'Batman' }, { id: 2, name: 'Thor' }])
  resetURL(url)
  hydrateFromURL()

  expect(state.searchQuery).toBe('man')
  expect(state.searchField).toBe('name')
  expect(state.sortCol).toBe('name')
  expect(state.sortDir).toBe('desc')
  expect(state.pageSize).toBe('all')
  expect(state.activeHeroId).toBe(1)
})
