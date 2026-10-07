import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('preview serves the app and JS with correct content types, denies traversal', async () => {
  const server = spawn(process.execPath, ['scripts/serve.mjs'], { env: { ...process.env, PORT: '4176' }, stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    await once(server.stdout, 'data');
    const page = await fetch('http://127.0.0.1:4176/');
    assert.equal(page.status, 200);
    assert.match(await page.text(), /<html lang="cs">/);
    const module = await fetch('http://127.0.0.1:4176/app.js');
    assert.equal(module.status, 200);
    assert.match(module.headers.get('content-type'), /text\/javascript/);
    const portrait = await fetch('http://127.0.0.1:4176/faces/happy.png');
    assert.equal(portrait.status, 200);
    assert.equal(portrait.headers.get('content-type'), 'image/png');
    assert.equal((await fetch('http://127.0.0.1:4176/%2e%2e%2fpackage.json')).status, 403);
    assert.equal((await fetch('http://127.0.0.1:4176/missing')).status, 404);
  } finally { server.kill(); }
});
