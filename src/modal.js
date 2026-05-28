import { setActiveHero } from './state.js'

// Replaces API "missing" placeholders with an em dash so the modal never
// shows raw "-" or empty strings. Keeps API quirks out of the visible UI.
function display(value) {
  if (value === null || value === undefined || value === '-' || value === '') return '—'
  return value
}

// Renders a hero's full detail card and reveals the modal. The hero argument
// is always trusted — app.js looks it up from state.heroes before calling,
// so we don't need defensive guards inside the template.
export function openModal(hero) {
  const modal = document.getElementById('modal')
  const content = document.getElementById('modalContent')

  // If the close animation was still running when the user clicked another
  // row, the .closing class would override the open state. Clearing it here
  // makes back-to-back opens behave predictably.
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
  // Move keyboard focus to the close button so users with screen readers
  // or keyboard navigation can dismiss the modal without tabbing through
  // the whole page first.
  document.getElementById('modalClose')?.focus()
}

// Plays the exit animation, then tears down the modal DOM after 180ms.
// We can't simply remove the "open" class — display:none would kick in
// instantly and the user would see no animation. The .closing class lets
// CSS run the exit keyframes while the modal stays visible.
export function closeModal() {
  const modal = document.getElementById('modal')
  const content = document.getElementById('modalContent')

  // Idempotent: calling closeModal() on an already-closed modal does nothing.
  // Protects against the Escape key firing while the modal is already closing.
  if (!modal.classList.contains('open')) return

  // Clear the URL hero state immediately, not inside the timeout. Otherwise
  // the URL would still show ?hero=X for 180ms after the user requested
  // close — copying the URL during the animation would carry stale state.
  setActiveHero(null)
  modal.classList.add('closing')

  setTimeout(() => {
    modal.classList.remove('open')
    modal.classList.remove('closing')
    content.innerHTML = ''
  }, 180)
}
