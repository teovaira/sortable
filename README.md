# Sortable

A vanilla JavaScript superhero data table. Search, sort, paginate, and inspect 563 heroes from the [Superhero API](https://akabab.github.io/superhero-api/).

No frameworks. No libraries. Fetch, ES modules, and the DOM.

---

## Features

- Table with 15 columns: icon, name, full name, all 6 powerstats, race, gender, height, weight, place of birth, alignment
- Live search with field selector and operators: `text`, `!exclude`, `~fuzzy`, `>`, `<`, `=`, `!=`
- Sort any column — alphabetic or numeric, missing values always last, toggles asc/desc
- Pagination: 10 / 20 / 50 / 100 / all rows per page
- Hero detail modal with large image and full stats
- URL reflects all state — search, sort, page, open hero — shareable and restorable
- Accessible modal — `role="dialog"`, keyboard focus moves to the close button on open, Escape to close

## Getting started

```bash
git clone https://platform.zone01.gr/git/tvairakt/sortable.git
cd sortable
npm install
```

Run the tests:

```bash
npm test            # run once
npm run test:watch  # re-run on file save
```

Run the app — open `index.html` in a browser. No build step required.

Because the app uses ES modules, some browsers block `file://` URLs. If `index.html` loads but stays blank, serve the folder over HTTP:

```bash
npx serve .
# then open http://localhost:3000
```

## Project structure

```
sortable/
├── index.html
├── src/
│   ├── app.js            — boot, event wiring
│   ├── data.js           — fetch, cache, field helpers
│   ├── state.js          — single source of truth, sort/filter/pagination
│   ├── table.js          — DOM rendering
│   ├── search.js         — query parsing and filtering
│   ├── modal.js          — hero detail view
│   ├── pop-up.js         — comic click effect
│   └── style.css
├── tests/
│   ├── data.test.js
│   ├── state.test.js
│   ├── table.test.js
│   ├── search.test.js
│   └── modal.test.js
├── .gitignore
├── package.json
├── package-lock.json
├── vitest.config.js
├── CHANGELOG.md
├── CONTRIBUTING.md
└── LICENSE.md
```

## Team

- **Theodore Vairaktaris** — search, modal, tests, docs
- **Stavros Gkraikas** — state, table, app, tests
- **Christoforos Kotsalas** — data, HTML, CSS, pop-up, tests
