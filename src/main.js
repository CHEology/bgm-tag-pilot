import { DEFAULT_CONFIG } from './config.js';
import { runBasicRules } from './rules/basicRules.js';
import { createRuleContext } from './rules/ruleEngine.js';
import { createTagPanel } from './ui/tagPanel.js';
import { injectStyles } from './ui/styles.js';
import { detectSubjectPage, isSubjectPath, readSubjectPage } from './dom/subjectPage.js';
import {
  detectCollectionEditor,
  findEditorObserverRoot,
  insertTagsIntoEditor,
  readCollectionEditor,
} from './dom/collectionEditor.js';
import { loadSettings } from './storage/settingsStorage.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger(DEFAULT_CONFIG.logPrefix);

export function isLikelyBangumiHost(hostname) {
  return ['bgm.tv', 'bangumi.tv', 'chii.in'].some((host) => hostname === host || hostname.endsWith(`.${host}`));
}

export function initializeTagPilot(root = document) {
  if (!isLikelyBangumiHost(window.location.hostname)) {
    logger.debug('Skipping initialization outside Bangumi host.');
    return { mounted: false, observing: false };
  }

  if (!isSubjectPath(window.location.pathname) || !detectSubjectPage(root)) {
    logger.debug('Skipping initialization outside Bangumi subject page.');
    return { mounted: false, observing: false };
  }

  const mountState = createMountState(root);

  if (tryMountTagPilot(mountState)) {
    return { mounted: mountState.mounted, observing: false };
  }

  const observer = observeCollectionEditor(root, () => {
    if (tryMountTagPilot(mountState)) {
      observer.disconnect();
    }
  });

  return { mounted: mountState.mounted, observing: Boolean(observer), observer };
}

function createMountState(root) {
  return {
    root,
    mounted: false,
    subject: readSubjectPage(root),
  };
}

function tryMountTagPilot(state) {
  if (state.mounted || !detectCollectionEditor(state.root)) {
    return state.mounted;
  }

  const editor = readCollectionEditor(state.root);
  if (!editor?.tagInput || !editor.panelMount) {
    state.mounted = true;
    logger.debug('Visible tag input found, but no reliable mount point exists.');
    return true;
  }

  const settings = loadSettings();
  const context = createRuleContext({
    subject: state.subject,
    existingTags: editor.existingTags,
    settings,
  });
  const suggestions = runBasicRules(context).slice(0, DEFAULT_CONFIG.maxSuggestions);

  injectStyles(state.root);
  createTagPanel({
    mount: editor.panelMount,
    suggestions,
    onInsert: (selectedTags) => {
      insertTagsIntoEditor(editor, selectedTags);
    },
  });

  state.mounted = true;
  logger.debug('TagPilot mounted for subject collection editor.');
  return true;
}

function observeCollectionEditor(root, onEditorReady) {
  if (typeof window.MutationObserver !== 'function') {
    logger.debug('MutationObserver is not available.');
    return null;
  }

  const observerRoot = findEditorObserverRoot(root);
  if (!observerRoot) {
    logger.debug('No observer root found for collection editor.');
    return null;
  }

  const observer = new window.MutationObserver(() => {
    onEditorReady();
  });

  observer.observe(observerRoot, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden'],
  });

  logger.debug('Waiting for Bangumi collection tag editor.');
  return observer;
}

function autoStart() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeTagPilot(document), { once: true });
  } else {
    initializeTagPilot(document);
  }
}

if (
  typeof window !== 'undefined'
  && typeof document !== 'undefined'
  && !window.__TAGPILOT_DISABLE_AUTO_START__
) {
  autoStart();
}
