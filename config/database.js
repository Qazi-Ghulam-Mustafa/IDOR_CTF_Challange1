import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.join(
  __dirname,
  "../database/idor_ctf.db"
);

const db = new Database(databasePath);

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

const schemaPath = path.join(
  __dirname,
  "../database/schema.sql"
);

const schema = readFileSync(schemaPath, "utf-8");

db.exec(schema);

console.log("SQLite database connected successfully");
console.log("Database tables created successfully");

export default db;
