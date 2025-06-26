import express from 'express';
import db from '../db.js';
import { validateCard } from '../validators/cardValidator.js';

const router = express.Router();

router.get('/', (req, res) => {
    const getCards = db.prepare(`SELECT * FROM card`);
    const cards = getCards.all();

    res.json(cards);
})

router.post('/', validateCard, (req, res) => {
    const { name } = req.validatedBody;
        
    try {
        const insertCard = db.prepare(`INSERT INTO card (name) VALUES (?)`);
        const result = insertCard.run(name);
        res.status(201).json({ id: result.lastInsertRowid, name });
    } catch (err) {
        console.error("Error inserting card:", err);
        res.status(500).json({ error: "Failed to insert card" })
    }
});

router.put('/:id', (req, res) => {
    const  { name } = req.body;
    const  { id } = req.params;

    const updateCard = db.prepare('UPDATE card SET name = ? WHERE id = ?')
    updateCard.run(name, id)

    res.json({ message: "Card updated" })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const deleteCard = db.prepare('DELETE FROM card WHERE id = ?')
    deleteCard.run(id)

    res.json({ message: "Card deleted" })
})

export default router;
