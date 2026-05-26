import { setActiveHero } from './state.js'

function display(value) {
  if (value === null || value === undefined || value === '-' || value === '') return '—'
  return value
}

export function openModal(hero) {
  const modal = document.getElementById('modal')
  const content = document.getElementById('modalContent')

  modal.classList.remove('closing')

  content.innerHTML = `
  <article class="hero-profile">
    <div class="hero-profile-header">
      <img class="hero-profile-image" src="${display(hero.images.lg)}" alt="${display(hero.name)}" />

      <div class="hero-profile-main">
        <p class="comic-label">Hero File</p>
        <h2>${display(hero.name)}</h2>
        <p class="hero-full-name">${display(hero.biography.fullName)}</p>
        <span class="alignment-badge">${display(hero.biography.alignment)}</span>
      </div>
    </div>

    <section class="hero-info-grid">
      <div class="hero-info-card">
        <span>Race</span>
        <strong>${display(hero.appearance.race)}</strong>
      </div>

      <div class="hero-info-card">
        <span>Gender</span>
        <strong>${display(hero.appearance.gender)}</strong>
      </div>

      <div class="hero-info-card">
        <span>Height</span>
        <strong>${display(hero.appearance.height?.[1])}</strong>
      </div>

      <div class="hero-info-card">
        <span>Weight</span>
        <strong>${display(hero.appearance.weight?.[1])}</strong>
      </div>

      <div class="hero-info-card wide">
        <span>Place of Birth</span>
        <strong>${display(hero.biography.placeOfBirth)}</strong>
      </div>
    </section>

    <section class="powerstats">
      <h3>Powerstats</h3>

      <div class="stat-row">
        <span>Intelligence</span>
        <strong>${display(hero.powerstats.intelligence)}</strong>
      </div>

      <div class="stat-row">
        <span>Strength</span>
        <strong>${display(hero.powerstats.strength)}</strong>
      </div>

      <div class="stat-row">
        <span>Speed</span>
        <strong>${display(hero.powerstats.speed)}</strong>
      </div>

      <div class="stat-row">
        <span>Durability</span>
        <strong>${display(hero.powerstats.durability)}</strong>
      </div>

      <div class="stat-row">
        <span>Power</span>
        <strong>${display(hero.powerstats.power)}</strong>
      </div>

      <div class="stat-row">
        <span>Combat</span>
        <strong>${display(hero.powerstats.combat)}</strong>
      </div>
    </section>
  </article>
`

  modal.classList.add('open')
}

export function closeModal() {
  const modal = document.getElementById('modal')
  const content = document.getElementById('modalContent')

  if (!modal.classList.contains('open')) return

  setActiveHero(null)
  modal.classList.add('closing')

  setTimeout(() => {
    modal.classList.remove('open')
    modal.classList.remove('closing')
    content.innerHTML = ''
  }, 180)
}
