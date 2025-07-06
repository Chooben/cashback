import express from 'express';
import db from '../db.js';
import { validateCard, validateCardArray, validateParams } from '../validators/cardValidator.js';

const router = express.Router();

router.get('/', (req, res) => {
    const query = db.prepare(`SELECT * FROM card`);
    const cards = query.all();

    res.json(cards);
});

router.post('/', validateCard, (req, res) => {
    try {
        const { name } = req.validatedBody;
        const query = db.prepare(`
            INSERT INTO card (name) VALUES (?)
        `).run(name);
        res.status(201).json({ id: query.lastInsertRowid, name });
    } catch (err) {
        console.error("Error inserting card:", err);
        res.status(500).json({ error: "Failed to insert card" })
    }
});

router.put('/', validateCardArray, (req, res) => {
    try {
        const values = req.validatedBody;
        const updatedCards = [];
        values.forEach(card => {
            const [id, name] = [card.id, card.name];            
            const query = db.prepare(`
                UPDATE card
                SET name = ?
                WHERE id = ?
            `).run(name, id);
            updatedCards.push({ id, name });
        });
        res.status(200).json(updatedCards);
    } catch (err) {
        console.error("Error udpating card", err);
        res.status(500).json({ error: "Failed to update cards" })
    };
});

router.delete('/:id', validateParams, (req, res) => {
    try {
        const { id } = req.validatedParams;
        const deleteCard = db.prepare(`
            DELETE FROM card WHERE id = ?
        `).run(parseInt(id));
        res.status(200).json({ message: "Card successfully delete", id});
    } catch (err) {
        console.error("Error deleting card", err);
        res.status(500).json({ error: "Failed to delete card" });
    };
});

export default router;
