import { object, string } from 'zod';

export const categorySchema = object({
    name: string({
        required_error: "Name is required"
    }),
    description: string({
        required_error: "Description is required"
    })
});

export const updateCategorySchema = object({
    name: string().optional(),
    description: string().optional()
});