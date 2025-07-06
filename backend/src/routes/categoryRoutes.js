import express from 'express';
import db from '../db.js';
import { validateCategory, validateCategoryArray } from '../validators/categoryValidator.js';

const router = express.Router();

router.get('/', (req, res) => {
    const query = db.prepare('SELECT * FROM category');
    const categories = query.all();
    res.json(categories);
})

router.post('/', validateCategory, (req, res) => {
    try {
        const { name } = req.validatedBody;
        const query = db.prepare(`INSERT INTO category (name) VALUES (?)`);
        const result = query.run(name);
        console.log("cat post request",result)
        res.status(201).json({ id: result.lastInsertRowid, name });
    } catch (err) {
        res.status(500).json({ error: "Failed to insert category" })
    }  
});

router.put('/', validateCategoryArray, (req, res) => {
    try {
        const values = req.validatedBody;
        const updatedCats = [];
        values.forEach(cat => {
            const [id, name] = [parseInt(cat.id), cat.name];
            const updateCat = db.prepare(`
                UPDATE category
                SET name =?
                WHERE id = ?
            `).run(name, id);
            updatedCats.push({ id, name });
        });
        res.status(200).json(updatedCats);
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