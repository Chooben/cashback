import { z } from 'zod';

export const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
});

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
}