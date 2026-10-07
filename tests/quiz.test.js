import test from 'node:test';
import assert from 'node:assert/strict';
import { elements } from '../dist/elements.js';
import { createRound, makeQuestion, checkAnswer, submitAnswer, readProgress, writeProgress, matchingElements } from '../dist/quiz.js';

const copper = { number: 29, symbol: 'Cu', cs: 'měď', la: 'cuprum' };
const oxygen = { number: 8, symbol: 'O', cs: 'kyslík', la: 'oxygenium' };
const iron = { number: 26, symbol: 'Fe', cs: 'železo', la: 'ferrum' };
const silver = { number: 47, symbol: 'Ag', cs: 'stříbro', la: 'argentum' };
const pool = [copper, oxygen, iron, silver];

test('included elements have unique identities and the agreed range', () => {
  assert.equal(elements.length, 73);
  assert.deepEqual(elements.map(e => e.number), [...Array.from({ length: 56 }, (_, i) => i + 1), ...Array.from({ length: 17 }, (_, i) => i + 72)]);
  assert.equal(new Set(elements.map(e => e.symbol)).size, 73);
  for (const e of elements) for (const field of ['cs', 'la', 'symbol']) assert.ok(e[field]);
  assert.equal(elements.find(e => e.symbol === 'Na').la, 'natrium');
  assert.equal(elements.find(e => e.symbol === 'Hg').la, 'hydrargyrum');
  assert.equal(elements.find(e => e.symbol === 'Ta').la, 'tantalum');
});

test('free-text names accept accents, case and whitespace, symbols retain case', () => {
  assert.equal(checkAnswer(copper, 'cs', ' MED '), true);
  assert.equal(checkAnswer(copper, 'la', ' CuPrUm '), true);
  assert.equal(checkAnswer(copper, 'symbol', ' Cu '), true);
  assert.equal(checkAnswer(copper, 'symbol', 'cu'), false);
  assert.equal(checkAnswer(copper, 'cs', ''), false);
  assert.equal(checkAnswer(copper, 'cs', 'železo'), false);
  assert.equal(checkAnswer(elements.find(e => e.symbol === 'S'), 'la', 'sulfurum'), true);
});

test('all three prompt fields and both answer modes appear over six questions', () => {
  assert.deepEqual(Array.from({ length: 6 }, (_, i) => makeQuestion(copper, i, pool).prompt), ['cs', 'la', 'symbol', 'cs', 'la', 'symbol']);
  assert.deepEqual(Array.from({ length: 6 }, (_, i) => makeQuestion(copper, i, pool).mode), ['choice', 'text', 'choice', 'text', 'choice', 'text']);
});

test('every option list contains the right answer exactly once without duplicates', () => {
  for (let i = 0; i < 60; i++) {
    const q = makeQuestion(copper, i, pool);
    assert.equal(q.fields.length, 2);
    assert.ok(!q.fields.includes(q.prompt));
    for (const field of q.fields) {
      assert.equal(q.options[field].length, 4);
      assert.equal(new Set(q.options[field]).size, 4);
      assert.equal(q.options[field].filter(v => v === copper[field]).length, 1);
    }
  }
});

test('rounds sample distinct elements and short retry pools stay short', () => {
  const round = createRound(elements, 10);
  assert.equal(round.questions.length, 10);
  assert.equal(new Set(round.questions.map(q => q.element.number)).size, 10);
  assert.equal(createRound([copper], 10, elements).questions.length, 1);
  assert.equal(createRound([], 10).questions.length, 0);
});

test('both fields are needed, and duplicate submit cannot score twice', () => {
  const round = createRound([copper], 10, pool);
  assert.equal(submitAnswer(round, { la: 'cuprum', symbol: 'Cu' }).correct, true);
  assert.equal(round.score, 1);
  submitAnswer(round, { la: 'cuprum', symbol: 'Cu' });
  assert.equal(round.score, 1);
  const wrong = createRound([oxygen], 10, pool);
  assert.equal(submitAnswer(wrong, { la: 'oxygenium', symbol: 'Cu' }).correct, false);
  assert.equal(wrong.score, 0);
  assert.deepEqual(wrong.mistakes.map(e => e.number), [8]);
});

test('storage rejects corrupted, negative, unknown and nonnumeric progress', () => {
  assert.deepEqual(readProgress({ getItem: () => '{bad' }).progress, {});
  assert.deepEqual(readProgress({ getItem: () => 'null' }).progress, {});
  const store = { getItem: () => JSON.stringify({ 29: { correct: 2, wrong: 1 }, 8: { correct: -1, wrong: 0 }, 26: { correct: '2', wrong: 0 }, 118: { correct: 1, wrong: 0 } }) };
  assert.deepEqual(readProgress(store).progress, { 29: { correct: 2, wrong: 1 } });
  assert.equal(readProgress({ getItem() { throw new Error('blocked'); } }).available, false);
  assert.equal(writeProgress({ setItem() { throw new Error('full'); } }, {}), false);
  let saved;
  assert.equal(writeProgress({ setItem(key, value) { saved = value; } }, { 29: { correct: 1, wrong: 0 } }), true);
  assert.deepEqual(JSON.parse(saved), { 29: { correct: 1, wrong: 0 } });
});

test('catalog searches by Czech without accents, Latin and symbols', () => {
  assert.deepEqual(matchingElements(pool, 'med').map(e => e.number), [29]);
  assert.deepEqual(matchingElements(pool, 'ARGENTUM').map(e => e.number), [47]);
  assert.deepEqual(matchingElements(pool, 'Fe').map(e => e.number), [26]);
  assert.equal(matchingElements(pool, 'nenalezeno').length, 0);
});
