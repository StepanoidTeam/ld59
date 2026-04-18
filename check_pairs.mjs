import { EMOJI_TAGS } from './demo-bob/js/emoji-tags.js';

const emojis = [...EMOJI_TAGS.keys()];
const n = emojis.length;
let failCount = 0;
const failMap = new Map();

for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    const a = EMOJI_TAGS.get(emojis[i]).filter((t) => !t.startsWith('!'));
    const b = EMOJI_TAGS.get(emojis[j]).filter((t) => !t.startsWith('!'));
    const common = a.filter((t) => b.includes(t));
    if (common.length === 0) {
      failCount++;
      const key = emojis[i];
      if (!failMap.has(key)) failMap.set(key, []);
      failMap.get(key).push(emojis[j]);
      const key2 = emojis[j];
      if (!failMap.has(key2)) failMap.set(key2, []);
      failMap.get(key2).push(emojis[i]);
    }
  }
}

console.log(
  'Total pairs without common positive tag:',
  failCount,
  '/',
  (n * (n - 1)) / 2,
);
console.log('');
if (failCount > 0) {
  const sorted = [...failMap.entries()].sort(
    (a, b) => b[1].length - a[1].length,
  );
  for (const [emoji, fails] of sorted) {
    const tags = EMOJI_TAGS.get(emoji)
      .filter((t) => !t.startsWith('!'))
      .join(', ');
    console.log(
      emoji,
      '(' + tags + ') — no match with',
      fails.length,
      ':',
      fails.join(' '),
    );
  }
}
