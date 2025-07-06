import { DatabaseSync } from 'node:sqlite'

const db = new DatabaseSync(':memory:')

db.exec(`
    CREATE TABLE card (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
    )
`)

db.exec(`
    CREATE TABLE category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
    )
`)

db.exec(`
    CREATE TABLE cashback (
        cardId INTEGER,
        catId INTEGER,
        percent DOUBLE,
        FOREIGN KEY(cardId) REFERENCES card(id) ON DELETE CASCADE,
        FOREIGN KEY(catId) REFERENCES category(id) ON DELETE CASCADE
    )
`)

export default db;