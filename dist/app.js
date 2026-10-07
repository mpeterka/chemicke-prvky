import { elements, categories } from './elements.js';
import { createRound, submitAnswer, labels, readProgress, writeProgress, matchingElements } from './quiz.js';

const main = document.querySelector('main');
const storageNotice = document.querySelector('#storage-notice');
let storage;
try { storage = window.localStorage; } catch { /* Private or restricted browser. */ }
let { progress, available } = readProgress(storage);
storageNotice.hidden = available;
let round = null;
let scope = 'common';
let view = 'home';
let answers = {};
let catalogQuery = '';
let catalogScope = 'all';
const school = elements.filter(e => e.common);

const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function setView(next) {
  view = next;
  for (const button of document.querySelectorAll('.nav-button')) {
    const active = next === 'catalog' ? button.dataset.action === 'catalog' : button.dataset.action === 'quiz';
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  }
}

function focusHeading() {
  main.querySelector('h1')?.focus({ preventScroll: true });
}

function memoryAid(e, explain = false) {
  return `<div class="cell-hint"><span class="cell-picture" aria-hidden="true">${e.hint.icon}</span><span class="cell-caption">${e.hint.caption}</span>${explain ? `<details class="cell-story"><summary>Proč tento obrázek?</summary><p>${e.hint.explanation} <a href="${e.hint.source}" target="_blank" rel="noopener">Zdroj souvislosti</a></p></details>` : ''}</div>`;
}

function cell(e, extraClass = '', record = false) {
  const saved = progress[e.number];
  const aliases = Object.values(e.aliases).flat();
  return `<article class="element-cell ${extraClass}" data-category="${e.category}">
    <span class="cell-number" aria-label="Protonové číslo ${e.number}">${e.number}</span>
    <span class="cell-symbol">${e.symbol}</span><span class="cell-cs">${e.cs}</span><span class="cell-la" lang="la">${e.la}</span>
    ${memoryAid(e, record || extraClass === 'question-cell')}
    ${record && aliases.length ? `<span class="cell-variants">Také: ${aliases.map(escape).join(', ')}</span>` : ''}
    ${record ? `<span class="cell-record">${saved ? `${saved.correct} správně · ${saved.wrong} chybně` : 'Zatím neprocvičeno'}</span>` : ''}</article>`;
}

function totals() {
  const entries = Object.values(progress);
  const right = entries.reduce((n, e) => n + e.correct, 0);
  const wrong = entries.reduce((n, e) => n + e.wrong, 0);
  return { practiced: entries.length, attempts: right + wrong, rate: right + wrong ? Math.round(100 * right / (right + wrong)) : null };
}

function renderHome() {
  setView('home');
  const stats = totals();
  main.innerHTML = `<section class="intro"><div class="intro-copy"><h1 tabindex="-1">Chemie po<br>jednom prvku.</h1><p class="lead">Spoj český název, latinský název a značku. Jednou vybereš odpověď, příště ji napíšeš zpaměti.</p></div>
    <div class="hero-art" aria-hidden="true">${cell(elements.find(e => e.symbol === 'Cu'), 'copper')}${cell(elements.find(e => e.symbol === 'O'), 'oxygen')}${cell(elements.find(e => e.symbol === 'Fe'), 'iron')}</div></section>
    <section class="practice-panel" aria-labelledby="practice-title"><div><h2 id="practice-title">Co si dnes procvičíš?</h2><p>Obě spodní řady a supertěžké prvky jsou prozatím vynechané.</p><div class="scope-options">
    <label class="scope-option"><input type="radio" name="scope" value="common" ${scope === 'common' ? 'checked' : ''}><div><strong>Školní základ</strong> <span>${school.length} běžných prvků</span></div></label>
    <label class="scope-option"><input type="radio" name="scope" value="all" ${scope === 'all' ? 'checked' : ''}><div><strong>Celá sada</strong> <span>73 prvků</span></div></label></div></div>
    <div class="start-block"><button class="primary" data-action="start">Spustit kvíz</button><p>10 otázek, vlastním tempem</p></div></section>
    <div class="steps"><span><b class="step-dot">1</b>Přiřaď chybějící dvojici</span><span><b class="step-dot">2</b>Podívej se na správnou odpověď</span><span><b class="step-dot">3</b>Zopakuj si chyby</span></div>
    <section class="stats" aria-label="Tvůj dosavadní pokrok"><div><strong>${stats.practiced}</strong>procvičených prvků</div><div><strong>${stats.rate === null ? '—' : stats.rate + ' %'}</strong>úspěšnost</div><div><strong>${stats.attempts}</strong>odpovědí</div></section>`;
}

function startRound(pool) {
  round = createRound(pool, 10, scope === 'all' ? elements : school);
  answers = {};
  renderQuestion();
  focusHeading();
}

