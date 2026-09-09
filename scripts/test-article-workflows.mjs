#!/usr/bin/env node
// Test the compiled Worker on localhost with LOCAL D1 only. Start it with:
// npx wrangler dev -c dist/server/wrangler.json --local --port 4331 --persist-to .wrangler/state
// This creates a disposable local editor/session/article and removes them in finally.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = new URL(process.argv[2] || 'http://localhost:4331');
assert(['localhost', '127.0.0.1'].includes(origin.hostname), 'This test only accepts a loopback server.');
const marker = `ci-review-${randomUUID()}`;
const session = randomUUID();
const sql = (command) =>
  JSON.parse(
    execFileSync(
      path.join(root, 'node_modules/.bin/wrangler'),
      ['d1', 'execute', 'changingireland-db', '--local', '--json', '--command', command],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    )
  );
const row = () => sql(`SELECT * FROM posts WHERE slug='${marker}'`)[0].results[0];
const publicGet = (route) => fetch(new URL(route, origin), { redirect: 'manual' });
const form = (route, fields) =>
  fetch(new URL(route, origin), {
    method: 'POST',
    redirect: 'manual',
    headers: { Cookie: `ci_session=${session}`, Origin: origin.origin },
    body: new URLSearchParams(fields),
  });
let assertions = 0;
const passed = (label) => {
  assertions++;
  console.log(`PASS ${label}`);
};
try {
  sql(`INSERT INTO users(username,email,first_name,last_name,password_hash,role) VALUES ('${marker}','${marker}@example.invalid','Local','Test','disabled-test-password','editor');
    INSERT INTO sessions(id,user_id,expires_at) SELECT '${session}',id,${Date.now() + 600000} FROM users WHERE username='${marker}';`);
  assert.equal((await publicGet('/admin/news')).status, 302);
  passed('anonymous admin access is rejected');
  const fields = { title: 'Local workflow test', slug: marker, content: '<p>Original body</p>', author: 'Local Test' };
  assert.equal((await form('/admin/news/edit', fields)).status, 302);
  const id = row().id;
  assert.equal(row().published, 0);
  assert.equal((await publicGet(`/${marker}`)).status, 404);
  passed('create draft and keep it private');
  const details = {
    ...fields,
    title: 'Updated local article',
    content:
      '<figure><img src="/files/example.webp" alt="Volunteers"><figcaption>Photo credit</figcaption></figure><p>Updated body <a href="java&#x73;cript:alert(1)">Link</a></p>',
    excerpt: 'Updated summary',
    image_url: '/files/example.webp',
    image_alt: 'Volunteers',
    categories: 'Community',
    tags: 'Test',
    published: 'on',
  };
  assert.equal((await form(`/admin/news/edit?id=${id}`, details)).status, 302);
  assert.equal(row().excerpt, details.excerpt);
  assert.equal(row().image_alt, 'Volunteers');
  assert(row().content.includes('<figcaption>'));
  assert(!row().content.includes('href='));
  assert.equal((await publicGet(`/${marker}`)).status, 200);
  passed('edit details, preserve captions, sanitise URLs and publish');
  assert.equal((await publicGet(`/${marker}`)).headers.get('x-edge-cache'), 'hit');
  passed('compiled Worker serves cached article');
  assert.equal((await form(`/admin/news/edit?id=${id}`, { ...fields, title: 'Withdrawn article' })).status, 302);
  assert.equal((await publicGet(`/${marker}`)).status, 404);
  passed('unpublish immediately invalidates cached article');
  const due = Math.ceil(Date.now() / 1000) * 1000 + 4000;
  assert.equal(
    (
      await form(`/admin/news/edit?id=${id}`, {
        ...fields,
        published: 'on',
        published_at_utc: new Date(due).toISOString(),
      })
    ).status,
    302
  );
  assert.equal((await publicGet(`/${marker}`)).status, 404);
  await publicGet('/news');
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, due - Date.now() + 100)));
  assert.equal((await publicGet(`/${marker}`)).status, 200);
  assert.equal((await publicGet('/news')).headers.get('x-edge-cache'), 'miss');
  passed('scheduled publication advances visibility and invalidates listing cache');
  assert.equal((await form(`/admin/news/edit?id=${id}`, { ...fields, slug: 'news' })).status, 200);
  assert.equal(row().slug, marker);
  passed('reserved address rejected without overwriting article');
  assert.equal((await form('/admin/news', { action: 'delete', id: String(id) })).status, 302);
  assert.equal(row(), undefined);
  assert.equal((await publicGet(`/${marker}`)).status, 404);
  passed('delete removes row and cached public page');
  console.log(`${assertions} compiled-runtime workflow checks passed.`);
} finally {
  sql(
    `DELETE FROM posts WHERE slug='${marker}'; DELETE FROM sessions WHERE id='${session}'; DELETE FROM users WHERE username='${marker}';`
  );
}
