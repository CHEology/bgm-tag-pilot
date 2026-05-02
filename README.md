# Bangumi TagPilot

Bangumi TagPilot (Bangumi 智能标签助手) is a lightweight browser-script / Bangumi SuperAlloy component project for collection tag suggestions.

The MVP is intentionally local, safe, and semi-automatic. It reads information that is already visible in the browser, suggests transparent rule-based tags, and lets the user manually insert selected suggestions into the existing Bangumi tag input.

## Safety Model

- Runs entirely in the browser.
- Uses vanilla JavaScript, HTML, and CSS.
- Does not use a backend service.
- Does not use external AI APIs.
- Does not automatically save, PATCH, overwrite, or update a Bangumi collection.
- Preserves all existing user tags.
- Inserts only user-selected suggested tags into the existing tag input.
- Keeps rules transparent so they can be disabled later.

## MVP Scope

The first version targets a single Bangumi subject / collection-editing context. Based on the public Bangumi site structure, the project treats subject pages and collection controls as DOM-driven browser surfaces, not as an external web application.

The MVP should provide:

- A small tag suggestion panel near the collection editor.
- A lightweight observer that waits for Bangumi's editor if it opens after page load.
- A basic local rule engine.
- Preview-only suggestions until the user explicitly inserts selected tags.
- No API calls, login/token handling, or batch operations.

## Current Limitations

- DOM selectors are provisional and isolated in `src/dom/selectors.js`.
- No real Bangumi API integration is implemented.
- The userscript bundle is generated under `dist/`.
- No settings UI persistence beyond minimal localStorage helpers.
- Batch mode is out of scope for MVP.

## Development

```sh
npm run dev
npm run build
npm run lint
npm test
```

`npm run build` produces an unminified single-file userscript at `dist/bangumi-tagpilot.user.js`.
