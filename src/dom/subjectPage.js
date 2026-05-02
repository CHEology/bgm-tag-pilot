import { SELECTORS } from './selectors.js';
import { isSafeSingleTokenTag, normalizeTag, uniqueTags } from '../utils/tags.js';

export function detectSubjectPage(root) {
  return isSubjectPath(window.location.pathname);
}

export function isSubjectPath(pathname) {
  return /^\/subject\/\d+\/?$/.test(pathname);
}

export function readSubjectPage(root) {
  return {
    title: readText(root, SELECTORS.subject.title),
    type: detectSubjectType(root),
    infoText: readText(root, SELECTORS.subject.infoBox),
    publicTags: readPublicTags(root),
  };
}

export function isSubjectTagLink(node) {
  const href = node.getAttribute('href') ?? '';
  return /\/(?:anime|book|music|game|real)?\/?tag\//.test(href);
}

export function isElementVisible(element) {
  if (!element || element.hidden || !element.isConnected) {
    return false;
  }

  let current = element;
  while (current && current.nodeType === Node.ELEMENT_NODE) {
    if (current.hidden) {
      return false;
    }

    const style = window.getComputedStyle?.(current);
    if (style?.display === 'none' || style?.visibility === 'hidden' || style?.visibility === 'collapse') {
      return false;
    }

    current = current.parentElement;
  }

  return true;
}

function readText(root, selector) {
  return root.querySelector(selector)?.textContent?.trim() ?? '';
}

function readPublicTags(root) {
  const tags = Array.from(root.querySelectorAll(SELECTORS.subject.publicTags))
    .filter(isSubjectTagLink)
    .filter(isElementVisible)
    .map((node) => extractTagText(node))
    .filter(isSafeSingleTokenTag);

  return uniqueTags(tags, normalizeTag);
}

function extractTagText(node) {
  return (node.textContent ?? '').replace(/\s*\d+$/, '').trim();
}

function detectSubjectType(root) {
  const bodyClass = root.body?.className ?? '';
  const path = window.location.pathname;

  // TODO: Verify these heuristics against logged-in Bangumi subject pages.
  if (bodyClass.includes('subject_anime') || path.includes('/anime/')) return 'anime';
  if (bodyClass.includes('subject_book') || path.includes('/book/')) return 'book';
  if (bodyClass.includes('subject_music') || path.includes('/music/')) return 'music';
  if (bodyClass.includes('subject_game') || path.includes('/game/')) return 'game';
  if (bodyClass.includes('subject_real') || path.includes('/real/')) return 'real';

  return null;
}