function renderQuestion() {
  setView('quiz');
  const q = round.questions[round.index];
  if (!q) return renderResult();
  const e = q.element;
  const checked = !!q.result;
  const missingLabels = q.fields.map(field => labels[field].toLocaleLowerCase('cs')).join(' a ');
  const questionCell = checked ? cell(e, 'question-cell') : `<article class="element-cell question-cell" data-category="${e.category}"><span class="cell-number" aria-label="Protonové číslo ${e.number}">${e.number}</span><span class="cell-field-label">${labels[q.prompt]}</span><span class="${q.prompt === 'symbol' ? 'cell-symbol' : 'prompt-name'}" ${q.prompt === 'la' ? 'lang="la"' : ''}>${e[q.prompt]}</span><span class="hidden-fields">${missingLabels}<br>?</span>${memoryAid(e)}</article>`;
  const answerGroups = q.fields.map(field => {
    const status = checked ? (q.result.matches[field] ? 'is-right' : 'is-wrong') : '';
    const content = q.mode === 'choice' ? `<div class="option-list">${q.options[field].map(value => {
      const selected = answers[field] === value;
      const optionStatus = checked ? (value === e[field] ? 'is-right' : selected ? 'is-wrong' : '') : '';
      return `<button type="button" class="answer-option ${optionStatus}" data-field="${field}" data-value="${escape(value)}" aria-pressed="${selected}" ${checked ? 'disabled' : ''} ${field === 'la' ? 'lang="la"' : ''}><span>${value}</span><span class="mark" aria-hidden="true">${checked && value === e[field] ? '✓' : checked && selected ? '×' : selected ? '●' : ''}</span></button>`;
    }).join('')}</div>` : `<input class="text-answer ${status}" id="answer-${field}" name="${field}" aria-labelledby="legend-${field}" aria-describedby="note-${field}${checked ? ' correction-' + field : ''}" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" value="${escape(answers[field] || '')}" ${checked ? 'readonly' : ''} ${field === 'la' ? 'lang="la"' : ''}><p class="input-note" id="note-${field}">${field === 'symbol' ? 'Velká a malá písmena jsou důležitá (např. Cu).' : 'Diakritiku a velká písmena neřešíme.'}</p>`;
    return `<fieldset><legend id="legend-${field}">${labels[field]}</legend>${content}${checked ? `<p class="field-correction" id="correction-${field}">${q.result.matches[field] ? '✓ Správně' : `× ${answers[field] ? 'Tvoje odpověď: ' + escape(answers[field]) : 'Bez odpovědi'}`}<br>Správně: <strong>${e[field]}</strong></p>` : ''}</fieldset>`;
  }).join('');

  main.innerHTML = `<div class="question-head"><h1 tabindex="-1">Doplň prvek</h1><span class="question-counter">Otázka ${round.index + 1} z ${round.questions.length}</span></div>
    <div class="progress-track" role="progressbar" aria-label="Postup kolem" aria-valuemin="0" aria-valuemax="${round.questions.length}" aria-valuenow="${round.index + (checked ? 1 : 0)}"><span style="width:${100 * (round.index + (checked ? 1 : 0)) / round.questions.length}%"></span></div>
    <div class="quiz-layout"><aside class="question-aside">${questionCell}<span class="category-tag">${categories[e.category]}</span><p class="question-help">${checked ? 'Teď znáš celou trojici. Chvilku si ji prohlédni.' : 'Jednu část znáš.<br>Doplň zbývající dvě.'}</p></aside>
    <form id="answer-form" novalidate><span class="mode-tag">${q.mode === 'choice' ? 'Výběr z možností' : 'Zpaměti — napiš odpověď'}</span><h2 class="answer-title">${checked ? 'Tvoje přiřazení' : q.mode === 'choice' ? 'Vyber správnou dvojici' : 'Napiš správnou dvojici'}</h2><div class="answer-groups">${answerGroups}</div>
    ${checked ? `<div class="feedback ${q.result.correct ? '' : 'wrong'}" role="status"><img class="feedback-face" src="./faces/${q.result.correct ? 'happy' : 'frowning'}.png" alt="" width="96" height="96"><div><h2>${q.result.correct ? 'Správná trojice!' : 'Tohle si ještě zopakujeme.'}</h2><p>${e.cs} — ${e.la} — ${e.symbol}</p></div></div>` : ''}
    <div class="answer-actions">${checked ? `<button type="button" class="primary" data-action="next">${round.index + 1 === round.questions.length ? 'Zobrazit výsledek' : 'Další prvek'}</button>` : '<button type="submit" class="primary" id="check-button" disabled>Zkontrolovat</button><button type="button" class="quiet" data-action="skip">Nevím</button>'}</div></form></div>
    <div class="round-meta"><span>Správné trojice: <strong>${round.score}</strong> · ${scope === 'all' ? 'Celá sada' : 'Školní základ'}</span><button class="quiet" data-action="home">Nový výběr</button></div>`;
  updateCheckButton();
}

function updateCheckButton() {
  const button = document.querySelector('#check-button');
  const q = round?.questions[round.index];
  if (button && q) button.disabled = !q.fields.every(field => String(answers[field] || '').trim());
}

