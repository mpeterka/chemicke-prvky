import { elements } from './elements.js';

export const fields = ['cs', 'la', 'symbol'];
export const labels = { cs: 'Český název', la: 'Latinský název', symbol: 'Značka' };
const storageKey = 'chemicke-prvky-progress-v1';

export function normalize(value) {
  return String(value ?? '').trim().toLocaleLowerCase('cs').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function makeQuestion(element, index, pool = elements) {
  const prompt = fields[index % 3];
  const missing = fields.filter(field => field !== prompt);
  // Shared distractor identities avoid contradictory sets of possible names.
  const distractors = shuffle(pool.filter(e => e.number !== element.number)).slice(0, 3);
  const options = Object.fromEntries(missing.map(field => [field, shuffle([...new Set([element[field], ...distractors.map(e => e[field])])])]));
  return { element, prompt, fields: missing, mode: index % 2 ? 'text' : 'choice', options, result: null };
}

export function createRound(pool, limit = 10, optionPool = elements) {
  const unique = [...new Map(pool.map(e => [e.number, e])).values()];
  return { questions: shuffle(unique).slice(0, limit).map((e, i) => makeQuestion(e, i, optionPool)), index: 0, score: 0, mistakes: [] };
}

export function checkAnswer(element, field, value) {
  if (!fields.includes(field) || !element) return false;
  if (field === 'symbol') return String(value ?? '').trim() === element.symbol;
  const expected = [element[field], ...(element.aliases?.[field] || [])];
  return expected.some(answer => normalize(value) === normalize(answer));
}

export function submitAnswer(round, answers) {
  const q = round.questions[round.index];
  if (!q) return null;
  if (q.result) return q.result;
  const matches = Object.fromEntries(q.fields.map(field => [field, checkAnswer(q.element, field, answers[field])]));
  const correct = Object.values(matches).every(Boolean);
  q.result = { correct, matches, answers: { ...answers } };
  if (correct) round.score++;
  else round.mistakes.push(q.element);
  return q.result;
}

export function matchingElements(pool, query) {
  const term = normalize(query);
  return pool.filter(e => [e.cs, e.la, e.symbol, ...Object.values(e.aliases || {}).flat()].some(value => normalize(value).includes(term)));
}

export function readProgress(storage) {
  try {
    const raw = JSON.parse(storage.getItem(storageKey) || '{}');
    const progress = {};
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      for (const e of elements) {
        const value = raw[e.number];
        if (value && ['correct', 'wrong'].every(k => Number.isSafeInteger(value[k]) && value[k] >= 0)) {
          progress[e.number] = { correct: value.correct, wrong: value.wrong };
        }
      }
    }
    return { progress, available: true };
  } catch (error) {
    return { progress: {}, available: error instanceof SyntaxError };
  }
}

export function writeProgress(storage, progress) {
  try { storage.setItem(storageKey, JSON.stringify(progress)); return true; }
  catch { return false; }
}
