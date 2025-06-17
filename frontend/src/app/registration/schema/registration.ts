import { z } from 'zod';

export const Schema = z.object({
  firstname: z.coerce.string().min(1, { message: 'Field cannot be empty' }),
  lastname: z.coerce.string().min(1, { message: 'Field cannot be empty' }),
  username: z.coerce
    .string()
    .min(5, { message: 'Minimum 5 characters required' })
    .max(20, { message: 'Maximum only 20 characters' }),
  email: z.coerce.string().email({ message: 'Invalid Email address' }),
  password: z.coerce
    .string()
    .min(8, { message: 'Minimum 8 characters required' }),
  confirmPassword: z.coerce
    .string()
    .min(8, { message: 'Minimum 8 characters required' }),
});
