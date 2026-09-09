import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';

/** Real SQLite SQL/triggers, isolated in memory. No production bindings or data. */
export function testDatabase() {
  const sqlite = new DatabaseSync(':memory:');
  const migrations = new URL('../../migrations/', import.meta.url);
  for (const name of readdirSync(migrations)
    .filter((name) => name.endsWith('.sql'))
    .sort()) {
    sqlite.exec(readFileSync(new URL(name, migrations), 'utf8'));
  }
  const queries: string[] = [];
  function prepare(sql: string, values: SQLInputValue[] = []) {
    return {
      bind: (...args: SQLInputValue[]) => prepare(sql, args),
      async first() {
        queries.push(sql);
        return sqlite.prepare(sql).get(...values) ?? null;
      },
      async all() {
        queries.push(sql);
        return { results: sqlite.prepare(sql).all(...values), success: true };
      },
      async run() {
        queries.push(sql);
        const result = sqlite.prepare(sql).run(...values);
        return {
          success: true,
          meta: { last_row_id: Number(result.lastInsertRowid), changes: Number(result.changes) },
        };
      },
    };
  }
  return { db: { prepare } as unknown as D1Database, sqlite, queries };
}
