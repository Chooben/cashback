import { z } from 'zod';

const cardSchema = z.object({
    name: z.string().min(1, "Name is required"),
});
const cardIdSchema = z.object({
    id: z.string().min(1, "Requires id"),
})
const fullCardSchema = z.object({
    id: z.number().int().min(1, "Card must have an id"),
    name: z.string().min(1, "Name is required")
})
const cardArraySchema = z.array(fullCardSchema);

export const validateParams = (req, res, next) => {
    try {
        req.validatedParams = cardIdSchema.parse(req.params);
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Validation failed',
        });
    };
}
export const validateCard = (req, res, next) => {
    try {
        req.validatedBody = cardSchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Validation failed',
            issues: err.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message,
            }))
        })
    };
};
export const validateCardArray = (req, res, next) => {
    try {
        const data = cardArraySchema.parse(req.body);
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