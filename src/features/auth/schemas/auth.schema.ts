import { z } from 'zod';

const passwordComplexityRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}+=\-_`~|:;"'<>,./])[A-Za-z\d@$!%*?&^#()[\]{}+=\-_`~|:;"'<>,./]{8,}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'First name is required')
      .max(50, 'First name is too long'),
    lastName: z
      .string()
      .trim()
      .min(1, 'Last name is required')
      .max(50, 'Last name is too long'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        passwordComplexityRegex,
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
