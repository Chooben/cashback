import express from 'express'
import db from '../db.js'
import { validateCashback, validateCashbackArray } from '../validators/cashbackValidator.js';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const query = db.prepare(`
            SELECT cardId, catId, percent
            FROM cashback
        `);

        const cashbacks = query.all();
        res.json(cashbacks);
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

router.post('/', validateCashbackArray, (req, res) => {
    try {
        const values = req.validatedBody;
        const newCb = [];
        values.forEach(cb => {
            const [cardId, catId, percent] = [cb.cardId, cb.catId, cb.percent];
            const query = db.prepare(`
                INSERT INTO cashback (cardId, catId, percent) 
                VALUES (?, ?, ?)
            `).run(cardId, catId, percent);
            newCb.push({ cardId, catId, percent });
        });
        res.status(201).json(newCb);
    } catch (error) {
        console.log("Error post request cashback", error);
    }    
});

router.put('/', validateCashbackArray, (req, res) => {
    try {
        const values = req.validatedBody;
        const updatedCbs = [];
        values.forEach(cb => {
            const [cardId, catId, percent] = [cb.cardId, cb.catId, cb.percent];

            const exists = db.prepare(`
                SELECT * FROM cashback 
                WHERE cardId = ? AND catId = ?
            `).get(cardId, catId);
            if (exists) {
                const query = db.prepare(`
                    UPDATE cashback 
                    SET percent = ? 
                    WHERE cardId = ? AND catId = ?
                `).run(percent, cardId, catId);
            } else {
                const query = db.prepare(`
                    INSERT INTO cashback (cardId, catId, percent) 
                    VALUES (?, ?, ?)    
                `).run(cardId, catId, percent);
            }
            updatedCbs.push({ cardId, catId, percent });
        }); 
        res.status(200).json(updatedCbs);        
    } catch (error) {
        console.error('Error updating cashback:', error);
        res.sendStatus(500);
    }
});

router.delete('/:id', (req, res) => {
    try {
        const { cardId, catId } = req.body;

        const query = db.prepare(`DELETE FROM cashback WHERE catId = ? AND cardId = ?`);
        query.run(catId, cardId);

        res.json({ message: "cashback deleted" });
    } catch (error) {
        console.log("Error put delete cashback", error);
    }
});

export default router;