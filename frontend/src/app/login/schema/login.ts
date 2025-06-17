import { z } from 'zod';

export const Schema = z.object({
  email: z.coerce.string().email({ message: 'Invalid Email address' }),
  password: z.coerce.string().min(1, { message: 'Feild should not be empty' }),
});
