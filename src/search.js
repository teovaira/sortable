export function parseQuery(query, field) {}

export function filterHeroes(heroes, filterFn) {
  if (filterFn === null) return heroes
  return heroes.filter(filterFn)
}
