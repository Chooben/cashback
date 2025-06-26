import express from 'express'
import db from '../db.js'
import { validateCashback } from '../validators/cashbackValidator.js';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const query = db.prepare(`
            SELECT cardId, catId, percent
            FROM cashback
        `);

        const cashback = query.all();

        res.json(cashback);
    } catch (error) {
        console.error("Error get request chashback", error);
    }
});

router.get('/:cardId', (req, res) => {
    const { cardId } = req.params;
    try {
        const query = db.prepare(`
            SELECT cardId, catId, percent
            FROM cashback
            WHERE cardId = ? 
        `);

        const cashback = query.all(cardId);

        res.json(cashback);
    } catch (error) {
        console.error("Error in GET /cashback/:cardId", error);
    }
});

router.post('/', validateCashback, (req, res) => {
    const { cardId, catId, percent } = req.validatedBody;
    try {
        
        console.log("Cashback POST: ", {cardId, catId, percent})
        const query = db.prepare(`INSERT INTO cashback (cardId, catId, percent) VALUES (?, ?, ?)`);

        const result = query.run(cardId, catId, percent);
        res.status(201).json({ id: result.lastInsertRowid, cardId, catId, percent});
    } catch (error) {
        console.log("Error post request cashback", error);
    }    
});

router.put('/', validateCashback, async (req, res) => {
    const { cardId, catId, percent } = req.validatedBody;

    try {
        const query = db.prepare(`
            UPDATE cashback 
            SET percent = ? 
            WHERE cardId = ? AND catId = ?
        `);
        const result = query.run(percent, cardId, catId);

        res.status(200).json({ message: 'Cashback updated', cardId, catId, percent});
    } catch (error) {
        console.error('Error updating cashback:', error);
        res.sendStatus(500);
    }
});

router.delete('/:id', (req, res) => {
    try {
        const { cardId } = req.body;
        const { catId } = req.body;

        const query = db.prepare(`DELETE FROM cashback WHERE catId = ? AND cardId = ?`);
        query.run(catId, cardId);

        res.json({ message: "cashback deleted" });
    } catch (error) {
        console.log("Error put delete cashback", error);
    }
});

export default router;