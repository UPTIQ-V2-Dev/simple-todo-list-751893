import { z } from 'zod';

export const todoFormSchema = z.object({
    name: z
        .string()
        .transform(val => val.trim())
        .refine(val => val.length > 0, 'Todo name is required')
        .refine(val => val.length <= 100, 'Todo name must be less than 100 characters'),
    description: z
        .string()
        .transform(val => val.trim())
        .optional()
        .refine(val => !val || val.length <= 500, 'Description must be less than 500 characters')
});

export type TodoFormData = z.infer<typeof todoFormSchema>;
