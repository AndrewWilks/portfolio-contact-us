import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import type { ZodSchema } from "zod";
import type { ValidationTargets } from "hono";

/**
 * zodValidatorWrapper(target, schema)
 * - target: one of 'json' | 'query' | 'params' etc as supported by zod-validator
 * - schema: Zod schema
 *
 * The wrapper will throw an HTTPException(400) with a small message when validation fails.
 * Callers can catch this and map to the envelope `{ ok: false, error }` where needed.
 */
export const zodValidatorWrapper = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
) =>
  zValidator(target, schema, (result) => {
    if (!result.success) {
      // Build a concise message from Zod errors
      const message = result.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      throw new HTTPException(400, { cause: result.error, message });
    }
  });

export default zodValidatorWrapper;
