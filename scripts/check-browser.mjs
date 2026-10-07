// Optional QA tool. Uses installed Playwright or PLAYWRIGHT_MODULE from a runtime.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { elements } from '../dist/elements.js';

const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium, webkit } = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright');
const url = process.env.APP_URL || 'http://127.0.0.1:4175/';
await mkdir('.qa', { recursive: true });

async function layout(page) {
  const result = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    short: [...document.querySelectorAll('button')].filter(e => e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().height < 48).map(e => e.textContent),
  }));
  assert.equal(result.overflow, false, 'Horizontal page overflow');
  assert.deepEqual(result.short, [], 'Touch targets below 48px');
}

async function questionElement(page) {
  const number = Number(await page.locator('.question-cell .cell-number').innerText());
  return elements.find(e => e.number === number);
}

for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await type.launch({ headless: true });
  try {
    for (const viewport of [{ width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 390, height: 844 }]) {
      const name = `${engine}-${viewport.width}`;
      const context = await browser.newContext({ viewport, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      await page.getByRole('button', { name: 'Spustit kvíz', exact: true }).waitFor();
      await layout(page);
      await page.screenshot({ path: `.qa/${name}-home.png`, fullPage: true });
      await page.getByRole('button', { name: 'Spustit kvíz', exact: true }).tap();
      for (let i = 0; i < 10; i++) {
        await page.locator('.question-cell').waitFor();
        const e = await questionElement(page);
        assert.equal(await page.locator('.question-cell .cell-picture').count(), 1, 'Question should show a visual mnemonic');
        assert.equal(await page.locator('.question-cell .cell-picture').isVisible(), false, 'Picture should be hidden until hint is requested');
        assert.equal(await page.locator('.question-cell .picture-explanation').isVisible(), false);
        assert.equal(await page.locator('.question-cell .name-origin').count(), 0);
        if (i === 1) {
          await page.locator('.question-cell summary').tap();
          assert.ok(await page.locator('.question-cell .cell-picture').isVisible());
          assert.ok(await page.locator('.question-cell .picture-explanation').isVisible());
          // Opening the hint must keep any typed answers intact.
          await page.locator('.text-answer').first().fill('rozpracováno');
          await page.locator('.question-cell summary').tap();
          assert.equal(await page.locator('.text-answer').first().inputValue(), 'rozpracováno');
          await page.locator('.question-cell summary').tap();
        }
        // Only atomic number, category and the single prompt may be shown before checking.
        assert.equal(await page.locator('.question-cell .cell-symbol').count(), i % 3 === 2 ? 1 : 0);
        await layout(page);
        if (i === 0) {
          await page.screenshot({ path: `.qa/${name}-choice.png`, fullPage: true });
          await page.getByRole('button', { name: 'Nevím', exact: true }).tap();
        } else if (i % 2) {
          for (const input of await page.locator('.text-answer').all()) {
            const field = await input.getAttribute('name');
            const answer = field === 'symbol' ? e[field] : e[field].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
            await input.fill(` ${answer} `);
          }
          if (i === 1) await page.screenshot({ path: `.qa/${name}-text.png`, fullPage: true });
          await page.getByRole('button', { name: 'Zkontrolovat', exact: true }).tap();
        } else {
          for (const fieldset of await page.locator('fieldset').all()) {
            const label = await fieldset.locator('legend').innerText();
            const field = label === 'Český název' ? 'cs' : label === 'Latinský název' ? 'la' : 'symbol';
            await fieldset.getByRole('button', { name: e[field], exact: true }).tap();
          }
          await page.getByRole('button', { name: 'Zkontrolovat', exact: true }).tap();
        }
        await page.locator('.feedback').waitFor();
        assert.equal(await page.locator('.question-cell .cell-picture').isVisible(), i === 1, 'Checking should preserve the requested hint state');
        assert.ok(await page.locator('.question-cell .name-origin').isVisible());
        assert.ok((await page.locator('.question-cell .name-origin').innerText()).includes(e.origin.text));
        assert.equal(await page.locator('.question-cell a').count(), 0, 'Cards should not show source links');
        await layout(page);
        assert.equal(await page.locator('.feedback').innerText().then(t => t.includes('Správná trojice!')), i !== 0);
        const portrait = page.locator('.feedback img');
        assert.equal(await portrait.count(), 1, 'Feedback should include the photo portrait');
        assert.match(await portrait.getAttribute('src'), i === 0 ? /frowning\.png$/ : /happy\.png$/);
        await portrait.evaluate(img => img.decode());
        assert.ok(await portrait.evaluate(img => img.naturalWidth > 0), 'Portrait image must load');
        if (i === 0) await page.screenshot({ path: `.qa/${name}-correction.png`, fullPage: true });
        await page.getByRole('button', { name: i === 9 ? 'Zobrazit výsledek' : 'Další prvek', exact: true }).tap();
      }
      assert.match(await page.locator('.result-score').innerText(), /9\s*\/\s*10/);
      await layout(page);
      await page.screenshot({ path: `.qa/${name}-result.png`, fullPage: true });
      await page.getByRole('button', { name: 'Zopakovat chyby (1)', exact: true }).tap();
      assert.equal(await page.locator('.question-counter').innerText(), 'Otázka 1 z 1');
      assert.equal(await page.locator('.answer-option').count(), 8, 'Retry still has four options per field');
      await page.getByRole('button', { name: 'Přehled prvků', exact: true }).tap();
      assert.equal(await page.locator('.catalog-grid article').count(), 73);
      assert.equal(await page.locator('.catalog-grid .cell-picture').count(), 73);
      await layout(page);
      await page.screenshot({ path: `.qa/${name}-catalog.png`, fullPage: true });
      await page.getByRole('searchbox').fill('med');
      assert.equal(await page.locator('.catalog-grid article').count(), 1);
      assert.equal(await page.locator('.catalog-grid .cell-symbol').innerText(), 'Cu');
      for (const [query, icon, explanation] of [['selen', '🌙', 'Seléné'], ['helium', '🎈', 'balónků']]) {
        await page.getByRole('searchbox').fill(query);
        assert.equal(await page.locator('.catalog-grid .cell-picture').isVisible(), false);
        await page.locator('.cell-story summary').tap();
        assert.equal(await page.locator('.catalog-grid .cell-picture').innerText(), icon);
        assert.ok((await page.locator('.picture-explanation').innerText()).includes(explanation));
        assert.ok(await page.locator('.name-origin').isVisible());
        await layout(page);
      }
      await page.getByRole('searchbox').fill('<img src=x onerror=alert(1)>');
      assert.equal(await page.locator('.catalog-grid article').count(), 0);
      await page.reload();
      await page.getByRole('button', { name: 'Spustit kvíz', exact: true }).waitFor();
      assert.match(await page.locator('.stats').innerText(), /90 %/);
      await page.getByRole('button', { name: 'Rozsah a zdroje', exact: true }).tap();
      assert.equal(await page.locator('dialog').isVisible(), true);
      await page.getByRole('button', { name: 'Zavřít', exact: true }).tap();
      assert.deepEqual(errors, []);
      console.log(`PASS ${name}: full mixed round, correction, retry, catalog, storage, touch layout`);
      await context.close();
    }
    const context = await browser.newContext({ hasTouch: true });
    await context.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } }));
    const page = await context.newPage();
    await page.goto(url);
    await page.getByRole('button', { name: 'Spustit kvíz', exact: true }).tap();
    await page.getByRole('button', { name: 'Nevím', exact: true }).tap();
    assert.equal(await page.locator('#storage-notice').isVisible(), true);
    assert.equal(await page.locator('.feedback').isVisible(), true);
    await context.close();
    console.log(`PASS ${engine}: blocked storage remains playable`);
  } finally { await browser.close(); }
}
