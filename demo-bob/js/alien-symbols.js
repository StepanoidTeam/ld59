// ===== Alien Dictionary (25 words) =====

// ===== Word constants =====
export const ALIVE = 'alive';
export const BIG = 'big';
export const FOOD = 'food';
export const DANGER = 'danger';
export const ROUND = 'round';
export const HARD = 'hard';
export const LIQUID = 'liquid';
export const SHARP = 'sharp';
export const HUMAN = 'human';
export const PLANT = 'plant';
export const TOOL = 'tool';
export const WEAPON = 'weapon';
export const METAL = 'metal';
export const BEAUTY = 'beauty';
export const CLOTH = 'cloth';
export const LONG = 'long';
export const HEAVY = 'heavy';
export const LIGHT = 'light';
export const FLIGHT = 'flight';
export const VALUE = 'value';
export const WARM = 'warm';
export const SHIELD = 'shield';
export const KNOW = 'know';
export const FAST = 'fast';
export const POWER = 'power';

/** Negate a tag: NOT(FAST) → '!fast' */
export function NOT(tag) {
  return `!${tag}`;
}

// ===== Alien emoji for each word =====
export const ALIEN_SYMBOLS_DEBUG = new Map([
  [ALIVE, '👾'],
  [BIG, '🚛'],
  [FOOD, '🍔'],
  [DANGER, '⚠️'],
  [ROUND, '⭕️'],
  [HARD, '🪨'],
  [LIQUID, '💧'],
  [SHARP, '#️⃣'],
  [HUMAN, '🧍'],
  [PLANT, '🌱'],
  [TOOL, '⚙️'],
  [WEAPON, '🔫'],
  [METAL, '🤘'],
  [BEAUTY, '💅'],
  [CLOTH, '👘'],
  [LONG, '🤥'],
  [HEAVY, '🐘'],
  [LIGHT, '🔆'],
  [FLIGHT, '🚀'],
  [VALUE, '💰'],
  [WARM, '☀️'],
  [SHIELD, '🛡️'],
  [KNOW, '🎓'],
  [FAST, '⏩'],
  [POWER, '⚡️'],
]);

export const ALIEN_SYMBOLS = new Map([
  [ALIVE, '☈'],
  [BIG, '♀︎'],
  [FOOD, '⚭'],
  [DANGER, '☊'],
  [ROUND, '✻'],
  [HARD, '⌘'],
  [LIQUID, '⌇'],
  [SHARP, 'ℌ'],
  [HUMAN, '⍚'],
  [PLANT, '⌧'],
  [TOOL, '☢︎'],
  [WEAPON, '⏚'],
  [METAL, '⏂'],
  [BEAUTY, '⎏'],
  [CLOTH, '⌱'],
  [LONG, '⍄'],
  [HEAVY, '⍱'],
  [LIGHT, '♾'],
  [FLIGHT, '☃︎'],
  [VALUE, '❥'],
  [WARM, '⍾'],
  [SHIELD, '⚩'],
  [KNOW, '⌲'],
  [FAST, '␥'],
  [POWER, '〠'],
]);
