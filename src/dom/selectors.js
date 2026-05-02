// Bangumi DOM selectors are intentionally centralized here.
// The live bgm.tv site exposes subject/category pages and collection controls,
// but exact editable tag selectors may vary by page state and login state.
export const SELECTORS = {
  subject: {
    title: 'h1.nameSingle a, h1.nameSingle, h1, [data-subject-title]',
    infoBox: '#infobox, .infobox',
    root: '#subject_detail, #columnSubjectHomeA, #columnSubjectBrowserA, body',
    publicTags: [
      'a[href*="/anime/tag/"]',
      'a[href*="/book/tag/"]',
      'a[href*="/music/tag/"]',
      'a[href*="/game/tag/"]',
      'a[href*="/real/tag/"]',
      'a[href*="/tag/"]',
      '#subject_detail a[href*="/tag/"]',
      '#subject_detail a[href*="/anime/tag/"]',
      '#subject_detail a[href*="/book/tag/"]',
      '#subject_detail a[href*="/music/tag/"]',
      '#subject_detail a[href*="/game/tag/"]',
      '#subject_detail a[href*="/real/tag/"]',
      '.subject_tag_section a[href*="/tag/"]',
    ].join(', '),
    typeFromBodyClass: 'body',
  },
  collectionEditor: {
    explicitTagInput: 'input[name="tags"], input#tags, textarea[name="tags"]',
    tagInput: [
      'input[name="tags"]',
      'input#tags',
      'textarea[name="tags"]',
      'input[placeholder*="标签"]',
      'input[aria-label*="标签"]',
      'input[type="text"]',
      'input:not([type])',
    ].join(', '),
    editorRoot: '#collectBox, #subjectPanelCollect, .collectModify, .collectBlock, [role="dialog"], form',
    observerRoot: 'body, [role="dialog"], #collectBox, #subjectPanelCollect, #columnSubjectHomeB, #columnSubjectBrowserB, #subject_detail',
    fallbackMount: '#columnSubjectHomeB, #columnSubjectBrowserB, #subject_detail, [role="dialog"]',
  },
};
