import { afterEach, expect, test, vi } from 'vitest'
import {
  debounce,
  getField,
  getHeightMetric,
  getWeightMetric,
  parseMetricNumber,
} from '../src/data.js'

const hero = {
  name: 'Batman',
  biography: {
    alignment: 'good',
    fullName: 'Bruce Wayne',
    placeOfBirth: '-',
  },
  appearance: {
    height: ["6'2", '188 cm'],
    weight: ['210 lb', '95 kg'],
  },
  powerstats: {
    intelligence: 100,
  },
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

// getField
test('getField — returns nested value by dot path', () => {
  expect(getField(hero, 'biography.alignment')).toBe('good')
})

test('getField — returns null when hero is missing', () => {
  expect(getField(null, 'name')).toBeNull()
})

test('getField — returns null when path is missing', () => {
  expect(getField(hero, '')).toBeNull()
})

test('getField — returns null when nested value is missing', () => {
  expect(getField(hero, 'biography.publisher.name')).toBeNull()
})

test('getField — returns null for placeholder, empty, or null values', () => {
  expect(getField(hero, 'biography.placeOfBirth')).toBeNull()
  expect(getField({ name: '' }, 'name')).toBeNull()
  expect(getField({ name: null }, 'name')).toBeNull()
})

test('getField — preserves valid falsy numeric values', () => {
  expect(getField({ powerstats: { speed: 0 } }, 'powerstats.speed')).toBe(0)
})

// getHeightMetric
test('getHeightMetric — returns metric height string', () => {
  expect(getHeightMetric(hero)).toBe('188 cm')
})

test('getHeightMetric — returns null when height is missing or placeholder', () => {
  expect(getHeightMetric({ appearance: {} })).toBeNull()
  expect(getHeightMetric({ appearance: { height: ['-', '0 cm'] } })).toBeNull()
  expect(getHeightMetric(null)).toBeNull()
})

// getWeightMetric
test('getWeightMetric — returns metric weight string', () => {
  expect(getWeightMetric(hero)).toBe('95 kg')
})

test('getWeightMetric — returns null when weight is missing or placeholder', () => {
  expect(getWeightMetric({ appearance: {} })).toBeNull()
  expect(getWeightMetric({ appearance: { weight: ['-', '0 kg'] } })).toBeNull()
  expect(getWeightMetric(null)).toBeNull()
})

// parseMetricNumber
test('parseMetricNumber — extracts leading number from metric string', () => {
  expect(parseMetricNumber('188 cm')).toBe(188)
})

test('parseMetricNumber — returns null for missing, placeholder, or zero metric values', () => {
  expect(parseMetricNumber(null)).toBeNull()
  expect(parseMetricNumber('-')).toBeNull()
  expect(parseMetricNumber('')).toBeNull()
  expect(parseMetricNumber('0 cm')).toBeNull()
})

// debounce
test('debounce — delays function until timeout expires', () => {
  vi.useFakeTimers()
  const fn = vi.fn()
  const debounced = debounce(fn, 200)

  debounced('Batman')

  expect(fn).not.toHaveBeenCalled()
  vi.advanceTimersByTime(199)
  expect(fn).not.toHaveBeenCalled()
  vi.advanceTimersByTime(1)
  expect(fn).toHaveBeenCalledWith('Batman')
})

test('debounce — clears previous timeout and uses latest call arguments', () => {
  vi.useFakeTimers()
  const fn = vi.fn()
  const debounced = debounce(fn, 200)

  debounced('Batman')
  vi.advanceTimersByTime(100)
  debounced('Superman')
  vi.advanceTimersByTime(200)

  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith('Superman')
})

// fetchHeroes
test('fetchHeroes — returns fetched heroes and reuses cached response', async () => {
  vi.resetModules()
  const heroes = [{ id: 1, name: 'Batman' }]
  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue(heroes),
  })
  vi.stubGlobal('fetch', fetch)
  const { fetchHeroes } = await import('../src/data.js')

  await expect(fetchHeroes()).resolves.toBe(heroes)
  await expect(fetchHeroes()).resolves.toBe(heroes)

  expect(fetch).toHaveBeenCalledTimes(1)
})

test('fetchHeroes — returns null when response is not ok', async () => {
  vi.resetModules()
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
  const { fetchHeroes } = await import('../src/data.js')

  await expect(fetchHeroes()).resolves.toBeNull()
})

test('fetchHeroes — returns null when fetch rejects', async () => {
  vi.resetModules()
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
  const { fetchHeroes } = await import('../src/data.js')

  await expect(fetchHeroes()).resolves.toBeNull()
})
