import { SELECTORS } from './selectors.js';
import { mergeTags, parseTagInput, serializeTags } from '../utils/tags.js';
import { isElementVisible } from './subjectPage.js';

export function detectCollectionEditor(root) {
  return Boolean(findVisibleTagInput(root));
}

export function readCollectionEditor(root) {
  const tagInput = findVisibleTagInput(root);
  const editorRoot = tagInput?.closest(SELECTORS.collectionEditor.editorRoot) ?? null;
  const panelMount = tagInput ? findOrCreatePanelMount(tagInput) : editorRoot ?? root.querySelector(SELECTORS.collectionEditor.fallbackMount);

  return {
    tagInput,
    editorRoot,
    panelMount,
    existingTags: parseTagInput(tagInput?.value ?? ''),
  };
}

export function findVisibleTagInput(root) {
  return Array.from(root.querySelectorAll(SELECTORS.collectionEditor.tagInput))
    .find((input) => isVisibleEditableInput(input) && isLikelyTagInput(input)) ?? null;
}

export function findEditorObserverRoot(root) {
  return root.body
    ?? queryFirstByPriority(root, SELECTORS.collectionEditor.observerRoot)
    ?? queryFirstByPriority(root, SELECTORS.subject.root)
    ?? null;
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

function findOrCreatePanelMount(tagInput) {
  const existing = Array.from(tagInput.parentElement?.children ?? [])
    .find((child) => child.classList.contains('tagpilot-mount'));
  if (existing) {
    return existing;
  }

  const mount = document.createElement('div');
  mount.className = 'tagpilot-mount';
  tagInput.insertAdjacentElement('afterend', mount);
  return mount;
}

function isVisibleEditableInput(input) {
  return isElementVisible(input)
    && !input.disabled
    && input.getAttribute('type') !== 'hidden'
    && input.getAttribute('type') !== 'search';
}

function isLikelyTagInput(input) {
  if (input.matches(SELECTORS.collectionEditor.explicitTagInput)) {
    return true;
  }

  const accessibleText = [
    input.getAttribute('name'),
    input.id,
    input.getAttribute('placeholder'),
    input.getAttribute('aria-label'),
  ].filter(Boolean).join(' ');

  if (/tag|标签/i.test(accessibleText)) {
    return true;
  }

  const context = input.closest(SELECTORS.collectionEditor.editorRoot) ?? input.parentElement;
  const contextText = (context?.textContent ?? '').replace(/\s+/g, ' ');

  return /标签/.test(contextText)
    && (/常用标签|我的标签|使用半角空格|逗号隔开|至多10个/.test(contextText));
}
