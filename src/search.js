import { getField } from './data.js'

function isMissing(value) {
  return value === null || value === '-' || value === ''
}

export function parseQuery(query, field) {
  if (!query || !query.trim()) return null

  if (query.startsWith('!') && !query.startsWith('!=')) {
    const term = query.slice(1)
    return (hero) => {
      const value = getField(hero, field)
      if (isMissing(value)) return false
      return !String(value).toLowerCase().includes(term.toLowerCase())
    }
  }

  return (hero) => {
    const value = getField(hero, field)
    if (isMissing(value)) return false
    return String(value).toLowerCase().includes(query.toLowerCase())
  }
}

export function filterHeroes(heroes, filterFn) {
  if (filterFn === null) return heroes
  return heroes.filter(filterFn)
}
