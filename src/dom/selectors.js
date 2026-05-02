// Bangumi DOM selectors are intentionally centralized here.
// The live bgm.tv site exposes subject/category pages and collection controls,
// but exact editable tag selectors may vary by page state and login state.
export const SELECTORS = {
  subject: {
    title: 'h1.nameSingle a, h1.nameSingle',
    infoBox: '#infobox, .infobox',
    root: '#subject_detail, #columnSubjectHomeA, #columnSubjectBrowserA, body',
    publicTags: [
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
    tagInput: 'input[name="tags"], input#tags, textarea[name="tags"]',
    editorRoot: '#collectBox, #subjectPanelCollect, .collectModify, .collectBlock, form',
    observerRoot: '#collectBox, #subjectPanelCollect, #columnSubjectHomeB, #columnSubjectBrowserB, #subject_detail',
    fallbackMount: '#columnSubjectHomeB, #columnSubjectBrowserB, #subject_detail',
  },
};
