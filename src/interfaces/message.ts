import { z } from "zod";
export const message = z.object({
  message: z.string(),
  person: z.enum(["user", "bot"]),
});
export type Message = z.infer<typeof message>;
