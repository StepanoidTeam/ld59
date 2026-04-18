// ===== Card Generation =====

import { BASE_EMOJIS } from './emojis.js';

const DECK_SIZE = 25; // 5×5 grid of cards

/** Fisher–Yates shuffle (returns new array) */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Generate a deck — pick DECK_SIZE unique emojis, one per card */
export function generateDeck(count = DECK_SIZE) {
  const shuffled = shuffle(BASE_EMOJIS);
  return shuffled.slice(0, count);
}
