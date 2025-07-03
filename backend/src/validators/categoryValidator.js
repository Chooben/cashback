import { z } from 'zod';

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
});
const fullCategorySchema = z.object({
    id: z.number().int().min(1, "Category must have an id"),
    name: z.string().min(1, "Name is required"),
})
const categoryArraySchema = z.array(fullCategorySchema);

export const validateCategory = (req, res, next) => {
    try {
        req.validatedBody = categorySchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Validation failed',
            issues: err.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message,
            }))
        })
    }
};
export const validateCategoryArray = (req, res, next) => {
    try {
        const data = categoryArraySchema.parse(req.body);
        req.validatedBody = data;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Validation failed",
            issues: err.errors.map(e => ({
                path: e.path.join("."),
                message: e.message,
            }))
        });
    }
};