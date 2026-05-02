# Bangumi TagPilot Specification

Chinese display name: Bangumi 智能标签助手

## Product Goals

- Help Bangumi users add consistent collection tags with less manual typing.
- Stay within browser-script / Bangumi SuperAlloy component scope.
- Suggest tags from visible page context and simple transparent rules.
- Keep all changes user-driven and reversible before Bangumi's own save action.
- Preserve existing collection tags by default.

## Non-Goals

- No backend service.
- No cloud app.
- No external AI service or AI API.
- No automatic collection manager.
- No automatic network mutation.
- No login, token, OAuth, or credential handling.
- No batch apply in MVP.
- No replacement for Bangumi's existing collection editor.

## Safety Rules

- Never automatically save, PATCH, POST, overwrite, or otherwise mutate a Bangumi collection.
- Never remove or rewrite an existing user tag.
- Only insert selected suggestions into the existing tag input.
- Keep every rule understandable by reading local source code.
- Keep future rule toggles simple and local.
- Treat Bangumi DOM selectors as fragile and isolate them in `src/dom/selectors.js`.

## MVP Behavior

1. Detect a likely Bangumi host such as `bgm.tv`.
2. Run only on `/subject/{id}` pages.
3. Read visible subject metadata from the page when available.
4. Read the current tag input value without changing it once a visible editor exists.
5. Generate preview suggestions from local rules.
6. Render a compact suggestion panel.
7. Let the user select suggestions.
8. Insert selected suggestions into the existing tag input only after a user action.
9. Leave Bangumi's normal save/update button untouched.

If the collection editor is not visible at page load, TagPilot watches the likely editor area with a lightweight `MutationObserver` and mounts once when the tag input appears.

## Suggested Tag Sources

- Subject category, matching Bangumi's public top-level areas such as 动画, 书籍, 音乐, 游戏, and 三次元.
- Visible subject title and aliases.
- Visible infobox fields.
- Existing user tags in the collection editor.
- Public tag links already rendered on the subject page.

For v0.1, suggested tags containing whitespace are skipped because Bangumi collection tags are whitespace-separated.

## Basic Rule Examples

- If the subject category is animation, suggest `动画`.
- If the subject category is game, suggest `游戏`.
- If an infobox or visible metadata contains a platform keyword, suggest a normalized platform tag.
- If a public subject tag is already prominent and absent from the user's current tags, suggest it as a candidate.
- If a suggestion already exists in the user's tags, suppress it.

These are examples only. Rule output must remain preview-only until the user manually inserts selected tags.

## User Interaction Flow

1. User opens a Bangumi subject page or collection editor.
2. TagPilot detects the editable tag field.
3. If needed, TagPilot waits for the editable tag field to appear after the user opens Bangumi's editor.
4. TagPilot displays a small suggestion panel near the field.
5. User reviews the suggested tags and their rule explanations.
6. User selects the tags they want.
7. User clicks insert.
8. TagPilot appends missing selected tags to the tag input while preserving existing tags.
9. User uses Bangumi's own interface to save or discard changes.

## Future Batch Mode

Batch mode is out of scope for MVP.

Future batch mode must be preview-first and must include:

- Explicit user opt-in.
- A scan result preview before any change.
- A backup/export of original tags.
- Per-item confirmation or a clearly limited batch confirmation.
- No hidden network mutation.
- Clear undo guidance.
- Conservative rate and scope limits.
