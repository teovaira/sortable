const API_URL = "https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json"

let heroesCache = null

// Fetches once, caches result. Returns null on failure.
export async function fetchHeroes() {
    if (heroesCache) {
        return heroesCache
    }

    try {
        const response = await fetch(API_URL)

        if (!response.ok) {
            return null
        }

        const data = await response.json()

        heroesCache = data

        return heroesCache
    } catch {
        return null
    }
}

// Gets a value by dot path. Returns null if missing, "-", or "".
// getField(hero, "biography.alignment") → "good" | null
export function getField(hero, path) {
    if (!hero || !path) {
        return null
    }
    const keys = path.split(".")
    let value = hero

    for (const key of keys) {
        if (value === null || value === undefined) {
            return null
        }

        value = value[key]
    }

    if (value === "-" || value === "" || value === undefined || value === null) {
        return null
    }

    return value
}

// Returns metric height string or null. e.g. "203 cm" | null
export function getHeightMetric(hero) {
    const height = getField(hero, "appearance.height")

    if (!Array.isArray(height)) {
        return null
    }

    const metricHeight = height[1]

    if (!metricHeight || metricHeight === "-" || metricHeight === "0 cm") {
        return null
    }

    return metricHeight
}

// Returns metric weight string or null. e.g. "441 kg" | null
export function getWeightMetric(hero) {
    const weight = getField(hero, "appearance.weight")

    if (!Array.isArray(weight)) {
        return null
    }

    const metricWeight = weight[1]

    if (!metricWeight || metricWeight === "-" || metricWeight === "0 kg") {
        return null
    }

    return metricWeight
}

// Extracts number from metric string. "203 cm" → 203, null → null, "-" → null, "0 cm" → null
export function parseMetricNumber(str) {
    if (!str || str === "-") {
        return null
    }

    const number = parseFloat(str)

    if (isNaN(number) || number === 0) {
        return null
    }

    return number
}

// Delays fn by ms. Use on search input to avoid lag.
// debounce() returns a debounced version of the function.
// The debounced function delays invoking fn until after ms milliseconds
// have elapsed since the last time the debounced function was invoked.
export function debounce(fn, ms) {
    let timeoutId

    return function (...args) {
        clearTimeout(timeoutId)

        timeoutId = setTimeout(() => {
            fn(...args)
        }, ms)
    }
}