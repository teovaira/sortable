import { expect, test } from 'vitest'
import { filterHeroes } from '../src/search.js'

const batman = { id: 1, name: 'Batman' }
const thor = { id: 2, name: 'Thor' }
const heroes = [batman, thor]

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
