import { z } from "zod";

export const ContactCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.email("Please enter a valid email address."),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number.")
    .optional(),
  message: z
    .string()
    .max(2000, "Message must not exceed 2000 characters.")
    .optional(),
});

export const ContactSchema = ContactCreateSchema.extend({
  id: z.uuid(),
  verified: z.boolean().default(false),
  createdAt: z.number(),
});

export type ContactCreate = z.infer<typeof ContactCreateSchema>;
export type Contact = z.infer<typeof ContactSchema>;

// Params and query schemas reusable by backend routes
export const IdParamsSchema = z.object({
  id: z.uuid(),
});

export type IdParams = z.infer<typeof IdParamsSchema>;

export const ContactsQuerySchema = z.object({
  q: z.string().optional(),
  // Query params are strings; coerce "true"/"false" strings to boolean
  verified: z.preprocess((val) => {
    if (typeof val === "string") {
      if (val === "true") return true;
      if (val === "false") return false;
    }
    return val;
  }, z.boolean().optional()),
});

export type ContactsQuery = z.infer<typeof ContactsQuerySchema>;
