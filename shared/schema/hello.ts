import { z } from "zod";

export const APIHelloSchema = z.object({
  message: z.string(),
});

export type Hello = z.infer<typeof APIHelloSchema>;
