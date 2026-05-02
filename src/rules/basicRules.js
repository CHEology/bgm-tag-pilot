import { isSafeSingleTokenTag, normalizeTag, uniqueTags } from '../utils/tags.js';

const SUBJECT_TYPE_TAGS = {
  anime: '动画',
  book: '书籍',
  music: '音乐',
  game: '游戏',
  real: '三次元',
};

export function runBasicRules(context) {
  const suggestions = [];

  if (context.isRuleEnabled('subjectType') && context.subject?.type) {
    const tag = SUBJECT_TYPE_TAGS[context.subject.type];
    if (tag) {
      suggestions.push({
        tag,
        ruleId: 'subjectType',
        label: '条目类型',
        reason: `条目类型建议 "${tag}"。`,
      });
    }
  }

  if (context.isRuleEnabled('publicTags')) {
    for (const tag of context.subject?.publicTags ?? []) {
      suggestions.push({
        tag,
        ruleId: 'publicTags',
        label: '页面标签',
        reason: 'Bangumi 条目页上可见的标签。',
      });
    }
  }

  return uniqueTags(suggestions, (suggestion) => normalizeTag(suggestion.tag))
    .filter((suggestion) => isSafeSingleTokenTag(suggestion.tag))
    .filter((suggestion) => !context.hasExistingTag(suggestion.tag));
}
