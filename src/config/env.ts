import { z } from "zod";

const isProduction = import.meta.env.PROD;

export const EnvSchema = z.object({
  VITE_API_BASE_URL: z
    .string()
    .url()
    .refine(
      (url) => !isProduction || url.startsWith("https://"),
      "API base URL must use HTTPS in production"
    )
});

export type Env = z.infer<typeof EnvSchema>;
