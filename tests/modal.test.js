import { expect, test, beforeEach, vi } from 'vitest'
import { openModal, closeModal } from '../src/modal.js'

vi.mock('../src/state.js', () => ({
  setActiveHero: vi.fn()
}))

import { setActiveHero } from '../src/state.js'

const hero = {
  id: 1,
  name: 'Batman',
  biography: { fullName: 'Bruce Wayne', placeOfBirth: 'Gotham', alignment: 'good' },
  appearance: {
    gender: 'Male', race: 'Human',
    height: ["6'2", '188 cm'], weight: ['210 lb', '95 kg']
  },
  powerstats: { intelligence: 100, strength: 26, speed: 27, durability: 34, power: 47, combat: 100 },
  images: { lg: 'https://example.com/batman-lg.jpg' }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
  document.body.innerHTML = `
    <div id="modal">
      <div id="modalContent"></div>
      <button id="modalClose"></button>
    </div>
  `
})

test('openModal — adds class "open" to #modal', () => {
  openModal(hero)
  expect(document.getElementById('modal').classList.contains('open')).toBe(true)
})

test('openModal — renders hero name in #modalContent', () => {
  openModal(hero)
  expect(document.getElementById('modalContent').innerHTML).toContain('Batman')
})

test('openModal — renders large image with correct src', () => {
  openModal(hero)
  const img = document.getElementById('modalContent').querySelector('img')
  expect(img).not.toBeNull()
  expect(img.src).toContain('batman-lg.jpg')
})

test('openModal — renders all 6 powerstat values', () => {
  openModal(hero)
  const content = document.getElementById('modalContent').innerHTML
  expect(content).toContain('100') // intelligence
  expect(content).toContain('26')  // strength
  expect(content).toContain('27')  // speed
  expect(content).toContain('34')  // durability
  expect(content).toContain('47')  // power
})

test('openModal — renders "—" for missing fullName', () => {
  openModal({ ...hero, biography: { ...hero.biography, fullName: '-' } })
  expect(document.getElementById('modalContent').innerHTML).toContain('—')
})

test('closeModal — removes class "open" from #modal', () => {
  openModal(hero)
  closeModal()
  vi.advanceTimersByTime(180)
  expect(document.getElementById('modal').classList.contains('open')).toBe(false)
})

test('closeModal — clears #modalContent', () => {
  openModal(hero)
  closeModal()
  vi.advanceTimersByTime(180)
  expect(document.getElementById('modalContent').innerHTML).toBe('')
})

test('closeModal — calls setActiveHero(null)', () => {
  openModal(hero)
  closeModal()
  vi.advanceTimersByTime(180)
  expect(setActiveHero).toHaveBeenCalledWith(null)
})
