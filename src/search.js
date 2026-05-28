import { getField, getHeightMetric, getWeightMetric, parseMetricNumber } from './data.js'

// Centralises the "missing" check so the API quirks ("-" and "") never leak
// into the rest of the file. Every operator below uses this — keeping the rule
// in one place means future API changes only require one edit.
function isMissing(value) {
  return value === null || value === '-' || value === ''
}

// Subsequence match — every character of `pattern` must appear inside `str`
// in the same order, but not necessarily consecutively. Lets users type
// "~bmn" and still match "Batman" when they don't remember exact spelling.
function fuzzyMatch(pattern, str) {
  let i = 0
  for (const char of pattern) {
    i = str.indexOf(char, i)
    if (i === -1) return false
    i++
  }
  return true
}

// Numeric operators need numbers, not strings. Height and weight are stored
// as arrays like ["6'8", "203 cm"], so we route them through the dedicated
// metric helpers before parsing; everything else passes through getField.
function getNumericValue(hero, field) {
  if (field === 'appearance.height') return parseMetricNumber(getHeightMetric(hero))
  if (field === 'appearance.weight') return parseMetricNumber(getWeightMetric(hero))
  return getField(hero, field)
}

// Returns a (hero) => boolean filter function, or null when the query is empty.
// Returning null lets callers (filterHeroes) short-circuit instead of running
// a no-op filter over hundreds of heroes on every keystroke.
//
// Operator order below is deliberate: "!=" must be checked before "!" and "="
// because startsWith would otherwise match the prefix and produce wrong results.
export function parseQuery(query, field) {
  if (!query || !query.trim()) return null

  if (query.startsWith('!=')) {
    const n = parseFloat(query.slice(2))
    return (hero) => {
      const value = getNumericValue(hero, field)
      if (value === null) return false
      return value !== n
    }
  }

  if (query.startsWith('>')) {
    const n = parseFloat(query.slice(1))
    return (hero) => {
      const value = getNumericValue(hero, field)
      if (value === null) return false
      return value > n
    }
  }

  if (query.startsWith('<')) {
    const n = parseFloat(query.slice(1))
    return (hero) => {
      const value = getNumericValue(hero, field)
      if (value === null) return false
      return value < n
    }
  }

  if (query.startsWith('=')) {
    const n = parseFloat(query.slice(1))
    return (hero) => {
      const value = getNumericValue(hero, field)
      if (value === null) return false
      return value === n
    }
  }

  // Fuzzy search lowercases on both sides so users don't have to match the
  // API's casing. Missing values must return false — they can't possibly match.
  if (query.startsWith('~')) {
    const pattern = query.slice(1).toLowerCase()
    return (hero) => {
      const value = getField(hero, field)
      if (isMissing(value)) return false
      return fuzzyMatch(pattern, String(value).toLowerCase())
    }
  }

  // Exclude: the second startsWith guard is belt-and-suspenders. The "!="
  // branch above already returned, so we can't reach here with "!=", but the
  // explicit check makes the intent obvious to anyone reading the code.
  if (query.startsWith('!') && !query.startsWith('!=')) {
    const term = query.slice(1)
    return (hero) => {
      const value = getField(hero, field)
      if (isMissing(value)) return false
      return !String(value).toLowerCase().includes(term.toLowerCase())
    }
  }

  // Default include operator. Missing values always return false — the spec
  // requires that "-" and "" never appear to match anything, since they
  // represent unknown data, not real values.
  return (hero) => {
    const value = getField(hero, field)
    if (isMissing(value)) return false
    return String(value).toLowerCase().includes(query.toLowerCase())
  }
}

// Treats a null filter as "no filter, show everything" so callers don't have
// to guard each call site. Keeps the caller-side code (state.js) symmetric:
// always call filterHeroes regardless of whether a query was typed.
export function filterHeroes(heroes, filterFn) {
  if (filterFn === null) return heroes
  return heroes.filter(filterFn)
}
