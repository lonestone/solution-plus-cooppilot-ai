import { z } from "zod";

export const lastCleanupSchema = z.object({
  lastCleanup: z.coerce.date(),
});

export type LastCleanup = z.infer<typeof lastCleanupSchema>;
