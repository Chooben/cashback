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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cardId INTEGER,
        catId INTEGER,
        percent DOUBLE,
        FOREIGN KEY(cardId) REFERENCES card(id),
        FOREIGN KEY(catId) REFERENCES category(id)
    )
`)

export default db;