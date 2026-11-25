import { z } from 'zod';

/**
 * The single description of every environment variable this service needs.
 */
const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    LOG_PRETTY: z.stringbool().optional(),
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
    DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),
    MONGO_URL: z.url({ protocol: /^mongodb(\+srv)?$/ }),
    MONGO_DB: z.string().min(1),
  })
  .transform((raw) => ({ ...raw, LOG_PRETTY: raw.LOG_PRETTY ?? raw.NODE_ENV !== 'production' }));

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