function check() {
  const q = round.questions[round.index];
  if (!q || q.result) return;
  const result = submitAnswer(round, answers);
  const record = progress[q.element.number] || { correct: 0, wrong: 0 };
  record[result.correct ? 'correct' : 'wrong']++;
  progress[q.element.number] = record;
  if (!writeProgress(storage, progress)) storageNotice.hidden = false;
  renderQuestion();
  main.querySelector('[data-action="next"]').focus({ preventScroll: true });
}

function renderResult() {
  setView('result');
  const mistakes = round.mistakes.length;
  main.innerHTML = `<section class="result-layout"><h1 tabindex="-1">${mistakes === 0 ? 'Všechny trojice sedí.' : 'Další kousek chemie v hlavě.'}</h1><div class="result-score" aria-label="${round.score} z ${round.questions.length} správně">${round.score}<span> / ${round.questions.length}</span></div><p>${mistakes === 0 ? 'Výborně. Zkus nové prvky, ať máš co objevovat.' : `Správné odpovědi už znáš. Teď si můžeš zopakovat ${mistakes === 1 ? 'prvek, který' : 'prvky, které'} ti ${mistakes === 1 ? 'unikl' : 'unikly'}.`}</p>
    <div class="result-actions">${mistakes ? `<button class="primary" data-action="retry">Zopakovat chyby (${mistakes})</button>` : ''}<button class="${mistakes ? 'secondary' : 'primary'}" data-action="start">Nové kolo</button></div>
    <div class="review-list">${round.questions.map(q => `<div class="review-item ${q.result?.correct ? '' : 'missed'}"><span class="small-symbol">${q.element.symbol}</span><div><strong>${q.element.cs}</strong><small lang="la">${q.element.la}</small></div><span class="result-mark" aria-label="${q.result?.correct ? 'Správně' : 'Chybně'}">${q.result?.correct ? '✓' : '×'}</span></div>`).join('')}</div><button class="quiet" data-action="home">Změnit sadu prvků</button></section>`;
}

function renderCatalog() {
  setView('catalog');
  main.innerHTML = `<section><div class="catalog-head"><div><h1 tabindex="-1">Prvky pod lupou.</h1><p>Český název, latina a značka pohromadě.</p></div></div>
    <div class="catalog-search"><label>Najdi prvek<input id="search" type="search" value="${escape(catalogQuery)}" placeholder="Třeba měď, cuprum nebo Cu" autocomplete="off" autocorrect="off" spellcheck="false"></label><label>Sada prvků<select id="catalog-scope"><option value="all" ${catalogScope === 'all' ? 'selected' : ''}>Celá sada (73)</option><option value="common" ${catalogScope === 'common' ? 'selected' : ''}>Školní základ (${school.length})</option></select></label></div>
    <p class="catalog-count" id="catalog-count" role="status"></p><div class="catalog-grid" id="catalog-grid"></div></section>`;
  filterCatalog();
}

function filterCatalog() {
  const found = matchingElements(catalogScope === 'common' ? school : elements, catalogQuery);
  document.querySelector('#catalog-count').textContent = `Zobrazeno: ${found.length} prvků. Bez obou spodních řad a prvků 104–118.`;
  document.querySelector('#catalog-grid').innerHTML = found.length ? found.map(e => cell(e, '', true)).join('') : '<p class="empty-state">Takový prvek tu není. Zkus jiný název nebo značku.</p>';
}

document.addEventListener('click', event => {
  const option = event.target.closest('[data-field]');
  if (option && !round.questions[round.index].result) {
    const field = option.dataset.field;
    answers[field] = option.dataset.value;
    for (const button of main.querySelectorAll(`[data-field="${field}"]`)) {
      const selected = button === option;
      button.setAttribute('aria-pressed', String(selected));
      button.querySelector('.mark').textContent = selected ? '●' : '';
    }
    updateCheckButton();
    return;
  }
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  if (action === 'about') return document.querySelector('#about-dialog').showModal();
  if (action === 'start') startRound(scope === 'common' ? school : elements);
  if (action === 'retry') startRound(round.mistakes);
  if (action === 'skip') check();
  if (action === 'next') { round.index++; answers = {}; renderQuestion(); focusHeading(); }
  if (action === 'home') { round = null; renderHome(); focusHeading(); }
  if (action === 'catalog') { renderCatalog(); focusHeading(); }
  if (action === 'quiz') { if (round) renderQuestion(); else renderHome(); focusHeading(); }
});

main.addEventListener('input', event => {
  if (event.target.matches('.text-answer')) { answers[event.target.name] = event.target.value; updateCheckButton(); }
  if (event.target.id === 'search') { catalogQuery = event.target.value; filterCatalog(); }
});
main.addEventListener('change', event => {
  if (event.target.name === 'scope') scope = event.target.value;
  if (event.target.id === 'catalog-scope') { catalogScope = event.target.value; filterCatalog(); }
});
main.addEventListener('submit', event => {
  if (event.target.id !== 'answer-form') return;
  event.preventDefault();
  if (round.questions[round.index].fields.every(field => String(answers[field] || '').trim())) check();
});

renderHome();
