// ===== Demo Bob — Main App =====

import { generateDeck } from './cards.js';
import { translateOne, mergeTranslations } from './alien.js';
import { ALIEN_LABELS_RU } from './alien-labels-ru.js';

const MAX_SELECTED = 5;
let lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
let showDebug = true;

let deck = [];
let selectedIndices = new Set();

// ===== DOM refs =====
const $cardGrid = document.getElementById('$cardGrid');
const $selectedCount = document.getElementById('$selectedCount');
const $btnGenerate = document.getElementById('$btnGenerate');
const $alienResponse = document.getElementById('$alienResponse');
const $perCardResponses = document.getElementById('$perCardResponses');
const $btnLang = document.getElementById('$btnLang');
const $chkDebug = document.getElementById('$chkDebug');
const $body = document.body;
const $dictTable = document.getElementById('$dictTable');
// ===== Dictionary Data =====
import * as AlienSymbols from './alien-symbols.js';
const ALL_FEATURES = [
  AlienSymbols.ALIVE,
  AlienSymbols.BIG,
  AlienSymbols.FOOD,
  AlienSymbols.DANGER,
  AlienSymbols.ROUND,
  AlienSymbols.HARD,
  AlienSymbols.LIQUID,
  AlienSymbols.SHARP,
  AlienSymbols.HUMAN,
  AlienSymbols.PLANT,
  AlienSymbols.TOOL,
  AlienSymbols.WEAPON,
  AlienSymbols.METAL,
  AlienSymbols.BEAUTY,
  AlienSymbols.CLOTH,
  AlienSymbols.LONG,
  AlienSymbols.HEAVY,
  AlienSymbols.LIGHT,
  AlienSymbols.FLIGHT,
  AlienSymbols.VALUE,
  AlienSymbols.WARM,
  AlienSymbols.SHIELD,
  AlienSymbols.KNOW,
  AlienSymbols.FAST,
  AlienSymbols.POWER,
];

// Символы для выбора (только уникальные, без пустого)
const SYMBOL_CHOICES = [
  '',
  ...Array.from(new Set([...Array.from(AlienSymbols.ALIEN_SYMBOLS.values())])),
];

// Состояние: выбранные символы для признаков
let featureSymbols = {};
for (const f of ALL_FEATURES) featureSymbols[f] = '';
function renderDictionaryTable() {
  const tbody = $dictTable.querySelector('tbody');
  tbody.innerHTML = '';
  const ROWS = 5;
  const COLS = 5;
  for (let row = 0; row < ROWS; row++) {
    const $tr = document.createElement('tr');
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col;
      if (idx >= ALL_FEATURES.length) {
        const $td = document.createElement('td');
        $td.textContent = '';
        $tr.appendChild($td);
        continue;
      }
      const feature = ALL_FEATURES[idx];
      const $td = document.createElement('td');
      $td.style.padding = '0.2rem 0.3rem';
      // label + select в одной ячейке
      const $label = document.createElement('span');
      $label.textContent = localizeLabel(feature);
      $label.style.display = 'block';
      $label.style.fontSize = '0.97em';
      $label.style.marginBottom = '0.1em';
      const $select = document.createElement('select');
      $select.dataset.feature = feature;
      for (const sym of SYMBOL_CHOICES) {
        const $opt = document.createElement('option');
        $opt.value = sym;
        $opt.textContent = sym;
        if (featureSymbols[feature] === sym) $opt.selected = true;
        $select.appendChild($opt);
      }
      $td.appendChild($label);
      $td.appendChild($select);
      $tr.appendChild($td);
    }
    tbody.appendChild($tr);
  }
}
function handleDictSymbolChange(e) {
  if (e.target.tagName !== 'SELECT') return;
  const feature = e.target.dataset.feature;
  const value = e.target.value;
  featureSymbols[feature] = value;
  // Можно добавить сохранение или обновление alien-символов тут
}

// ===== Rendering =====

function renderDeck() {
  $cardGrid.innerHTML = '';
  selectedIndices.clear();
  updateCounter();
  renderAlienResponse();

  deck.forEach((emoji, cardIndex) => {
    const $card = document.createElement('label');
    $card.classList.add('card');

    const $checkbox = document.createElement('input');
    $checkbox.type = 'checkbox';
    $checkbox.classList.add('card-checkbox');
    $checkbox.dataset.index = cardIndex;

    const $emoji = document.createElement('span');
    $emoji.classList.add('emoji-item');
    $emoji.textContent = emoji;

    const $checkmark = document.createElement('span');
    $checkmark.classList.add('card-checkmark');
    $checkmark.textContent = '✓';

    $card.appendChild($checkbox);
    $card.appendChild($emoji);
    $card.appendChild($checkmark);
    $cardGrid.appendChild($card);
  });
}

