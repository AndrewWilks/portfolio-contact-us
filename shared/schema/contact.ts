import { z } from "zod";

export const ContactCreateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  message: z.string().max(2000).optional(),
});

export const ContactSchema = ContactCreateSchema.extend({
  id: z.uuid(),
  verified: z.boolean().default(false),
  createdAt: z.number(),
});

export type ContactCreate = z.infer<typeof ContactCreateSchema>;
export type Contact = z.infer<typeof ContactSchema>;
