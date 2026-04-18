// ===== Alien Translation =====

import { ALIEN_SYMBOLS } from './alien-symbols.js';
import { EMOJI_TAGS } from './emoji-tags.js';

export { ALIEN_SYMBOLS, EMOJI_TAGS };

// ===== Global tag frequency (for filtering common tags) =====
const TAG_GLOBAL_FREQ = new Map();
for (const [, tags] of EMOJI_TAGS) {
  for (const tag of tags) {
    if (tag.startsWith('!')) continue;
    TAG_GLOBAL_FREQ.set(tag, (TAG_GLOBAL_FREQ.get(tag) || 0) + 1);
  }
}
const COMMON_TAG_THRESHOLD = EMOJI_TAGS.size * 0.4;

/** Translate a single emoji to its tags.
 *  Returns array of { symbol, label, negated }. */
export function translateOne(emoji) {
  const tags = EMOJI_TAGS.get(emoji);
  if (!tags) return [];

  const result = [];
  for (const tag of tags) {
    const negated = tag.startsWith('!');
    const baseTag = negated ? tag.slice(1) : tag;
    const symbol = ALIEN_SYMBOLS.get(baseTag);
    if (!symbol) continue;
    result.push({ symbol, label: baseTag, negated });
  }
  return result;
}

/** Translate multiple emojis — flat unique list.
 *  Returns array of { symbol, label, negated }. */
export function translate(humanEmojis) {
  const seen = new Set();
  const result = [];

  for (const emoji of humanEmojis) {
    for (const word of translateOne(emoji)) {
      const key = (word.negated ? '!' : '') + word.label;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(word);
    }
  }

  return result;
}

/** Merge tags from multiple emojis: remove conflicting pairs (tag vs !tag),
 *  sort by frequency (how many emojis share that tag).
 *  Returns array of { symbol, label, negated, count }. */
export function mergeTranslations(humanEmojis) {
  const positives = new Map(); // label → count
  const negatives = new Map(); // label → count

  for (const emoji of humanEmojis) {
    const tags = EMOJI_TAGS.get(emoji);
    if (!tags) continue;

    for (const tag of tags) {
      const negated = tag.startsWith('!');
      const baseTag = negated ? tag.slice(1) : tag;
      const map = negated ? negatives : positives;
      map.set(baseTag, (map.get(baseTag) || 0) + 1);
    }
  }

  const result = [];

  // Only include tags that don't conflict (no opposite present)
  // Only show tags present in ALL selected items
  const total = humanEmojis.length;
  for (const [label, count] of positives) {
    if (negatives.has(label)) continue;
    if (count < total) continue;
    const symbol = ALIEN_SYMBOLS.get(label);
    if (!symbol) continue;
    result.push({ symbol, label, negated: false, count });
  }

  for (const [label, count] of negatives) {
    if (positives.has(label)) continue;
    if (count < total) continue;
    const symbol = ALIEN_SYMBOLS.get(label);
    if (!symbol) continue;
    result.push({ symbol, label, negated: true, count });
  }

  // Sort by count descending (most shared first)
  result.sort((a, b) => b.count - a.count);

  return result;
}