function updateCounter() {
  $selectedCount.textContent = `${selectedIndices.size} / ${MAX_SELECTED}`;
}

function localizeLabel(label) {
  return lang === 'ru' ? ALIEN_LABELS_RU.get(label) || label : label;
}

function renderAlienWord({ symbol, label, negated }) {
  const $word = document.createElement('span');
  $word.classList.add('alien-word');
  if (negated) $word.classList.add('negated');
  $word.textContent = symbol;
  if (showDebug) {
    const labelText = (negated ? '!' : '') + localizeLabel(label);
    $word.setAttribute('data-label', labelText);
    $word.title = labelText;
    $word.style.setProperty('--debug-label', `'${labelText}'`);
  } else {
    $word.removeAttribute('data-label');
    $word.title = '';
  }
  return $word;
}

function renderAlienResponse() {
  const selectedEmojis = [...selectedIndices].map((i) => deck[i]);

  // ===== Per-card responses =====
  $perCardResponses.innerHTML = '';

  if (selectedEmojis.length > 0) {
    for (const emoji of selectedEmojis) {
      const words = translateOne(emoji);

      const $row = document.createElement('div');
      $row.classList.add('per-card-row');

      const $emojiLabel = document.createElement('span');
      $emojiLabel.classList.add('per-card-emoji');
      $emojiLabel.textContent = emoji;
      if (showDebug) {
        $emojiLabel.style.display = '';
      } else {
        $emojiLabel.style.display = 'none';
      }
      $row.appendChild($emojiLabel);

      const $words = document.createElement('div');
      $words.classList.add('alien-response', 'active');
      for (const word of words) {
        $words.appendChild(renderAlienWord(word));
      }
      $row.appendChild($words);

      $perCardResponses.appendChild($row);
    }
  }

  // ===== Merged response =====
  $alienResponse.innerHTML = '';

  if (selectedEmojis.length === 0) {
    $alienResponse.textContent = '…';
    $alienResponse.classList.remove('active');
  } else {
    const merged = mergeTranslations(selectedEmojis);
    if (merged.length === 0) {
      $alienResponse.textContent =
        lang === 'ru' ? 'Нет общих признаков' : 'No common features';
      $alienResponse.classList.add('active');
    } else {
      for (const word of merged) {
        $alienResponse.appendChild(renderAlienWord(word));
      }
      $alienResponse.classList.add('active');
    }
  }

  // Toggle debug class on body for CSS hiding
  if (showDebug) {
    $body.classList.remove('debug-hidden');
  } else {
    $body.classList.add('debug-hidden');
  }

  console.log('👽 alien response:', selectedEmojis);
}

// ===== Events =====

function handleCardToggle(e) {
  const $checkbox = e.target;
  if ($checkbox.type !== 'checkbox') return;

  const index = Number($checkbox.dataset.index);

  if ($checkbox.checked) {
    if (selectedIndices.size >= MAX_SELECTED) {
      $checkbox.checked = false;
      return;
    }
    selectedIndices.add(index);
  } else {
    selectedIndices.delete(index);
  }

  updateCounter();
  renderAlienResponse();
  console.log('🃏 selected cards:', [...selectedIndices]);
}

function handleGenerate() {
  deck = generateDeck();
  renderDeck();
  console.log('🃏 new deck generated:', deck.length, 'cards');
}

function handleLangSwitch() {
  lang = lang === 'ru' ? 'en' : 'ru';
  document.documentElement.lang = lang;
  $btnLang.textContent = lang.toUpperCase();
  renderAlienResponse();
  renderDictionaryTable();
}

function handleDebugToggle() {
  showDebug = $chkDebug.checked;
  renderAlienResponse();
}

function bindEvents() {
  $cardGrid.addEventListener('change', handleCardToggle);
  $btnGenerate.addEventListener('click', handleGenerate);
  $btnLang.addEventListener('click', handleLangSwitch);
  $chkDebug.addEventListener('change', handleDebugToggle);
  $dictTable.addEventListener('change', handleDictSymbolChange);
}

// ===== Init =====

function init() {
  $btnLang.textContent = lang.toUpperCase();
  $chkDebug.checked = showDebug;
  bindEvents();
  handleGenerate();
  renderDictionaryTable();
}

init();
