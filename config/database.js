import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const DatabasePath = path.join(_dirname, "../database/idor_ctf.db");

const db = new Database(DatabasePath);

db.pragma("foreign_keys=ON");

db.pragma("journal_mode=WAL");

const schemaPath = path.join(_dirname, "../database/schema.sql");

const schema = readFileSync(schemaPath, "utf-8");

db.exec(schema);

console.log("SQLite database connected successfully");

console.log("Database table created successfully");

export default db;
