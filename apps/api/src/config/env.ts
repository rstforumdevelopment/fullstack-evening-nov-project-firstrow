import { z } from 'zod';

/**
 * The single description of every environment variable this service needs.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n Invalid environment configuration\n');
  console.error(z.prettifyError(parsed.error));
  console.error('\n Compare your .env against .env.example, then try again.\n');
  process.exit(1);
}

export const env: Readonly<Env> = Object.freeze(parsed.data);

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
