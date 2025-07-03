import express from 'express';
import db from '../db.js';
import { validateCategory, validateCategoryArray } from '../validators/categoryValidator.js';

const router = express.Router();

router.get('/', (req, res) => {
    const categories = db.prepare('SELECT * FROM category');
    const cat = categories.all();

    res.json(cat);
})

router.post('/', validateCategory, (req, res) => {
    const { name } = req.validatedBody;

    try {
        const insertCat = db.prepare(`INSERT INTO category (name) VALUES (?)`);
        const result = insertCat.run(name);
        res.status(201).json({ id: result.lastInsertRowid, name });
    } catch (err) {
        res.status(500).json({ error: "Failed to insert category" })
    }  
});

router.put('/', validateCategoryArray, (req, res) => {
    const values = req.validatedBody;
    try {
        values.forEach(cat => {
            const [id, name] = [parseInt(cat.id), cat.name];
            const updateCat = db.prepare(`
                UPDATE category
                SET name =?
                WHERE id = ?
            `).run(name, id);            
        });
        res.status(200).json({ message: "category updated" });
    } catch (err) {
        console.error("Error updating categories", err);
        res.status(500).json({ error: "Failed to update categories" })
    }
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const deleteCat = db.prepare(`DELETE FROM category WHERE id = ?`);
    deleteCat.run(id);
    res.json({message: "category deleted"});
})

export default router;