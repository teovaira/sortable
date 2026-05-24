import { setActiveHero } from './state.js'

function display(value) {
  if (value === null || value === undefined || value === '-' || value === '') return '—'
  return value
}

export function openModal(hero) {
  const modal = document.getElementById('modal')
  const content = document.getElementById('modalContent')

  content.innerHTML = `
    <img src="${hero.images.lg}" alt="${hero.name}" />
    <h2>${hero.name}</h2>
    <p><strong>Full Name:</strong> ${display(hero.biography.fullName)}</p>
    <p><strong>Alignment:</strong> ${display(hero.biography.alignment)}</p>
    <p><strong>Place of Birth:</strong> ${display(hero.biography.placeOfBirth)}</p>
    <p><strong>Gender:</strong> ${display(hero.appearance.gender)}</p>
    <p><strong>Race:</strong> ${display(hero.appearance.race)}</p>
    <p><strong>Height:</strong> ${display(hero.appearance.height?.[1])}</p>
    <p><strong>Weight:</strong> ${display(hero.appearance.weight?.[1])}</p>
    <p><strong>Intelligence:</strong> ${display(hero.powerstats.intelligence)}</p>
    <p><strong>Strength:</strong> ${display(hero.powerstats.strength)}</p>
    <p><strong>Speed:</strong> ${display(hero.powerstats.speed)}</p>
    <p><strong>Durability:</strong> ${display(hero.powerstats.durability)}</p>
    <p><strong>Power:</strong> ${display(hero.powerstats.power)}</p>
    <p><strong>Combat:</strong> ${display(hero.powerstats.combat)}</p>
  `

  modal.classList.add('open')
}

export function closeModal() {
  const modal = document.getElementById('modal')
  const content = document.getElementById('modalContent')

  modal.classList.remove('open')
  content.innerHTML = ''
  setActiveHero(null)
}
