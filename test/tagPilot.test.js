import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { runBasicRules } from '../src/rules/basicRules.js';
import { createRuleContext } from '../src/rules/ruleEngine.js';
import { readSubjectPage } from '../src/dom/subjectPage.js';
import { insertTagsIntoEditor, readCollectionEditor } from '../src/dom/collectionEditor.js';
import { mergeTags, parseTagInput } from '../src/utils/tags.js';

beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  window.__TAGPILOT_DISABLE_AUTO_START__ = true;
  window.localStorage.clear();
  document.head.innerHTML = '';
  document.body.className = '';
  document.body.innerHTML = '';
  window.history.pushState({}, '', 'https://bgm.tv/');
});

describe('Bangumi TagPilot initializer', () => {
  it('runs only on /subject/{id} paths', async () => {
    document.body.innerHTML = '<h1 class="nameSingle">Title</h1><input name="tags" value="">';
    window.history.pushState({}, '', 'https://bgm.tv/anime/browser');

    const { initializeTagPilot } = await import('../src/main.js');
    const state = initializeTagPilot(document);

    expect(state.mounted).toBe(false);
    expect(state.observing).toBe(false);
    expect(document.querySelector('.tagpilot-panel')).toBeNull();
  });

  it('waits for a visible collection tag input, mounts once, and disconnects the observer', async () => {
    document.body.innerHTML = `
      <h1 class="nameSingle">Subject Title</h1>
      <div id="subject_detail">
        <a href="/anime/tag/TV">TV 10</a>
        <a href="/anime/tag/恋爱">恋爱 20</a>
      </div>
      <div id="columnSubjectHomeB"></div>
    `;
    window.history.pushState({}, '', 'https://bgm.tv/subject/12345');

    const { initializeTagPilot } = await import('../src/main.js');
    const state = initializeTagPilot(document);
    const disconnectSpy = vi.spyOn(state.observer, 'disconnect');

    expect(state.mounted).toBe(false);
    expect(state.observing).toBe(true);

    document.querySelector('#columnSubjectHomeB').innerHTML = '<form><input name="tags" value="TV"></form>';
    await Promise.resolve();
    await Promise.resolve();

    expect(document.querySelectorAll('.tagpilot-panel')).toHaveLength(1);
    expect(document.querySelector('.tagpilot-panel').textContent).toContain('恋爱');
    expect(disconnectSpy).toHaveBeenCalledTimes(1);

    document.querySelector('#columnSubjectHomeB form').append(document.createElement('input'));
    await Promise.resolve();

    expect(document.querySelectorAll('.tagpilot-panel')).toHaveLength(1);
  });
});

describe('tag parsing and insertion', () => {
  it('preserves existing tokens and appends only missing selected tags', () => {
    expect(parseTagInput('TV  恋爱')).toEqual(['TV', '恋爱']);
    expect(mergeTags(['TV', '恋爱'], ['TV', '校园'])).toEqual(['TV', '恋爱', '校园']);
  });

  it('inserts tags without submitting or making network requests', () => {
    document.body.innerHTML = '<form id="collectBox"><input name="tags" value="TV"></form>';
    const editor = readCollectionEditor(document);
    const submitSpy = vi.spyOn(document.querySelector('form'), 'submit').mockImplementation(() => {});
    const fetchSpy = vi.fn();
    const xhrSpy = vi.fn();

    vi.stubGlobal('fetch', fetchSpy);
    vi.stubGlobal('XMLHttpRequest', xhrSpy);

    insertTagsIntoEditor(editor, ['恋爱', 'TV']);

    expect(editor.tagInput.value).toBe('TV 恋爱');
    expect(submitSpy).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrSpy).not.toHaveBeenCalled();
  });
});

describe('suggestions', () => {
  it('skips whitespace suggestions and suppresses ASCII duplicates case-insensitively', () => {
    const context = createRuleContext({
      subject: {
        publicTags: ['science fiction', 'TV', 'tv', '恋爱'],
      },
      existingTags: [],
      settings: { rules: { publicTags: true, subjectType: false } },
    });

    expect(runBasicRules(context).map((suggestion) => suggestion.tag)).toEqual(['TV', '恋爱']);
  });

  it('deduplicates against existing user tags', () => {
    const context = createRuleContext({
      subject: {
        publicTags: ['TV', '恋爱'],
      },
      existingTags: ['tv'],
      settings: { rules: { publicTags: true, subjectType: false } },
    });

    expect(runBasicRules(context).map((suggestion) => suggestion.tag)).toEqual(['恋爱']);
  });

  it('extracts only Bangumi tag links from the subject page', () => {
    const dom = new JSDOM(`
      <body>
        <h1 class="nameSingle">Subject</h1>
        <div id="subject_detail">
          <a href="/anime/tag/TV">TV 1028</a>
          <a href="/anime/tag/space%20opera">space opera</a>
          <a href="/subject/123">not-a-tag</a>
          <a href="/game/tag/RPG">RPG</a>
        </div>
      </body>
    `, { url: 'https://bgm.tv/subject/123' });

    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    const previousNode = globalThis.Node;

    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.Node = dom.window.Node;

    try {
      expect(readSubjectPage(dom.window.document).publicTags).toEqual(['TV', 'RPG']);
    } finally {
      globalThis.window = previousWindow;
      globalThis.document = previousDocument;
      globalThis.Node = previousNode;
    }
  });
});
