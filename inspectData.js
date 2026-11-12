
import db from './config/database.js';

console.log('\n========== USERS ==========');

const users = db.prepare(`
    SELECT id, username, email
    FROM users
`).all();

console.table(users);

console.log('\n========== DOCUMENTS ==========');

const documents = db.prepare(`
    SELECT id, owner_id, title
    FROM documents
`).all();

console.table(documents);

console.log('\n========== CHALLENGES ==========');

const challenges = db.prepare(`
    SELECT id, title, slug
    FROM challenges
`).all();

console.table(challenges);

db.close();
