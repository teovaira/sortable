# Contributing

## Who owns what

| Files | Owner |
|---|---|
| `src/data.js`, `tests/data.test.js`, `index.html`, `src/style.css`, `src/pop-up.js` | Christoforos |
| `src/state.js`, `src/table.js`, `src/app.js`, `tests/state.test.js`, `tests/table.test.js` | Stavros |
| `src/search.js`, `src/modal.js`, `tests/search.test.js`, `tests/modal.test.js`, `docs/`, `package.json`, `vitest.config.js` | Theodore |

Nobody edits another person's files without agreement.

## Branches

Work on your own branch: `dev-<yourname>`. Open a pull request into `main` when your work is ready for review.

## Workflow

```
1. Write the test first — it must fail (red)
2. Write the implementation — test passes (green)
3. Commit tests and implementation separately
```

## Commit format

```
type(scope): short description

feat(search): add fuzzy operator
test(modal): add closeModal spy test
fix(data): replace parseInt with parseFloat
docs(readme): add setup instructions
```

Types: `feat`, `fix`, `test`, `docs`, `refactor`

## Running tests

```bash
npm test             # run once
npm run test:watch   # watch mode
```

All tests must pass before merging into `main`.

## Error handling rules

- Return `null` for missing or invalid values, `[]` for empty collections
- One `try/catch` in the entire project — inside `fetchHeroes` only
- No `throw` anywhere else
