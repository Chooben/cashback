import { z } from 'zod'

const cashbackSchema = z.object({
    cardId: z.number().int().min(1, 'Card must have an id'),
    catId: z.number().int().min(1, 'Category must have an id'),
    percent: z.number().min(0, 'Percent must exist'),
});

const cashbackArraySchema = z.array(cashbackSchema);

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

export const validateCashbackArray = (req, res, next) => {
    try {
        const data = cashbackArraySchema.parse(req.body);
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