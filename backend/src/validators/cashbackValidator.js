import { z } from 'zod'

export const cashbackSchema = z.object({
    cardId: z.number().int().min(1, 'Card must have an id'),
    catId: z.number().int().min(1, 'Category must have an id'),
    percent: z.number().min(0, 'Percent must exist'),
});

export const validateCashback = (req, res, next) => {
    try {
        req.validatedBody = cashbackSchema.parse(req.body);
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