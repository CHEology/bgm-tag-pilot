import { normalizeTag } from '../utils/tags.js';

export function createRuleContext({ subject, existingTags, settings }) {
  const existing = new Set((existingTags ?? []).map(normalizeTag));

  return {
    subject,
    existingTags: existingTags ?? [],
    settings,
    hasExistingTag(tag) {
      return existing.has(normalizeTag(tag));
    },
    isRuleEnabled(ruleId) {
      return settings?.rules?.[ruleId] !== false;
    },
  };
}
