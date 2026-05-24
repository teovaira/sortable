import { expect, test } from 'vitest'
import { filterHeroes, parseQuery } from '../src/search.js'

const batman = { id: 1, name: 'Batman' }
const thor = { id: 2, name: 'Thor' }
const heroes = [batman, thor]

// parseQuery — empty
test('parseQuery — empty string returns null', () => {
  expect(parseQuery('', 'name')).toBeNull()
})

test('parseQuery — whitespace-only returns null', () => {
  expect(parseQuery('  ', 'name')).toBeNull()
})

// parseQuery — include (default operator)
test('parseQuery include — matches hero whose name contains query', () => {
  const fn = parseQuery('man', 'name')
  expect(fn({ name: 'Batman' })).toBe(true)
})

test('parseQuery include — no match when name does not contain query', () => {
  const fn = parseQuery('man', 'name')
  expect(fn({ name: 'Thor' })).toBe(false)
})

test('parseQuery include — case-insensitive', () => {
  const fn = parseQuery('MAN', 'name')
  expect(fn({ name: 'batman' })).toBe(true)
})

test('parseQuery include — returns false when field value is null', () => {
  const fn = parseQuery('man', 'name')
  expect(fn({ name: null })).toBe(false)
})

test('parseQuery include — returns false when field value is "-"', () => {
  const fn = parseQuery('man', 'biography.placeOfBirth')
  expect(fn({ biography: { placeOfBirth: '-' } })).toBe(false)
})

test('parseQuery include — returns false when field value is ""', () => {
  const fn = parseQuery('man', 'biography.fullName')
  expect(fn({ biography: { fullName: '' } })).toBe(false)
})

// parseQuery — exclude operator
test('parseQuery exclude — filters out hero whose name contains query', () => {
  const fn = parseQuery('!man', 'name')
  expect(fn({ name: 'Batman' })).toBe(false)
})

test('parseQuery exclude — passes hero whose name does not contain query', () => {
  const fn = parseQuery('!man', 'name')
  expect(fn({ name: 'Thor' })).toBe(true)
})

test('parseQuery exclude — returns false when field value is null', () => {
  const fn = parseQuery('!man', 'name')
  expect(fn({ name: null })).toBe(false)
})

// filterHeroes
test('filterHeroes — null filterFn returns full array unchanged', () => {
  expect(filterHeroes(heroes, null)).toBe(heroes)
})

test('filterHeroes — empty array returns empty array', () => {
  expect(filterHeroes([], fn => true)).toEqual([])
})

test('filterHeroes — returns only heroes where fn returns true', () => {
  const fn = hero => hero.name === 'Batman'
  expect(filterHeroes(heroes, fn)).toEqual([batman])
})
