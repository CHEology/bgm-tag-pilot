# Instructions for Future Coding Agents

- Keep this project within browser-script / Bangumi SuperAlloy component scope.
- Do not add backend services.
- Do not add external AI APIs.
- Do not implement automatic PATCH, update, save, or overwrite behavior unless explicitly requested.
- Preserve existing tags.
- Prefer small, reviewable changes.
- Keep code modular.
- Add comments around Bangumi-specific DOM selectors.
- When selectors are uncertain, isolate them in `src/dom/selectors.js`.
- Treat `dist/` as generated output.
- Do not minify during early development.
- Do not implement batch operations in MVP.
- Do not implement login, token, OAuth, or credential handling unless explicitly requested.
- Define done as: code is readable, module boundaries are clear, and no mutation behavior is implemented.
