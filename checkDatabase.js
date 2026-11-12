import db from './config/database.js';

const tables = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    AND name NOT LIKE 'sqlite_%'
`).all();

console.log('\nDatabase Tables:');

console.table(tables);

db.close();
