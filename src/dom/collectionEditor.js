import { SELECTORS } from './selectors.js';
import { mergeTags, parseTagInput, serializeTags } from '../utils/tags.js';
import { isElementVisible } from './subjectPage.js';

export function detectCollectionEditor(root) {
  return Boolean(findVisibleTagInput(root));
}

export function readCollectionEditor(root) {
  const tagInput = findVisibleTagInput(root);
  const editorRoot = tagInput?.closest(SELECTORS.collectionEditor.editorRoot) ?? null;
  const panelMount = editorRoot ?? root.querySelector(SELECTORS.collectionEditor.fallbackMount);

  return {
    tagInput,
    editorRoot,
    panelMount,
    existingTags: parseTagInput(tagInput?.value ?? ''),
  };
}

export function findVisibleTagInput(root) {
  return Array.from(root.querySelectorAll(SELECTORS.collectionEditor.tagInput))
    .find((input) => isElementVisible(input) && !input.disabled && input.getAttribute('type') !== 'hidden') ?? null;
}

export function findEditorObserverRoot(root) {
  return queryFirstByPriority(root, SELECTORS.collectionEditor.observerRoot)
    ?? queryFirstByPriority(root, SELECTORS.subject.root)
    ?? root.body;
}

export function insertTagsIntoEditor(editor, tagsToInsert) {
  if (!editor?.tagInput || !Array.isArray(tagsToInsert) || tagsToInsert.length === 0) {
    return;
  }

  const currentTags = parseTagInput(editor.tagInput.value);
  const nextTags = mergeTags(currentTags, tagsToInsert);

  editor.tagInput.value = serializeTags(nextTags);
  editor.tagInput.dispatchEvent(new window.Event('input', { bubbles: true }));
  editor.tagInput.dispatchEvent(new window.Event('change', { bubbles: true }));
}

function queryFirstByPriority(root, selectors) {
  return selectors
    .split(',')
    .map((selector) => root.querySelector(selector.trim()))
    .find(Boolean) ?? null;
}
