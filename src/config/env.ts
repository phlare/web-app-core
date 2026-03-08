import { z } from "zod";

export const EnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url()
});

export type Env = z.infer<typeof EnvSchema>;
