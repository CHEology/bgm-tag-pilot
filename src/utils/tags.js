export function normalizeTag(tag) {
  return String(tag ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

export function hasWhitespace(tag) {
  return /\s/.test(String(tag ?? ''));
}

export function isSafeSingleTokenTag(tag) {
  const text = String(tag ?? '').trim();

  if (!text || text.length > 32 || hasWhitespace(text)) {
    return false;
  }

  if (/^\d+$/.test(text) || /^\(\d+\)$/.test(text)) {
    return false;
  }

  return !new Set(['更多', 'more', '全部', '搜索', '标签搜索']).has(text.toLowerCase());
}

export function parseTagInput(value) {
  return String(value ?? '')
    .split(/\s+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function serializeTags(tags) {
  return tags.join(' ');
}

export function mergeTags(existingTags, tagsToInsert) {
  const seen = new Set();
  const merged = [];

  for (const tag of [...existingTags, ...tagsToInsert]) {
    const normalized = normalizeTag(tag);
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    merged.push(String(tag).trim());
  }

  return merged;
}

export function uniqueTags(items, getKey) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    const key = getKey(item);
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(item);
  }

  return result;
}
