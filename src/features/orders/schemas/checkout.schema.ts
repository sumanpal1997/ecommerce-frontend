import { z } from 'zod';

export const checkoutShippingSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  street: z.string().trim().min(5, 'Street address must be at least 5 characters'),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State or Province is required'),
  postalCode: z.string().trim().min(2, 'Postal or Zip code is required'),
  country: z.string().trim().min(2, 'Country is required'),
  phone: z.string().trim().min(5, 'Valid phone number is required'),
});

export type CheckoutShippingFormData = z.infer<typeof checkoutShippingSchema>;
